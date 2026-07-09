import { buildInvitationConfig } from "@/lib/build-config";
import { noorBirthMediaSequence } from "@/data/sequences/noor-birth-media.sequence";
import { noorBirthMediaDemoData } from "@/data/invitations/noor-birth-media-demo";

export const noorBirthMediaConfig = buildInvitationConfig(
  noorBirthMediaDemoData,
  noorBirthMediaSequence
);
