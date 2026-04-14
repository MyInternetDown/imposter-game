import { describe, expect, it } from "vitest";
import { starterPromptPack, defaultRoomSettings } from "@imposter/shared";
import {
  createInitialRoomState,
  lockSubmissions,
  scoreRound,
  setPlayerReady,
  startGame,
  submitAnswer,
  submitVote,
} from "./index";

describe("game engine", () => {
  it("starts a game with the first prompt", () => {
    const room = createInitialRoomState({
      code: "ABCDE",
      host: {
        id: "host-1",
        displayName: "Host",
        ready: true,
        score: 0,
        connectionStatus: "connected",
        role: "host",
      },
      settings: defaultRoomSettings,
    });

    room.players.push({
      id: "player-2",
      displayName: "Guest",
      ready: true,
      score: 0,
      connectionStatus: "connected",
      role: "player",
    });

    const next = startGame(room, starterPromptPack.prompts);

    expect(next.phase).toBe("answering");
    expect(next.activeRound?.promptId).toBe("starter-1");
  });

  it("prevents duplicate answers and self-voting", () => {
    let room = createInitialRoomState({
      code: "ABCDE",
      host: {
        id: "host-1",
        displayName: "Host",
        ready: true,
        score: 0,
        connectionStatus: "connected",
        role: "host",
      },
      settings: defaultRoomSettings,
    });

    room.players.push({
      id: "player-2",
      displayName: "Guest",
      ready: true,
      score: 0,
      connectionStatus: "connected",
      role: "player",
    });

    room = startGame(room, starterPromptPack.prompts);
    room = submitAnswer(room, { playerId: "host-1", answer: "Answer one" });
    room = submitAnswer(room, { playerId: "player-2", answer: "Answer two" });
    room = lockSubmissions(room);

    expect(() =>
      submitVote(room, { voterId: "host-1", targetPlayerId: "host-1" }),
    ).toThrowError(/cannot vote for themselves/i);
  });

  it("scores votes as 100 points each", () => {
    let room = createInitialRoomState({
      code: "ABCDE",
      host: {
        id: "host-1",
        displayName: "Host",
        ready: true,
        score: 0,
        connectionStatus: "connected",
        role: "host",
      },
      settings: defaultRoomSettings,
    });

    room.players.push({
      id: "player-2",
      displayName: "Guest",
      ready: true,
      score: 0,
      connectionStatus: "connected",
      role: "player",
    });

    room = startGame(room, starterPromptPack.prompts);
    room = submitAnswer(room, { playerId: "host-1", answer: "A" });
    room = submitAnswer(room, { playerId: "player-2", answer: "B" });
    room = lockSubmissions(room);
    room = submitVote(room, { voterId: "host-1", targetPlayerId: "player-2" });

    const scores = scoreRound(room);
    const guest = scores.find((player) => player.id === "player-2");

    expect(guest?.score).toBe(100);
  });

  it("updates player ready state", () => {
    const room = createInitialRoomState({
      code: "ABCDE",
      host: {
        id: "host-1",
        displayName: "Host",
        ready: false,
        score: 0,
        connectionStatus: "connected",
        role: "host",
      },
      settings: defaultRoomSettings,
    });

    const next = setPlayerReady(room, "host-1", true);

    expect(next.players[0]?.ready).toBe(true);
  });
});
