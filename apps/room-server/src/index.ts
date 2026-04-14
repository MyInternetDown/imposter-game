import { Hono } from "hono";
import { cors } from "hono/cors";
import { createInitialRoomState, startGame } from "@imposter/game-engine";
import {
  createRoomSummary,
  defaultRoomSettings,
  generateRoomCode,
  nowIso,
  starterPromptPack,
} from "@imposter/shared";
import type { RoomCode, RoomState, RoomSummary } from "@imposter/types";

type Bindings = {
  ROOM_SERVER_SECRET: string;
};

const rooms = new Map<RoomCode, RoomState>();
const roomSummaries = new Map<RoomCode, RoomSummary>();

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
  const body = await c.req.json().catch(() => ({}));
  const code = generateRoomCode();
  const hostName = typeof body.hostName === "string" ? body.hostName : "Host";

  const roomState = createInitialRoomState({
    code,
    host: {
      id: crypto.randomUUID(),
      displayName: hostName,
      ready: true,
      score: 0,
      connectionStatus: "connected",
      role: "host",
    },
    settings: defaultRoomSettings,
  });

  rooms.set(code, roomState);
  roomSummaries.set(
    code,
    createRoomSummary({
      code,
      playerCount: roomState.players.length,
      selectedPackName: starterPromptPack.title,
      settings: defaultRoomSettings,
    }),
  );

  return c.json({ room: roomSummaries.get(code) }, 201);
});

app.get("/rooms/:code", (c) => {
  const code = c.req.param("code") as RoomCode;
  const room = rooms.get(code);

  if (!room) {
    return c.json({ error: "Room not found" }, 404);
  }

  return c.json({ room });
});

app.post("/rooms/:code/join", async (c) => {
  const code = c.req.param("code") as RoomCode;
  const room = rooms.get(code);

  if (!room) {
    return c.json({ error: "Room not found" }, 404);
  }

  const body = await c.req.json().catch(() => ({}));
  const displayName = typeof body.displayName === "string" ? body.displayName : "Guest";
  const playerId = crypto.randomUUID();

  room.players.push({
    id: playerId,
    displayName,
    ready: false,
    score: 0,
    connectionStatus: "connected",
    role: "player",
  });

  room.updatedAt = nowIso();
  roomSummaries.set(
    code,
    createRoomSummary({
      code,
      playerCount: room.players.length,
      selectedPackName: starterPromptPack.title,
      settings: room.settings,
      status: room.phase === "lobby" ? "lobby" : "in_game",
    }),
  );

  return c.json({ playerId, room });
});

app.post("/rooms/:code/start", (c) => {
  const code = c.req.param("code") as RoomCode;
  const room = rooms.get(code);

  if (!room) {
    return c.json({ error: "Room not found" }, 404);
  }

  const nextState = startGame(room, starterPromptPack.prompts);
  rooms.set(code, nextState);

  return c.json({ room: nextState });
});

export default app;

