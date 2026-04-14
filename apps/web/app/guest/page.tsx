import Link from "next/link";
import { AppShell } from "../../components/shell";
import { Card, PrimaryButton } from "@imposter/ui";

export default function GuestPage() {
  return (
    <AppShell
      title="Join as a guest"
      subtitle="This is the first-step guest flow scaffold. In the full MVP this form will mint a guest session and reconnect token before joining the room server."
    >
      <Card title="Guest join" eyebrow="Temporary access">
        <form className="grid gap-4">
          <input type="text" name="displayName" placeholder="Display name" />
          <input type="text" name="roomCode" placeholder="Room code" />
          <Link href="/room/FJ7KQ">
            <PrimaryButton label="Enter lobby" />
          </Link>
        </form>
      </Card>
    </AppShell>
  );
}

