import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { lookupGuestBySlug } from "@/lib/rsvp";
import { guestLookupSchema, formatRsvpZodIssues } from "@/lib/validation/rsvp-schemas";
import { checkRateLimit, rateLimitClientKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rateKey = rateLimitClientKey(request, "guest-lookup");
  const limit = checkRateLimit(rateKey, 15, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { found: false, message: "محاولات كثيرة. انتظر قليلاً وحاول مرة أخرى." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    guestLookupSchema.parse(body);
    const result = await lookupGuestBySlug(body.slug, {
      phone: body.phone,
      guestCode: body.guestCode,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { found: false, message: formatRsvpZodIssues(error) },
        { status: 400 }
      );
    }
    console.error("[api/guest/lookup]", error);
    return NextResponse.json(
      { found: false, message: "تعذر التحقق. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
