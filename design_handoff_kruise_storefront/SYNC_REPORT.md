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

**Phase 2–3 (done in a follow-up commit)**
- Swirl system ported to `globals.css` (`.kr-swirl` + per-scent `[data-swirl]`, `.kr-sunburst`
  kept as back-compat alias) with the 8 `swirl-*.svg` in `public/assets`; `.kr-sticker-text`
  and the re-cut `.kr-wordmark-box` added.
- `KruiseProductCard` now shows pack art on a flat `--flavor-100` tile (white circle removed).
- v2 drop-culture home rebuilt: new `components/KruiseV2Home.tsx` (hero slideshow, claims/stockist
  marquees, scent rail, founder note, featured drop with gallery + format swatches, social strip,
  newsletter), rendered by `app/page.tsx`. Verified swirl/pack/paper rendering in a browser harness.
  The old v1 home (with stale "Cherry Bomb"/"Wave Rider" review names) is gone.
- Added the 7 `paper-*.png` hangers to `public/assets`.

**Still open**
- Chrome is still v1: `layout.tsx` renders `KruiseSiteHeader`/`KruiseSiteFooter`, so the v2 ticker
  sits under the v1 header. The v2 `menu`-drawer header + `footer-minimal` aren't wired (would need
  a layout change + a PDP chrome wrap to avoid double chrome). 
- v2 home content is the design reference's static copy — hero/rail/drop not yet wired to
  `getProducts()`; the rail/drop "Add to cart" buttons are not wired to `KruiseCartProvider`.
- `swirl-fine-white.svg` / `swirl-broad-white.svg` (ray-density variants) not added — nothing on the
  home uses `data-swirl-rays`, so the rules were omitted rather than ported.
- Node modules aren't installed in this checkout, so this was verified by CSS/asset render + manual
  type review, not a full `next build`.
