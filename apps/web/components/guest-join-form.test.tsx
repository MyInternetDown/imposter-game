// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GuestJoinForm } from "./guest-join-form";
import { RoomApiError } from "../lib/room-client";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  joinRoom: vi.fn(),
  saveRoomSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
}));

vi.mock("../lib/room-client", async () => {
  const actual = await vi.importActual("../lib/room-client");
  return {
    ...actual,
    joinRoom: mocks.joinRoom,
  };
});

vi.mock("../lib/room-session", () => ({
  saveRoomSession: mocks.saveRoomSession,
}));

describe("GuestJoinForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows invalid room errors from the backend", async () => {
    mocks.joinRoom.mockRejectedValue(new RoomApiError("ROOM_NOT_FOUND", "Room not found."));

    render(<GuestJoinForm />);

    fireEvent.change(screen.getByPlaceholderText("Display name"), {
      target: { value: "Mina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Room code"), {
      target: { value: "nope1" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Enter lobby" }).closest("form")!);

    expect(await screen.findByText("Room not found.")).toBeInTheDocument();
  });

  it("stores the session and navigates on success", async () => {
    mocks.joinRoom.mockResolvedValue({
      room: { code: "ABCDE" },
      viewer: { token: "token-2" },
    });

    render(<GuestJoinForm />);

    fireEvent.change(screen.getByPlaceholderText("Display name"), {
      target: { value: "Mina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Room code"), {
      target: { value: "abcde" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Enter lobby" }).closest("form")!);

    await waitFor(() => {
      expect(mocks.joinRoom).toHaveBeenCalledWith("ABCDE", { displayName: "Mina" });
      expect(mocks.saveRoomSession).toHaveBeenCalled();
      expect(mocks.push).toHaveBeenCalledWith("/room/ABCDE");
    });
  });
});
