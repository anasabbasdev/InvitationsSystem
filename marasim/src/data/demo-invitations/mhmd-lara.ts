import { buildInvitationConfigV2 } from "@/lib/build-config";
import { psdWedding01Blueprint } from "@/data/blueprints/psd-wedding-01.blueprint";
import { psdWedding01Preset } from "@/data/presets/psd-wedding-01.preset";
import { mhmdLaraData } from "@/data/invitations/mhmd-lara";

export const mhmdLaraConfig = buildInvitationConfigV2(
  psdWedding01Blueprint,
  psdWedding01Preset,
  mhmdLaraData
);
