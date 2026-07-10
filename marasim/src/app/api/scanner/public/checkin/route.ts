import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fetchEventByScannerToken } from "@/lib/repositories";
import { resolveLookupToTicketToken } from "@/lib/scanner-resolve";
import { checkInTicketForScanner } from "@/lib/checkin";
import { publicScannerCheckinSchema } from "@/lib/validation/rsvp-schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = publicScannerCheckinSchema.parse(body);

    const event = await fetchEventByScannerToken(parsed.scannerToken);
    if (!event) {
      return NextResponse.json(
        { status: "INVALID", message: "Invalid scanner" },
        { status: 404 }
      );
    }

    const ticketToken = await resolveLookupToTicketToken(event.id, parsed.lookup);
    if (!ticketToken) {
      return NextResponse.json({ status: "INVALID" });
    }

    const result = await checkInTicketForScanner(
      ticketToken,
      event.id,
      parsed.entries,
      null
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    console.error("[api/scanner/public/checkin]", error);
    return NextResponse.json(
      { error: "Unable to check in", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
