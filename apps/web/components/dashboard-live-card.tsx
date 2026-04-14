"use client";

import { useEffect, useState } from "react";
import { RoomStatusCard } from "./room-status-card";
import { Card } from "@imposter/ui";
import { getRoom } from "../lib/room-client";
import { getLastRoomCode, getRoomSession } from "../lib/room-session";
import type { RoomSummary } from "@imposter/types";

export function DashboardLiveCard() {
  const [room, setRoom] = useState<RoomSummary | null>(null);
  const [message, setMessage] = useState("Looking for your latest room...");

  useEffect(() => {
    const code = getLastRoomCode();

    if (!code) {
      setMessage("No recent room found yet. Create or join one to see it here.");
      return;
    }

    const session = getRoomSession(code);

    getRoom(code, session?.token)
      .then((response) => {
        setRoom(response.summary);
      })
      .catch(() => {
        setMessage("Your latest room is no longer available.");
      });
  }, []);

  if (room) {
    return <RoomStatusCard room={room} />;
  }

  return (
    <Card title="Latest room" eyebrow="Live status">
      <p className="text-sm text-white/75">{message}</p>
    </Card>
  );
}
