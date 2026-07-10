import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSessionUser } from "@/lib/auth";
import { isEventOwner } from "@/lib/repositories/owners";
import { checkInTicketForScanner } from "@/lib/checkin";
import { resolveLookupToTicketToken } from "@/lib/scanner-resolve";
import { scannerCheckinSchema } from "@/lib/validation/rsvp-schemas";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = scannerCheckinSchema.parse(body);

    const owns = await isEventOwner(user.id, parsed.eventId);
    if (!owns) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const ticketToken = await resolveLookupToTicketToken(parsed.eventId, parsed.lookup);
    if (!ticketToken) {
      return NextResponse.json({ status: "INVALID" });
    }

    const result = await checkInTicketForScanner(
      ticketToken,
      parsed.eventId,
      parsed.entries,
      user.id
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    console.error("[api/scanner/checkin]", error);
    return NextResponse.json(
      { error: "Unable to check in ticket", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
