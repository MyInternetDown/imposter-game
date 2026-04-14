import Link from "next/link";
import { AppShell } from "../../components/shell";
import { Card, PrimaryButton } from "@imposter/ui";

export default function CreateRoomPage() {
  return (
    <AppShell
      title="Create a private room"
      subtitle="The host creates a room, chooses the prompt pack and reveal style, then hands out the room code or invite link."
    >
      <Card title="Room settings" eyebrow="Host controls">
        <form className="grid gap-4 md:grid-cols-2">
          <input type="text" placeholder="Room title" defaultValue="Friday Night Test Room" />
          <select defaultValue="starter-pack">
            <option value="starter-pack">Starter Pack</option>
            <option value="movie-night">Movie Night Chaos</option>
          </select>
          <select defaultValue="all_at_once">
            <option value="all_at_once">Reveal all at once</option>
            <option value="one_by_one">Reveal one by one</option>
          </select>
          <input type="number" min="1" max="10" defaultValue="5" />
          <Link href="/room/FJ7KQ">
            <PrimaryButton label="Create room" />
          </Link>
        </form>
      </Card>
    </AppShell>
  );
}

