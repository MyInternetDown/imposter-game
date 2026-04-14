// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateRoomForm } from "./create-room-form";
import { RoomApiError } from "../lib/room-client";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  createRoom: vi.fn(),
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
    createRoom: mocks.createRoom,
  };
});

vi.mock("../lib/room-session", () => ({
  saveRoomSession: mocks.saveRoomSession,
}));

describe("CreateRoomForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("submits and redirects to the created room", async () => {
    mocks.createRoom.mockResolvedValue({
      room: { code: "ABCDE" },
      viewer: { token: "token-1" },
    });

    render(<CreateRoomForm />);

    fireEvent.change(screen.getByPlaceholderText("Host display name"), {
      target: { value: "Alex" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Create room" }).closest("form")!);

    await waitFor(() => {
      expect(mocks.createRoom).toHaveBeenCalled();
      expect(mocks.saveRoomSession).toHaveBeenCalledWith(
        "ABCDE",
        expect.objectContaining({ token: "token-1" }),
      );
      expect(mocks.push).toHaveBeenCalledWith("/room/ABCDE");
    });
  });

  it("renders API errors", async () => {
    mocks.createRoom.mockRejectedValue(
      new RoomApiError("INVALID_INPUT", "hostName is required."),
    );

    render(<CreateRoomForm />);
    fireEvent.submit(screen.getByRole("button", { name: "Create room" }).closest("form")!);

    expect(await screen.findByText("hostName is required.")).toBeInTheDocument();
  });
});
