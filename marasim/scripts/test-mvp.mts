/**
 * MVP logic unit tests — no Supabase required for most cases.
 * Run: npm run test:mvp
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractTicketToken } from "@/lib/ticket-token";
import {
  parsePublicRsvpBody,
  parseControlledRsvpBody,
  publicRsvpBodySchema,
} from "@/lib/validation/rsvp-schemas";
import { generateSecureToken } from "@/lib/secure-token";

describe("ticket token extraction", () => {
  it("extracts bare token", () => {
    assert.equal(extractTicketToken("abc123token"), "abc123token");
  });

  it("extracts from /t/ path", () => {
    assert.equal(extractTicketToken("/t/my-ticket-token"), "my-ticket-token");
  });

  it("extracts from full URL", () => {
    assert.equal(
      extractTicketToken("https://example.com/t/qr-token-xyz"),
      "qr-token-xyz"
    );
  });
});

describe("RSVP body validation", () => {
  it("validates public RSVP", () => {
    const body = parsePublicRsvpBody({
      slug: "ws-royal-demo",
      name: "أحمد",
      requestedSeats: 2,
    });
    assert.equal(body.requestedSeats, 2);
  });

  it("validates controlled RSVP", () => {
    const token = generateSecureToken();
    const body = parseControlledRsvpBody({
      slug: "ws-royal-demo",
      inviteToken: token,
      name: "سارة",
      seats: 2,
    });
    assert.equal(body.seats, 2);
  });

  it("rejects over-long name", () => {
    const result = publicRsvpBodySchema.safeParse({
      slug: "x",
      name: "a",
      requestedSeats: 1,
    });
    assert.equal(result.success, false);
  });
});

describe("secure tokens", () => {
  it("generates unique url-safe tokens", () => {
    const a = generateSecureToken();
    const b = generateSecureToken();
    assert.notEqual(a, b);
    assert.match(a, /^[A-Za-z0-9_-]+$/);
  });
});
