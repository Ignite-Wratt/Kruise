# Kruise storefront — instructions for Claude Code

This app is the code side of a two-way sync with the **Kruise Design System**. Read this
before changing anything visual.

## Where the design truth lives

The design system is a sibling project (also mirrored into this repo's design folder).
Paths below are relative to the design system root.

| You need | Read |
| --- | --- |
| Token values | `tokens/design-tokens.json` → `resolved` (flat `--var` → final value) |
| Token source / comments | `tokens/colors.css`, `typography.css`, `layout.css`, `patterns.css` |
| What changed recently | `DESIGN_SYNC.md` → `## Changelog` (start here) |
| Component API | `components/core/<Name>.d.ts` |
| Component behaviour + do/don't | `components/core/<Name>.prompt.md` |
| Brand voice, foundations, motion | `readme.md` |
| Screen intent | `ui_kits/`, `templates/`, `Kruise Shopify Theme Preview.html` |
| Brand art | `assets/*.png` |

**The HTML files are design references, not code to port.** They show exact intended
look and behaviour. Rebuild them with this app's own patterns (server components, Tailwind
or CSS modules, `next/image` if you enable it) — do not paste their markup.

**Fidelity: high.** Match colors, type, spacing, radii, shadows, and interaction states
exactly. When in doubt about a value, look it up in `design-tokens.json` rather than
matching by eye from a screenshot.

## Non-negotiable brand mechanics

These four things are what make it look like Kruise. Get them right before anything else.

1. **Chunky sticker outline** — `3px solid var(--border-ink)` on buttons, cards, badges,
   tiles. Softer UI (inputs, dividers) uses `2px solid var(--border-soft)`.
2. **Hard sticker shadow** — offset, **zero blur**, in ink: `0 4px 0 0 var(--ink-900)`.
   Not a blurred drop shadow.
3. **Press = physical.** Hover lifts `translateY(-2px)` and grows the shadow; press
   translates `translateY(4px)` and collapses the shadow to `0 0`. Never an opacity dip.
   Easing `--ease-bounce` `cubic-bezier(0.34,1.56,0.64,1)`, 120–360ms.
4. **Gummy radii** — cards 20–40px, buttons and tags fully pill. Nothing sharp.

Plus: one accent color per section (never a rainbow), display type in Baloo 2 ExtraBold,
body in Nunito, mono only for SKUs/specs.

## Rules

- **Never introduce a color, size, radius, or shadow that isn't a token.** If the design
  needs one that doesn't exist, use the nearest token and file it in `SYNC_REPORT.md` —
  do not invent a hex.
- **Keep the `Kruise*` component prefix** so nothing collides with design-system exports.
- **Keep prop names matching the `.d.ts`.** If implementation forces a change, that's a
  breaking change — report it.
- **Copy follows `readme.md` → CONTENT FUNDAMENTALS**: speaks to "you", sentence case,
  sensory-first, concrete numbers, emoji only in marketing microcopy — never in UI chrome.
- **No hand-drawn SVG illustrations.** Brand art is in `assets/`; functional icons are
  Lucide-style at stroke 2.25.
- **Photography**: product and lifestyle imagery comes from Shopify CDN or supplied
  files. The design previews use fillable image slots where photography belongs — those
  are placeholders, not a design choice to replicate.

## Reporting back — `SYNC_REPORT.md`

This is the only channel from code back into the design system. After a batch of work,
append an entry for anything the design didn't cover or couldn't be honoured:

```markdown
### 2026-07-27 — <what you were doing>
Consumed changelog entry: <date + title from DESIGN_SYNC.md>

**Missing tokens**
- Needed a mid-tint lemon between `--lemon-100` and `--lemon-300` for the hero. Used
  literal `#FFDC42`. Suggest `--lemon-200`.

**API changes**
- `KruiseProductCard` needed a `soldOut` boolean; not in `ProductCard.d.ts`.

**Layout / responsive**
- Hero two-column collapses below 900px, not 768px — the headline wraps badly.

**Won't implement**
- <thing> + why.
```

Keep entries short and specific. Design resolves them on the next sync — each item either
becomes a real token/spec or gets recorded as accepted drift.

## Repo

`repo: Ignite-Wratt/Kruise`, `branch: main`. The design system has **read-only** GitHub
access, so pushes are yours. See the design system's `github.md` for the screen map
tying each screen to the files it was built from — keep that map true when you move files.
