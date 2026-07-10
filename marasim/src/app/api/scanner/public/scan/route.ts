import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fetchEventByScannerToken } from "@/lib/repositories";
import { resolveLookupToTicketToken } from "@/lib/scanner-resolve";
import { lookupTicketForScanner } from "@/lib/tickets";
import { publicScannerLookupSchema } from "@/lib/validation/rsvp-schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = publicScannerLookupSchema.parse(body);

    const event = await fetchEventByScannerToken(parsed.scannerToken);
    if (!event) {
      return NextResponse.json({ status: "INVALID" });
    }

    const ticketToken = await resolveLookupToTicketToken(event.id, parsed.lookup);
    if (!ticketToken) {
      return NextResponse.json({ status: "INVALID" });
    }

    const result = await lookupTicketForScanner(ticketToken, event.id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    console.error("[api/scanner/public/scan]", error);
    return NextResponse.json(
      { error: "Unable to scan", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
