# Toss Design System (TDS)

A faithful, buildable recreation of **TDS — the Toss Design System**, the common design language behind Toss, Korea's financial super-app (Viva Republica / 비바리퍼블리카). This system is meant for designing and prototyping **Appintoss** mini-apps and Toss-styled interfaces.

> **What Toss is.** Not a neo-bank — a *super-app*: one interface holds transfers, investments, credit scoring, insurance, brokerage and lending. The design's whole job is to flatten that complexity into roughly one gesture per screen. That demands extreme restraint: a blue-and-neutral palette, one type family in a few weights, and quiet single-layer shadows. Every ornamental move costs clarity, and clarity is the brand promise.

## Sources
Rebuilt from Toss's **public** developer documentation (values copied, not guessed):
- Appintoss design guide (uploaded `uploads/components.md`): https://developers-apps-in-toss.toss.im/design/components.html
- Appintoss design tooling & rules: https://developers-apps-in-toss.toss.im/design/prepare/design.html
- TDS React Native — Colors: https://tossmini-docs.toss.im/tds-react-native/foundation/colors/
- TDS React Native — Typography: https://tossmini-docs.toss.im/tds-react-native/foundation/typography/
- TDS React Native — component index: https://tossmini-docs.toss.im/tds-react-native/
- `@toss/tds-react-native` (colors object), `@toss/apps-in-toss` SDK
- Public brand assets on `static.toss.im`

_TDS is Toss's intellectual property, licensed to Appintoss partners for the limited purpose of building on Toss. This project is a reference recreation for that purpose; do not use it to imply endorsement._

## Hard constraints (from Toss's own docs)
- **Light mode only.** Dark mode is not yet supported by TDS — design light.
- **Mobile-first, 375px design width.** Screens are laid out for a phone.
- Every screen puts a **Navigation/Navbar** at the very top; most content is composed from **ListRow**, not custom boxes.
- Operate the right panel / props — avoid ad-hoc values off the grid.

---

## CONTENT FUNDAMENTALS
Toss's voice is the most-imitated in Korean product writing. It is **warm, plain, and quietly reassuring** — like a competent friend who happens to work in finance.

- **해요체, always.** Korean sentences end in the soft-polite `~요` (해요체), never the stiff `~습니다` (합니다체). "보냈어요", "기다려 주세요" — not "송금이 완료되었습니다".
- **Speaks with "you" and "we"**, addresses the user directly, and often asks ("추가해 볼까요?"). Conversational, never bureaucratic.
- **Plain words over jargon.** Say the everyday thing ("보낼 금액") instead of the banking term. Numbers and money are made legible, not intimidating.
- **Short.** One idea per line. Titles are a phrase, not a sentence. Body explains in one breath.
- **Positive & active framing.** "지금 추가해 볼까요?" rather than "계좌가 등록되지 않았습니다."
- **Casing/punctuation.** Korean has no casing; Latin/UI labels are typically Title or sentence case ("전체보기", "송금하기"). Sentences take a period; short labels usually don't. No exclamation-mark spam.
- **Emoji.** Not used inside product UI copy. (Emoji *do* appear as tags in the Figma/AppBuilder toolchain — 🔴 Navigation, 🌈 Screen, 🔵 Text — but that's authoring scaffolding, not user-facing content.) Toss also maintains its own emoji-like art set ("Toss Face"), used as illustration, not as text punctuation.
- **Examples**
  - Confirm: "32,000원을 보냈어요."
  - Empty state: "아직 등록된 계좌가 없어요. 지금 추가해 볼까요?"
  - Wait: "잠시만 기다려 주세요."
  - Error (calm, blameless): "올바른 이메일이 아니에요."

---

## VISUAL FOUNDATIONS
- **Color.** Blue-and-neutral, full stop. `blue-500 #3182f6` is the single brand/action colour; the 10-step **grey** scale does almost all structural work (text, surfaces, borders). Status colours are semantic and restrained: **red = negative/loss/destructive**, **green = positive/gain/success/"on"**, orange/yellow for warnings & events, teal/purple only as rare accents. The palette is built for perceptual evenness (same scale step reads equally bright across hues), so `blue-500`, `red-500`, `green-500` carry identical weight. Backgrounds are white or `grey-100`.
- **Type.** One family: custom **Toss Product Sans** (numerals optically matched to Korean hangul; enhanced %, comma, ± legibility). It ships in 8 weights but the UI uses restraint — **400 / 500 / 600 / 700**. Tabular figures for money and tables; proportional for display. Tracking is tight and neutral (roughly -0.01 to -0.02em on titles). The type scale is a token ladder (Typography 1–7 + subTypography 1–13) that scales with OS "larger text" — never hardcode px in product.
- **Spacing / layout.** 4px base grid. Standard side padding **16–24px**. Money & summary screens *breathe* (24px+ gaps between groups, generous margins around balances); detail/transaction screens *densify* (8–12px). Fixed elements: top Navbar, and a bottom full-width primary CTA (56px).
- **Radius.** Generous and consistent — **~16px** for buttons, cards and inputs; **24px** for bottom sheets; **full** for chips/avatars.
- **Backgrounds.** Clean flat white or `grey-100` sections. **No gradients** on core UI (a subtle brand gradient appears only in marketing/hero art). No textures, no repeating patterns. Imagery, when present, is bright, warm-neutral, high-key photography or Toss's own 3D/emoji illustration — never dark or heavily filtered.
- **Elevation / shadows.** Minimal, neutral, **single-layer** near-black at low opacity (6–12%). Elevation is communicated through quiet opacity differences, not dramatic depth — visual noise undermines trust in a finance app.
- **Borders.** Hairlines in `grey-200`; inputs use a single 2px underline that turns blue on focus, red on error (not full boxed borders).
- **Motion.** Quick and soft: 150–300ms, ease-out (`cubic-bezier(0.22,1,0.36,1)`). Fades and slides, **no bounce** on core UI. Segmented/toggle thumbs slide; sheets rise.
- **Hover / press.** Mobile-first, so **press** matters most: buttons **scale down ~0.97 and darken one step** (blue-500 → blue-600); rows tint with a faint grey-opacity wash. Hover (web) mirrors the darken.
- **Transparency & blur.** Overlays/scrims use the **grey-opacity** ramp (dialog backdrop ≈ greyOpacity-700). Pressed states use greyOpacity-50/100. Blur is used sparingly (sticky headers over scrolling content).
- **Cards.** A "card" in Toss is usually **white, ~16px radius, shadow-1 or just a grey-100 fill, no border** — and is frequently just a stack of ListRows rather than a bordered box.

---

## ICONOGRAPHY
- **Toss uses its own proprietary icon set** ("toss-icons" / TDS icons) — clean, medium-stroke line icons with rounded joins, plus a set of filled/branded glyphs and 3D illustrations. These are shipped inside TDS, not as public files, so they are **not bundled here**.
- **Substitution (flagged):** for prototyping, use **Lucide** (https://lucide.dev, CDN-available) — its rounded-join, ~1.8px line style is the closest open match to TDS line icons. This system's components use only **minimal inline geometric glyphs** (chevron, checkmark, close, back arrow) — generic UI arrows, not brand iconography.
- **No emoji in UI copy.** Toss's expressive art comes from **"Toss Face"** (its own open emoji-style illustration set) and 3D renders used as illustration/spot art, not as inline text.
- **Format:** icons in-product are vector (SVG). Brand/marketing spot art is 3D PNG/Lottie from `static.toss.im`.
- When building here: reach for Lucide via CDN for line icons; use `assets/` for any real Toss art you're licensed to drop in.

---

## LOGO / ASSETS
**No official logo file was supplied with the source**, so per policy the brand name is set in plain type wherever a mark belongs — lowercase **`toss`** in `blue-500`, bold (see the Brand → Wordmark card). **Do not treat this as the real logo.** Drop the licensed Toss wordmark/symbol into `assets/` and replace the placeholder before any real use.

---

## Foundations at a glance
| Concern | Base tokens | Semantic aliases |
|---|---|---|
| Color | `--blue-50…900`, `--grey-50…900`, red/green/orange/yellow/teal/purple, `--grey-opacity-*` | `--primary`, `--text-primary/secondary/tertiary`, `--surface-*`, `--border-*`, `--positive`, `--negative`, `--warning`, `--scrim` |
| Type | `--t1…t7` (+ `--sub1…13`), `--weight-*`, `--font-sans` | `.tds-t1 … .tds-t7` helper classes |
| Spacing | `--space-2…48`, `--screen-*`, `--navbar-height`, `--cta-height` | — |
| Radius | `--radius-2…24`, `--radius-full` | — |
| Effects | `--shadow-1/2/3`, `--ease-*`, `--duration-*`, `--press-scale` | — |

---

## INDEX (manifest)
**Root**
- `styles.css` — the single stylesheet consumers link (imports the token layers + font).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `effects.css`, `fonts.css`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/` — reusable React primitives (below).
- `ui_kits/toss-app/` — interactive Toss mobile app recreation.
- `SKILL.md` — Agent-Skill entry point.
- `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json` — generated; do not edit.

**Components** (namespace `window.TossDesignSystemTDS_edd598`)
- Actions: **Button**, **TextButton**, **IconButton**
- Forms: **TextField**, **Checkbox**, **Radio**, **Switch**
- Data: **ListRow**, **Badge**
- Feedback: **Dialog**, **Toast**, **ProgressBar**, **Loader**
- Navigation: **Tab**, **SegmentedControl**

Each component directory holds `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and one `@dsCard` HTML.

### Scope note
TDS's full library spans ~40 mobile components (Amount, Asset, BoardRow, Carousel, Dropdown, Keypad, Navbar, NumericSpinner, Rating, SearchField, Skeleton, Slider, Stepper, Table, Text Field variants, charts, …). This recreation ships the **high-frequency core** (the 15 above) that covers most Appintoss screens. Remaining families are documented but not yet built — ask to extend.
