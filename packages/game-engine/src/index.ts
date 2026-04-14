import { nowIso } from "@imposter/shared";
import type {
  PlayerState,
  PromptItem,
  RoomSettings,
  RoomState,
  RoundSubmission,
  RoundVote,
} from "@imposter/types";

export function createInitialRoomState({
  code,
  host,
  settings,
}: {
  code: string;
  host: PlayerState;
  settings: RoomSettings;
}): RoomState {
  const timestamp = nowIso();

  return {
    code,
    createdAt: timestamp,
    updatedAt: timestamp,
    phase: "lobby",
    players: [host],
    settings,
    activeRound: null,
  };
}

export function startGame(room: RoomState, prompts: PromptItem[]): RoomState {
  if (room.phase !== "lobby") {
    throw new Error("Game can only start from the lobby.");
  }

  if (room.players.length < 2) {
    throw new Error("At least two players are required to start the game.");
  }

  const firstPrompt = prompts[0];

  if (!firstPrompt) {
    throw new Error("A prompt pack is required to start the game.");
  }

  return {
    ...room,
    phase: "answering",
    updatedAt: nowIso(),
    activeRound: {
      roundNumber: 1,
      promptId: firstPrompt.id,
      promptText: firstPrompt.text,
      submissions: [],
      votes: [],
      revealCursor: 0,
    },
  };
}

export function setPlayerReady(
  room: RoomState,
  playerId: string,
  ready: boolean,
): RoomState {
  const player = room.players.find((item) => item.id === playerId);

  if (!player) {
    throw new Error("Player not found in room.");
  }

  return {
    ...room,
    updatedAt: nowIso(),
    players: room.players.map((item) =>
      item.id === playerId ? { ...item, ready } : item,
    ),
  };
}

export function submitAnswer(room: RoomState, submission: RoundSubmission): RoomState {
  if (room.phase !== "answering" || !room.activeRound) {
    throw new Error("Room is not accepting answers.");
  }

  if (room.activeRound.submissions.some((item) => item.playerId === submission.playerId)) {
    throw new Error("Player has already submitted an answer.");
  }

  return {
    ...room,
    updatedAt: nowIso(),
    activeRound: {
      ...room.activeRound,
      submissions: [...room.activeRound.submissions, submission],
    },
  };
}

export function lockSubmissions(room: RoomState): RoomState {
  if (room.phase !== "answering" || !room.activeRound) {
    throw new Error("Room is not currently answering.");
  }

  return {
    ...room,
    phase: "revealing",
    updatedAt: nowIso(),
  };
}

export function revealNext(room: RoomState): RoomState {
  if (room.phase !== "revealing" || !room.activeRound) {
    throw new Error("Room is not in reveal phase.");
  }

  return {
    ...room,
    updatedAt: nowIso(),
    activeRound: {
      ...room.activeRound,
      revealCursor: Math.min(
        room.activeRound.revealCursor + 1,
        room.activeRound.submissions.length,
      ),
    },
  };
}

export function submitVote(room: RoomState, vote: RoundVote): RoomState {
  if (!room.activeRound) {
    throw new Error("No active round.");
  }

  if (vote.voterId === vote.targetPlayerId) {
    throw new Error("Players cannot vote for themselves.");
  }

  if (room.activeRound.votes.some((item) => item.voterId === vote.voterId)) {
    throw new Error("Player has already voted.");
  }

  return {
    ...room,
    updatedAt: nowIso(),
    phase: "results",
    activeRound: {
      ...room.activeRound,
      votes: [...room.activeRound.votes, vote],
    },
  };
}

export function scoreRound(room: RoomState): PlayerState[] {
  if (!room.activeRound) {
    return room.players;
  }

  const totals = room.activeRound.votes.reduce<Record<string, number>>((acc, vote) => {
    acc[vote.targetPlayerId] = (acc[vote.targetPlayerId] ?? 0) + 100;
    return acc;
  }, {});

  return room.players.map((player) => ({
    ...player,
    score: player.score + (totals[player.id] ?? 0),
  }));
}

export function buildMvpRoundPreview({
  prompt,
  players,
}: {
  prompt: string;
  players: string[];
}) {
  return {
    roundNumber: 1,
    prompt,
    players: players.map((displayName, index) => ({
      id: `player-${index + 1}`,
      displayName,
      ready: index < 2,
      score: index * 100,
    })),
  };
}
