"use client";

import React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRoom, RoomApiError } from "../lib/room-client";
import { saveRoomSession } from "../lib/room-session";

export function CreateRoomForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const hostName = String(formData.get("hostName") ?? "");
        const revealStyle = String(formData.get("revealStyle") ?? "all_at_once");
        const roundCount = Number(formData.get("roundCount") ?? 5);

        startTransition(async () => {
          try {
            const response = await createRoom({
              hostName,
              settings: {
                revealStyle: revealStyle === "one_by_one" ? "one_by_one" : "all_at_once",
                roundCount: Number.isFinite(roundCount) ? roundCount : 5,
              },
            });

            saveRoomSession(response.room.code, response.viewer);
            router.push(`/room/${response.room.code}`);
          } catch (caught) {
            setError(
              caught instanceof RoomApiError ? caught.message : "Could not create room right now.",
            );
          }
        });
      }}
    >
      <input name="hostName" type="text" placeholder="Host display name" defaultValue="Host" />
      <select name="revealStyle" defaultValue="all_at_once">
        <option value="all_at_once">Reveal all at once</option>
        <option value="one_by_one">Reveal one by one</option>
      </select>
      <input name="roundCount" type="number" min="1" max="10" defaultValue="5" />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-neon px-4 py-3 font-semibold text-ink disabled:opacity-60"
      >
        {isPending ? "Creating room..." : "Create room"}
      </button>
      {error ? <p className="text-sm text-coral md:col-span-2">{error}</p> : null}
    </form>
  );
}
