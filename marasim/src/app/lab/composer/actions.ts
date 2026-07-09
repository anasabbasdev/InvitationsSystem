"use server";

import { requireAdminSession } from "@/lib/auth";
import {
  fetchAllInvitationSlugs,
  fetchInvitationBySlug,
  republishInvitation,
  updateInvitationDataJson,
} from "@/lib/repositories";
import type { InvitationData } from "@/types/invitation";

export async function listDbInvitationSlugsAction(): Promise<string[]> {
  await requireAdminSession();
  return fetchAllInvitationSlugs();
}

export async function loadDbInvitationDataAction(slug: string): Promise<InvitationData | null> {
  await requireAdminSession();
  const row = await fetchInvitationBySlug(slug);
  if (!row) return null;
  return row.invitation_data_json as InvitationData;
}

export async function saveDbInvitationDataAction(
  slug: string,
  data: InvitationData
): Promise<{ ok: true } | { ok: false; message: string }> {
  await requireAdminSession();
  const row = await fetchInvitationBySlug(slug);
  if (!row) return { ok: false, message: "Invitation not found in Supabase" };
  await updateInvitationDataJson(row.id, data);
  return { ok: true };
}

export async function publishDbInvitationAction(
  slug: string
): Promise<{ ok: true; snapshotId: string } | { ok: false; message: string }> {
  await requireAdminSession();
  try {
    const result = await republishInvitation(slug);
    return { ok: true, snapshotId: result.snapshotId };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Publish failed" };
  }
}
