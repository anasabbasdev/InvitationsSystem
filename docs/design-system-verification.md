# Design System Verification — Phase 2.7

> Acceptance test proving Phase 2.6 turned the engine into a **Creative Design Engine** — not a single template with different colors.

---

## 1. Routes & Sequences

| Route | Slug | Sequence | InvitationData | Purpose |
|---|---|---|---|---|
| `/i/demo-wedding` | `demo-wedding` | `wedding-royal.sequence.ts` | `ahmad-sara-demo.ts` | Classic dark royal — ornate, framed, diamond |
| `/i/noor-wedding-demo` | `noor-wedding-demo` | `noor-wedding-luxury.sequence.ts` | `noor-wedding-demo.ts` | Cinematic copper — minimal, airy, no icons |
| `/i/noor-birth-demo` | `noor-birth-demo` | `noor-birth-soft.sequence.ts` | `noor-birth-demo.ts` | Soft birth — glass, polaroid, single name |
| `/i/noor-wedding-alt-demo` | `noor-wedding-alt-demo` | **`noor-wedding-luxury.sequence.ts`** (same as #2) | `noor-wedding-alt-demo.ts` | Reuse proof — different data/overrides only |

All four routes use the same `InvitationRenderer`. No hardcoded pages.

---

## 2. Variant Matrix Per Route

| Scene | demo-wedding | noor-wedding-demo | noor-birth-demo | noor-wedding-alt-demo |
|---|---|---|---|---|
| opening | `rings_luxury` | `full_video_intro` | `minimal_tap` | `minimal_tap` ⚡ |
| hero_names | `stacked_calligraphy` | `split_names` | `single_name_centered` | `stacked_calligraphy` ⚡ |
| invitation_message | `classic_card` | `full_bleed_text` | `minimal_quote` | `classic_card` ⚡ |
| event_details | `stacked_cards` | `minimal_rows` | `timeline` | `timeline` ⚡ |
| countdown | `boxed_luxury` | `minimal_digits` | `boxed_luxury` | `boxed_luxury` ⚡ |
| gallery_media | `single_card` | `full_bleed_media` | `polaroid_stack` | `polaroid_stack` ⚡ |
| location | `map_button_card` | `minimal_link` | `map_button_card` | `map_button_card` ⚡ |
| notes | `simple_list` | `simple_list` | `elegant_cards` | `elegant_cards` ⚡ |
| rsvp | `luxury_form` | `minimal_form` | *(hidden — rsvp off)* | `luxury_form` ⚡ |
| ticket_confirmation | `closing_luxury` | `minimal_thank_you` | `brand_signature` | `closing_luxury` ⚡ |

⚡ = overridden via `InvitationData.variantOverrides` (alt demo only — sequence file unchanged)

---

## 3. Design Tokens Per Demo

| Token | demo-wedding | noor-wedding-demo | noor-birth-demo | noor-wedding-alt-demo |
|---|---|---|---|---|
| `cardStyle` | framed | minimal | glass | framed ⚡ |
| `buttonStyle` | pill | square | pill | pill ⚡ |
| `dividerStyle` | diamond | line | none | diamond ⚡ |
| `iconStyle` | line | none | none | line ⚡ |
| `typographyStyle` | classic | modern | soft | calligraphy ⚡ |
| `cornerStyle` | ornate | none | none | ornate ⚡ |
| `sectionLabelStyle` | plain | plain | plain | badge ⚡ |
| `density` | balanced | airy | airy | balanced ⚡ |
| Primary color | `#C9A24D` gold | `#C8843A` copper | `#C48B9F` rose | `#3D6B5E` emerald ⚡ |
| Background | `#0F0B08` | `#0C0905` | `#1A0F14` | `#080E0C` ⚡ |

⚡ = from `themeOverrides` in alt demo (not in sequence file)

---

## 4. Visual Differentiation Audit

### What differs between the three original demos (beyond color/text)

| Dimension | demo-wedding | noor-wedding-demo | noor-birth-demo |
|---|---|---|---|
| Opening structure | Animated rings + star + pill CTA | Cinematic bottom-anchored CTA, no rings | Clean minimal tap, no rings |
| Hero layout | Stacked calligraphy + connector "و" | Asymmetric split (right/left names) | Single centered oversized name |
| Message layout | Framed card + corner ornaments | Full-bleed text on background | Quote mark + flowing text |
| Details layout | Icon circles + stacked values | Label/value rows, no icons | Vertical timeline dots |
| Countdown | Bordered boxes | Large bare digits | Bordered boxes (glass feel) |
| Gallery | Single bordered card | Full-scene immersive bleed | Polaroid stack with rotation |
| Location | Pin icon + card + pill button | Large title + underline link | Pin card (icons hidden via token) |
| Notes | Diamond bullets in one card | Diamond bullets in one card | Each note in separate glass card |
| RSVP | Luxury framed form | Minimal underline inputs | Hidden (announcement flow) |
| Closing | Rings + ornament + brand | Large centered text only | Brand watermark signature |
| Icons | Visible line SVGs | Hidden (`iconStyle: none`) | Hidden (`iconStyle: none`) |
| Dividers | Diamond ◆ | Thin line | None |
| Typography | Classic (Amiri headings) | Modern (sans throughout) | Soft (sans, airy spacing) |

**Verdict:** The three original routes are visually distinct in structure, not just palette.

### Phase 2.7 sequence tweaks (birth demo)

`noor-birth-soft.sequence.ts` was adjusted so birth no longer shares `minimal_digits` countdown or `stacked_cards` details with other demos:

- `event_details`: `stacked_cards` → `timeline`
- `countdown`: `minimal_digits` → `boxed_luxury`
- `ticket_confirmation`: `minimal_thank_you` → `brand_signature`

---

## 5. Reuse Proof — What Changed in Alt Demo (Without Copying Sequence)

| Layer | Changed? | What |
|---|---|---|
| **Sequence file** | ❌ No | Still `noor-wedding-luxury.sequence.ts` unchanged |
| **variantOverrides** | ✅ Yes | 10/10 scenes use different variants than base noor-wedding-demo |
| **themeOverrides** | ✅ Yes | Emerald/champagne palette + full design token set |
| **designOverrides** | ✅ Yes | Per-scene tweaks (ghost opening button, glass notes, etc.) |
| **assetOverrides** | ✅ Yes | Different gradients on opening, hero, gallery, closing |
| **content** | ✅ Yes | Different couple (عبدالله & ريما), venue (جدة), dates, copy |
| **Scene components** | ❌ No | Zero new or modified scene components |
| **Hardcoded page** | ❌ No | Registered via slug registry like all other demos |

### Alt vs Base noor-wedding-demo — side-by-side

| Aspect | noor-wedding-demo | noor-wedding-alt-demo |
|---|---|---|
| Sequence | noor-wedding-luxury | **same** |
| Colors | Copper `#C8843A` | Emerald `#3D6B5E` |
| Opening | full_video_intro | minimal_tap |
| Hero | split_names | stacked_calligraphy |
| Message | full_bleed_text | classic_card (framed) |
| Details | minimal_rows | timeline |
| Countdown | minimal_digits | boxed_luxury |
| Gallery | full_bleed_media | polaroid_stack |
| Location | minimal_link | map_button_card + icons |
| Notes | simple_list | elegant_cards (glass) |
| RSVP form | minimal_form | luxury_form |
| Closing | minimal_thank_you | closing_luxury (rings) |
| Icons | none | line |
| Dividers | line | diamond |

---

## 6. What Still Requires Component Changes

Nothing for the acceptance test scenarios. All four demos render through existing scene components + config.

Future cases that would need component work:

| Case | Why |
|---|---|
| New variant name not in scene switch | Add variant branch in scene component |
| New design token value | Extend `DesignTokens` type + style helper |
| Custom font family beyond Amiri/Tajawal | Load font in `layout.tsx` |
| Motion presets from `scene.motion` | Motion values exist in config but are not fully consumed yet |

---

## 7. Hardcoded by Design

Items intentionally left in components (documented, not bugs):

| Item | Location | Reason |
|---|---|---|
| Section label fallbacks | All scenes (`?? "تفاصيل المناسبة"`, etc.) | Empty-content fallback for dev/preview — real invitations set `content.sectionLabel` |
| Name/venue fallbacks | HeroNames, Location | Placeholder when InvitationData is incomplete |
| RSVP mock success copy | `RSVPScene.tsx` | Business message, not client-specific data |
| Ticket closing copy | `TicketConfirmationScene.tsx` | Standard thank-you / status text |
| Brand line "مراسِم" | `closing_luxury`, `brand_signature` variants | Product signature — not per-client |
| Polaroid frame color `#f5ede6` | `GalleryMediaScene` polaroid variant | Warm cream frame aesthetic — could become token later |
| Opening scroll hint animation | `rings_luxury` variant only | Decorative UX for luxury opening |
| 10-scene canonical order | `InvitationRenderer` | Core architecture — scenes are fixed, presentation is not |
| Font loading (Amiri, Tajawal) | `app/layout.tsx` | Only two web fonts loaded; `typographyStyle` switches between them |
| `OrnamentDivider.tsx` | `components/ui/` | Legacy file — replaced by `SceneOrnament.tsx`, not imported anywhere |
| Framer Motion timings | Scene components | Animation layer — not in JSON config yet |
| `scene.motion` config field | Sequence / InvitationData | Stored but not yet read by components |

### Hardcoded leftovers audit (Phase 2.7 check)

| Check | Status |
|---|---|
| Section titles hardcoded | ✅ Configurable via `content.sectionLabel` + `sectionLabelStyle`; fallbacks only |
| SVG mandatory icons | ✅ Respects `iconStyle: "none"` and `iconStyle: "asset"` |
| OrnamentDivider fixed in scenes | ✅ Replaced by `SceneOrnament` reading `dividerStyle` |
| Card style fixed | ✅ Reads `cardStyle` via `getCardStyles()` |
| Button style fixed | ✅ Reads `buttonStyle` via `getButtonStyles()` |
| Layout ignores variant | ✅ All 10 scenes have `switch (scene.variant)` with 3 branches |

---

## 8. Build Status

```
npm run build   → ✅ success
npx tsc --noEmit → ✅ no errors
```

Routes verified in build output:

- `/i/demo-wedding`
- `/i/noor-wedding-demo`
- `/i/noor-birth-demo`
- `/i/noor-wedding-alt-demo`

---

## 9. What Noor Should Deliver First (Priority Assets)

### Wedding Royal (`/i/demo-wedding`)

| Scene | Asset | Path suggestion |
|---|---|---|
| opening | Dark texture background | `public/assets/demo/wedding/opening-bg.webp` |
| opening | Top ornament | `public/assets/demo/wedding/ornament-top.webp` |
| opening | Bottom ornament | `public/assets/demo/wedding/ornament-bottom.webp` |
| gallery | Engagement photo | `public/assets/demo/wedding/gallery-01.webp` |

### Noor Wedding (`/i/noor-wedding-demo`)

| Scene | Asset | Path suggestion |
|---|---|---|
| opening | Cinematic video ≤3MB | `public/assets/demo/noor/wedding/opening-bg.mp4` |
| opening | Video fallback still | `public/assets/demo/noor/wedding/opening-bg.webp` |
| gallery | Full-bleed photo | `public/assets/demo/noor/wedding/gallery-01.webp` |

### Noor Birth (`/i/noor-birth-demo`)

| Scene | Asset | Path suggestion |
|---|---|---|
| opening | Soft rose background | `public/assets/demo/noor/birth/opening-bg.webp` |
| gallery | Baby photo (polaroid) | `public/assets/demo/noor/birth/baby-photo-01.webp` |

### Wedding Alt — reuse proof (`/i/noor-wedding-alt-demo`)

Same sequence as Noor Wedding — deliver to `wedding-alt/` folder:

| Scene | Asset | Path suggestion |
|---|---|---|
| opening | Emerald-themed video or image | `public/assets/demo/noor/wedding-alt/opening-bg.mp4` |
| gallery | Polaroid photo | `public/assets/demo/noor/wedding-alt/gallery-01.webp` |
| hero | Optional background texture | `public/assets/demo/noor/wedding-alt/hero-bg.webp` |

**Rule:** No variable text inside any image file.

---

## 10. Phase 2.8 — Asset-Driven Scene Player

### Relationship to Phase 2.6 / 2.7

| Phase | Proved |
|---|---|
| **2.6** | Design tokens + `scene.variant` change web layout (cards, icons, dividers) |
| **2.7** | Same sequence + different `InvitationData` = different visual direction |
| **2.8** | Designer video/image/layers replace web animations — minimal custom code per client |

The engine now supports three composition modes per scene via `scene.media`:

| Mode | When to use |
|---|---|
| `full_media` | Designer delivers a complete scene as one video or image |
| `layered_media` | Background + foreground ornaments + live text slots |
| `web_layout` | Functional scenes (RSVP, countdown, location) or no assets yet |

### New media demo routes

| Route | Sequence | Mode mix |
|---|---|---|
| `/i/noor-wedding-media-demo` | `noor-wedding-media.sequence.ts` | opening/hero/message/gallery/closing = media-driven; details/countdown/location/rsvp = web_layout |
| `/i/noor-birth-media-demo` | `noor-birth-media.sequence.ts` | same pattern for birth |

### Composition mode per scene (media demos)

| Scene | Wedding media | Birth media |
|---|---|---|
| opening | `full_media` (video) | `full_media` (video) |
| hero_names | `layered_media` | `layered_media` |
| invitation_message | `full_media` (image + live text) | `full_media` |
| event_details | `web_layout` | `web_layout` |
| countdown | `web_layout` | `web_layout` |
| gallery_media | `full_media` | `full_media` |
| location | `web_layout` | `web_layout` |
| notes | `web_layout` | `web_layout` |
| rsvp | `web_layout` | `web_layout` (hidden if rsvp off) |
| ticket_confirmation | `full_media` (video/image) | `full_media` (image) |

### What still needs web programming

| Need | Mode |
|---|---|
| RSVP form + validation | `web_layout` |
| Countdown timer (live dates) | `web_layout` |
| Map link / venue | `web_layout` |
| Seat logic, QR, backend | Future phases |
| Custom butterfly/gate CSS animation | **Not needed** — designer video instead |

### Build status (Phase 2.8)

All routes including legacy demos + 2 new media demos: `npm run build` ✅

---

## 11. Phase 2.10 — Journey Foundation

### Architecture layers

| Layer | File location | Contains |
|---|---|---|
| **SequenceBlueprint** | `data/blueprints/*.blueprint.ts` | Scene IDs, types, order, `enabledByDefault`, `required` |
| **DesignPreset** | `data/presets/*.preset.ts` | `theme`, `typeDefaults[sceneType]`, `sceneOverrides[sceneId]` |
| **InvitationData** | `data/invitations/*.ts` | Client content, RSVP, `sceneOverrides[sceneId]` |
| **InvitationConfig** | built at runtime | Resolved output for `InvitationRenderer` |

### Same blueprint, three designs (all 10 scenes enabled)

| Route | Blueprint | Preset | Visual |
|---|---|---|---|
| `/i/ws-royal-demo` | `wedding-standard` | `wedding-royal-dark` | Dark gold, web_layout, framed cards |
| `/i/ws-floral-demo` | `wedding-standard` | `wedding-cinematic-floral` | Designer video/image, full_media |
| `/i/ws-minimal-demo` | `wedding-standard` | `wedding-minimal-modern` | Light theme, Tajawal, no icons |

---

## 12. Phase 2.11 — Scene Instance Composer

### Composer capabilities (`/lab/composer`)

| Feature | Status |
|---|---|
| State keyed by `sceneId` | ✅ |
| Add Scene (pick type → auto ID) | ✅ |
| Duplicate (independent copy) | ✅ |
| Remove / Enable / Disable | ✅ |
| Move Up / Move Down | ✅ |
| Edit scene ID + label | ✅ |
| Separate exports (Blueprint / Preset / Data / Config) | ✅ |

### Gallery repeat acceptance

| Route | Blueprint | Proof |
|---|---|---|
| `/i/ws-gallery-repeat-demo` | `gallery-repeat-acceptance` | `gallery-childhood` (image) + `gallery-wedding-day` (video) — independent `preset.sceneOverrides` + `data.sceneOverrides` |

### Published snapshot policy

- **Draft:** resolves latest blueprint + preset + data via `buildInvitationConfigV2()`.
- **Published:** `createPublishedSnapshot(config)` freezes `InvitationConfig` with `snapshotAt`, `blueprintRef`, `presetRef`, `dataRef`.
- Later blueprint/preset edits do not affect published invitations.
