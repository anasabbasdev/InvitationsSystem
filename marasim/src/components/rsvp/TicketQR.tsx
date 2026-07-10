"use client";

import QRCode from "react-qr-code";

/** QR encodes the guest code only — scanned at the event door. */
export default function TicketQR({
  value,
  size = 200,
}: {
  value: string;
  size?: number;
}) {
  return (
    <div className="inline-flex rounded-lg bg-white p-4">
      <QRCode value={value} size={size} level="M" />
    </div>
  );
}
