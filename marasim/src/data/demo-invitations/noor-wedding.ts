import { InvitationConfig } from "@/types/invitation";
import { buildInvitationConfig } from "@/lib/build-config";
import { noorWeddingLuxurySequence } from "@/data/sequences/noor-wedding-luxury.sequence";
import { noorWeddingDemoData } from "@/data/invitations/noor-wedding-demo";

/**
 * Noor Wedding Demo config — built by merging sequence + invitation data.
 * Accessible at: /i/noor-wedding-demo
 *
 * Sequence: noor-wedding-luxury  (Warm Copper & Amber theme)
 * Data:     noorWeddingDemoData  (Khaled & Noura wedding)
 *
 * To create a second wedding with the same Copper theme:
 *   1. Add a new file in data/invitations/ with client's InvitationData
 *   2. buildInvitationConfig(clientData, noorWeddingLuxurySequence)
 *   3. Register the slug in lib/invitation-config.ts
 */
export const noorWeddingConfig: InvitationConfig = buildInvitationConfig(
  noorWeddingDemoData,
  noorWeddingLuxurySequence
);
