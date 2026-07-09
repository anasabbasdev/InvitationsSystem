# AGENTS.md - Marasim Interactive Invitations

> Project app lives in `marasim/` (folder name is not final). See also `marasim_technical_plan_v2_ar.md` for phased implementation plan in Arabic.

## Project Summary

Marasim is an MVP for luxury interactive digital invitations focused on mobile-first event experiences.

The project is not a generic template editor and not a one-off static HTML invitation generator. It is an **Invitation Renderer / Player** that reads a structured JSON configuration and renders reusable scenes with custom assets.

Business principle:

**Custom externally, modular internally.**

Clients receive a premium custom-designed invitation. Internally, the system uses a fixed scene architecture, reusable components, configurable variants, RSVP logic, owner dashboard, and QR-based group tickets.

---

## Core MVP Scope

Build only the MVP needed to sell and test the service:

- Mobile-first invitation renderer.
- Scene Library of 10 canonical scene types (journey is configurable per blueprint).
- JSON-based invitation config (V2: Blueprint + Preset + Data).
- RSVP with two modes:
  - Public Request RSVP.
  - Controlled Link RSVP.
- Owner dashboard, responsive and PWA-ready.
- In-app notifications inside the dashboard.
- QR group tickets.
- Scanner/check-in flow.
- Basic admin/internal management.
- Landing page with demos and request quote CTA.

Do not build a full SaaS platform yet.

---

## Non-Goals For MVP

Do not implement unless explicitly requested in a later phase:

- Customer-facing template editor.
- Stripe/online checkout.
- WhatsApp Business API automation.
- Push notifications as a required dependency.
- Static HTML export for customers.
- Full multi-tenant SaaS billing.
- Full logistics management for photography/decor/giveaways.
- Desktop-first layouts.
- Native mobile app.

---

## Tech Direction

Preferred stack:

- React + TypeScript.
- Next.js is preferred if starting from scratch.
- Tailwind CSS.
- Framer Motion for safe web animations.
- React Hook Form + Zod for forms.
- Supabase for database/auth/storage integration where needed.
- Cloudflare R2 later for heavy assets.

Use English for code identifiers, file names, variables, and comments. Arabic content is allowed only in seed/demo data, UI text, and documentation.

---

## Architecture Rule (V2 — Source of Truth)

Never hardcode an invitation as a single page.

Every invitation must be rendered through:

```txt
SequenceBlueprint + DesignPreset + InvitationData
  -> buildInvitationConfigV2()
  -> InvitationConfig
  -> InvitationRenderer
  -> Scene Components (via scene registry)
```

On publish:

```txt
InvitationConfig
  -> createPublishedSnapshot()
  -> frozen published config (stored in published_snapshots)
```

### Six-Layer Model

Do not mix journey, design, and client content in one file.

| Layer | Type | Purpose | Contains |
|---|---|---|---|
| 1. Scene Library | `SceneType` | Reusable component catalog | 10 canonical types — **not** a fixed journey |
| 2. Journey | `SequenceBlueprint` | Which scenes, in what order | `SceneBlueprintEntry[]`: `id`, `type`, `enabledByDefault`, `required` — **no design, no content** |
| 3. Design | `DesignPreset` | Visual identity | `theme`, `typeDefaults[sceneType]`, `sceneOverrides[sceneId]` |
| 4. Content | `InvitationData` | Per-client invitation | names, dates, assets, RSVP, `sceneOverrides[sceneId]` |
| 5. Resolved | `InvitationConfig` | Runtime merge output | `InvitationScene[]` with `enabled`, variant, design, media, content |
| 6. Published | `PublishedSnapshot` | Frozen publish artifact | `InvitationConfig` + `snapshotAt` + version refs — immutable for live invitations |

**SceneInstance** is the resolved unit at runtime: one `InvitationScene` with a unique `id` (sceneId), a `type` (SceneType), and merged fields. Blueprint entries become instances after merge.

### Merge Order (buildInvitationConfigV2)

1. Blueprint `SceneBlueprintEntry` (id, type, enabled from `enabledByDefault` / `required`)
2. `DesignPreset.typeDefaults[sceneType]`
3. `DesignPreset.sceneOverrides[sceneId]`
4. `InvitationData.sceneOverrides[sceneId]` (content, `enabled`, assets)
5. → Resolved `InvitationScene`

Build with:

```txt
lib/build-config.ts       ->  buildInvitationConfigV2(blueprint, preset, data)
lib/build-config.ts       ->  createPublishedSnapshot(config)
lib/preset-utils.ts       ->  getPresetTypeDefaults()
lib/invitation-config.ts  ->  slug registry + Supabase lookup (Phase 3A+)
```

### Journey vs Scene Library

The 10 scene types are a **Scene Library**, not a mandatory fixed journey:

```txt
opening | hero_names | invitation_message | event_details | countdown
gallery_media | location | notes | rsvp | ticket_confirmation
```

- Scenes can be **added, duplicated, reordered, or removed** per blueprint.
- The same `SceneType` may appear multiple times with different `sceneId` values (e.g. two `gallery_media` scenes).
- New assets or visual identity → new **DesignPreset**, not a new blueprint.
- New **SequenceBlueprint** only when the **journey** changes (count, order, repetition, types).
- Overrides target **`sceneId`**, not `SceneType` alone (legacy type-keyed overrides exist only in V1).

### RSVP & Closing Scene Rules

- `rsvp` scene: disable independently via `scene.enabled: false` in overrides — not via `variant: "hidden"`.
- `ticket_confirmation` is the historical `SceneType` name; functionally it is the **Closing Scene** only (thank-you / farewell).
- **Disabling RSVP does NOT auto-hide the closing scene.** Each scene's visibility is controlled by its own `enabled` flag.
- QR and ticket status **never** appear inside `InvitationRenderer` — only on `/s/[rsvp_view_token]` or `/t/[ticketToken]`.

### Snapshot Policy

- **Draft invitation:** built from latest linked Blueprint + Preset + InvitationData via `buildInvitationConfigV2()`.
- **Published invitation:** serves the frozen `PublishedSnapshot` only — not a live re-merge.
- Editing a Blueprint or Preset does **not** auto-change published invitations.
- Re-publish creates a **new** snapshot; old snapshots are retained for audit / rollback.
- `createPublishedSnapshot()` sets `snapshotAt` and should record `blueprintRef`, `presetRef`, `dataRef` on the config.

### Database Contract (Phase 3A — design only, not implemented yet)

Design tables:

| Table | Key fields |
|---|---|
| `sequence_blueprints` | `id`, `name`, `version`, `blueprint_json`, `status`, timestamps |
| `design_presets` | `id`, `name`, `version`, `compatible_blueprint_id` (nullable), `preset_json`, `status`, timestamps |
| `invitations` | `id`, `event_id`, `slug`, `blueprint_id`, `blueprint_version`, `preset_id`, `preset_version`, `invitation_data_json`, `status` (`draft` \| `published` \| `archived`), `published_snapshot_id` (nullable), timestamps |
| `published_snapshots` | `id`, `invitation_id`, `resolved_config_json`, `blueprint_id`, `blueprint_version`, `preset_id`, `preset_version`, `snapshot_at` |

Operational tables (Phase 3B+): `events`, `event_settings`, `rsvps`, `tickets`, `invite_links`, `checkins`, `event_notifications`.

**Decision pending before migration:** actual schema may use UUID primary keys with string business IDs inside JSON — pick one convention and apply consistently.

> Do not create Supabase tables or migrations until Phase 3A is explicitly approved.

---

## Folder Structure

Use this structure unless there is a strong reason to adjust it:

```txt
marasim/                          # Next.js app (project name is not final)
src/
  app/
    i/[slug]/page.tsx             # Public invitation player
    s/[token]/page.tsx            # Guest RSVP/ticket status page (Phase 3B)
    t/[ticketToken]/page.tsx      # Direct ticket page (Phase 5)
    lab/
      composer/page.tsx           # Internal Scene Instance Composer (dev)
      composer/userguide/page.tsx
    owner/
      login/page.tsx
      events/page.tsx
      events/[eventId]/page.tsx
      events/[eventId]/rsvps/page.tsx
      events/[eventId]/tickets/page.tsx
      events/[eventId]/scanner/page.tsx
      events/[eventId]/notifications/page.tsx
    admin/
      page.tsx
  components/
    invitation/
      InvitationRenderer.tsx
      SceneFrame.tsx
      LayerRenderer.tsx
      MediaSceneRenderer.tsx      # full_media / layered_media scenes
      MusicGate.tsx
      scene-registry.tsx          # SceneType → component map
      scenes/
        OpeningScene.tsx
        HeroNamesScene.tsx
        InvitationMessageScene.tsx
        EventDetailsScene.tsx
        CountdownScene.tsx
        GalleryMediaScene.tsx
        LocationScene.tsx
        NotesScene.tsx
        RSVPScene.tsx
        TicketConfirmationScene.tsx   # Closing scene only — no QR
    lab/
      ComposerApp.tsx
      JourneyPanel.tsx
      DesignPanel.tsx
      ContentPanel.tsx
    dashboard/
    scanner/
    ui/
  lib/
    build-config.ts               # buildInvitationConfigV2 + createPublishedSnapshot
    preset-utils.ts               # getPresetTypeDefaults()
    composer/                     # Composer state, journey helpers
      state.ts
      journey.ts
    scene-design.ts               # DesignTokens defaults + resolution
    supabase.ts                   # Phase 3A+
    invitation-config.ts          # slug registry (+ Supabase fallback in 3A)
    rsvp.ts
    tickets.ts
    checkin.ts
    notifications.ts
  types/
    invitation.ts                 # V2 types + legacy V1 types
    rsvp.ts
    tickets.ts
    events.ts
  data/
    blueprints/                   # SequenceBlueprint journey definitions
      wedding-standard.blueprint.ts
      wedding-short.blueprint.ts
    presets/                      # DesignPreset visual identities
      wedding-royal-dark.preset.ts
      wedding-cinematic-floral.preset.ts
    invitations/                  # InvitationData per client / demo
      ws-royal-demo.ts
    sequences/                    # LEGACY V1 — old demos only
      wedding-royal.sequence.ts
    demo-invitations/             # LEGACY V1 thin wrappers for registry
      wedding-royal.ts
  public/
    assets/
      demo/
```

---

## Invitation Renderer Rules

- Renderer reads only config and props.
- Scenes should not fetch database data directly unless specifically designed to do so.
- Keep visual scene rendering separate from RSVP/ticket business logic.
- `LayerRenderer` handles backgrounds, overlays, foreground ornaments, video/image/lottie layers.
- `SceneFrame` handles mobile layout, min-height, safe padding, and scroll behavior.
- `MusicGate` handles first-tap music unlock.

Mobile constraints:

- Design for 390px width first.
- Support 348px to 430px without layout breaks.
- Center content on larger screens with max-width 430px.

---

## RSVP Rules

There are two approved RSVP modes.

### 1. Public Request RSVP

Anyone with the invitation link can request attendance.

Rules:

- Submission creates RSVP with `status = pending`.
- Generate a cryptographically strong `rsvp_view_token` for the guest.
- After submit, redirect guest to `/s/[rsvp_view_token]` (no login required).
- Do not generate ticket immediately.
- Do not subtract seats immediately.
- Owner must approve, reject, or edit approved seats.
- Only approved seats count against capacity.
- Create an in-app notification for the owner.
- After approval, the same `/s/[rsvp_view_token]` page shows the QR ticket.
- Owner may copy/share that status link manually (WhatsApp later in a later phase).

### 2. Controlled Link RSVP

A private invite link has a token and a max seat limit.

Rules:

- Guest opens `/i/[slug]?t=[invite_token]` (or dedicated controlled route).
- Guest cannot request more than `max_seats`.
- Link may be tied to side: groom, bride, general, VIP.
- Ticket can be generated after valid confirmation.
- Link may be disabled/expired/used depending on settings.
- The invite/status URL itself is the guest's ticket page after confirmation.

---

## QR Ticket Rules

Guests do not have accounts. They access tickets only through unguessable token URLs.

QR codes must not contain sensitive data.

### Guest-facing routes

```txt
/s/[rsvp_view_token]   # RSVP status + QR after approval (public request mode)
/t/[ticketToken]       # Direct ticket page / QR payload URL (scanner + guest view)
```

### Scanner rule

The QR encodes only:

```txt
/t/[ticketToken]
```

The scanner must fetch data from the database.

Ticket is group-based:

- One QR can represent multiple seats.
- Scanner shows max entries, used entries, remaining entries.
- Scanner actions may check in 1, 2, 3, or all remaining entries.
- Never allow `used_entries` to exceed `max_entries`.

Wrong-event protection:

If a scanner is opened for event A and the QR belongs to event B, show a clear `WRONG_EVENT` state and do not allow check-in.

---

## Database Safety Rules

- Never rely only on frontend validation for seat counts.
- Enforce seat limits in server-side/Supabase logic where possible.
- Never subtract requested seats until approval/confirmation.
- Generate cryptographically strong tokens for invite links and tickets.
- Do not expose service role keys to the frontend.
- Use environment variables.
- RLS should be planned before any production deployment.

---

## PWA Rules

PWA is for owner/organizer dashboard only.

Do not require invitees/guests to install anything.

MVP PWA requirements:

- Dashboard responsive on mobile.
- Manifest-ready.
- In-app notifications.
- Scanner route optimized for mobile.

Push notifications are optional later and must not be required for the dashboard to function.

---

## UI/UX Rules

For invitees:

- No login.
- No app install.
- No unnecessary steps.
- Clear RSVP flow.
- Music starts only after user interaction.
- After RSVP submit, guest receives a personal status link (`/s/[rsvp_view_token]`).
- QR ticket appears only on the status/ticket page when allowed — never inside the invitation scroll.
- `TicketConfirmationScene` is a closing/thank-you message only.

For owner:

- Fast dashboard.
- Clear seat counters.
- Pending RSVP actions visible.
- Scanner easy to open.

For gate organizer:

Show only operational data:

- valid/invalid/wrong event/used status.
- event name.
- event date.
- guest name.
- side.
- seats and used count.
- check-in buttons.

---

## Coding Style

- Use TypeScript strictly.
- Prefer small components.
- Keep business logic in `lib/`.
- Keep types in `types/`.
- Avoid duplicated logic.
- Avoid hardcoded event data in components.
- Use accessible form controls.
- Keep animations tasteful and performant.
- Avoid heavy videos in every scene.
- Use optimized assets.

---

## Development Order

Follow this order unless the user explicitly changes it:

1. Project setup and folder structure. **Done (Phase 0)**
2. Invitation types and config schema. **Done**
3. Sequence + InvitationData split and `buildInvitationConfig()`. **Done**
4. InvitationRenderer and 10 scene skeletons. **Done (Phase 1)**
5. First Wedding Royal static demo at `/i/demo-wedding`. **Done**
6. Visual polish for Wedding Royal demo. **Done (Phase 2)**
7. Noor Design Integration Readiness — 3 demo routes, LayerRenderer, asset docs. **Done (Phase 2.5)**
8. **Creative Design System Activation — scene variants, DesignTokens, SceneDesign, 3 visually distinct demos. Done (Phase 2.6)**
9. Design Integration Acceptance Test — reuse proof, variantOverrides, verification docs. **Done (Phase 2.7)**
10. **Asset-Driven Scene Player — full_media / layered_media / MediaSceneRenderer. Done (Phase 2.8)**
11. **Internal Scene Composer — /lab/composer dev tool. Done (Phase 2.9)**
12. **Architecture Validation & Journey Foundation — SequenceBlueprint, DesignPreset, sceneId overrides, enabled scenes. Done (Phase 2.10)**
13. **Scene Instance Composer & Architecture Closure — sceneId-based Composer, Journey editor, separated exports, published snapshot policy. Done (Phase 2.11)**
14. **Documentation & Persistence Contract Freeze — V2-only docs, database contract, snapshot policy. Done (Phase 2.12)**
15. **Phase 3A — Supabase Persistence Foundation** (in progress):
    - Supabase setup + migrations ✅
    - Blueprint / Preset / Invitation / Snapshot repositories ✅
    - Load invitation by slug from Supabase ✅
    - Local registry fallback for demos ✅
    - Seed script (`npm run db:seed`) ✅
    - No real RSVP submission yet
16. **Phase 3B — Public Request RSVP** (not started — requires approval):
    - RSVP submission + cryptographic `rsvp_view_token`
    - Redirect to `/s/[token]`
    - Status page: pending / rejected / approved
    - Owner notification record
    - No seat deduction before approval
17. Owner dashboard skeleton (Phase 4).
18. Approval flow, seat counters, ticket generation (Phase 4).
19. QR display on status page + scanner/check-in (Phase 5).
20. Controlled Link RSVP (Phase 6).
21. Landing page (Phase 7).
22. PWA polish.

**Phase 2.6 is a prerequisite for Phase 3+ if the goal is selling real Noor-designed invitations.**
**Phase 2.8 is the preferred delivery path for Noor animations** — designer videos/images, not per-client web animations.
**Phase 2.12 freezes the V2 persistence contract.** Do not start Supabase until Phase 3A is explicitly approved.
Reason: Admin UI will store blueprint, preset, and invitation data in the database.
Those fields must match the V2 merge model before migrations are written.

Do not jump to payments, WhatsApp automation, or template editor before these are stable.

### Creating a New Invitation (V2 workflow)

```txt
SequenceBlueprint  +  DesignPreset  +  InvitationData
  → buildInvitationConfigV2()
  → InvitationConfig
  → InvitationRenderer
```

1. Pick or create a `SequenceBlueprint` in `data/blueprints/` (journey only — IDs, order, enabled).
2. Pick or create a `DesignPreset` in `data/presets/` (`typeDefaults` + optional `sceneOverrides` by sceneId).
3. Create `InvitationData` in `data/invitations/` with client content and `sceneOverrides` keyed by sceneId.
4. Build: `buildInvitationConfigV2(blueprint, preset, data)`.
5. Register slug in `lib/invitation-config.ts` (Phase 3A+: Supabase with local fallback).

**Rule:** New assets or visual identity = new DesignPreset, NOT a new SequenceBlueprint.
New SequenceBlueprint only when the journey changes (scene count, order, repetition, types).

### Creating a New Blueprint (journey only)

1. Define ordered `SceneBlueprintEntry[]` with unique `id`, `type`, optional `label`, `enabledByDefault`, `required`.
2. Set `layout` defaults only — no theme, no variants, no client content.
3. Bump `version` when journey structure changes.
4. Reuse across multiple presets and invitations.

### Creating a New Design Preset

1. Define `theme` + `typeDefaults[sceneType]` for baseline visuals per scene type.
2. Use `sceneOverrides[sceneId]` for per-instance differences (e.g. two gallery scenes).
3. Bump `version` when visual defaults change.
4. Optionally set `compatible_blueprint_id` when preset is blueprint-specific.

---

## Legacy (V1 — backward compatibility only)

V1 exists **only** to keep old demo routes working (`demo-wedding`, `noor-*`). Do **not** use V1 for any new feature, demo, or database design.

```txt
InvitationSequence + InvitationData
  → buildInvitationConfig()   # @deprecated
  → InvitationConfig
```

| V1 artifact | Location | Why kept |
|---|---|---|
| `InvitationSequence` | `data/sequences/` | Old demos built before Phase 2.10 |
| `buildInvitationConfig()` | `lib/build-config.ts` | Registry wrappers for legacy slugs |
| Type-keyed `content` / `assetOverrides` | `InvitationData` | Backward compat in merge fallbacks |
| `data/demo-invitations/` | thin V1 wrappers | Pre-built configs for old registry entries |
| `variant: "hidden"` | some legacy sequences | Superseded by `enabled: false` in V2 |

When migrating a demo to V2: extract journey → blueprint, design → preset, content → `sceneOverrides[sceneId]`.

### Design System — Phase 2.6

The renderer supports a two-level design token system:

**Level 1 — `DesignPreset.theme.design` or `theme.design` (DesignTokens):** Applies to all scenes.
```ts
theme.design = {
  cardStyle: "framed" | "minimal" | "glass" | "full_bleed" | "none",
  buttonStyle: "pill" | "square" | "ghost" | "underline" | "none",
  dividerStyle: "diamond" | "line" | "floral_asset" | "none",
  iconStyle: "line" | "filled" | "asset" | "none",
  typographyStyle: "classic" | "modern" | "calligraphy" | "soft",
  cornerStyle: "ornate" | "minimal" | "none",
  sectionLabelStyle: "badge" | "plain" | "hidden",
  density: "airy" | "balanced" | "compact",
}
```

**Level 2 — `scene.design` (SceneDesign):** Per-scene overrides (same fields + extra):
```ts
scene.design = {
  ...DesignTokens,          // can override any token for this scene only
  ornamentAsset?: string,   // custom divider image (for dividerStyle: "floral_asset")
  iconAssets?: Record<string, string>, // custom icons (for iconStyle: "asset")
  textPlacement?: "top" | "center" | "bottom" | "overlay",
  mediaTreatment?: "card" | "full_bleed" | "polaroid" | "frame",
}
```

**Resolution order (highest to lowest priority):**
`scene.design` → `theme.design` → DESIGN_DEFAULTS (in `lib/scene-design.ts`)

**JSON-serializable:** All values are plain strings. No functions or components in config.
Suitable for storage in Supabase `design_presets` / `published_snapshots` tables (Phase 3A).

### Scene Variants Reference

| Scene | Variants |
|---|---|
| `opening` | `rings_luxury`, `full_video_intro`, `minimal_tap` |
| `hero_names` | `stacked_calligraphy`, `split_names`, `single_name_centered` |
| `invitation_message` | `classic_card`, `full_bleed_text`, `minimal_quote` |
| `event_details` | `stacked_cards`, `timeline`, `minimal_rows` |
| `countdown` | `boxed_luxury`, `minimal_digits`, `hidden` |
| `gallery_media` | `single_card`, `full_bleed_media`, `polaroid_stack` |
| `location` | `map_button_card`, `minimal_link`, `full_bleed_location` |
| `notes` | `simple_list`, `elegant_cards`, `hidden` |
| `rsvp` | `luxury_form`, `minimal_form`, `hidden` |
| `ticket_confirmation` | `closing_luxury`, `minimal_thank_you`, `brand_signature` |

### Scene Composition Modes — Phase 2.8

Each scene can set `media.compositionMode`:

| Mode | Purpose |
|---|---|
| `full_media` | Single designer video/image fills the scene |
| `layered_media` | Stack background + foreground assets + optional live text |
| `web_layout` | Default — variants + design tokens (RSVP, countdown, etc.) |

Config lives on scene media fields in preset/data overrides.
Rendered by `MediaSceneRenderer` when mode is `full_media` or `layered_media`.

---

## Acceptance Criteria For MVP

The MVP is acceptable when:

- `/i/ws-royal-demo` (or any V2 demo) shows a full mobile invitation from blueprint + preset + data.
- `/i/demo-wedding` continues to work via legacy V1 registry path.
- RSVP can be submitted and guest is redirected to `/s/[rsvp_view_token]`.
- Owner can approve/reject/edit seats.
- Approved RSVP creates a group QR ticket visible on the guest status page.
- Scanner validates the ticket via `/t/[ticketToken]`.
- Scanner can check in partial group entries.
- Scanner blocks overuse.
- Scanner detects wrong-event tickets.
- Dashboard shows seat counters and in-app notifications.
- Landing page can send potential customers to WhatsApp/request quote.
- New invitations are created via Blueprint + Preset + InvitationData (V2).

---

## Important Warning

Do not turn this project into a beautiful single-page demo only.

The UI matters, but the business value comes from:

- reusable scene engine,
- controlled RSVP,
- QR tickets,
- owner dashboard,
- operational check-in.
- Use latest compatible versions: Next.js 16.x, React 19.2, Tailwind CSS v4.

A pretty page without this structure is not the product.
