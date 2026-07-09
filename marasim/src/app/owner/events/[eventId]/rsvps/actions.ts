"use server";

import { revalidatePath } from "next/cache";
import { requireEventOwnership } from "@/lib/auth";
import { approveRSVP, rejectRSVP, RsvpError } from "@/lib/rsvp";
import { RpcError } from "@/lib/repositories/rpc";

export type RsvpActionResult = { ok: boolean; message?: string } | null;

export async function approveRsvpAction(
  _prevState: RsvpActionResult,
  formData: FormData
): Promise<RsvpActionResult> {
  const eventId = String(formData.get("eventId") ?? "");
  const rsvpId = String(formData.get("rsvpId") ?? "");
  const approvedSeats = Number.parseInt(String(formData.get("approvedSeats") ?? ""), 10);

  await requireEventOwnership(eventId);

  if (!Number.isInteger(approvedSeats) || approvedSeats <= 0) {
    return { ok: false, message: "عدد المقاعد غير صالح" };
  }

  try {
    await approveRSVP(rsvpId, approvedSeats);
    revalidatePath(`/owner/events/${eventId}/rsvps`);
    revalidatePath(`/owner/events/${eventId}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof RpcError || error instanceof RsvpError) {
      return { ok: false, message: error.message };
    }
    console.error("[approveRsvpAction]", error);
    return { ok: false, message: "تعذرت الموافقة على الطلب" };
  }
}

export async function rejectRsvpAction(
  _prevState: RsvpActionResult,
  formData: FormData
): Promise<RsvpActionResult> {
  const eventId = String(formData.get("eventId") ?? "");
  const rsvpId = String(formData.get("rsvpId") ?? "");

  await requireEventOwnership(eventId);

  try {
    await rejectRSVP(rsvpId);
    revalidatePath(`/owner/events/${eventId}/rsvps`);
    revalidatePath(`/owner/events/${eventId}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof RpcError || error instanceof RsvpError) {
      return { ok: false, message: error.message };
    }
    console.error("[rejectRsvpAction]", error);
    return { ok: false, message: "تعذر رفض الطلب" };
  }
}
