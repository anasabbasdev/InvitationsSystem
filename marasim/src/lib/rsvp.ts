import "server-only";

export type { InviteLinkContext } from "@/lib/rsvp-core";

export {
  RsvpError,
  submitPublicRSVP,
  getRSVPStatusView,
  lookupGuestBySlug,
  resolveInviteLinkContext,
  approveRSVP,
  rejectRSVP,
  validateInviteLink,
  confirmControlledRSVP,
  type InviteLinkValidation,
  type PublicRSVPSubmission,
  type PublicRSVPResult,
  type RSVPStatusView,
  type GuestLookupResult,
} from "@/lib/rsvp-core";
