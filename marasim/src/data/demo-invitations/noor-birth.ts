import { InvitationConfig } from "@/types/invitation";
import { buildInvitationConfig } from "@/lib/build-config";
import { noorBirthSoftSequence } from "@/data/sequences/noor-birth-soft.sequence";
import { noorBirthDemoData } from "@/data/invitations/noor-birth-demo";

/**
 * Noor Birth Demo config — built by merging sequence + invitation data.
 * Accessible at: /i/noor-birth-demo
 *
 * Sequence: noor-birth-soft   (Dusty Rose & Blush theme)
 * Data:     noorBirthDemoData (Layan birth announcement)
 *
 * RSVP is disabled — ticket_confirmation renders as a closing "يسعدنا حضوركم" scene.
 */
export const noorBirthConfig: InvitationConfig = buildInvitationConfig(
  noorBirthDemoData,
  noorBirthSoftSequence
);
