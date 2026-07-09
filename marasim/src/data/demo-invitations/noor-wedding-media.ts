import { buildInvitationConfig } from "@/lib/build-config";
import { noorWeddingMediaSequence } from "@/data/sequences/noor-wedding-media.sequence";
import { noorWeddingMediaDemoData } from "@/data/invitations/noor-wedding-media-demo";

export const noorWeddingMediaConfig = buildInvitationConfig(
  noorWeddingMediaDemoData,
  noorWeddingMediaSequence
);
