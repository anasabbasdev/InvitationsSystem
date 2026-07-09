import { InvitationConfig } from "@/types/invitation";
import { buildInvitationConfig } from "@/lib/build-config";
import { weddingRoyalSequence } from "@/data/sequences/wedding-royal.sequence";
import { ahmadSaraDemoData } from "@/data/invitations/ahmad-sara-demo";

/**
 * Demo Wedding Royal config — built by merging sequence + invitation data.
 * Accessible at: /i/demo-wedding
 *
 * To create a different invitation with the same design:
 *   1. Add a new file in data/invitations/ with your client's InvitationData
 *   2. buildInvitationConfig(clientData, weddingRoyalSequence)
 */
export const weddingRoyalConfig: InvitationConfig = buildInvitationConfig(
  ahmadSaraDemoData,
  weddingRoyalSequence
);
