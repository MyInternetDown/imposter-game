import { AppShell } from "../../components/shell";
import { Card } from "@imposter/ui";
import { starterPromptPack } from "@imposter/shared";
import { DashboardLiveCard } from "../../components/dashboard-live-card";

const savedPacks = [
  starterPromptPack,
  {
    id: "movie-night",
    ownerId: "user-demo",
    title: "Movie Night Chaos",
    description: "Loud, silly prompts for friend groups.",
    visibility: "private" as const,
    prompts: [
      { id: "prompt-1", text: "Worst movie title for a first date?", sortOrder: 1 },
      { id: "prompt-2", text: "Pitch the cheapest superhero origin story.", sortOrder: 2 },
    ],
  },
];

export default function DashboardPage() {
  return (
    <AppShell
      title="Host dashboard"
      subtitle="A registered-user home for room creation, pack management, and session history once Supabase auth and persistence are wired in."
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardLiveCard />
        <Card title="Saved packs" eyebrow="Owned content">
          <div className="grid gap-3 text-sm text-white/75">
            {savedPacks.map((pack) => (
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
