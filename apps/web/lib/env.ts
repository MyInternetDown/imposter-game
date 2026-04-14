export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  roomServerUrl: process.env.NEXT_PUBLIC_ROOM_SERVER_URL ?? "http://localhost:8787",
  voiceProvider: process.env.NEXT_PUBLIC_VOICE_PROVIDER ?? "livekit",
};

