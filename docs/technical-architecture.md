# KGM UAE Microsite — Technical Architecture

> **Status:** Planning document. Written **before implementation**. No website code is
> produced here.
> **Sources of truth:** `CLAUDE.md` (instructions), `docs/project-brief.md` (factual
> truth), `docs/visual-ux-direction.md` (approved visual/UX direction), and the
> approved proposal `docs/KGM UAE Microsite-QuickStart Proposal 2026 _ by Worx (1).pptx`
> (scope). This document translates those into an implementable architecture and does
> **not** expand scope.
>
> **Content rule:** No unconfirmed business, vehicle, showroom, contact, legal,
> analytics, or provider information is invented. Unresolved items are marked
> **CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS** and defer to
> `project-brief.md` §13.
>
> **Stack decision (baseline):** Static, **build-free vanilla HTML + CSS + JavaScript
> (ES modules)** — no framework, no bundler, minimal/zero dependencies — per CLAUDE.md
> §18 (performance), §25 (dependencies), and the "lightweight one-page microsite"
> mandate. This keeps the artefact deployable as static files with SSL (proposal Week 3).

---

## 1. Project Structure

```text
KGM-Microsite/
├── index.html                # Single page; all five sections + persistent layer
├── css/
│   ├── styles.css            # Entry stylesheet (@imports the partials below, or single file)
│   ├── base.css              # Reset, root tokens, base elements
│   ├── typography.css        # Latin + Arabic (Cairo) type system
│   ├── layout.css            # Grid, containers, section scaffolding, logical properties
│   ├── components.css        # Nav, model slider, gallery, showroom cards, form, buttons
│   └── rtl.css               # RTL-only overrides that logical properties can't cover
├── js/
│   ├── main.js               # Entry (type="module"); boots controllers in order
│   ├── i18n.js               # Language state, dir/lang switching, string application
│   ├── models.js             # Renders The Models from data; slider behavior
│   ├── gallery.js            # Gallery behavior (scroll/swipe, optional lightbox)
│   ├── showrooms.js          # Showroom rendering, map init, directions deep-links
│   ├── form.js               # FILL→VALIDATE→submit orchestration, states
│   ├── validation.js         # Pure field validators (reusable, testable)
│   ├── consent.js            # PDPL consent gate (governs analytics + records consent)
│   ├── whatsapp.js           # Click-to-chat link builder
│   └── analytics.js          # GA4 wrapper (consent-gated event dispatch)
├── data/
│   ├── content.en.json       # English strings/copy (placeholders until approved)
│   ├── content.ar.json       # Arabic strings/copy (placeholders until translated)
│   ├── models.json           # Model list + 3 key-number slots (values CONTENT REQUIRED)
│   ├── gallery.json          # Gallery items (asset refs + alt keys)
│   └── showrooms.json        # Showroom entries (fields present, values CONTENT REQUIRED)
├── assets/
│   ├── img/                  # Optimized responsive imagery (models, gallery, hero)
│   ├── icons/                # UI/SVG icons (WhatsApp, arrows, directions, etc.)
│   ├── fonts/                # Self-hosted fonts if licensing requires (Cairo + Latin)
│   └── meta/                 # favicon set, OG/social share images
└── docs/                     # project-brief.md, visual-ux-direction.md, this file, proposal
```

Notes:
- The repo already contains `index.html`, `css/styles.css`, `js/script.js` (all empty).
  **This document does not modify them.** During implementation, `js/script.js` is
  either replaced by `js/main.js` or kept as the module entry — a small decision made
  at build time, not here.
- `data/`, `assets/`, and the CSS/JS partials are **proposed**; a simpler single-file
  fallback (one `styles.css`, one `script.js`, inline JSON) is acceptable if the module
  approach proves heavier than the site warrants (CLAUDE.md §20 — simplest appropriate
  solution).

---

## 2. HTML Architecture

Single semantic document; one `<main>`; sections in journey order.

```text
<html lang dir>                         # lang/dir set dynamically by i18n.js
  <head> … meta, hreflang, OG, favicon, GA4 (consent-gated) … </head>
  <body>
    <a class="skip-link">               # Skip to content (a11y)
    <header role="banner">              # Persistent nav layer
       - Logo (KGM lockup — CONTENT REQUIRED)
       - Anchor nav: Models / Gallery / Showrooms / Register
       - EN | AR language switcher
       - Register Interest CTA (primary)
    <main id="main">
      <section id="hero">               # ARRIVE — full-bleed, one headline+line, CTA
      <section id="models">             # EXPLORE — image-led slider; name + 3 numbers
      <section id="gallery">            # TRUST — full-bleed imagery
      <section id="showrooms">          # TRUST — cards + map + directions
      <section id="register">           # REGISTER — form
        <form novalidate>               # JS-driven validation; native fallback
           Name / Phone / Emirate(select) / Model(select) / PDPL consent(checkbox) / submit
           + regions for inline errors and success (aria-live)
    </main>
    <div class="persistent-actions">    # Always-there layer
       - Register Interest (sticky affordance)
       - WhatsApp click-to-chat (floating)
    <div id="consent">                  # PDPL consent UI (wording CONTENT REQUIRED)
    <footer>                            # Privacy link, legal (wording CONTENT REQUIRED)
    <script type="module" src="js/main.js">
  </body>
</html>
```

Principles: landmark elements (`header`/`main`/`footer`/`nav`/`section`), one `<h1>`
(hero), logical heading order, labelled controls, no `div`-only interactivity.

---

## 3. CSS Architecture

- **Global reset/base (`base.css`):** modern minimal reset (box-sizing, margins,
  media defaults), root custom properties, base element styling.
- **Design tokens (CSS custom properties on `:root`):**
  - Colour: `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`,
    `--color-accent` (primary CTA), `--color-whatsapp`. **Values = CONTENT REQUIRED**
    (brand guidelines); ship with clearly-marked placeholders that pass contrast.
  - Type: `--font-latin`, `--font-arabic` (Cairo), a small size scale
    (`--step--1 … --step-4`), line-heights (separate Latin/Arabic), tracking.
  - Space/radius/shadow/z-index scales; `--container`, `--gutter`.
  - Motion: `--ease`, `--dur-fast/base/slow`.
- **Typography (`typography.css`):** Latin display/body + **Cairo** for Arabic; Arabic
  line-height/letter-spacing rules; no forced uppercase on Arabic; `font-display: swap`.
- **Layout system (`layout.css`):** CSS Grid + Flexbox; a centered container; section
  scaffolding; **logical properties everywhere** (see RTL). Full-bleed utility for hero
  and gallery.
- **Responsive breakpoints (mobile-first `min-width`)** — matching CLAUDE.md §19:
  - small mobile (base, ~≤380px) → large mobile (~480px) → tablet (~768px) →
    desktop (~1024px) → wide desktop (~1440px). Exact values finalised in build; fluid
    `clamp()` type/space reduces breakpoint dependence.
- **Component styles (`components.css`):** nav, buttons/CTA, model slider, gallery,
  showroom card, map container, form fields, consent UI, WhatsApp button.
- **State styles:** `:hover`/`:focus-visible`/`:active`/`:disabled`; form `aria-invalid`
  error styling; success state; slider active/snap states; loading/skeleton for media.
- **RTL strategy:**
  - Set `dir="rtl"` on `<html>` for Arabic; **author LTR-first using logical
    properties** so most mirroring is automatic.
  - `rtl.css` holds only the exceptions logical properties can't express (e.g.,
    directional icons, slider transform direction, background positions).
  - Sliders/gallery reverse advance direction under RTL (coordinated with JS).
- **Logical CSS properties:** use `margin-inline`, `padding-inline`, `inset-inline`,
  `border-inline`, `text-align: start/end`, `float: inline-start`, logical grid flow —
  **not** left/right — so LTR/RTL share one source.
- **Animation & motion rules (per visual-ux §6):** animate `transform`/`opacity` only;
  scroll-reveal via `IntersectionObserver` toggling classes; honour
  `@media (prefers-reduced-motion: reduce)` to disable non-essential motion; no heavy
  animation libraries.

---

## 4. JavaScript Architecture

Native **ES modules**, progressive-enhancement mindset (core content usable without JS
where feasible; JS enriches). No framework.

| Module | Responsibility |
|--------|----------------|
| `main.js` | Boot sequence: read language state → apply i18n → render models/gallery/showrooms from data → wire form, consent, WhatsApp, analytics, nav. |
| `i18n.js` | Holds language state (`en`/`ar`); loads `content.<lang>.json`; sets `<html lang>` + `<html dir>`; applies strings to `data-i18n` targets; exposes `switchLanguage()`; preserves scroll position on switch. |
| `models.js` | Renders model cards from `models.json`; slider (swipe/drag/arrow/keyboard) with snap + progress; **RTL-aware direction**; optional "select model → prefill form". |
| `gallery.js` | Full-bleed gallery scroll/swipe; optional lightbox (if approved); lazy media; RTL-aware; keyboard + focus management. |
| `showrooms.js` | Renders showroom cards from `showrooms.json`; initialises map (provider TBD); builds **Directions** deep-links; click-to-call/WhatsApp hooks. |
| `validation.js` | Pure, side-effect-free validators (required, phone format, selection made, consent checked) returning structured results; reusable + unit-testable. |
| `form.js` | Orchestrates FILL→VALIDATE→submit; inline error rendering; disabled/submitting states; success/error states; triggers analytics + consent recording; calls the (configurable) submission transport. |
| `consent.js` | PDPL consent gate: renders consent UI, records the user's choice + timestamp, **gates analytics** (`analytics.js` only fires after consent), exposes consent state to `form.js` for consent recording. |
| `whatsapp.js` | Builds `https://wa.me/<number>?text=<message>` from config; wires all WhatsApp entry points; fires `whatsapp_click`. |
| `analytics.js` | Thin GA4 wrapper (`track(event, params)`); no-ops until consent granted; centralises event names + standard params (`language`, `page_direction`). |

Cross-cutting details:
- **Language switching:** `i18n.switchLanguage(lang)` → swap strings, set `lang`/`dir`,
  re-run direction-dependent component setup (slider/gallery), fire `language_switch`.
- **EN/AR content handling:** all copy comes from `content.<lang>.json`; **no
  hard-coded user-facing strings** in JS/HTML (except neutral symbols). Placeholders
  clearly marked until approved copy/translation arrives.
- **RTL direction switching:** single source — `dir` attribute drives CSS; JS only
  adjusts behaviours CSS cannot (slider transform sign, swipe mapping).
- **Model rendering / Gallery / Showrooms:** data-driven from `data/*.json`; components
  render N items generically so final lineup/imagery/showrooms drop in without code
  changes.
- **Form validation / submission flow:** see §7.
- **Consent handling:** see §7 and §14.
- **WhatsApp:** see §8.
- **GA4 event tracking:** see §10.

---

## 5. Content Architecture

Data-driven so **confirmed content drops into JSON without code changes**. All values
below that are business facts are **CONTENT REQUIRED**; the *shapes* are defined here.

**`models.json`** (order = launch order; "whichever models arrive first lead the page"):
```jsonc
[
  {
    "id": "torres",                      // stable machine key (analytics/form value)
    "nameKey": "models.torres.name",     // resolved via content.<lang>.json
    "image": "assets/img/models/torres", // base name; responsive variants resolved at build
    "keyNumbers": [                       // EXACTLY 3 — values CONTENT REQUIRED
      { "valueKey": "models.torres.kn1.value", "labelKey": "models.torres.kn1.label" },
      { "valueKey": "models.torres.kn2.value", "labelKey": "models.torres.kn2.label" },
      { "valueKey": "models.torres.kn3.value", "labelKey": "models.torres.kn3.label" }
    ]
  }
  // …only CONFIRMED UAE lineup; potential set (brief §6): Tivoli, Torres, Torres Hybrid,
  //   Actyon, Rexton, Musso, Musso EV. Final lineup = CONTENT REQUIRED.
]
```
> **CONTENT REQUIRED:** confirmed lineup + order; the **three key numbers** per model
> (values + labels); official imagery. Not invented.

**`gallery.json`:**
```jsonc
[ { "id": "g1", "image": "assets/img/gallery/g1", "altKey": "gallery.g1.alt" } ]
```
> **CONTENT REQUIRED:** gallery imagery + approved alt text.

**`showrooms.json`:**
```jsonc
[
  {
    "id": "showroom-1",
    "nameKey": "showrooms.s1.name",
    "addressKey": "showrooms.s1.address",   // value CONTENT REQUIRED
    "hours": [ /* {dayKey, openKey, closeKey} — values CONTENT REQUIRED */ ],
    "coordinates": null,                     // {lat,lng} CONTENT REQUIRED (do not invent)
    "mapEmbed": null,                        // provider/URL CONTENT REQUIRED
    "directionsUrl": null                    // deep-link built once coordinates confirmed
  }
]
```
> **CONTENT REQUIRED (must not be invented):** addresses, hours, coordinates, map data.

**Form options:**
- `emirates`: list of the 7 UAE emirates (labels via i18n). **Confirm** the list/order
  with owner (visual-ux Appendix A #5).
- `models`: derived from confirmed `models.json` (machine keys as values).

**English / Arabic content (`content.en.json` / `content.ar.json`):**
```jsonc
{
  "nav": { "models": "…", "gallery": "…", "showrooms": "…", "register": "…" },
  "hero": { "headline": "…", "sub": "…", "cta": "…" },
  "models": { "torres": { "name": "…", "kn1": { "value": "…", "label": "…" } } },
  "gallery": { "g1": { "alt": "…" } },
  "showrooms": { "s1": { "name": "…", "address": "…" } },
  "form": { "name": "…", "phone": "…", "emirate": "…", "model": "…",
            "consent": "…", "submit": "…", "success": "…", "errors": { … } },
  "whatsapp": { "defaultMessage": "…" },
  "legal": { "privacy": "…", "pdplConsent": "…" }
}
```
> **CONTENT REQUIRED:** all real copy (approved EN) and its professional AR translation;
> PDPL/consent + privacy wording; WhatsApp default message. Placeholders only until then.

---

## 6. Bilingual Architecture

- **Language state:** single source in `i18n.js` (`currentLang: 'en' | 'ar'`),
  initialised from URL strategy (below) → else stored preference → else default.
  **Default language = decision required** (see below).
- **EN/AR switching:** `switchLanguage()` swaps the loaded content dictionary, updates
  DOM strings, sets attributes, re-inits direction-sensitive components, fires
  `language_switch`, and updates the URL per strategy. Scroll position/section
  preserved where feasible (CLAUDE.md §8).
- **HTML `lang`:** set to `en` or `ar` on `<html>`.
- **HTML `dir`:** `ltr` for English, `rtl` for Arabic on `<html>`.
- **RTL layout behavior:** driven by `dir` + logical CSS (see §3); JS handles only
  behavioural mirroring (slider/gallery direction).
- **Arabic typography:** **Cairo** (confirmed brief §5), tuned line-height/tracking;
  numeral style (Western vs. Eastern-Arabic) — **decision required** (visual-ux App. A #7).
- **Translation content structure:** parallel `content.en.json` / `content.ar.json`
  with identical keys; missing keys log a warning in dev, never render raw keys to users.
- **URL / language strategy:** **CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS.**
  Options (to be confirmed with owner):
  1. **Path-based** `/` (EN) and `/ar/` — cleanest for `hreflang`/SEO (recommended).
  2. **Query param** `?lang=ar` — simplest for a static single file.
  3. **Subdomain** — heaviest; unlikely for a microsite.
  Whichever is chosen must produce stable, indexable URLs per language for `hreflang`
  (§11). Recommendation noted; **final choice requires approval** before build.

---

## 7. Register Interest Architecture (FILL → VALIDATE → NOTIFY → FOLLOW UP)

**Fields (confirmed, brief §9):** Name · Phone · Emirate (select) · Model of interest
(select) · PDPL consent (required checkbox).

**FILL (client):**
- Mobile-optimised inputs: `type="tel"` + `inputmode` for phone; native `<select>` for
  Emirate/Model; labels above fields; model may be prefilled from The Models.
- `form_start` fires on first field interaction.

**VALIDATE (client, `validation.js` + `form.js`):**
- Required checks; phone format check (lenient, UAE-aware pattern — **exact rule to
  confirm**); a selection made for Emirate/Model; **consent checkbox required**.
- Inline, field-level error messages (from i18n) tied via `aria-describedby`;
  `aria-invalid` on failing fields; focus moves to first error; `form_error` fired.
- Native `novalidate` + JS validation for consistent bilingual messaging; graceful
  degradation to native validation if JS fails.

**Spam / bot protection (client + server):**
- Client: **honeypot** field + minimum-time-to-submit heuristic (no user friction).
- Stronger protection (e.g., token/challenge service) may be added server-side.
  **Method + any provider = CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS**
  (visual-ux App. A #4). No provider invented.

**PDPL consent + consent recording:**
- Explicit, unticked consent checkbox with linked privacy wording (**wording CONTENT
  REQUIRED**). Submission blocked until checked.
- On success, record consent: consent = true, timestamp, and consent-text version,
  submitted alongside the lead so there is an auditable record.

**Submission transport (NOTIFY):**
- `form.js` posts a structured payload to a **configurable endpoint** (single
  `SUBMIT_ENDPOINT` constant/config). The **endpoint, email recipient(s), and delivery
  provider are CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS** (brief §13 items
  8, 9, 12). **No backend service, email address, API, CRM, or provider is invented
  here.**
- Server responsibilities (whatever provider is later chosen): validate again, apply
  server-side spam protection, **email the lead to sales**, and **append to the
  running-sheet backup** so the inbox is never the only copy (brief §9 "no lead lost").
  Leads kept **CRM-ready/exportable** (Zoho/CRAMS) — export only, not integration.

**FOLLOW UP:** out of the microsite's technical scope (sales calls back); the payload
must contain every field "ready to dial" (proposal slide 6).

**Success state:** clear confirmation message (aria-live), sets expectation of sales
follow-up; fires **`generate_lead`** only on server-confirmed success.

**Error state:** field-level (validation) and form-level (network/server) errors with
retry; never lose entered data; announced to assistive tech.

---

## 8. WhatsApp Architecture

- Click-to-chat link: `https://wa.me/<E164_NUMBER>?text=<url-encoded default message>`,
  built by `whatsapp.js` from config; opens in a new tab/app.
- Present in the persistent layer (floating) and optionally in Showrooms; large touch
  target; keyboard reachable; mirrored position under RTL.
- Fires `whatsapp_click` with a `source` param.
- **CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS:** the WhatsApp **number** and
  the approved **default message** (brief §13 items 10, 11). Neither is invented; config
  holds clearly-marked placeholders until supplied.

---

## 9. Showroom Architecture

- **Location information & opening hours:** rendered from `showrooms.json` (fields
  defined in §5); values are **CONTENT REQUIRED**.
- **Map behavior:** a map per showroom (or a combined map). **Provider is a decision
  required** (visual-ux App. A #3) — options: interactive embed vs. static image + link.
  Loaded deferred/consent-aware to protect performance (§12). **No provider, key, or
  coordinates invented.**
- **Directions behavior:** a **Directions** action deep-links to the user's map app
  using the (confirmed) coordinates/address; fires `directions_click`. Until
  coordinates are supplied the control is present but non-functional/placeholder.
- **CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS:** addresses, coordinates,
  opening hours, and map provider (brief §13 items 5–7).

---

## 10. Analytics Architecture (GA4)

Reuses the event names defined in **`visual-ux-direction.md` §21**. `analytics.js`
centralises dispatch; **all events are consent-gated** by `consent.js` and no-op until
consent is granted.

| Required action | Event name (from visual-ux §21) | Fired by |
|-----------------|----------------------------------|----------|
| Register CTA clicks | `register_cta_click` | header/hero/sticky CTA handlers |
| Form starts | `form_start` | `form.js` (first field interaction) |
| Successful form submissions | `generate_lead` (primary conversion) | `form.js` on server-confirmed success |
| WhatsApp clicks | `whatsapp_click` | `whatsapp.js` |
| Language switching | `language_switch` | `i18n.js` |
| Showroom interactions | `showroom_view` | `showrooms.js` |
| Direction clicks | `directions_click` | `showrooms.js` |

(Also available from §21: `form_submit`, `form_error`, `model_view`,
`gallery_interact`.) **Standard params on every event:** `language` (`en`/`ar`) and
`page_direction` (`ltr`/`rtl`). Attribution via GA4 automatic UTM capture — no custom
system (CLAUDE.md §15).

> **CONTENT REQUIRED:** GA4 **Measurement ID** (brief §13 item 13) and confirmation of
> any pre-existing GA4 naming standard. No ID invented.

---

## 11. SEO Architecture

- **Title structure:** `<Page/Brand> — <Descriptor>` per language. **Copy CONTENT
  REQUIRED**; structure defined, text placeholdered.
- **Meta description:** one concise description per language. **Copy CONTENT REQUIRED.**
- **Canonical strategy:** self-referential `<link rel="canonical">` per language URL
  (depends on the URL/language strategy in §6).
- **hreflang strategy (confirmed requirement, brief §5/§11):** reciprocal
  `hreflang="en"` / `hreflang="ar"` + `x-default`, pointing at the per-language URLs
  from §6. Requires the URL strategy to be confirmed first.
- **Open Graph / social sharing:** `og:title`, `og:description`, `og:image`,
  `og:locale` (+ `og:locale:alternate`), Twitter card tags. **Share image + copy =
  CONTENT REQUIRED** (asset in `assets/meta/`).
- **Favicon requirements:** full favicon set (ICO/PNG/SVG + apple-touch-icon +
  `site.webmanifest`) in `assets/meta/`. **Source logo = CONTENT REQUIRED.**
- **Also:** `robots`/sitemap on go-live; production **domain = CONTENT REQUIRED**
  (brief §13 item 15). No final SEO copy or URLs invented.

---

## 12. Performance Architecture

- **Image optimization:** modern formats (AVIF/WebP) with fallbacks; correct dimensions;
  compressed; a defined budget for the hero (LCP) asset.
- **Responsive images:** `srcset`/`sizes` + `<picture>` for art-directed EN/mobile vs.
  desktop crops (visual-ux §5).
- **Lazy loading:** `loading="lazy"` + `decoding="async"` for below-the-fold media;
  `IntersectionObserver` for deferred gallery/map init; hero eager + `fetchpriority`.
- **JavaScript loading:** `type="module"` (deferred by default); split modules loaded as
  needed; no framework/bundler; minimal code.
- **CSS strategy:** small token-driven stylesheet; critical/above-the-fold styles
  prioritised; avoid render-blocking; `font-display: swap`; self-host fonts if licence
  allows to cut third-party latency.
- **Animation performance:** `transform`/`opacity` only; `IntersectionObserver`-driven
  reveals; respect reduced-motion; no layout thrash.
- **Third parties:** GA4 and map loaded deferred/consent-aware.
- **Core Web Vitals:** LCP (optimise hero), CLS (reserve media dimensions, stable fonts),
  INP (lean JS, passive listeners). Verified on real phones in Week 3 (proposal).

---

## 13. Accessibility Architecture

Per CLAUDE.md §17.

- **Semantic HTML:** landmarks, one `<h1>`, ordered headings, real buttons/links/labels.
- **Keyboard navigation:** everything operable by keyboard; logical tab order; skip
  link; slider/gallery/map operable and not focus-trapping.
- **Focus states:** visible `:focus-visible` on all interactive elements; focus moved to
  first form error and to success confirmation.
- **Screen reader labels:** programmatic labels for all fields/controls; `aria-live` for
  errors/success; meaningful `alt` (CONTENT REQUIRED copy); decorative images `alt=""`.
- **Form error handling:** `aria-invalid`, `aria-describedby`, clear bilingual messages.
- **Contrast:** WCAG AA for text and essential UI; never colour-only state (pair with
  icon/text) — constrains palette (§3).
- **Reduced motion:** `prefers-reduced-motion` honoured throughout.
- **Arabic accessibility:** correct `lang`/`dir`; Arabic screen-reader friendliness;
  mirrored focus order matches visual order; no Latin-only assumptions.

---

## 14. Security & Privacy Considerations

- **Form security:** validate client- and server-side; escape/encode all rendered
  values; HTTPS only (proposal Week 3 SSL); no secrets in client code (submission
  endpoint config only, no credentials).
- **Spam protection:** honeypot + time-heuristic client-side; server-side check via the
  chosen (CONTENT REQUIRED) method; rate limiting is a server concern of the chosen
  provider.
- **Consent handling:** explicit opt-in PDPL consent required to submit; consent gates
  analytics; consent choice + timestamp + text-version recorded with the lead.
- **Data minimization:** collect **only** the four approved fields + consent — Name,
  Phone, Emirate, Model. No extra tracking of personal data; analytics params carry no
  PII.
- **No sensitive data:** no payment, ID, or account data; no fields beyond the approved
  set; running-sheet/backup handled by the (CONTENT REQUIRED) server side, not exposed
  client-side.

---

## 15. Implementation Order (phased)

Aligned to the proposal's 3-week arc and CLAUDE.md §29 (incremental).

1. **Foundation:** `index.html` skeleton (semantic landmarks, sections), CSS reset +
   design tokens + typography (placeholder palette, Cairo + Latin), base layout &
   container, logical-property scaffolding. No content yet.
2. **Bilingual core:** `i18n.js` + `content.*.json` structure; `lang`/`dir` switching;
   EN|AR switcher; verify RTL flips layout early (before components exist).
3. **Persistent layer:** header/nav, primary Register CTA, WhatsApp button
   (placeholder config), consent scaffold.
4. **Hero (ARRIVE):** full-bleed layout, headline/CTA wiring, reduced-motion-safe entry.
5. **The Models (EXPLORE):** `models.js` + `models.json` (placeholder data), RTL-aware
   slider, name + 3 key-number slots.
6. **Gallery (TRUST):** `gallery.js`, lazy full-bleed media, optional lightbox.
7. **Showrooms (TRUST):** `showrooms.js`, cards, map integration (provider TBD),
   directions deep-links.
8. **Register Interest (REGISTER):** `validation.js` + `form.js`; states; consent
   recording; submission transport against configurable endpoint.
9. **Analytics:** `analytics.js` consent-gated; wire all §10 events.
10. **SEO/meta:** titles, descriptions, canonical, **hreflang**, OG, favicon (structure
    + placeholders).
11. **Performance & a11y pass:** responsive images, lazy loading, CWV checks, keyboard/
    screen-reader/contrast audit, reduced-motion.
12. **Bilingual QA on real devices** (EN/LTR + AR/RTL) across all breakpoints; console
    clean; then content swap-in once approved assets/copy arrive; go-live (domain, SSL).

> Content-dependent steps (models, gallery, showrooms, copy, translation, WhatsApp,
> GA4 ID, SEO copy, domain) are built against **clearly-marked placeholders** and
> finalised only when the **CONTENT REQUIRED** items land.

---

## Appendix — Decisions That Must Be Confirmed Before Implementation

**Technical decisions (this doc):**
1. **URL / language strategy** (§6) — path vs. query vs. subdomain. *Blocks hreflang/SEO/build skeleton.*
2. **Module vs. single-file** structure (§1) — ES-modules split vs. one `script.js`/`styles.css`.
3. **Map provider** (§9) — interactive embed vs. static + link (keys/cost/perf).
4. **Form submission provider/endpoint** (§7) — no backend chosen yet.
5. **Spam/bot-protection method** (§7).
6. **Phone validation rule** strictness (§7).
7. **Font self-hosting vs. hosted** (§3/§12) — depends on licence.

**Carried from `visual-ux-direction.md` (unchanged):** brand guidelines; light vs.
dark theme; palette; Emirate list; model→form prefill; Arabic numeral style; motion
ceiling; GA4 naming standard.

**Content Required (defers to `project-brief.md` §13):** confirmed lineup & order;
three key numbers per model; model + gallery imagery (+ alt); showroom addresses, hours,
coordinates; map provider; sales recipient(s); running-sheet destination; WhatsApp
number + message; PDPL/consent + privacy wording; GA4 Measurement ID; SEO copy/OG image;
production domain; approved EN copy; professional AR translation; brand assets; spec sheet.

> **Nothing above is invented.** All business/vehicle/showroom/contact/legal/provider
> specifics remain CONTENT REQUIRED until supplied by the project owner.
