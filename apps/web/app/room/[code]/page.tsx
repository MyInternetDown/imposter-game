import { AppShell } from "../../../components/shell";
import { mockRoom } from "../../../lib/mock-data";
import { buildMvpRoundPreview } from "@imposter/game-engine";
import { Card } from "@imposter/ui";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const preview = buildMvpRoundPreview({
    prompt: "Worst thing to hear from your rideshare driver?",
    players: ["Alex", "Mina", "Rob", "Jules"],
  });

  return (
    <AppShell
      title={`Room ${code}`}
      subtitle="This room screen is wired to the shared game-engine contracts. The next milestone is replacing the mock state with worker-backed websocket state and Supabase-authenticated sessions."
    >
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.8fr]">
        <div className="grid gap-6">
          <Card title={preview.prompt} eyebrow={`Round ${preview.roundNumber}`}>
            <div className="grid gap-4 text-sm text-white/75">
              <p>Reveal style: {mockRoom.settings.revealStyle}</p>
              <p>Timer: {mockRoom.settings.answerDurationSeconds} seconds</p>
              <div className="rounded-2xl border border-dashed border-neon/40 bg-white/5 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neon">
                  Answer submission
                </p>
                <textarea rows={4} placeholder="Type your answer here..." />
                <button className="mt-3 rounded-xl bg-coral px-4 py-3 font-semibold text-white">
                  Lock in answer
                </button>
              </div>
            </div>
          </Card>
          <Card title="Lobby + game roster" eyebrow="Connected players">
            <div className="grid gap-3 md:grid-cols-2">
              {preview.players.map((player) => (
                <div
                  key={player.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
                >
                  <p className="font-semibold text-white">{player.displayName}</p>
                  <p>{player.ready ? "Ready" : "Waiting"}</p>
                  <p>{player.score} pts</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="grid gap-6">
          <Card title="Room actions" eyebrow="Host area">
            <div className="grid gap-3 text-sm text-white/75">
              <button className="rounded-xl bg-neon px-4 py-3 font-semibold text-ink">
                Start game
              </button>
              <button className="rounded-xl border border-white/15 px-4 py-3 text-left">
                Reveal next answer
              </button>
              <button className="rounded-xl border border-white/15 px-4 py-3 text-left">
                Lock room
              </button>
              <button className="rounded-xl border border-coral/40 px-4 py-3 text-left text-coral">
                End game
              </button>
            </div>
          </Card>
          <Card title="Chat + voice" eyebrow="Comms">
            <div className="grid gap-3 text-sm text-white/75">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Room chat</p>
                <p className="mt-2">Text chat becomes worker-broadcast events in the next milestone.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Voice controls</p>
                <p className="mt-2">LiveKit provider abstraction is scaffolded and ready for token wiring.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

