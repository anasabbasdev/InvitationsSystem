import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { confirmControlledRSVP, RsvpError } from "@/lib/rsvp";
import { formatRsvpZodIssues, parseControlledRsvpBody } from "@/lib/validation/rsvp-schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseControlledRsvpBody(body);

    const result = await confirmControlledRSVP({
      slug: parsed.slug,
      inviteToken: parsed.inviteToken,
      name: parsed.name,
      seats: parsed.seats,
      phone: parsed.phone,
    });

    return NextResponse.json({
      status: "confirmed",
      guestCode: result.guestCode,
      ticketToken: result.ticketToken,
    });
  } catch (error) {
    if (error instanceof RsvpError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: formatRsvpZodIssues(error), code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    console.error("[api/rsvp/controlled/confirm]", error);
    return NextResponse.json(
      { error: "Unable to confirm invite", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
