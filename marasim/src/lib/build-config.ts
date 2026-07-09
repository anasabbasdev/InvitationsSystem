import {
  InvitationConfig,
  InvitationData,
  InvitationSequence,
} from "@/types/invitation";
import { mergeSceneMedia } from "@/lib/scene-media";

/**
 * buildInvitationConfig — merges a sequence (design) with invitation data (content)
 * into a final InvitationConfig that InvitationRenderer consumes.
 *
 * Merge priority (highest → lowest):
 *   data.mediaOverrides[sceneType]    >  sceneDef.media
 *   data.variantOverrides[sceneType]  >  sceneDef.variant
 *   data.designOverrides[sceneType]   >  sceneDef.design  >  theme.design (global defaults)
 *   data.assetOverrides[sceneType]    >  sceneDef.background / overlay / foreground
 *   data.content[sceneType]           >  sceneDef.defaultContent
 *   data.themeOverrides               >  sequence.theme
 */
export function buildInvitationConfig(
  data: InvitationData,
  sequence: InvitationSequence
): InvitationConfig {
  return {
    id: data.id,
    eventId: data.eventId,
    slug: data.slug,
    language: data.language,
    direction: data.direction,
    theme: { ...sequence.theme, ...data.themeOverrides },
    layout: sequence.layout,
    music: data.music,
    rsvp: data.rsvp,
    scenes: sequence.scenes.map((sceneDef, index) => {
      const assetOverride = data.assetOverrides?.[sceneDef.sceneType];
      const designOverride = data.designOverrides?.[sceneDef.sceneType];
      const variantOverride = data.variantOverrides?.[sceneDef.sceneType];
      const mediaOverride = data.mediaOverrides?.[sceneDef.sceneType];
      return {
        id: `${sceneDef.sceneType}-${String(index + 1).padStart(2, "0")}`,
        type: sceneDef.sceneType,
        variant: variantOverride ?? sceneDef.variant,
        background: assetOverride?.background ?? sceneDef.background,
        overlay: assetOverride?.overlay ?? sceneDef.overlay,
        foreground: assetOverride?.foreground ?? sceneDef.foreground,
        content: {
          ...sceneDef.defaultContent,
          ...data.content[sceneDef.sceneType],
        },
        motion: sceneDef.motion,
        design: designOverride
          ? { ...sceneDef.design, ...designOverride }
          : sceneDef.design,
        media: mergeSceneMedia(sceneDef.media, mediaOverride),
      };
    }),
  };
}
