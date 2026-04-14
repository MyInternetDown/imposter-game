import { Hono } from "hono";
import { cors } from "hono/cors";
import { setPlayerReady, createInitialRoomState, startGame } from "@imposter/game-engine";
import {
  clampText,
  createRoomSummary,
  defaultRoomSettings,
  generateRoomCode,
  generateSessionToken,
  mergeRoomSettings,
  nowIso,
  profanityCheck,
  starterPromptPack,
} from "@imposter/shared";
import type {
  CreateRoomRequest,
  CreateRoomResponse,
  GetRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  ReadyRoomRequest,
  RoomActionResponse,
  RoomCode,
  RoomErrorCode,
  RoomErrorResponse,
  RoomState,
  RoomSummary,
  RoomViewer,
} from "@imposter/types";

type Bindings = {
  ROOM_SERVER_SECRET: string;
};

type SessionRecord = {
  playerId: string;
  roomCode: RoomCode;
};

type InternalRoom = {
  state: RoomState;
  summary: RoomSummary;
  sessions: Map<string, SessionRecord>;
};

const rooms = new Map<RoomCode, InternalRoom>();

function jsonError(
  c: Parameters<ReturnType<typeof createApp>["request"]>[0] extends never ? never : any,
  status: number,
  code: RoomErrorCode,
  message: string,
) {
  const payload: RoomErrorResponse = {
    error: {
      code,
      message,
    },
  };

  return c.json(payload, status);
}

function findRoom(code: RoomCode) {
  return rooms.get(code);
}

function extractBearerToken(authorization: string | undefined): string | null {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim() || null;
}

function viewerFromToken(room: InternalRoom, token: string | null): RoomViewer | undefined {
  if (!token) {
    return undefined;
  }

  const session = room.sessions.get(token);

  if (!session) {
    return undefined;
  }

  const player = room.state.players.find((item) => item.id === session.playerId);

  if (!player) {
    return undefined;
  }

  return {
    playerId: player.id,
    token,
    isHost: player.role === "host",
  };
}

function buildRoomResponse(room: InternalRoom, viewer?: RoomViewer): RoomActionResponse {
  return {
    room: room.state,
    summary: room.summary,
    viewer,
  };
}

function updateSummary(room: InternalRoom) {
  room.summary = createRoomSummary({
    code: room.state.code,
    playerCount: room.state.players.length,
    selectedPackName: starterPromptPack.title,
    settings: room.state.settings,
    status: room.state.phase === "lobby" ? "lobby" : room.state.phase === "ended" ? "finished" : "in_game",
  });
}

function validateDisplayName(input: string | undefined, fieldLabel: "hostName" | "displayName") {
  const normalized = clampText(input ?? "", 24);

  if (!normalized) {
    return {
      ok: false as const,
      error: {
        code: "INVALID_INPUT" as const,
        message: `${fieldLabel} is required.`,
      },
    };
  }

  const moderation = profanityCheck(normalized);

  if (!moderation.clean) {
    return {
      ok: false as const,
      error: {
        code: "INVALID_INPUT" as const,
        message: moderation.reason ?? "Display name contains blocked language.",
      },
    };
  }

  return {
    ok: true as const,
    value: normalized,
  };
}

function createViewer(roomCode: RoomCode, playerId: string, isHost: boolean) {
  return {
    playerId,
    token: generateSessionToken(),
    isHost,
  };
}

function requireViewer(c: any, room: InternalRoom): RoomViewer | Response {
  const token = extractBearerToken(c.req.header("Authorization"));
  const viewer = viewerFromToken(room, token);

  if (!viewer) {
    return jsonError(c, 401, "UNAUTHORIZED", "A valid room session token is required.");
  }

  return viewer;
}

export function resetRoomStore() {
  rooms.clear();
}

export function createApp() {
  const app = new Hono<{ Bindings: Bindings }>();

  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.get("/", (c) =>
    c.json({
      ok: true,
      service: "room-server",
      timestamp: nowIso(),
    }),
  );

  app.get("/health", (c) =>
    c.json({
      status: "healthy",
      activeRooms: rooms.size,
      starterPackPrompts: starterPromptPack.prompts.length,
    }),
  );

  app.post("/rooms", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<CreateRoomRequest>;
    const name = validateDisplayName(body.hostName, "hostName");

    if (!name.ok) {
      return jsonError(c, 400, name.error.code, name.error.message);
    }

    const code = generateRoomCode();
    const viewer = createViewer(code, crypto.randomUUID(), true);
    const settings = mergeRoomSettings(body.settings);
    const state = createInitialRoomState({
      code,
      host: {
        id: viewer.playerId,
        displayName: name.value,
        ready: true,
        score: 0,
        connectionStatus: "connected",
        role: "host",
      },
      settings,
    });

    const room: InternalRoom = {
      state,
      summary: createRoomSummary({
        code,
        playerCount: 1,
        selectedPackName: starterPromptPack.title,
        settings,
      }),
      sessions: new Map([[viewer.token, { playerId: viewer.playerId, roomCode: code }]]),
    };

    rooms.set(code, room);

    const payload: CreateRoomResponse = {
      ...buildRoomResponse(room, viewer),
      viewer,
    };

    return c.json(payload, 201);
  });

  app.get("/rooms/:code", (c) => {
    const code = c.req.param("code") as RoomCode;
    const room = findRoom(code);

    if (!room) {
      return jsonError(c, 404, "ROOM_NOT_FOUND", "Room not found.");
    }

    const viewer = viewerFromToken(room, extractBearerToken(c.req.header("Authorization")));
    const payload: GetRoomResponse = buildRoomResponse(room, viewer);

    return c.json(payload);
  });

  app.post("/rooms/:code/join", async (c) => {
    const code = c.req.param("code") as RoomCode;
    const room = findRoom(code);

    if (!room) {
      return jsonError(c, 404, "ROOM_NOT_FOUND", "Room not found.");
    }

    if (room.state.settings.roomLocked) {
      return jsonError(c, 403, "ROOM_LOCKED", "This room is locked.");
    }

    if (room.state.players.length >= room.state.settings.maxPlayers) {
      return jsonError(c, 403, "ROOM_FULL", "This room is full.");
    }

    const body = (await c.req.json().catch(() => ({}))) as Partial<JoinRoomRequest>;
    const name = validateDisplayName(body.displayName, "displayName");

    if (!name.ok) {
      return jsonError(c, 400, name.error.code, name.error.message);
    }

    if (
      room.state.players.some(
        (player) => player.displayName.toLowerCase() === name.value.toLowerCase(),
      )
    ) {
      return jsonError(
        c,
        409,
        "DUPLICATE_DISPLAY_NAME",
        "That display name is already in use in this room.",
      );
    }

    const viewer = createViewer(code, crypto.randomUUID(), false);
    room.state.players.push({
      id: viewer.playerId,
      displayName: name.value,
      ready: false,
      score: 0,
      connectionStatus: "connected",
      role: "player",
    });
    room.state.updatedAt = nowIso();
    room.sessions.set(viewer.token, {
      playerId: viewer.playerId,
      roomCode: code,
    });
    updateSummary(room);

    const payload: JoinRoomResponse = {
      ...buildRoomResponse(room, viewer),
      viewer,
    };

    return c.json(payload, 201);
  });

  app.post("/rooms/:code/ready", async (c) => {
    const code = c.req.param("code") as RoomCode;
    const room = findRoom(code);

    if (!room) {
      return jsonError(c, 404, "ROOM_NOT_FOUND", "Room not found.");
    }

    const viewer = requireViewer(c, room);

    if (viewer instanceof Response) {
      return viewer;
    }

    const body = (await c.req.json().catch(() => ({}))) as Partial<ReadyRoomRequest>;
    const ready = typeof body.ready === "boolean" ? body.ready : true;

    room.state = setPlayerReady(room.state, viewer.playerId, ready);
    updateSummary(room);

    return c.json(buildRoomResponse(room, viewer));
  });

  app.post("/rooms/:code/start", (c) => {
    const code = c.req.param("code") as RoomCode;
    const room = findRoom(code);

    if (!room) {
      return jsonError(c, 404, "ROOM_NOT_FOUND", "Room not found.");
    }

    const viewer = requireViewer(c, room);

    if (viewer instanceof Response) {
      return viewer;
    }

    if (!viewer.isHost) {
      return jsonError(c, 403, "HOST_ONLY", "Only the host can start the game.");
    }

    try {
      room.state = startGame(room.state, starterPromptPack.prompts);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start game.";
      const codeForError =
        message.includes("At least two players")
          ? "NOT_ENOUGH_PLAYERS"
          : message.includes("lobby")
            ? "INVALID_PHASE"
            : "INVALID_INPUT";

      return jsonError(c, 400, codeForError, message);
    }

    updateSummary(room);
    return c.json(buildRoomResponse(room, viewer));
  });

  return app;
}

const app = createApp();

export default app;
