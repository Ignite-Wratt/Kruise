# Sync report — code → design

Append entries here for anything the implementation couldn't honour, needed beyond the
design system, or discovered in real use. The design system reads this file on every sync
and either turns each item into a real token/spec or records it as accepted drift in
`DESIGN_SYNC.md` → `## Known drift`.

Format and guidance: `CLAUDE.md` → "Reporting back". Newest entry first.

---

### Template — copy this

```markdown
### YYYY-MM-DD — <what you were doing>
Consumed changelog entry: <date + title from DESIGN_SYNC.md>

**Missing tokens**
-

**API changes**
-

**Layout / responsive**
-

**Won't implement**
-
```

---

### 2026-08-12 — storefront v2 sync, phase 1 (tokens · 7-SKU catalogue · flavor unions)
Consumed changelog entries: 2026-08-11 "repackaged: swirl, 7-SKU range, retuned palette" and
2026-07-27 "scent quiz shipped to the theme" (pack art).

**Applied**
- `app/globals.css` tokens re-pulled from `tokens/design-tokens.json` → `resolved`:
  cherry `#e21f26` (was `#ed1b54`), tangerine `#f16a21`, lemon `#f9a01e`, lime `#1f8a45`,
  wave `#22bab2`, sky `#71b9e1`, plus new `--marine-*` / `--graphite-*` families and the seven
  `--scent-<sku>-a` / `-tint` pairs.
- `Flavor` union (`KruiseButton`) gains `'marine' | 'graphite'`; `KruiseTag` and
  `KruiseProductCard` color maps extended to match.
- `lib/products.ts` fallback catalogue → **7 SKUs**: "Clean Machine" → **New Car Overdrive**
  (marine), added **Black Knight** (graphite); all six carry-overs now point at pack art
  (`/assets/pack-*.png`, added to `public/assets`). Duration copy "45+ days" → "30 day long lasting".
- `lib/scents.ts` presets → pack art + new-car/knight keyword matches; Coconut Bliss re-flavoured
  to wave (teal), matching the v2 scent tokens.

**Missing / needs design**
- Scent notes for **New Car Overdrive** and **Black Knight** aren't in `guidelines/color-scents.html`;
  left empty. Pull from `Kruise Product Pages.html` note pyramids (`scent.notes_top|heart|base`).
- Format swatches from the PDP changelog (Vent clip $12 / Paper hanger $6 / Clip + 2 refills $24)
  not applied yet — fallback still Single clip / 3-pack / Refill.

**Deferred to later phases (this same sync)**
- Swirl system: `.kr-sunburst` → `.kr-swirl` + `swirl-*.svg`; pack-art hero + product-card visuals.
- The v2 drop-culture home rebuild — `app/page.tsx` on the `ticker-bar` / `hero-slideshow` /
  `scent-rail` / `featured-drop` / … layout from `Kruise Storefront v2.html`.
