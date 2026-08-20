"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import type { InviteLinkContext } from "@/lib/rsvp-core";
import { defaultPhoneValue, phoneValueToRaw, type PhoneInputValue } from "@/components/ui/PhoneInput";

export type RsvpFormState = { name: string; guests: string; note: string; phone: PhoneInputValue };

export type RsvpSubmitSuccess = {
  guestCode: string;
  status: string;
  approvedSeats?: number | null;
};

function initialSuccessFromContext(ctx?: InviteLinkContext): RsvpSubmitSuccess | null {
  if (ctx?.status === "already_confirmed" && ctx.guestView.found && ctx.guestView.guestCode) {
    return {
      guestCode: ctx.guestView.guestCode,
      status: ctx.guestView.status ?? "confirmed",
      approvedSeats: ctx.guestView.approvedSeats,
    };
  }
  return null;
}

export function useRSVPForm(
  slug: string,
  maxSeats: number,
  options?: {
    inviteToken?: string;
    inviteLinkContext?: InviteLinkContext;
  }
) {
  const [form, setForm] = useState<RsvpFormState>({
    name: "",
    guests: "1",
    note: "",
    phone: defaultPhoneValue(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RsvpSubmitSuccess | null>(() =>
    initialSuccessFromContext(options?.inviteLinkContext)
  );

  const seatOptions = Array.from({ length: Math.max(1, maxSeats) }, (_, i) => i + 1);
  const isControlled = Boolean(options?.inviteToken);
  const linkBlocked = options?.inviteLinkContext?.status === "invalid";
  const linkDone = options?.inviteLinkContext?.status === "already_confirmed";

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (linkBlocked || linkDone) return;

    setSubmitting(true);
    setError(null);

    const seats = Number.parseInt(form.guests, 10);

    try {
      const response = await fetch(
        isControlled ? "/api/rsvp/controlled/confirm" : "/api/rsvp/public",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isControlled
              ? {
                  slug,
                  inviteToken: options!.inviteToken,
                  name: form.name.trim(),
                  seats,
                  phone: form.phone.national.trim() ? phoneValueToRaw(form.phone) : undefined,
                }
              : {
                  slug,
                  name: form.name.trim(),
                  phone: phoneValueToRaw(form.phone),
                  requestedSeats: seats,
                  guestNote: form.note.trim() || undefined,
                }
          ),
        }
      );

      const data = (await response.json()) as {
        guestCode?: string;
        status?: string;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "تعذر إرسال الطلب. حاول مرة أخرى.");
        return;
      }

      if (data.guestCode) {
        setSuccess({
          guestCode: data.guestCode,
          status: data.status ?? (isControlled ? "confirmed" : "pending"),
          approvedSeats: isControlled ? seats : undefined,
        });
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    submitting,
    error,
    success,
    seatOptions,
    handleChange,
    handleSubmit,
    setPhone: (phone: PhoneInputValue) => setForm((prev) => ({ ...prev, phone })),
    isControlled,
    linkBlocked,
    linkDone,
  };
}
