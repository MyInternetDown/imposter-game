"use client";

import React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinRoom, RoomApiError } from "../lib/room-client";
import { saveRoomSession } from "../lib/room-session";

export function GuestJoinForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const displayName = String(formData.get("displayName") ?? "");
        const roomCode = String(formData.get("roomCode") ?? "").toUpperCase();

        startTransition(async () => {
          try {
            const response = await joinRoom(roomCode, {
              displayName,
            });

            saveRoomSession(response.room.code, response.viewer);
            router.push(`/room/${response.room.code}`);
          } catch (caught) {
            setError(caught instanceof RoomApiError ? caught.message : "Could not join room.");
          }
        });
      }}
    >
      <input type="text" name="displayName" placeholder="Display name" />
      <input type="text" name="roomCode" placeholder="Room code" />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-neon px-4 py-3 font-semibold text-ink disabled:opacity-60"
      >
        {isPending ? "Joining..." : "Enter lobby"}
      </button>
      {error ? <p className="text-sm text-coral">{error}</p> : null}
    </form>
  );
}
