"use client";

import React from "react";
import { useEffect, useState, useTransition } from "react";
import { Card } from "@imposter/ui";
import { getRoom, RoomApiError, setRoomReady, startRoom } from "../lib/room-client";
import { getRoomSession, saveRoomSession } from "../lib/room-session";
import type { GetRoomResponse } from "@imposter/types";

export function RoomLiveClient({ code }: { code: string }) {
  const [data, setData] = useState<GetRoomResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isStarting, startTransition] = useTransition();
  const [isUpdatingReady, startReadyTransition] = useTransition();

  useEffect(() => {
    setSessionToken(getRoomSession(code)?.token ?? null);
  }, [code]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await getRoom(code, sessionToken ?? undefined);

        if (!active) {
          return;
        }

        setData(response);
        setError(null);

        if (response.viewer) {
          saveRoomSession(code, response.viewer);
          setSessionToken(response.viewer.token);
        }
      } catch (caught) {
        if (!active) {
          return;
        }

        setError(caught instanceof RoomApiError ? caught.message : "Could not load room.");
      }
    };

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 2000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [code, sessionToken]);

  const currentPlayer = data?.viewer
    ? data.room.players.find((player) => player.id === data.viewer?.playerId)
    : null;

  const canStart = Boolean(data?.viewer?.isHost && data.room.phase === "lobby");

  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.8fr]">
      <div className="grid gap-6">
        <Card
          title={data?.room.activeRound?.promptText ?? "Waiting for the game to start"}
          eyebrow={
            data?.room.activeRound
              ? `Round ${data.room.activeRound.roundNumber}`
              : `Room ${code}`
          }
        >
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <div className="grid gap-4 text-sm text-white/75">
            <p>Phase: {data?.room.phase ?? "loading"}</p>
            <p>Reveal style: {data?.room.settings.revealStyle ?? "..."}</p>
            <p>Timer: {data?.room.settings.answerDurationSeconds ?? "..."} seconds</p>
            {data?.room.phase === "answering" ? (
              <div className="rounded-2xl border border-dashed border-neon/40 bg-white/5 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neon">
                  First playable slice
                </p>
                <p>
                  The room is now backend-driven. Submission, reveal, and voting transport come next.
                </p>
              </div>
            ) : null}
          </div>
        </Card>
        <Card title="Lobby + game roster" eyebrow="Connected players">
          <div className="grid gap-3 md:grid-cols-2">
            {data?.room.players.map((player) => (
              <div
                key={player.id}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
              >
                <p className="font-semibold text-white">{player.displayName}</p>
                <p>{player.role === "host" ? "Host" : "Player"}</p>
                <p>{player.ready ? "Ready" : "Waiting"}</p>
                <p>{player.score} pts</p>
              </div>
            )) ?? <p className="text-sm text-white/60">Loading players...</p>}
          </div>
        </Card>
      </div>
      <div className="grid gap-6">
        <Card title="Room actions" eyebrow="Live controls">
          <div className="grid gap-3 text-sm text-white/75">
            {canStart ? (
              <button
                className="rounded-xl bg-neon px-4 py-3 font-semibold text-ink disabled:opacity-60"
                disabled={isStarting}
                onClick={() =>
                  startTransition(async () => {
                    if (!sessionToken) {
                      setError("Host session missing for this browser.");
                      return;
                    }

                    try {
                      const response = await startRoom(code, sessionToken);
                      setData((current) =>
                        current
                          ? { ...current, room: response.room, summary: response.summary, viewer: current.viewer }
                          : null,
                      );
                      setError(null);
                    } catch (caught) {
                      setError(
                        caught instanceof RoomApiError ? caught.message : "Could not start room.",
                      );
                    }
                  })
                }
              >
                {isStarting ? "Starting..." : "Start game"}
              </button>
            ) : null}
            {currentPlayer ? (
              <button
                className="rounded-xl border border-white/15 px-4 py-3 text-left disabled:opacity-60"
                disabled={isUpdatingReady}
                onClick={() =>
                  startReadyTransition(async () => {
                    if (!sessionToken) {
                      setError("Join the room from this browser to update your ready state.");
                      return;
                    }

                    try {
                      const response = await setRoomReady(code, sessionToken, {
                        ready: !currentPlayer.ready,
                      });
                      setData((current) =>
                        current
                          ? { ...current, room: response.room, summary: response.summary, viewer: current.viewer }
                          : null,
                      );
                    } catch (caught) {
                      setError(
                        caught instanceof RoomApiError ? caught.message : "Could not update ready state.",
                      );
                    }
                  })
                }
              >
                {isUpdatingReady
                  ? "Updating..."
                  : currentPlayer.ready
                    ? "Mark not ready"
                    : "Ready up"}
              </button>
            ) : (
              <p className="rounded-xl border border-white/10 px-4 py-3">
                Join this room from the guest or create-room flow to get a player session.
              </p>
            )}
            {!data?.viewer?.isHost ? (
              <p className="rounded-xl border border-white/10 px-4 py-3">
                Host controls only appear for the host session in this browser.
              </p>
            ) : null}
          </div>
        </Card>
        <Card title="Chat + voice" eyebrow="Comms">
          <div className="grid gap-3 text-sm text-white/75">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Room chat</p>
              <p className="mt-2">Next step: move chat events onto live transport.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Voice controls</p>
              <p className="mt-2">Next step: issue LiveKit voice tokens server-side.</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
