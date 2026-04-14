import { AppShell } from "../../components/shell";
import { RoomStatusCard } from "../../components/room-status-card";
import { mockPacks, mockRoom } from "../../lib/mock-data";
import { Card } from "@imposter/ui";

export default function DashboardPage() {
  return (
    <AppShell
      title="Host dashboard"
      subtitle="A registered-user home for room creation, pack management, and session history once Supabase auth and persistence are wired in."
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <RoomStatusCard room={mockRoom} />
        <Card title="Saved packs" eyebrow="Owned content">
          <div className="grid gap-3 text-sm text-white/75">
            {mockPacks.map((pack) => (
              <div key={pack.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{pack.title}</p>
                <p className="mt-1">{pack.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neon">
                  {pack.prompts.length} prompts
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

