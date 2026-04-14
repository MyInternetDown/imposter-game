import { AppShell } from "../../../components/shell";
import { RoomLiveClient } from "../../../components/room-live-client";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <AppShell
      title={`Room ${code}`}
      subtitle="This room screen is wired to the shared game-engine contracts. The next milestone is replacing the mock state with worker-backed websocket state and Supabase-authenticated sessions."
    >
      <RoomLiveClient code={code} />
    </AppShell>
  );
}
