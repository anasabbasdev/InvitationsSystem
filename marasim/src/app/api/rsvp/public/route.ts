import { NextResponse } from "next/server";
import { RsvpError, submitPublicRSVP } from "@/lib/rsvp";
import { ZodError } from "zod";
import { formatRsvpZodIssues } from "@/lib/validation/rsvp-schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitPublicRSVP(body);

    return NextResponse.json({
      rsvpViewToken: result.rsvpViewToken,
      guestCode: result.guestCode,
      status: result.status,
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
    console.error("[api/rsvp/public]", error);
    return NextResponse.json(
      { error: "Unable to submit RSVP", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
