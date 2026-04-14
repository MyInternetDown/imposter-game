import { AppShell } from "../../components/shell";
import { Card } from "@imposter/ui";
import { CreateRoomForm } from "../../components/create-room-form";

export default function CreateRoomPage() {
  return (
    <AppShell
      title="Create a private room"
      subtitle="The host creates a room, chooses the prompt pack and reveal style, then hands out the room code or invite link."
    >
      <Card title="Room settings" eyebrow="Host controls">
        <CreateRoomForm />
      </Card>
    </AppShell>
  );
}
