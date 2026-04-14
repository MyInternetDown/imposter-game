import { AppShell } from "../../components/shell";
import { mockPacks } from "../../lib/mock-data";
import { Card } from "@imposter/ui";

export default function PacksPage() {
  return (
    <AppShell
      title="Question pack builder"
      subtitle="Registered users will create, edit, delete, and eventually reorder prompt packs here. The schema and validation rules are already scaffolded for this flow."
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card title="Your packs" eyebrow="Starter data">
          <div className="grid gap-3 text-sm text-white/75">
            {mockPacks.map((pack) => (
              <div key={pack.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{pack.title}</p>
                <p className="mt-1">{pack.description}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Pack editor scaffold" eyebrow="Validated form">
          <form className="grid gap-4">
            <input type="text" placeholder="Pack title" defaultValue="Late Night Chaos" />
            <textarea
              rows={3}
              placeholder="Description"
              defaultValue="Fast prompts for group play with reveal-and-vote rounds."
            />
            <textarea
              rows={5}
              placeholder="One prompt per line"
              defaultValue={"Worst excuse for being late?\nPitch a luxury product nobody asked for.\nName a haunted app update."}
            />
            <button className="rounded-xl bg-neon px-4 py-3 font-semibold text-ink">
              Save pack
            </button>
          </form>
        </Card>
      </section>
    </AppShell>
  );
}

