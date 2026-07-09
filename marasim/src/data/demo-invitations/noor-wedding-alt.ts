import { buildInvitationConfig } from "@/lib/build-config";
import { noorWeddingLuxurySequence } from "@/data/sequences/noor-wedding-luxury.sequence";
import { noorWeddingAltDemoData } from "@/data/invitations/noor-wedding-alt-demo";

/**
 * Noor Wedding Alt Demo — reuse proof config.
 * Accessible at: /i/noor-wedding-alt-demo
 *
 * Same sequence as /i/noor-wedding-demo — different InvitationData only.
 */
export const noorWeddingAltConfig = buildInvitationConfig(
  noorWeddingAltDemoData,
  noorWeddingLuxurySequence
);
