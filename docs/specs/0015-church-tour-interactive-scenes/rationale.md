# 0015. Church Tour Interactive Scenes: Rationale

## Context

Catholic churches are filled with rich sacred signs, architecture, and sacred vessels whose spiritual purpose is often unfamiliar to young children. Without guided context, children can feel lost during Mass or treat church visits like ordinary auditoriums.

At the same time, children need to understand that the church building is truly sacred because Jesus is present in the Blessed Sacrament. Reverence is learned by seeing and practicing: genuflecting toward the Tabernacle, blessing oneself with holy water at the entrance, keeping a quiet voice in the nave, and showing honour to the altar.

The learning platform requires an engaging yet reverent digital church tour that runs smoothly on low power devices and phones without requiring heavy 3D rendering engines or video streams. Children must be able to explore freely at their own pace, read or listen to age adapted teaching, link directly to glossary terms, and earn habit stars upon finishing the complete church tour.

## Options considered

### Option 1: Discrete SVG illustrated scenes with percentage coordinates and bottom sheet modals (Chosen)

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

## Rationale

Option 1 provides the ideal balance between sacred dignity, mobile performance, and engaging discovery. Catholic children aged 3 to 15 learn best when visual cues match the peaceful, calm atmosphere of a church. Heavy 3D rendering from Option 2 introduces battery drain, complexity, and performance crashes on entry level phones, while static galleries in Option 3 fail to convey the sacred journey from the church doors to the high altar. Option 1 delivers an accessible, responsive experience that honors project design principles.

## References

- Project rules: [`.agents/AGENTS.md`](file:///c:/Users/User/CodeOven/kids-zone-app/.agents/AGENTS.md) (Priest reviewer workflow, append only ledger, zero child tracking)
- Data model: [`docs/data-model.md`](file:///c:/Users/User/CodeOven/kids-zone-app/docs/data-model.md) (Phase 2 Inside the Church tour specifications)
- Design tokens: [`docs/design.json`](file:///c:/Users/User/CodeOven/kids-zone-app/docs/design.json) (48px tap targets, calm colors, gentle lamb feedback)
- Liturgical practice: General Instruction of the Roman Missal (GIRM) guidelines on sacred furnishings and reverent posture
