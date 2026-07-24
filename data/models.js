/* =============================================================================
   KGM UAE Microsite — Models content structure
   Source of truth for the "The Models" slider (rendered by js/script.js).

   ARCHITECTURE NOTE
   docs/technical-architecture.md §5 specifies `data/models.json`. For this
   build-free ES-module setup we use a JS module (imported directly) instead of
   fetched JSON — this keeps rendering synchronous (no fetch/file:// fragility,
   no async scroll-reveal ordering issues) while preserving the same intent:
   content separated from logic, rendered generically for N models. It can move
   to fetched JSON if a build/server step is later introduced.

   CONTENT INTEGRITY — nothing is invented:
   - `order` uses the POTENTIAL lineup from the proposal (brief §6). The final
     confirmed UAE lineup and order are CONTENT REQUIRED / NOT SPECIFIED.
     "Whichever models arrive first lead the page" — reorder this array to match.
   - `image` is null → renders a marked placeholder. CONTENT REQUIRED: official imagery.
   - Each model must have EXACTLY THREE key numbers. `value` and `label` are null
     → render placeholders. CONTENT REQUIRED: the three key numbers per model
     (from the KGM spec sheet). Do NOT invent values.
   - `name` is the brand model name (shown as-is in EN and AR). Any Arabic
     transliteration, if required, is CONTENT REQUIRED.
   ========================================================================== */

/** @typedef {{ value: (string|null), label: (string|null) }} KeyNumber */
/** @typedef {{ id: string, name: string, image: (string|null), keyNumbers: KeyNumber[] }} Model */

const emptyKeyNumbers = () => [
  { value: null, label: null },
  { value: null, label: null },
  { value: null, label: null }
];

/** @type {Model[]} */
export const MODELS = [
  { id: 'tivoli',        name: 'Tivoli',        image: null, keyNumbers: emptyKeyNumbers() },
  { id: 'torres',        name: 'Torres',        image: null, keyNumbers: emptyKeyNumbers() },
  { id: 'torres-hybrid', name: 'Torres Hybrid', image: null, keyNumbers: emptyKeyNumbers() },
  { id: 'actyon',        name: 'Actyon',        image: null, keyNumbers: emptyKeyNumbers() },
  { id: 'rexton',        name: 'Rexton',        image: null, keyNumbers: emptyKeyNumbers() },
  { id: 'musso',         name: 'Musso',         image: null, keyNumbers: emptyKeyNumbers() },
  { id: 'musso-ev',      name: 'Musso EV',      image: null, keyNumbers: emptyKeyNumbers() }
];
