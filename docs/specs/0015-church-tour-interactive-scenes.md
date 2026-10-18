# 0015. Church Tour Interactive Scenes

**Date**: 2026-10-18
**Status**: Proposed

## Summary

This specification defines the interactive church tour feature for Kid Zone. Children explore five illustrated rooms of a Catholic church with horizontal pan navigation, tapping glowing halo hot spots on sacred items like the Tabernacle, Altar, and Baptismal Font. Each item opens a calm bottom sheet presenting child friendly explanations tailored by age band, Web Speech audio narration, and practical reverence guidance on how to behave reverently in God's house.

## Context

Catholic churches are filled with rich sacred signs, architecture, and sacred vessels whose spiritual purpose is often unfamiliar to young children. Without guided context, children can feel lost during Mass or treat church visits like ordinary auditoriums.

At the same time, children need to understand that the church building is truly sacred because Jesus is present in the Blessed Sacrament. Reverence is learned by seeing and practicing: genuflecting toward the Tabernacle, blessing oneself with holy water at the entrance, keeping a quiet voice in the nave, and showing honour to the altar.

The learning platform requires an engaging yet reverent digital church tour that runs smoothly on low power devices and phones without requiring heavy 3D rendering engines or video streams. Children must be able to explore freely at their own pace, read or listen to age adapted teaching, link directly to glossary terms, and earn habit stars upon finishing the complete church tour.

## Requirements

**User stories**:

- As a Catholic child, I want to explore different parts of a Catholic church building so that I understand sacred objects when I attend Holy Mass with my family.
- As a young learner, I want to tap glowing halo spots on church items so that I can listen to friendly explanations and learn how we show reverence.
- As a parent, I want my child to learn liturgical etiquette and Catholic reverence without distractions or noisy commercial game mechanics.

**Acceptance criteria**:

- **AC-1**: The church tour provides five distinct illustrated scenes in logical walking order: The Entrance and Narthex, The Nave and Pews, The Sacred Sanctuary, The High Altar and Tabernacle, and The Sacristy.
- **AC-2**: Each scene renders a responsive vector illustration with interactive halo hot spots positioned via percentage coordinates (x percent and y percent from 0 to 100), ensuring accurate alignment on phones, tablets, and desktop displays.
- **AC-3**: Tapping an item hot spot opens an accessible bottom sheet dialog displaying the item title, sacred illustration, age band explanation (derived from child birth date: 3 to 7, 8 to 10, or 11 to 15), and a dedicated reverence note titled "How we behave".
- **AC-4**: Each sacred item provides Web Speech API read aloud narration with play, pause, and stop controls, highlighting text as it reads for emerging readers.
- **AC-5**: Items with matching glossary entries provide a direct link to the full glossary definition, reinforcing catechism vocabulary.
- **AC-6**: Scene navigation allows smooth horizontal transitions between adjacent scenes with clear previous and next buttons that maintain accessible 48px tap targets.
- **AC-7**: Unauthenticated guest learners can explore all five scenes and items freely without database errors or sign in prompts.
- **AC-8**: Authenticated children who inspect all items across the five scenes can complete the tour, logging an idempotent activity event 'church_tour_completed' and earning 5 stars via default coin rules.

## Options considered

### Option 1: Discrete SVG illustrated scenes with percentage coordinates and bottom sheet modals (Recommended)

Five curated vector scenes representing the Catholic church journey. Each scene features hot spots placed with percentage offsets, opening an accessible bottom sheet containing age adapted copy, reverence notes, and audio playback.

**Pros**:

- Lightweight, fast loading on cheap mobile devices and poor network connections.
- Clean responsive layout scaling naturally to any viewport aspect ratio.
- High contrast accessible focus indicators for keyboard and screen reader users.

**Cons**:

- Requires separate curated vector artwork for each room instead of a 360 degree panoramic sphere.

### Option 2: Full 3D WebGL panoramic sphere

An interactive 360 degree camera view using Three.js or WebGL where children drag to rotate around a photographic or rendered church interior.

**Pros**:

- Provides full spatial immersion.

**Cons**:

- Heavy memory and battery drain on mobile phones.
- Requires external graphics libraries and large texture assets.
- Harder to navigate for young children aged 3 to 7.

### Option 3: Static picture gallery with bullet points

A photo album page showing church objects in a static list with captions below each image.

**Pros**:

- Simple to build with zero layout logic.

**Cons**:

- Lacks interactive discovery and spatial context of walking through a church.
- Low engagement for young learners.

## Decision

**Chosen option**: Option 1: Discrete SVG illustrated scenes with percentage coordinates and bottom sheet modals.

We will build the church tour as five responsive illustrated vector scenes with percentage hot spot positioning, accessible bottom sheet item cards, Web Speech audio, and reverence guidance.

**Implementation skills**: `drizzle-best-practices` (`c:/Users/User/CodeOven/kids-zone-app/.agents/skills/drizzle-best-practices/`), `web-design-guidelines` (`c:/Users/User/CodeOven/kids-zone-app/.agents/skills/web-design-guidelines/`)

## Rationale

Option 1 provides the ideal balance between sacred dignity, mobile performance, and engaging discovery. Catholic children aged 3 to 15 learn best when visual cues match the peaceful, calm atmosphere of a church. Heavy 3D rendering from Option 2 introduces battery drain, complexity, and performance crashes on entry level phones, while static galleries in Option 3 fail to convey the sacred journey from the church doors to the high altar. Option 1 delivers an accessible, responsive experience that honors project design principles.

## Feature design

**Data model sketch**:

```sql
-- Table: church_tour_scenes
-- Uses contentMeta() helper: status, locale, source_note, created_by, reviewed_by, reviewed_at, published_by, published_at, timestamps, min_age, max_age
-- Enforces ageRangeCheck and publishedCheck table level constraints
CREATE TABLE church_tour_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  illustration_svg_key TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  locale TEXT NOT NULL DEFAULT 'en',
  source_note TEXT,
  created_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  published_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  min_age SMALLINT NOT NULL DEFAULT 3,
  max_age SMALLINT NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: church_tour_items
-- Uses contentMeta() helper: status, locale, source_note, created_by, reviewed_by, reviewed_at, published_by, published_at, timestamps, min_age, max_age
-- Enforces ageRangeCheck and publishedCheck table level constraints
CREATE TABLE church_tour_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID NOT NULL REFERENCES church_tour_scenes(id) ON DELETE CASCADE,
  glossary_term_id UUID REFERENCES glossary_terms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  illustration_svg_key TEXT NOT NULL,
  x_percent SMALLINT NOT NULL CHECK (x_percent BETWEEN 0 AND 100),
  y_percent SMALLINT NOT NULL CHECK (y_percent BETWEEN 0 AND 100),
  reverence_note TEXT NOT NULL,
  simplified_text_band_3_7 TEXT NOT NULL,
  simplified_text_band_8_10 TEXT NOT NULL,
  simplified_text_band_11_15 TEXT NOT NULL,
  audio_narration_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  locale TEXT NOT NULL DEFAULT 'en',
  source_note TEXT,
  created_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  published_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  min_age SMALLINT NOT NULL DEFAULT 3,
  max_age SMALLINT NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**API surface**:

| Endpoint                        | Method | Key inputs                                                 | Key outputs                                                                                              | Auth                            | Key errors           |
| ------------------------------- | ------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------- | -------------------- |
| `/api/church-tour/scenes`       | GET    | none                                                       | `scenes: ChurchTourSceneSummary[]`                                                                       | public                          | 500 server error     |
| `/api/church-tour/scenes/:slug` | GET    | `slug: string` (path)                                      | `scene: ChurchTourSceneDetail` (includes items with resolved `glossaryTerm: { id, slug, term }` summary) | public                          | 404 not found        |
| `/api/church-tour/complete`     | POST   | `childId?: string (uuid)`, `idempotencyKey: string (uuid)` | `status: "success"`, `guest: boolean`, `starsAwarded: number`, `duplicate?: boolean`                     | public / optional child session | 400 validation error |

**Value sourcing**:

| Action               | Value produced / displayed                             | Source                                                                                                                                   |
| -------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Open scene list      | Scene titles, descriptions, order                      | `church_tour_scenes` database rows where status is published                                                                             |
| View church scene    | Illustration vector and hot spot positions             | `church_tour_scenes.illustration_svg_key`, `church_tour_items.x_percent`, `church_tour_items.y_percent`                                  |
| Tap sacred item      | Reverence guidance, item illustration, and explanation | `church_tour_items.illustration_svg_key`, `church_tour_items.reverence_note`, text selected by child age band (`simplified_text_band_*`) |
| Tap glossary link    | Catechism vocabulary definition                        | `glossary_terms.slug` linked via `church_tour_items.glossary_term_id` and joined in scene detail payload                                 |
| Audio narration      | Spoken voice audio                                     | Web Speech API speech synthesis of active age band text                                                                                  |
| Complete church tour | Stars awarded                                          | `coin_rules` rule for activity type `church_tour_completed`                                                                              |

**Key invariants**:

- Hotspot coordinates must always be integers between 0 and 100 percent.
- Child facing queries read only published content rows, enforced by database policy.
- No personal child information is logged during scene views or item taps.
- Guest learners can explore all five scenes without an account or database mutation. Unauthenticated requests to complete return guest success without inserting database rows.
- Completing the tour awards stars at most once per child via the firstTimeOnly ledger constraint.

**Security model**:

- Public read access permitted for published rows via Postgres row level security.
- Mutation endpoints validate inputs using Zod schemas (`packages/validators`).
- Activity events and ledger entries enforce non null child identifiers for registered accounts.

**Critical test scenarios**:

- Happy path: A child opens the church tour, navigates through all five scenes (Narthex to Sacristy), taps sacred items to view reverence guidance, listens to audio narration, and completes the tour, verifying **AC-1**, **AC-2**, **AC-3**, **AC-4**, and **AC-6**.
- Age band tailoring: A 5 year old learner sees short phonetic sentences while a 12 year old learner receives deeper doctrinal context on the same Tabernacle item, verifying **AC-3**.
- Guest experience: An unauthenticated guest navigates all scenes without authentication prompts or failed requests, verifying **AC-7**.
- Ledger and idempotency: An authenticated child completes the tour twice with the same idempotency key, earning stars once without balance duplication, verifying **AC-8**.
- Error handling: Requesting an unknown scene slug returns a 404 response with peaceful lamb guidance, verifying **AC-1**.

## Build plan

Following our Tracer Bullet build approach, work proceeds in thin end to end vertical slices:

1. **Database schema and seed data**: Define `churchTourScenes` and `churchTourItems` tables in [`packages/db/src/schema/church-tour.ts`](file:///c:/Users/User/CodeOven/kids-zone-app/packages/db/src/schema/church-tour.ts), export them in [`packages/db/src/schema/index.ts`](file:///c:/Users/User/CodeOven/kids-zone-app/packages/db/src/schema/index.ts), add seed data for the 5 scenes and sacred items, and register the `church_tour_completed` activity type (satisfies **AC-1**, **AC-2**).
2. **Input validators**: Create Zod schemas for church tour query parameters and completion payloads in [`packages/validators/src/church-tour.ts`](file:///c:/Users/User/CodeOven/kids-zone-app/packages/validators/src/church-tour.ts) (satisfies **AC-8**).
3. **Backend API routes**: Implement `GET /api/church-tour/scenes`, `GET /api/church-tour/scenes/:slug`, and `POST /api/church-tour/complete` routes in [`apps/api/src/routes/church-tour.ts`](file:///c:/Users/User/CodeOven/kids-zone-app/apps/api/src/routes/church-tour.ts) and mount in Hono application (satisfies **AC-1**, **AC-7**, **AC-8**).
4. **UI components**: Create `ChurchSceneViewer`, `HotspotButton`, `ChurchItemModal`, and `TourProgressIndicator` in [`packages/ui/src/components/`](file:///c:/Users/User/CodeOven/kids-zone-app/packages/ui/src/components/) with high contrast focus rings, pulsing halos, and audio read aloud (satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**).
5. **Web page views**: Build `/church-tour` catalog page and `/church-tour/[slug]` interactive scene viewer in [`apps/web/src/app/church-tour/`](file:///c:/Users/User/CodeOven/kids-zone-app/apps/web/src/app/church-tour/) with smooth horizontal navigation and completion win state (satisfies **AC-1**, **AC-6**, **AC-8**).
6. **Automated tests**: Add unit tests for API endpoints, coordinate bounds, and completion reward handling in `apps/api` and `packages/validators` (satisfies **AC-2**, **AC-7**, **AC-8**).

## Consequences

- **Easier**: Children gain intuitive spatial awareness of Catholic church buildings before attending Sunday Mass.
- **Easier**: Sacred vocabulary words connect seamlessly between the church tour and the catechism glossary.
- **Harder**: Vector scene backgrounds must be carefully drawn and reviewed so hot spot percentage coordinates align accurately across varying aspect ratios.

## Follow-up

- Consider adding specialized historic church styles (such as Romanesque basilicas, Byzantine domes, and mission chapels) in a future content expansion.
- Add optional interactive liturgical color switcher showing how the altar linens and vestments change across seasons.

## References

- Project rules: [`.agents/AGENTS.md`](file:///c:/Users/User/CodeOven/kids-zone-app/.agents/AGENTS.md) (Priest reviewer workflow, append only ledger, zero child tracking)
- Data model: [`docs/data-model.md`](file:///c:/Users/User/CodeOven/kids-zone-app/docs/data-model.md) (Phase 2 Inside the Church tour specifications)
- Design tokens: [`docs/design.json`](file:///c:/Users/User/CodeOven/kids-zone-app/docs/design.json) (48px tap targets, calm colors, gentle lamb feedback)
- Liturgical practice: General Instruction of the Roman Missal (GIRM) guidelines on sacred furnishings and reverent posture
