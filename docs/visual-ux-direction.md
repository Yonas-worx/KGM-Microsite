# KGM UAE Microsite — Visual & UX Direction

> **Status:** Planning document. Written **before any website code**.
> **Source of truth:** `docs/project-brief.md` and the approved proposal
> `docs/KGM UAE Microsite-QuickStart Proposal 2026 _ by Worx (1).pptx`, read with
> `CLAUDE.md`. This document interprets those into a practical visual/UX direction; it
> does **not** override them and does **not** introduce new scope.
>
> **Content rule:** Nothing here invents vehicle specs, model availability, key
> numbers, imagery, addresses, hours, coordinates, contact details, WhatsApp numbers,
> or legal/PDPL wording. Where a concept depends on unconfirmed input it is marked
> **CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS** and defers to
> `project-brief.md` §13.
>
> **Reference rule:** The official KGM site (`https://en.kg-mobility.com/`) is used
> **only** as research/inspiration for automotive context and model presentation. The
> microsite is an **original KGM UAE experience** — no copying of its layout,
> structure, content, design, code, interactions, or assets.

---

## 1. Overall Creative Concept

**Concept: "The Arrival."** The microsite is staged as the moment KGM arrives in the
UAE — one confident, cinematic scroll that behaves like a manufacturer's flagship
experience compressed to a single page. Not a campaign landing page; a premium
automotive destination.

- **One continuous cinematic scroll** — each section is a full "scene" that hands off
  to the next, so the page reads as a directed sequence rather than stacked blocks.
- **Image leads, copy follows.** Short lines only. The vehicles and photography carry
  the emotion; text orients and converts.
- **Every scene points to one action:** *Register Interest.* The CTA is always
  reachable but never shouty.
- **Restraint as luxury.** Generous negative space, few type sizes, few colours,
  purposeful motion. The feeling of quality comes from what is left out.

**Guiding line (from brief §15):** *Beautiful enough to create desire. Simple enough
to create action.*

---

## 2. Brand & Visual Character

**Character:** premium, modern, cinematic, automotive, confident, high-quality,
mobile-first. Manufacturer-grade, regionally aware (UAE), equally at home in English
and Arabic.

- **Editorial, not templated.** Asymmetric but disciplined layouts; strong grid;
  large imagery framed by whitespace.
- **Confident quiet.** Minimal chrome, no decorative clutter, no stock-template
  patterns. Interface elements defer to vehicles.
- **Regional premium.** Sophisticated and international while respecting Arabic as a
  first-class experience (not an afterthought translation).

> **CONTENT REQUIRED:** Official KGM brand guidelines (logo lockups, clear-space,
> exact brand colours, approved fonts, tone-of-voice). Until supplied, the palette and
> type below are a **working direction**, not final brand truth.

---

## 3. Colour Direction

**Approach: a dark, cinematic base that makes vehicle photography the hero, with a
single restrained accent for action.**

Working direction (placeholder — pending official brand guidelines):

- **Foundation:** near-black / deep charcoal canvas for hero and immersive scenes, so
  photography and headlines feel lit from within.
- **Light surfaces:** clean off-white/light-neutral for reading-dense scenes (form,
  showroom details) to maximise legibility and contrast.
- **Neutrals:** a small greyscale ramp for text, dividers, and UI states.
- **Single accent:** one confident accent reserved almost exclusively for the
  **Register Interest CTA** and key interactive affordances, so the primary action is
  unmistakable. WhatsApp keeps its own recognisable brand green as a **secondary**
  action so it never competes with the primary CTA.
- **Contrast rule:** every text/background pairing must meet accessibility contrast
  targets (see §18) — this constrains the accent, not the other way around.

> **CONTENT REQUIRED / NOT SPECIFIED IN PROJECT MATERIALS:** exact KGM brand colour
> values (primary, accent, neutrals) and any mandated brand green vs. WhatsApp green
> handling. Final palette must come from official brand guidelines before build.

---

## 4. Typography Direction

**Confirmed (brief §5):** **Arabic uses the Cairo typeface**, with tuned line-height
designed for Arabic.

**Approach: a two-script system that feels like one voice.**

- **Latin (English):** a modern, geometric/neo-grotesque sans with a strong, confident
  display weight for headlines and a highly legible weight for body — automotive and
  premium, not decorative. **CONTENT REQUIRED:** the specific approved Latin
  typeface(s) (pending brand guidelines).
- **Arabic:** **Cairo**, paired to match the Latin family's weight and rhythm so both
  languages feel equally intentional.
- **Scale:** a small, deliberate type scale (few sizes). Large cinematic headlines,
  clear sub-labels (often uppercase/tracked in EN to echo the proposal's tone), short
  body lines.
- **Rhythm:** generous line-height; short measure (line length) to keep the "short
  lines of copy" discipline. Arabic gets its own line-height and letter-spacing rules
  (no forced uppercase; no tight Latin tracking applied to Arabic).
- **Numerals:** key numbers rendered large and confident as a design element (see §9)
  — but the **numbers themselves are CONTENT REQUIRED**.

---

## 5. Image & Photography Direction

**Confirmed (brief §6, §7):** the lineup is *"showcased with official imagery"*;
gallery is *"full-bleed brand imagery, no walls of text."* Imagery is a required brand
asset delivered at kick-off.

**Approach: photography is the product.**

- **Full-bleed, cinematic framing.** Vehicles shot with space around them; let images
  breathe edge-to-edge on mobile and desktop.
- **Consistent grade.** A unified colour treatment across hero, models, and gallery so
  the set feels like one campaign, not a mixed folder.
- **Hierarchy:** hero shot > model hero shots > gallery/aesthetic shots. Text overlays
  only where contrast allows (use gradients/scrims, not boxes, to preserve the image).
- **Art direction for two aspect worlds:** portrait-friendly crops for mobile,
  wide/landscape crops for desktop — planned per image, not stretched.

> **CONTENT REQUIRED / NOT SPECIFIED:** all official model and gallery imagery (hero +
> aesthetic shots), approved crops, and usage rights. No imagery is invented,
> AI-generated, or sourced from the official website.

---

## 6. Motion & Animation Principles

**Approach: motion serves storytelling and clarity — never decoration** (CLAUDE.md
forbids unnecessary animations).

- **Cinematic reveals:** gentle fade/rise as scenes enter the viewport; subtle
  parallax on hero/gallery imagery for depth. Slow, weighted easing (premium, not
  bouncy).
- **Purposeful only:** every animation either establishes hierarchy, guides the eye
  toward the CTA, or provides feedback. If it does none of these, it is removed.
- **Performance-bounded:** prefer transform/opacity (GPU-friendly); avoid layout
  thrash and heavy JS animation libraries (CLAUDE.md §18/§25).
- **Direction-aware:** any horizontal motion (sliders, transitions) must respect
  reading direction and flip for RTL (see §15).
- **Respect user settings:** honour `prefers-reduced-motion` — reduce or disable
  non-essential motion (see §18).

---

## 7. Navigation Experience

**Purpose:** let users move through the single scroll effortlessly and reach the
primary action from anywhere.

- **Feeling:** light, unobtrusive, confident. Navigation is a thin layer over the
  imagery, not a heavy header.
- **Visual approach:** minimal top bar — KGM logo, a compact anchor set to the five
  scenes (Models / Gallery / Showrooms / Register), the **EN | AR** switcher, and the
  **Register Interest** CTA. Transparent over the hero, gaining a subtle solid/blur
  background once the user scrolls for legibility.
- **Interaction approach:** smooth anchored scrolling to sections; clear active-state;
  fully keyboard operable; large touch targets on mobile (condensed/menu pattern where
  space is tight).
- **Conversion role:** keeps **Register Interest** and language choice one tap away at
  all times, reducing friction to the primary goal.

> **CONTENT REQUIRED:** final KGM logo lockup (EN and, if applicable, AR) and clear-space rules.

---

## 8. Hero Experience (ARRIVE)

- **Purpose:** deliver the single message — *KGM is in the UAE* — in one cinematic
  screen (brief §3, §4).
- **User feeling:** arrival, anticipation, premium confidence. "Something significant
  has landed."
- **Visual approach:** full-bleed hero imagery/vehicle, one short headline, one line of
  supporting copy, one primary CTA. Deep cinematic base; strong type; lots of air.
  Optional subtle parallax/scroll cue.
- **Interaction approach:** immediate (no gate/loader wall); a gentle scroll indicator
  invites the journey; CTA and language switcher present. If motion/video is used it is
  lightweight, muted, and reduced under `prefers-reduced-motion`.
- **Conversion role:** sets tone and plants the primary CTA at first contact; frames the
  entire scroll as leading toward Register Interest.

> **CONTENT REQUIRED:** approved hero imagery/footage; approved EN hero headline + line
> and its professional AR translation (brief §13 items 3, 16, 17).

---

## 9. The Models Experience (EXPLORE)

- **Purpose:** present the confirmed UAE lineup — *names, hero shots, key numbers only*
  — and enable **premium model discovery without separate detail pages** (brief §6;
  Creative Direction priority 3).
- **User feeling:** desire and ease — "these are beautiful, and I can take them in
  quickly."
- **Visual approach:** an image-led, swipeable showcase. Each model = large hero shot +
  model name + exactly **three key numbers** presented as a confident, minimal stat
  row. Ordering follows *"whichever models arrive first lead the page."*
- **Interaction approach:** horizontal swipe/slider on mobile, arrow/drag on desktop;
  snap points; clear progress indicator. **RTL flips slider direction and controls**
  (see §15). Selecting a model can pre-fill the form's "model of interest" (see §12).
- **Conversion role:** turns interest in a specific model into a warm, pre-qualified
  path into Register Interest.

> **CONTENT REQUIRED / NOT SPECIFIED:** final confirmed lineup and launch order; the
> **three key numbers per model** (from KGM spec sheet); official model imagery. These
> must not be invented (brief §13 items 1, 2, 3). Build the component to accept N
> models with 3 numbers each; leave data placeholders clearly marked.

---

## 10. Gallery Experience (TRUST)

- **Purpose:** build desire and confidence through *full-bleed brand imagery, no walls
  of text* (brief §7).
- **User feeling:** immersion and credibility — "this brand is real, premium, and
  here."
- **Visual approach:** an edge-to-edge visual sequence (full-bleed frames and/or a
  refined grid). Minimal captions if any; imagery does the talking. Unified grade with
  the rest of the page.
- **Interaction approach:** smooth scroll/swipe; optional lightweight lightbox for
  enlarging; lazy-loaded media; subtle parallax. Direction-aware for RTL. Keyboard and
  screen-reader accessible with meaningful alt text.
- **Conversion role:** the emotional peak before the ask — raises desire so the
  Register step feels natural, and reinforces trust ("really here").

> **CONTENT REQUIRED:** the gallery image set and approved alt text (brief §13 item 4).

---

## 11. Showrooms Experience (TRUST)

- **Purpose:** provide *locations, hours, live map & directions* — proof KGM is "just a
  few minutes away" (brief §8).
- **User feeling:** reassurance and proximity — "I know where to go and how to get
  there."
- **Visual approach:** clean, legible, on a lighter surface for readability; each
  showroom as a clear card (name, address, hours) paired with a map and a prominent
  **Directions** action. Premium but information-first.
- **Interaction approach:** live/interactive map; one-tap **Get Directions** (deep-link
  to the user's map app); click-to-call/WhatsApp where appropriate. Direction and label
  alignment flip for RTL. Fully keyboard accessible; map must not trap focus.
- **Conversion role:** lowers real-world friction and builds trust, supporting the
  decision to register (and offering WhatsApp as an alternative contact).

> **CONTENT REQUIRED / NOT SPECIFIED (must not be invented):** showroom addresses,
> opening hours, map coordinates/pins, and directions data (brief §13 items 5–7).
> **Design decision to confirm:** map provider (e.g., Google Maps embed vs. static
> map + link) — affects performance, keys, and cost. Flagged for owner decision.

---

## 12. Register Interest Experience (REGISTER)

- **Purpose:** the primary conversion — a *30-second bilingual form, straight to sales*
  with fields **Name · Phone · Emirate · Model of interest** (brief §9).
- **User feeling:** effortless and trustworthy — "this takes seconds and my data is
  handled properly."
- **Visual approach:** focused, uncluttered form on a calm surface; large tappable
  fields; clear labels above inputs; one prominent submit; visible PDPL consent. Short
  supportive copy setting expectation of what happens next (sales follow-up).
- **Interaction approach:**
  - Minimal fields only; mobile-optimised inputs (`tel` keypad for phone; Emirate as a
    select; Model prefilled from The Models when chosen).
  - **Inline validation** with clear, specific messages; explicit required-field
    marking; visible error and **success** states; disabled-until-valid or clear
    submit feedback.
  - **Spam & bot protection** and **PDPL consent recorded** (brief §9). Consent is an
    explicit, unticked checkbox with linked privacy wording.
  - Full keyboard support, labelled fields, focus states, and error text tied to
    inputs via ARIA.
  - RTL: labels, inputs, help/error text, and checkbox alignment fully mirrored (§15).
- **Conversion role:** *this is the goal.* Every prior scene exists to get the user
  here ready to submit; success should feel rewarding and tell them what happens next.

> **CONTENT REQUIRED / NOT SPECIFIED:** PDPL/consent + privacy wording; the list of
> Emirates to offer (standard 7 UAE emirates — confirm with owner); model options
> (from confirmed lineup); sales notification recipient(s); running-sheet destination;
> chosen spam/bot-protection method; success-message copy (brief §13 items 1, 8, 9,
> 12, 16, 17). Do not invent legal text or recipients.

---

## 13. Persistent CTA & WhatsApp Behavior

**Confirmed (brief §4):** the always-there layer = **EN | AR switcher · WhatsApp
click-to-chat · Register-Interest CTA · PDPL privacy & consent.**

- **Purpose:** keep the primary action and instant contact reachable throughout the
  scroll without disrupting the cinematic feel.
- **Feeling:** helpful, not nagging.
- **Visual approach:** a tasteful persistent **Register Interest** affordance (e.g.,
  in nav and/or a subtle sticky action) using the single accent colour; a floating
  **WhatsApp** button using its recognisable green as the secondary action. The two
  never compete — primary accent > WhatsApp green in visual weight/priority.
- **Interaction approach:** WhatsApp opens click-to-chat with an approved prefilled
  message; Register scrolls to / focuses the form. Both are large touch targets,
  keyboard reachable, and mirror position appropriately in RTL.
- **Conversion role:** two always-available conversion paths — form (primary) and
  WhatsApp (for those who prefer to message, per brief §9).

> **CONTENT REQUIRED / NOT SPECIFIED:** WhatsApp number and approved default message
> (brief §13 items 10, 11). No number or message is invented.

---

## 14. English & Arabic Experience

**Confirmed (brief §5):** Arabic is a first-class citizen; both languages ship day one;
EN | AR toggle + hreflang; professional human EN→AR translation.

- **Equal footing:** Arabic is designed, not merely translated — its own layout,
  typography (Cairo), rhythm, and mirrored patterns. Neither language is a degraded
  version of the other.
- **Switching:** an obvious **EN | AR** toggle in the nav that flips **direction and
  layout**, not just text (CLAUDE.md §8). It should preserve the user's scroll position/
  scene where technically feasible.
- **SEO:** `hreflang` so each audience is served the correct version (brief §11).
- **Copy discipline:** short lines in both languages; Arabic copy reviewed for natural
  phrasing and length differences (Arabic can run longer/shorter — layouts must flex).

> **CONTENT REQUIRED:** final approved EN copy and its professional AR translation for
> every string (brief §13 items 16, 17). Placeholder copy must be clearly marked and
> never shipped as final.

---

## 15. RTL Behavior

**Confirmed (brief §5):** Arabic is *RTL, fully mirrored* — layout, navigation, forms,
and sliders flip, not just text.

- **Layout mirroring:** overall document direction switches to RTL; horizontal order of
  columns, nav items, and icons mirrors; logical CSS properties (start/end) preferred
  over left/right so mirroring is systemic, not manual.
- **Components:** The Models slider reverses swipe/advance direction and moves its
  controls/progress accordingly; gallery navigation mirrors; form label/field/checkbox
  alignment mirrors; "next/previous" and arrow icons flip.
- **Typography:** Cairo, Arabic line-height/letter-spacing; no forced uppercase; Latin
  tracking rules not applied to Arabic; numerals presentation confirmed with owner.
- **Exceptions:** phone numbers, latin brand names, and map UI follow platform norms;
  WhatsApp/telephone remain LTR where appropriate.
- **Testing:** every component verified in both LTR and RTL (CLAUDE.md §7, §26).

---

## 16. Mobile-First Behavior

**Confirmed (brief §2, §4):** built **mobile-first for launch-campaign traffic.**

- **Design order:** small screens first; enhance upward. Never desktop-first patched
  for mobile (CLAUDE.md §19).
- **Ergonomics:** thumb-reachable primary actions; large touch targets (≥ accessible
  minimum); sticky/near CTA and WhatsApp; native input types and pickers.
- **Media:** portrait-friendly crops; responsive images with appropriate sizes/formats;
  lazy loading below the fold; avoid heavy video on mobile data.
- **Performance budget:** minimise JS, avoid large libraries, fast first paint on
  mid-range phones and UAE mobile networks (CLAUDE.md §18).
- **Breakpoints to verify (CLAUDE.md §19):** small mobile, large mobile, tablet,
  desktop, wide desktop — in both EN/LTR and AR/RTL.

---

## 17. Desktop Behavior

- **Purpose:** translate the mobile-first scroll into a spacious, cinematic
  large-screen experience without adding scope.
- **Visual approach:** wider crops and full-bleed imagery exploit the canvas; generous
  margins; larger display type; multi-column where it aids clarity (e.g., showroom
  cards beside map). The single-scroll narrative is preserved.
- **Interaction approach:** hover states and subtle parallax become available (and are
  purely enhancements — nothing essential depends on hover); slider supports
  drag/arrows/keyboard; smooth anchored navigation.
- **Conversion role:** persistent CTA remains prominent; the form stays focused and
  never sprawls — width is constrained for readability.

---

## 18. Accessibility Principles

Aligned to CLAUDE.md §17.

- **Semantic HTML** and landmark structure; logical heading order; single main scroll
  navigable by keyboard.
- **Keyboard:** all interactive elements reachable and operable; visible focus states;
  no keyboard traps (esp. slider, gallery lightbox, map).
- **Forms:** programmatic labels, required indication, error messages tied to fields
  (`aria-describedby`), clear success announcement (live region).
- **Media:** meaningful `alt` text for imagery (CONTENT REQUIRED for approved alt
  copy); captions/labels where needed; decorative images marked as such.
- **Colour & contrast:** meet WCAG AA contrast for text and essential UI; never rely on
  colour alone to convey state (pair with icon/text).
- **Motion:** honour `prefers-reduced-motion`; keep essential meaning without animation.
- **Targets:** adequate touch target sizes and spacing.
- **Bilingual a11y:** correct `lang` and `dir` attributes per language; Arabic
  screen-reader friendliness.

---

## 19. Performance Principles

Aligned to CLAUDE.md §18, §25.

- **Image-led but disciplined:** optimised, responsive images; modern formats (e.g.,
  WebP/AVIF) with fallbacks; correct sizing; lazy-load off-screen media; prioritise the
  hero (LCP) asset.
- **Lean JS:** vanilla-first; avoid large frameworks/libraries unless justified; no
  dependency added without checking simpler options first.
- **Fast first render:** minimise render-blocking resources; system/font-display
  strategy to avoid invisible text; defer non-critical work.
- **Motion cost-aware:** transform/opacity animations; avoid layout thrash and heavy
  scroll libraries.
- **Third parties:** GA4 and any map embed loaded carefully (deferred/consent-aware) to
  protect load time. Map-provider choice affects budget (see §11).
- **Verify:** no console errors; test image loading and mobile experience (CLAUDE.md
  §26, §30).

---

## 20. The Complete User Journey: ARRIVE → EXPLORE → TRUST → REGISTER

A single directed scroll; each scene has one job and hands off to the next.

| Stage | Scene(s) | Purpose | Intended feeling | Visual approach | Interaction approach | Conversion role |
|-------|----------|---------|------------------|-----------------|----------------------|-----------------|
| **ARRIVE** | Hero | Announce *KGM is in the UAE* | Anticipation, arrival, premium confidence | Full-bleed cinematic hero, one headline + line, one CTA | Immediate entry, gentle scroll cue, CTA + language present | Plants primary CTA at first contact; frames the scroll |
| **EXPLORE** | The Models | Show lineup — names, hero shots, 3 key numbers | Desire + easy discovery | Image-led swipeable showcase, minimal stat rows | Swipe/drag/keyboard, snap, RTL-aware; model → form prefill | Warms a specific-model intent into the form |
| **TRUST** | Gallery + Showrooms | Prove premium + presence/proximity | Immersion, credibility, reassurance | Full-bleed gallery; clean showroom cards + map | Smooth scroll/lightbox; live map + one-tap directions | Raises desire and lowers real-world friction |
| **REGISTER** | Register Interest (+ persistent CTA/WhatsApp) | Capture a qualified lead in ~30s | Effortless, trustworthy | Focused form, clear labels, visible consent, success state | Minimal fields, inline validation, spam/bot + PDPL, WhatsApp alt | **The goal** — submit to sales; confirm what happens next |

**Throughline:** imagery creates desire; short copy orients; the primary accent always
points to Register Interest; WhatsApp offers a lighter path; Arabic and English are
equally first-class at every step.

---

## 21. Analytics & Event Tracking (GA4)

**Confirmed (brief §11, CLAUDE.md §15):** GA4 is implemented; important user actions
are tracked with **clear, consistent event names**; marketing must see which campaign
produced each lead. Do **not** build a complicated analytics system beyond this.

This section maps each tracked action to its UX trigger so it can be wired during
build. Event names below are a **proposed convention** (lowercase `snake_case`,
GA4-style) — not confirmed brand/analytics taxonomy; adjust if the owner has an
existing GA4 naming standard.

### 21.1 Event map (interaction → event)

| # | User action (UX trigger) | Proposed event name | Journey stage | Key parameters (proposed) |
|---|--------------------------|---------------------|---------------|---------------------------|
| 1 | Click any **Register Interest** CTA (nav, hero, sticky, section) | `register_cta_click` | ARRIVE→REGISTER | `cta_location` (nav/hero/sticky/section), `language` |
| 2 | **Form start** — first focus/input on any form field | `form_start` | REGISTER | `language`, `model_prefilled` (bool) |
| 3 | **Form submit attempt** (button pressed) | `form_submit` | REGISTER | `language` |
| 4 | **Validation error** shown on submit | `form_error` | REGISTER | `error_fields` (list), `language` |
| 5 | **Successful submission** (server-confirmed lead) — *primary conversion* | `generate_lead` | REGISTER | `model_of_interest`, `emirate`, `language` |
| 6 | **WhatsApp** click-to-chat (any instance) | `whatsapp_click` | any | `source` (sticky/showroom/nav), `language` |
| 7 | **Language switch** EN↔AR | `language_switch` | any | `from_language`, `to_language` |
| 8 | **Model interaction** — advance/select a model in The Models | `model_view` | EXPLORE | `model_name`, `method` (swipe/arrow/select) |
| 9 | **Gallery interaction** — open/advance gallery (incl. lightbox if approved) | `gallery_interact` | TRUST | `method`, `language` |
| 10 | **Showroom interaction** — expand/focus a showroom card | `showroom_view` | TRUST | `showroom_name`, `language` |
| 11 | **Directions** click (deep-link to map app) | `directions_click` | TRUST | `showroom_name`, `language` |

Notes:
- **Primary conversion = event #5 (`generate_lead`)**, fired only on server-confirmed
  success — never on submit-click alone — so reporting counts real leads. Mark it as
  the GA4 conversion/key event.
- **Recommended standard parameters on every event:** `language` (`en`/`ar`) and
  `page_direction` (`ltr`/`rtl`) so EN vs. AR performance is comparable.
- **Model / emirate values** must map to the *confirmed* lineup and Emirate list — use
  stable machine keys, not free text. Values themselves depend on **CONTENT REQUIRED**
  items (final lineup; Emirate list) and are **not invented** here.
- **Campaign attribution** relies on GA4's automatic UTM capture from launch-campaign
  links; no custom system is added (respects CLAUDE.md's "no complicated analytics").

### 21.2 Consent & privacy (PDPL)

- GA4 must load in a **consent-aware** manner. Analytics/tracking events fire **only
  after** the user's consent choice is resolved, consistent with the site's PDPL
  privacy & consent layer (brief §9, §13).
- The **exact consent mechanism/wording is CONTENT REQUIRED / NOT SPECIFIED IN PROJECT
  MATERIALS** (see brief §13 item 12). This document specifies the *behaviour* (gate
  analytics on consent), not the legal text.

### 21.3 Not specified / required from owner

- **GA4 Measurement ID** — CONTENT REQUIRED (brief §13 item 13). No placeholder ID is
  invented.
- Confirmation of any **existing GA4 event-naming standard** the owner already uses (to
  override the proposed convention above).
- **PDPL consent copy/mechanism** governing when analytics may fire.

---

## Appendix A — Design Decisions Requiring Owner Confirmation (roll-up)

These are **decisions/inputs**, not inventions. All must be confirmed before or during
build; they cross-reference `project-brief.md` §13.

1. Official **brand guidelines**: logo lockups, exact colours, approved Latin
   typeface(s) (Arabic = Cairo is confirmed).
2. **Colour palette** finalisation (foundation, single accent, WhatsApp-green handling).
3. **Map provider** for Showrooms (embed vs. static + link) — performance/cost/keys.
4. **Spam/bot-protection** method (e.g., honeypot, token-based, or provider) — privacy
   and PDPL implications.
5. **Emirate list** presentation (confirm the 7 UAE emirates as options).
6. **Model → form prefill** behaviour confirmation.
7. Arabic **numeral style** (Western vs. Eastern Arabic numerals) for key numbers.
8. Motion intensity ceiling (how cinematic vs. how restrained).

## Appendix B — Content Required / Not Specified (roll-up, defers to brief §13)

Final lineup & order · three key numbers per model · official model imagery · gallery
imagery + alt text · showroom addresses · opening hours · coordinates/directions ·
sales notification recipient(s) · running-sheet destination · WhatsApp number ·
WhatsApp default message · PDPL/consent + privacy wording · GA4 Measurement ID · SEO
metadata (titles, descriptions, canonicals, hreflang URLs) · production domain ·
approved EN copy · professional AR translation · brand assets/design system · spec
sheet.

> **None of the above may be invented.** Where needed for layout, use clearly marked
> placeholders only.
