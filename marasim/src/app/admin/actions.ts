"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { createEventWithOwner, listAllEvents } from "@/lib/repositories";
import { getSessionUser } from "@/lib/auth";

export async function createEventAction(
  _prev: { ok: boolean; message?: string } | null,
  formData: FormData
) {
  await requireAdminSession();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();
  const totalCapacity = Number(formData.get("totalCapacity") ?? 0) || null;
  const rsvpMode = String(formData.get("rsvpMode") ?? "public_request") as
    | "none"
    | "public_request"
    | "controlled_link";

  if (!title || !slug || !ownerEmail) {
    return { ok: false as const, message: "جميع الحقول مطلوبة" };
  }

  const admin = await import("@/lib/supabase/create-admin-client").then((m) =>
    m.createSupabaseAdminClient()
  );
  const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const owner = users.users.find((u) => u.email === ownerEmail);
  if (!owner) {
    return { ok: false as const, message: "لم يتم العثور على حساب المالك" };
  }

  await createEventWithOwner({
    title,
    slug,
    totalCapacity,
    ownerUserId: owner.id,
    rsvpEnabled: rsvpMode !== "none",
    rsvpMode,
    maxPublicRequest: 4,
    approvalRequired: true,
  });

  revalidatePath("/admin/events");
  return { ok: true as const };
}

export async function listEventsAction() {
  await requireAdminSession();
  return listAllEvents();
}

export async function getCurrentUserEmailAction() {
  const user = await getSessionUser();
  return user?.email ?? null;
}
