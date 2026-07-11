/**
 * Landing page contact & CTA URLs from environment.
 * Missing values hide the corresponding link (no fake production URLs).
 */

export type LandingContact = {
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  /** Dev-only fallback when NEXT_PUBLIC_WHATSAPP_URL is unset */
  whatsappForCta: string | null;
};

export function getLandingContact(): LandingContact {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || null;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || null;

  const whatsappForCta =
    whatsapp ??
    (process.env.NODE_ENV !== "production" ? "https://wa.me/966500000000" : null);

  return { whatsapp, email, instagram, whatsappForCta };
}
