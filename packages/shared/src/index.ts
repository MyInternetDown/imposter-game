import type { QuestionPack, RoomSettings, RoomSummary } from "@imposter/types";

const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const defaultRoomSettings: RoomSettings = {
  maxPlayers: 8,
  roundCount: 5,
  answerDurationSeconds: 60,
  revealStyle: "all_at_once",
  allowChat: true,
  allowVoice: true,
  roomLocked: false,
};

export const starterPromptPack: QuestionPack = {
  id: "starter-pack",
  ownerId: "system",
  title: "Starter Pack",
  description: "Seed prompts for local development and first-room testing.",
  visibility: "unlisted",
  prompts: [
    { id: "starter-1", text: "Worst text to receive from your boss at 2 AM?", sortOrder: 1 },
    { id: "starter-2", text: "Pitch a terrible new theme park ride.", sortOrder: 2 },
    { id: "starter-3", text: "Name a suspiciously cheap luxury brand.", sortOrder: 3 },
    { id: "starter-4", text: "Invent a useless smart-home device.", sortOrder: 4 },
    { id: "starter-5", text: "What's the most chaotic wedding gift?", sortOrder: 5 },
  ],
};

export function generateRoomCode(length = 5): string {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length);
    return ROOM_CODE_ALPHABET[index];
  }).join("");
}

export function generateSessionToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function createRoomSummary(partial: Partial<RoomSummary> & Pick<RoomSummary, "code" | "playerCount" | "settings">): RoomSummary {
  return {
    code: partial.code,
    playerCount: partial.playerCount,
    selectedPackName: partial.selectedPackName ?? null,
    status: partial.status ?? "lobby",
    settings: partial.settings,
  };
}

export function clampText(input: string, maxLength: number): string {
  return input.trim().slice(0, maxLength);
}

export function mergeRoomSettings(overrides?: Partial<RoomSettings>): RoomSettings {
  return {
    ...defaultRoomSettings,
    ...overrides,
  };
}

export function profanityCheck(input: string): { clean: boolean; reason?: string } {
  const banned = ["slur-placeholder"];
  const normalized = input.toLowerCase();
  const hit = banned.find((word) => normalized.includes(word));

  if (hit) {
    return { clean: false, reason: `Contains blocked term: ${hit}` };
  }

  return { clean: true };
}
