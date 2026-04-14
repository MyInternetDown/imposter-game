// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RoomLiveClient } from "./room-live-client";

const mocks = vi.hoisted(() => ({
  getRoom: vi.fn(),
  startRoom: vi.fn(),
  setRoomReady: vi.fn(),
  getRoomSession: vi.fn(),
  saveRoomSession: vi.fn(),
}));

vi.mock("../lib/room-client", async () => {
  const actual = await vi.importActual("../lib/room-client");
  return {
    ...actual,
    getRoom: mocks.getRoom,
    startRoom: mocks.startRoom,
    setRoomReady: mocks.setRoomReady,
  };
});

vi.mock("../lib/room-session", () => ({
  getRoomSession: mocks.getRoomSession,
  saveRoomSession: mocks.saveRoomSession,
}));

describe("RoomLiveClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders live room state and host controls for the host viewer", async () => {
    mocks.getRoomSession.mockReturnValue({ token: "host-token" });
    mocks.getRoom.mockResolvedValue({
      room: {
        code: "ABCDE",
        phase: "lobby",
        activeRound: null,
        settings: {
          revealStyle: "all_at_once",
          answerDurationSeconds: 60,
        },
        players: [
          { id: "p1", displayName: "Alex", role: "host", ready: true, score: 0 },
          { id: "p2", displayName: "Mina", role: "player", ready: false, score: 0 },
        ],
      },
      summary: {},
      viewer: {
        playerId: "p1",
        token: "host-token",
        isHost: true,
      },
    });
    mocks.startRoom.mockResolvedValue({
      room: {
        code: "ABCDE",
        phase: "answering",
        activeRound: {
          roundNumber: 1,
          promptText: "Worst thing to hear from your rideshare driver?",
        },
        settings: {
          revealStyle: "all_at_once",
          answerDurationSeconds: 60,
        },
        players: [
          { id: "p1", displayName: "Alex", role: "host", ready: true, score: 0 },
          { id: "p2", displayName: "Mina", role: "player", ready: false, score: 0 },
        ],
      },
      summary: {},
    });

    render(<RoomLiveClient code="ABCDE" />);

    expect(await screen.findByText("Alex")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start game" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start game" }));

    await waitFor(() => {
      expect(mocks.startRoom).toHaveBeenCalledWith("ABCDE", "host-token");
    });
  });

  it("hides host controls for non-host viewers", async () => {
    mocks.getRoomSession.mockReturnValue({ token: "guest-token" });
    mocks.getRoom.mockResolvedValue({
      room: {
        code: "ABCDE",
        phase: "lobby",
        activeRound: null,
        settings: {
          revealStyle: "all_at_once",
          answerDurationSeconds: 60,
        },
        players: [{ id: "p2", displayName: "Mina", role: "player", ready: false, score: 0 }],
      },
      summary: {},
      viewer: {
        playerId: "p2",
        token: "guest-token",
        isHost: false,
      },
    });

    render(<RoomLiveClient code="ABCDE" />);

    expect(await screen.findByText("Mina")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Start game" })).not.toBeInTheDocument();
    expect(
      screen.getByText("Host controls only appear for the host session in this browser."),
    ).toBeInTheDocument();
  });
});
