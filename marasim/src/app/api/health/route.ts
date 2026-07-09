import { NextResponse } from "next/server";
import {
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

/** Public diagnostics — never returns secret values. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    runtime: "cloudflare-workers",
    supabasePublic: isSupabaseConfigured(),
    supabaseAdmin: isSupabaseAdminConfigured(),
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    hasSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    testHub: process.env.ENABLE_TEST_HUB === "true",
  });
}
