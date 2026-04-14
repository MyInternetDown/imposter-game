import type { VoiceProvider } from "@imposter/types";

export interface VoiceConfig {
  provider: VoiceProvider;
  publicUrl?: string;
  tokenEndpoint?: string;
  videoEnabled: boolean;
}

function readEnv(key: string): string | undefined {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };

  return runtime.process?.env?.[key];
}

export function createVoiceConfig(): VoiceConfig {
  const provider = (readEnv("NEXT_PUBLIC_VOICE_PROVIDER") ?? "livekit") as VoiceProvider;

  return {
    provider,
    publicUrl: readEnv("NEXT_PUBLIC_LIVEKIT_URL"),
    tokenEndpoint: "/api/voice/token",
    videoEnabled: false,
  };
}
