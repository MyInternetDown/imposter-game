export const dbTables = {
  profiles: "profiles",
  guestSessions: "guest_sessions",
  questionPacks: "question_packs",
  questionPackItems: "question_pack_items",
  rooms: "rooms",
  roomMembers: "room_members",
  gameSessions: "game_sessions",
  gameRounds: "game_rounds",
  roundSubmissions: "round_submissions",
  roundVotes: "round_votes",
  scoreEntries: "score_entries",
  moderationActions: "moderation_actions",
} as const;

function readEnv(key: string): string {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };

  return runtime.process?.env?.[key] ?? "";
}

export function getDbEnv() {
  return {
    supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseDbUrl: readEnv("SUPABASE_DB_URL"),
  };
}
