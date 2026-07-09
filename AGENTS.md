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
- 10 canonical invitation scenes.
- JSON-based invitation config.
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

## Architecture Rule

Never hardcode an invitation as a single page.

Every invitation must be rendered through:

```txt
InvitationSequence + InvitationData
  -> buildInvitationConfig()
  -> InvitationConfig
  -> InvitationRenderer
  -> Scene Components
```

### Two-Layer Config Model

Do not mix design and client content in one file.

| Layer | Purpose | Contains |
|---|---|---|
| `InvitationSequence` | Reusable visual design | theme, layout, scene variants, gradients, motion defaults |
| `InvitationData` | Per-client invitation | names, dates, assets, RSVP settings, content overrides |

The renderer consumes only the merged `InvitationConfig`. Build it with:

```txt
lib/build-config.ts  ->  buildInvitationConfig(data, sequence)
lib/invitation-config.ts  ->  slug registry + Supabase lookup (Phase 3+)
```

Canonical scenes:

```txt
1. opening
2. hero_names
3. invitation_message
4. event_details
5. countdown
6. gallery_media
7. location
8. notes
9. rsvp
10. ticket_confirmation
```

If RSVP is disabled, the renderer should skip `rsvp` and `ticket_confirmation`, or turn `ticket_confirmation` into a simple closing/thank-you scene.

`ticket_confirmation` inside the invitation is **never** the QR ticket page. It is only a closing / thank-you scene. The guest's QR and ticket status live on a separate personal status route (see RSVP and QR rules below).

---

## Folder Structure

Use this structure unless there is a strong reason to adjust it:

```txt
marasim/                          # Next.js app (project name is not final)
src/
  app/
    i/[slug]/page.tsx             # Public invitation player
    s/[token]/page.tsx            # Guest RSVP/ticket status page (Phase 3)
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
      MusicGate.tsx
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
        TicketConfirmationScene.tsx   # closing/thank-you only — no QR here
    dashboard/
    scanner/
    ui/
  lib/
    build-config.ts               # buildInvitationConfig(data, sequence)
    supabase.ts
    invitation-config.ts          # slug registry
    rsvp.ts
    tickets.ts
    checkin.ts
    notifications.ts
  types/
    invitation.ts                 # InvitationConfig, InvitationSequence, InvitationData
    rsvp.ts
    tickets.ts
    events.ts
  data/
    sequences/                    # reusable design templates
      wedding-royal.sequence.ts
    invitations/                  # per-client content + assets
      ahmad-sara-demo.ts
    demo-invitations/             # built configs for registry (thin wrappers)
      wedding-royal.ts
      birth-elegant.ts
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
12. Supabase + Public Request RSVP + `/s/[rsvp_view_token]` status page (Phase 3).
13. Owner dashboard skeleton (Phase 4).
14. Approval flow, seat counters, ticket generation (Phase 4).
15. QR display on status page + scanner/check-in (Phase 5).
16. Controlled Link RSVP (Phase 6).
17. Landing page (Phase 7).
18. PWA polish.

**Phase 2.6 is a prerequisite for Phase 3+ if the goal is selling real Noor-designed invitations.**
**Phase 2.8 is the preferred delivery path for Noor animations** — designer videos/images, not per-client web animations.
Reason: Admin UI will store `variant`, `design tokens`, and `scene.design` in the database.
Those fields must work in the renderer before the admin can manage them.

Do not jump to payments, WhatsApp automation, or template editor before these are stable.

### Creating a New Invitation (internal workflow)

1. Pick or create an `InvitationSequence` in `data/sequences/`.
2. Create `InvitationData` in `data/invitations/` with client content and asset paths.
3. Build config: `buildInvitationConfig(data, sequence)`.
4. Register slug in `lib/invitation-config.ts` (Phase 3+: save to Supabase `invitations` table instead).

### Creating a New Sequence (internal workflow)

1. Define theme, layout, and ordered `SceneDefinition[]` with variants and default content only.
2. Set `theme.design` (DesignTokens) to define the visual personality of the sequence.
3. Set `variant` per scene to control layout (e.g., `rings_luxury`, `split_names`, `minimal_tap`).
4. Optionally set `scene.design` for per-scene overrides (e.g., different `iconStyle` on one scene).
5. Do not put real client names, dates, or uploaded assets in the sequence file.
6. Reuse the sequence across multiple invitations via different `InvitationData` files.

### Design System — Phase 2.6

The renderer supports a two-level design token system:

**Level 1 — `sequence.theme.design` (DesignTokens):** Applies to all scenes.
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
Suitable for storage in Supabase `sequences` table in Phase 3.

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

Config lives on `SceneDefinition.media`, overridable via `InvitationData.mediaOverrides`.
Rendered by `MediaSceneRenderer` when mode is `full_media` or `layered_media`.

---

## Acceptance Criteria For MVP

The MVP is acceptable when:

- `/i/demo-wedding` shows a full mobile invitation with the 10-scene sequence.
- RSVP can be submitted and guest is redirected to `/s/[rsvp_view_token]`.
- Owner can approve/reject/edit seats.
- Approved RSVP creates a group QR ticket visible on the guest status page.
- Scanner validates the ticket via `/t/[ticketToken]`.
- Scanner can check in partial group entries.
- Scanner blocks overuse.
- Scanner detects wrong-event tickets.
- Dashboard shows seat counters and in-app notifications.
- Landing page can send potential customers to WhatsApp/request quote.
- New invitations can be created by pairing an existing sequence with new invitation data.

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
