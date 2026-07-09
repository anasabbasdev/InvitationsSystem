import { z } from "zod";

const sceneTypeSchema = z.enum([
  "opening",
  "hero_names",
  "invitation_message",
  "event_details",
  "countdown",
  "gallery_media",
  "location",
  "notes",
  "rsvp",
  "ticket_confirmation",
]);

const layerSchema = z
  .object({
    type: z.enum(["image", "video", "color", "gradient", "lottie"]),
    src: z.string().optional(),
    value: z.string().optional(),
    fit: z.enum(["cover", "contain"]).optional(),
    position: z.enum(["top", "center", "bottom", "full"]).optional(),
    opacity: z.number().optional(),
    height: z.string().optional(),
  })
  .passthrough();

const designTokensSchema = z
  .object({
    cardStyle: z.string().optional(),
    buttonStyle: z.string().optional(),
    dividerStyle: z.string().optional(),
    iconStyle: z.string().optional(),
    typographyStyle: z.string().optional(),
    cornerStyle: z.string().optional(),
    sectionLabelStyle: z.string().optional(),
    density: z.string().optional(),
  })
  .passthrough();

const sceneDesignSchema = designTokensSchema.extend({}).passthrough();

const sceneMediaConfigSchema = z
  .object({
    compositionMode: z.enum(["full_media", "layered_media", "web_layout"]),
  })
  .passthrough();

const designPresetSceneSchema = z
  .object({
    variant: z.string().optional(),
    design: sceneDesignSchema.optional(),
    media: sceneMediaConfigSchema.optional(),
    background: layerSchema.optional(),
    overlay: layerSchema.optional(),
    foreground: z.array(layerSchema).optional(),
    defaultContent: z.record(z.string(), z.unknown()).optional(),
    motion: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export const sequenceBlueprintSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  version: z.string().min(1).optional(),
  layout: z.object({
    mobileMaxWidth: z.number(),
    minSupportedWidth: z.number(),
    safePaddingX: z.number(),
  }),
  scenes: z
    .array(
      z.object({
        id: z.string().min(1),
        type: sceneTypeSchema,
        label: z.string().optional(),
        enabledByDefault: z.boolean().optional(),
        required: z.boolean().optional(),
      })
    )
    .min(1),
});

export const designPresetSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  version: z.string().min(1).optional(),
  theme: z
    .object({
      family: z.string(),
      primaryColor: z.string(),
      secondaryColor: z.string(),
      backgroundColor: z.string(),
      fontHeading: z.string(),
      fontBody: z.string(),
    })
    .passthrough(),
  typeDefaults: z.record(sceneTypeSchema, designPresetSceneSchema).optional(),
  sceneOverrides: z.record(z.string(), designPresetSceneSchema).optional(),
  scenes: z.record(sceneTypeSchema, designPresetSceneSchema).optional(),
});

export const invitationDataSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  eventId: z.string().min(1),
  sequenceId: z.string().min(1),
  blueprintId: z.string().optional(),
  presetId: z.string().optional(),
  language: z.enum(["ar", "en"]),
  direction: z.enum(["rtl", "ltr"]),
  music: z
    .object({
      enabled: z.boolean(),
      src: z.string().optional(),
      startMode: z.enum(["after_first_tap", "manual", "disabled"]),
    })
    .passthrough(),
  rsvp: z
    .object({
      enabled: z.boolean(),
      mode: z.enum(["none", "public_request", "controlled_link"]),
      approvalRequired: z.boolean(),
      maxPublicRequest: z.number().optional(),
    })
    .passthrough(),
  content: z.record(sceneTypeSchema, z.record(z.string(), z.unknown())).optional(),
  sceneOverrides: z
    .record(
      z.string(),
      z
        .object({
          enabled: z.boolean().optional(),
          variant: z.string().optional(),
          content: z.record(z.string(), z.unknown()).optional(),
        })
        .passthrough()
    )
    .optional(),
}).passthrough();

const invitationSceneSchema = z.object({
  id: z.string().min(1),
  type: sceneTypeSchema,
  variant: z.string().min(1),
  enabled: z.boolean().optional(),
  required: z.boolean().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  design: sceneDesignSchema.optional(),
  media: sceneMediaConfigSchema.optional(),
  background: layerSchema.optional(),
  overlay: layerSchema.optional(),
  foreground: z.array(layerSchema).optional(),
  motion: z.record(z.string(), z.unknown()).optional(),
});

export const invitationConfigSchema = z.object({
  id: z.string().min(1),
  eventId: z.string().min(1),
  slug: z.string().min(1),
  language: z.enum(["ar", "en"]),
  direction: z.enum(["rtl", "ltr"]),
  theme: z
    .object({
      family: z.string(),
      primaryColor: z.string(),
      secondaryColor: z.string(),
      backgroundColor: z.string(),
      fontHeading: z.string(),
      fontBody: z.string(),
    })
    .passthrough(),
  layout: z.object({
    mobileMaxWidth: z.number(),
    minSupportedWidth: z.number(),
    safePaddingX: z.number(),
  }),
  music: z
    .object({
      enabled: z.boolean(),
      startMode: z.enum(["after_first_tap", "manual", "disabled"]),
    })
    .passthrough(),
  rsvp: z
    .object({
      enabled: z.boolean(),
      mode: z.enum(["none", "public_request", "controlled_link"]),
      approvalRequired: z.boolean(),
    })
    .passthrough(),
  scenes: z.array(invitationSceneSchema).min(1),
  snapshotAt: z.string().optional(),
  blueprintRef: z.object({ id: z.string(), version: z.string() }).optional(),
  presetRef: z.object({ id: z.string(), version: z.string() }).optional(),
  dataRef: z.object({ id: z.string() }).optional(),
});

export type ValidationIssue = {
  path: string;
  message: string;
};

export function formatZodIssues(
  error: z.ZodError
): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function parseSequenceBlueprint(data: unknown) {
  return sequenceBlueprintSchema.safeParse(data);
}

export function parseDesignPreset(data: unknown) {
  return designPresetSchema.safeParse(data);
}

export function parseInvitationData(data: unknown) {
  return invitationDataSchema.safeParse(data);
}

export function parseInvitationConfig(data: unknown) {
  return invitationConfigSchema.safeParse(data);
}
