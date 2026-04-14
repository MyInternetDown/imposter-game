import Link from "next/link";
import { Card, PrimaryButton, SecondaryButton } from "@imposter/ui";
import { AppShell } from "../components/shell";

const features = [
  "Guest join flow with room codes",
  "Registered host dashboard and pack builder scaffold",
  "Server-authoritative room engine contracts",
  "Text chat and voice-provider abstraction hooks",
];

export default function HomePage() {
  return (
    <AppShell
      title="Online party games with real room architecture"
      subtitle="This milestone focuses on a clean MVP foundation: guest joins, host rooms, shared game contracts, and a dev setup that is easy to run locally or in Docker."
    >
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Get into a room fast" eyebrow="MVP focus">
          <div className="space-y-6">
            <p className="max-w-2xl text-base text-white/75">
              Start with one playable mode, private room codes, prompt packs, and a
              server-owned game loop that is ready to expand.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/guest">
                <PrimaryButton label="Join as guest" />
              </Link>
              <Link href="/create-room">
                <SecondaryButton label="Create a room" />
              </Link>
            </div>
          </div>
        </Card>
        <Card title="What this repo gives you" eyebrow="Included now">
          <ul className="grid gap-3 text-sm text-white/75">
            {features.map((feature) => (
              <li key={feature} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {feature}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </AppShell>
  );
}

