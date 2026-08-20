import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import {
  fetchEventBySlug,
  fetchEventOwnersForEvent,
  fetchInvitationBySlug,
  findEventsByTitleHint,
} from "@/lib/repositories";

const GENERIC_SENT =
  "إذا وُجد حساب مرتبط بهذه البيانات، أرسلنا رابط استعادة إلى البريد المسجّل. راجع صندوق الوارد والرسائل غير المرغوبة.";

function normalizeRecoveryQuery(raw: string): string {
  const trimmed = raw.trim();
  const fromUrl = trimmed.match(/\/i\/([^/?#]+)/i);
  return (fromUrl?.[1] ?? trimmed).toLowerCase();
}

export async function findOwnerEmailsForRecoveryHint(hint: string): Promise<string[]> {
  const q = normalizeRecoveryQuery(hint);
  if (q.length < 3) return [];

  const invitation = await fetchInvitationBySlug(q);
  const eventFromSlug = invitation?.event_id
    ? { id: invitation.event_id }
    : await fetchEventBySlug(q);

  let eventId = eventFromSlug?.id ?? null;
  if (!eventId) {
    const byTitle = await findEventsByTitleHint(hint.trim());
    if (byTitle.length === 1) eventId = byTitle[0].id;
  }
  if (!eventId) return [];

  const owners = await fetchEventOwnersForEvent(eventId);
  if (owners.length === 0) return [];

  const admin = createSupabaseAdminClient();
  const emails: string[] = [];
  for (const owner of owners) {
    const { data, error } = await admin.auth.admin.getUserById(owner.user_id);
    if (error || !data.user?.email) continue;
    emails.push(data.user.email);
  }
  return [...new Set(emails)];
}

export async function sendOwnerRecoveryEmails(
  emails: string[],
  redirectTo: string
): Promise<void> {
  const admin = createSupabaseAdminClient();
  for (const email of emails) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });
    if (error) {
      console.warn(`[owner-recovery] generateLink failed for ${email}:`, error.message);
      continue;
    }
    if (process.env.NODE_ENV !== "production") {
      const link = data.properties?.action_link;
      if (link) console.log(`[owner-recovery] recovery link for ${email}: ${link}`);
    }
    // Also ask Auth to email the user when custom SMTP is configured in Supabase.
    await admin.auth.resetPasswordForEmail(email, { redirectTo }).catch(() => {});
  }
}

export { GENERIC_SENT };
