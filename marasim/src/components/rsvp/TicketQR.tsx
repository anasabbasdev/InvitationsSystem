"use client";

import QRCode from "react-qr-code";

/** Renders a scannable ticket QR. The encoded value is only `/t/[ticketToken]` — never guest data. */
export default function TicketQR({ url, size = 200 }: { url: string; size?: number }) {
  return (
    <div className="inline-flex rounded-lg bg-white p-4">
      <QRCode value={url} size={size} level="M" />
    </div>
  );
}
