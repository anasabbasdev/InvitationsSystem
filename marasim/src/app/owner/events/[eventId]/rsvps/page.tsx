/**
 * Owner RSVP Requests — Phase 4
 */
export default async function OwnerRSVPsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <main className="min-h-dvh flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <h1 className="text-2xl font-bold" style={{ color: "#C9A24D" }}>
          طلبات الحضور
        </h1>
        <p className="text-sm text-gray-500">
          Event: <code className="text-gray-400">{eventId}</code>
        </p>
        <p className="text-xs text-gray-600">RSVP Management — المرحلة 4</p>
      </div>
    </main>
  );
}
