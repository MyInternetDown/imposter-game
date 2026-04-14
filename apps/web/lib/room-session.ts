import type { RoomViewer } from "@imposter/types";

const PREFIX = "imposter-room-session:";
const LAST_ROOM_KEY = "imposter-last-room-code";

export function saveRoomSession(code: string, viewer: RoomViewer) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(`${PREFIX}${code}`, JSON.stringify(viewer));
  window.localStorage.setItem(LAST_ROOM_KEY, code);
}

export function getRoomSession(code: string): RoomViewer | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(`${PREFIX}${code}`);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as RoomViewer;
  } catch {
    return null;
  }
}

export function getLastRoomCode(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(LAST_ROOM_KEY);
}
