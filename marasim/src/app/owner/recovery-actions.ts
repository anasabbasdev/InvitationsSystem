"use server";

import { getSiteOrigin } from "@/lib/site-url";
import {
  findOwnerEmailsForRecoveryHint,
  GENERIC_SENT,
  sendOwnerRecoveryEmails,
} from "@/lib/owner-recovery";

function recoveryRedirect(origin: string): string {
  return `${origin}/auth/callback?next=/owner/update-password`;
}

export async function requestPasswordResetByEmail(
  formData: FormData
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, message: "أدخل بريداً إلكترونياً صحيحاً." };
  }

  const origin = await getSiteOrigin();
  const redirectTo = recoveryRedirect(origin);
  await sendOwnerRecoveryEmails([email], redirectTo);
  return { ok: true, message: GENERIC_SENT };
}

export async function requestPasswordResetByEventHint(
  formData: FormData
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const hint = String(formData.get("hint") ?? "").trim();
  if (hint.length < 3) {
    return { ok: false, message: "اكتب اسم المناسبة أو رابط الدعوة (مثال: mhmd_lara)." };
  }

  const emails = await findOwnerEmailsForRecoveryHint(hint);
  const origin = await getSiteOrigin();
  if (emails.length > 0) {
    await sendOwnerRecoveryEmails(emails, recoveryRedirect(origin));
  }
  return { ok: true, message: GENERIC_SENT };
}

export async function updateOwnerPassword(
  formData: FormData
): Promise<{ ok: true } | { ok: false; message: string }> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) {
    return { ok: false, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." };
  }
  if (password !== confirm) {
    return { ok: false, message: "كلمتا المرور غير متطابقتين." };
  }

  const { createSupabaseServerClient } = await import("@/lib/supabase/server-client");
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, message: "انتهت صلاحية رابط الاستعادة. اطلب رابطاً جديداً." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { ok: false, message: "تعذر تحديث كلمة المرور. حاول مرة أخرى." };
  }

  return { ok: true };
}
