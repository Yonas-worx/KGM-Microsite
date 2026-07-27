# KGM UAE Microsite — Build

A static, build-free implementation of the approved KGM UAE Microsite:
one bilingual (EN/AR, full RTL) cinematic scroll — Hero → The Models →
Gallery → Showrooms → Register Interest — per `docs/*` in the project.

## Run it locally

No build step, no server required — just double-click `index.html` and it
opens directly in your browser. (Earlier builds needed a local server
because they used ES modules + `fetch()` for JSON, which browsers block
under `file://`. That's been removed: all data now loads as plain inline
`<script>` globals, so the site is fully self-contained.)

If you prefer serving it anyway (e.g. for testing SEO/meta behaviour):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## What's real vs. placeholder

**Real, in use:**
- All 10 uploaded KGM vehicle images (`assets/img/models/`) — driving The
  Models carousel, the Gallery, and the Register form's model dropdown.
- The uploaded hero video (`assets/video/hero.mp4`, compressed for web
  delivery) and three stills pulled from it for the Gallery scene.
- The 7 UAE emirates (public geography, not brand content) in the
  Register form.
- Vehicle body-segment labels (e.g. "Mid-size SUV", "Pickup") — these are
  general, factual classifications, not specs, figures, or claims.

**Placeholder, clearly marked `CONTENT REQUIRED`, per `project-brief.md`
§13 — nothing here is invented:**
- Final confirmed launch lineup & order (all 10 supplied models are shown;
  narrow this down once the confirmed launch set is known)
- The three key numbers per model
- Model descriptions/categories beyond body segment
- Gallery/lifestyle imagery beyond the hero-video stills + product shots
- Showroom names, addresses, hours, coordinates, map embed
- WhatsApp number + default message (`js/config.js`)
- Form submission endpoint / sales recipient (`js/config.js`)
- GA4 Measurement ID (`js/config.js`)
- PDPL/consent and legal/footer copy
- Approved English copy and its professional Arabic translation (draft
  working copy is in place so the bilingual experience can be reviewed
  end-to-end, but is explicitly flagged `DRAFT` in
  `data/content.en.json` / `data/content.ar.json` and must not ship as-is)
- Brand guidelines (logo, exact colours, approved Latin typeface) — the
  current palette/type is a working creative direction, not final brand
  truth (`css/base.css` tokens)

## Where to plug real content in

Everything is data-driven — no code changes needed for content:

| To add… | Edit |
|---|---|
| Confirmed lineup/order/specs | `data/models.js` (plain JS object literal — same shape as before, prefixed `window.KGM_MODELS = `) |
| Gallery imagery | `data/gallery.js` + drop files in `assets/img/gallery/` |
| Showroom details | `data/showrooms.js` |
| Approved EN/AR copy | `data/content.en.js` / `data/content.ar.js` |
| WhatsApp number, form endpoint, GA4 ID | `js/config.js` |
| Brand colours/type | tokens at the top of `css/base.css` |

## Architecture

Vanilla HTML/CSS/JS, no framework, no bundler — matching
`technical-architecture.md`'s intent. One deliberate deviation from the
original spec: data files are plain `.js` globals (`window.KGM_MODELS`,
etc.) and scripts load as ordinary `<script src>` tags on a shared
`window.KGM` namespace, not ES modules / `fetch()`. Modules and `fetch()`
are blocked by browsers under `file://`, which broke every section after
the Hero the first time this shipped. This trades the more "modern"
module syntax for something that reliably works the moment someone
double-clicks `index.html` — no server, no build step. Script load order
(bottom of `index.html`) is what keeps dependencies correct without a
bundler.
