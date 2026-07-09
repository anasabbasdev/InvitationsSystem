import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isEventOwner, getUserRole } from "@/lib/repositories/owners";

export type SessionUser = {
  id: string;
  email: string | null;
};

/** Validates the JWT against Supabase Auth — safe for server-side authorization checks. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email ?? null };
  } catch {
    // Cloudflare Workers / edge: cookies or auth refresh may fail — treat as logged out.
    return null;
  }
}

/** Redirects to /owner/login when there is no valid session. */
export async function requireOwnerSession(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/owner/login");
  }
  return user;
}

/**
 * Redirects to /owner/login if unauthenticated, or /owner/events if the
 * current user does not own the given event. Returns the session user.
 */
export async function requireEventOwnership(eventId: string): Promise<SessionUser> {
  const user = await requireOwnerSession();
  const owns = await isEventOwner(user.id, eventId);
  if (!owns) {
    redirect("/owner/events");
  }
  return user;
}

/** Redirects to /owner/login if unauthenticated, or /owner/events if not an admin. */
export async function requireAdminSession(): Promise<SessionUser> {
  const user = await requireOwnerSession();
  const role = await getUserRole(user.id);
  if (role !== "admin") {
    redirect("/owner/events");
  }
  return user;
}
