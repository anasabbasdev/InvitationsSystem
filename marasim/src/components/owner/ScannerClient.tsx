"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ScanResultStatus, TicketDisplayInfo } from "@/types/tickets";

type ScanResponse = { status: ScanResultStatus; info?: TicketDisplayInfo };
type CheckinResponse = {
  status: ScanResultStatus | "EXCEEDED";
  info?: TicketDisplayInfo;
  message?: string;
};

const STATUS_COPY: Record<string, { label: string; color: string }> = {
  VALID: { label: "صالحة", color: "#4ade80" },
  INVALID: { label: "غير صالحة", color: "#f87171" },
  REVOKED: { label: "ملغاة", color: "#f87171" },
  FULLY_USED: { label: "مستخدمة بالكامل", color: "#fbbf24" },
  WRONG_EVENT: { label: "لا تخص هذه المناسبة", color: "#f87171" },
  EXCEEDED: { label: "يتجاوز العدد المتبقي", color: "#f87171" },
};

export default function ScannerClient({ eventId }: { eventId: string }) {
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | CheckinResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastScannedRef = useRef<string>("");

  const runScan = useCallback(
    async (rawToken: string) => {
      if (!rawToken.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/scanner/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, token: rawToken.trim() }),
        });
        const data = (await res.json()) as ScanResponse;
        if (!res.ok) {
          setError("تعذر فحص التذكرة. حاول مرة أخرى.");
          setLoading(false);
          return;
        }
        setResult(data);
      } catch {
        setError("تعذر الاتصال بالخادم.");
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  async function handleCheckIn(entries: number) {
    if (!result?.info) return;
    setCheckinLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scanner/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, token: result.info.ticket.token, entries }),
      });
      const data = (await res.json()) as CheckinResponse;
      if (!res.ok) {
        setError("تعذر تسجيل الدخول.");
        return;
      }
      setResult(data);
    } catch {
      setError("تعذر الاتصال بالخادم.");
    } finally {
      setCheckinLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setManualInput("");
    lastScannedRef.current = "";
  }

  function stopCamera() {
    if (detectIntervalRef.current) {
      clearInterval(detectIntervalRef.current);
      detectIntervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  async function startCamera() {
    const BarcodeDetectorCtor = (window as unknown as { BarcodeDetector?: unknown })
      .BarcodeDetector;
    if (!BarcodeDetectorCtor) {
      setCameraSupported(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);

      type Detector = { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> };
      const DetectorCtor = BarcodeDetectorCtor as unknown as new (opts: {
        formats: string[];
      }) => Detector;
      const detector = new DetectorCtor({ formats: ["qr_code"] });

      detectIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || loading) return;
        try {
          const codes = await detector.detect(videoRef.current);
          const value = codes[0]?.rawValue;
          if (value && value !== lastScannedRef.current) {
            lastScannedRef.current = value;
            setManualInput(value);
            stopCamera();
            await runScan(value);
          }
        } catch {
          // transient decode failure — ignore and retry next tick
        }
      }, 400);
    } catch {
      setError("تعذر الوصول إلى الكاميرا. استخدم الإدخال اليدوي.");
      setCameraSupported(false);
    }
  }

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remaining = result?.info ? result.info.ticket.maxEntries - result.info.ticket.usedEntries : 0;
  const statusInfo = result ? STATUS_COPY[result.status] ?? { label: result.status, color: "#f87171" } : null;
  const canCheckIn = result?.status === "VALID" && remaining > 0;

  const checkInOptions = Array.from({ length: Math.min(remaining, 3) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runScan(manualInput);
          }}
          className="flex gap-2"
        >
          <input
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="ألصق التوكن أو رابط التذكرة /t/..."
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : "فحص"}
          </button>
        </form>

        {cameraSupported ? (
          <button
            type="button"
            onClick={() => (cameraOn ? stopCamera() : startCamera())}
            className="rounded-md border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            {cameraOn ? "إيقاف الكاميرا" : "مسح بالكاميرا (QR)"}
          </button>
        ) : (
          <p className="text-xs text-zinc-500">
            المسح بالكاميرا غير مدعوم على هذا المتصفح — استخدم الإدخال اليدوي أعلاه.
          </p>
        )}

        {cameraOn && (
          <video
            ref={videoRef}
            className="w-full rounded-md bg-black"
            muted
            playsInline
          />
        )}
      </div>

      {error && (
        <p className="rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      {result && statusInfo && (
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </span>
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              مسح جديد
            </button>
          </div>

          {result.info && (
            <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
              <Info label="المناسبة" value={result.info.event.title} />
              <Info label="الضيف" value={result.info.guest.name || "—"} />
              {result.info.guest.side && <Info label="الطرف" value={result.info.guest.side} />}
              <Info label="المقاعد" value={String(result.info.ticket.maxEntries)} />
              <Info label="المستخدم" value={String(result.info.ticket.usedEntries)} />
              <Info label="المتبقي" value={String(remaining)} />
            </div>
          )}

          {canCheckIn && (
            <div className="flex flex-wrap gap-2 pt-2">
              {checkInOptions.map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={checkinLoading}
                  onClick={() => handleCheckIn(n)}
                  className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
                >
                  إدخال {n}
                </button>
              ))}
              {remaining > 1 && (
                <button
                  type="button"
                  disabled={checkinLoading}
                  onClick={() => handleCheckIn(remaining)}
                  className="rounded-md border border-amber-500 px-4 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
                >
                  إدخال الكل ({remaining})
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
