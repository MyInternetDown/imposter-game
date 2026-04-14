import { AppShell } from "../../components/shell";
import { Card } from "@imposter/ui";
import { GuestJoinForm } from "../../components/guest-join-form";

export default function GuestPage() {
  return (
    <AppShell
      title="Join as a guest"
      subtitle="This is the first-step guest flow scaffold. In the full MVP this form will mint a guest session and reconnect token before joining the room server."
    >
      <Card title="Guest join" eyebrow="Temporary access">
        <GuestJoinForm />
      </Card>
    </AppShell>
  );
}
