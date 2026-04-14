import type { RoomSummary } from "@imposter/types";
import { Card } from "@imposter/ui";

export function RoomStatusCard({ room }: { room: RoomSummary }) {
  return (
    <Card title={`Room ${room.code}`} eyebrow={room.status}>
      <div className="grid gap-2 text-sm text-white/75">
        <p>{room.playerCount} players connected</p>
        <p>{room.settings.roundCount} rounds configured</p>
        <p>Reveal style: {room.settings.revealStyle}</p>
        <p>Prompt pack: {room.selectedPackName ?? "Default starter pack"}</p>
      </div>
    </Card>
  );
}

