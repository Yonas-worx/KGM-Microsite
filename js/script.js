/* =============================================================================
   KGM UAE Microsite — Script (ES module)
   Sources: docs/technical-architecture.md (§4, §6, §10)

   Implemented here:
   - language state + EN/AR switching (html lang/dir), preference persistence
   - navigation: sticky-header scroll state, mobile menu, active-link highlight
   - Register Interest CTA behavior (scroll + focus)
   - The Models: horizontal slider controls (RTL-aware) + model_view events
   - scroll reveal (IntersectionObserver, reduced-motion aware)
   - GA4 event hooks (consent-gated stub, event names per visual-ux §21)
   - form: form_start hook only — NO submission backend is wired

   NOT implemented (later phases): full form validation + submission transport,
   real content/data loading, map + WhatsApp links. No endpoint/provider invented.

   CONTENT NOTE: Arabic strings are WORKING PLACEHOLDERS for UI chrome only, so the
   switcher + RTL layout are demonstrable. ALL final copy (EN + professional AR) is
   CONTENT REQUIRED (project-brief §13). Marketing/marketing-adjacent lines below are
   drawn only from confirmed materials (e.g. "August 2026", "~30 seconds").
   ========================================================================== */

'use strict';

/* ---------------------------------------------------------------------------
   i18n — UI chrome strings only
   --------------------------------------------------------------------------- */
const STRINGS = {
  en: {
    'a11y.skip': 'Skip to content',
    'brand.sub': 'United Arab Emirates',
    'nav.menu': 'Menu',
    'nav.models': 'Models',
    'nav.gallery': 'Gallery',
    'nav.showrooms': 'Showrooms',
    'nav.register': 'Register',
    'cta.register': 'Register Interest',
    'hero.kicker': 'United Arab Emirates',
    'hero.title': 'KGM is in the UAE',
    'hero.sub': 'The first vehicles arrive in August 2026.',
    'hero.explore': 'Explore the models',
    'hero.scroll': 'Scroll',
    'models.eyebrow': 'The Models',
    'models.title': 'The lineup',
    'gallery.eyebrow': 'Gallery',
    'gallery.title': 'A closer look',
    'showrooms.eyebrow': 'Showrooms',
    'showrooms.title': 'Visit us',
    'showrooms.hours': 'Opening hours',
    'showrooms.directions': 'Get directions',
    'register.eyebrow': 'Register Interest',
    'register.title': 'Be first to know',
    'register.lead': 'Takes about 30 seconds. Our team follows up personally.',
    'form.name': 'Name',
    'form.phone': 'Phone',
    'form.emirate': 'Emirate',
    'form.model': 'Model of interest',
    'form.select': 'Select…',
    'form.consent': '[CONTENT REQUIRED: PDPL consent & privacy wording]',
    'footer.privacy': '[CONTENT REQUIRED: Privacy policy]'
  },
  // Arabic = placeholder UI chrome only; final AR copy requires professional translation.
  ar: {
    'a11y.skip': 'تخطَّ إلى المحتوى',
    'brand.sub': 'الإمارات العربية المتحدة',
    'nav.menu': 'القائمة',
    'nav.models': 'الطُّرُز',
    'nav.gallery': 'المعرض',
    'nav.showrooms': 'صالات العرض',
    'nav.register': 'التسجيل',
    'cta.register': 'سجّل اهتمامك',
    'hero.kicker': 'الإمارات العربية المتحدة',
    'hero.title': 'KGM في الإمارات',
    'hero.sub': 'تصل أولى المركبات في أغسطس 2026.',
    'hero.explore': 'استكشف الطُّرُز',
    'hero.scroll': 'مرِّر',
    'models.eyebrow': 'الطُّرُز',
    'models.title': 'التشكيلة',
    'gallery.eyebrow': 'المعرض',
    'gallery.title': 'نظرة أقرب',
    'showrooms.eyebrow': 'صالات العرض',
    'showrooms.title': 'زورونا',
    'showrooms.hours': 'ساعات العمل',
    'showrooms.directions': 'الاتجاهات',
    'register.eyebrow': 'سجّل اهتمامك',
    'register.title': 'كن أول من يعلم',
    'register.lead': 'يستغرق نحو 30 ثانية. يتابع فريقنا معك شخصيًا.',
    'form.name': 'الاسم',
    'form.phone': 'الهاتف',
    'form.emirate': 'الإمارة',
    'form.model': 'الطراز محل الاهتمام',
    'form.select': 'اختر…',
    'form.consent': '[محتوى مطلوب: نص الموافقة والخصوصية PDPL]',
    'footer.privacy': '[محتوى مطلوب: سياسة الخصوصية]'
  }
};

const SUPPORTED_LANGS = ['en', 'ar'];
const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'kgm-lang';

/* Form messages (bilingual). Kept separate from UI-chrome STRINGS.
   Arabic here is a working placeholder pending professional translation. */
const FORM_MESSAGES = {
  en: {
    name: 'Please enter your name.',
    phone: 'Please enter a valid phone number.',
    emirate: 'Please select your emirate.',
    model: 'Please select a model.',
    consent: 'Please accept to continue.',
    tooFast: 'That was a little quick — please try again.',
    summary: (n) => `Please review ${n} field${n > 1 ? 's' : ''} above.`,
    // Honest: validation passed, but no submission transport is connected yet.
    notConfigured: 'Details look good. Submission is not yet connected (CONTENT REQUIRED: endpoint).'
  },
  ar: {
    name: 'يرجى إدخال اسمك.',
    phone: 'يرجى إدخال رقم هاتف صحيح.',
    emirate: 'يرجى اختيار الإمارة.',
    model: 'يرجى اختيار طراز.',
    consent: 'يرجى الموافقة للمتابعة.',
    tooFast: 'كان ذلك سريعًا بعض الشيء — يرجى المحاولة مرة أخرى.',
    summary: (n) => `يرجى مراجعة ${n} حقل أعلاه.`,
    notConfigured: 'البيانات تبدو صحيحة. لم يتم ربط الإرسال بعد (محتوى مطلوب: نقطة الإرسال).'
  }
};

// Submission transport is NOT configured (technical-architecture §7).
// No endpoint/provider is invented. When provided later, POST here and fire
// `generate_lead` ONLY on server-confirmed success.
const SUBMIT_ENDPOINT = null;
// URL/language strategy is NOT YET CONFIRMED (technical-architecture §6):
// foundation reads a saved preference only; no URL scheme is assumed.

const i18n = {
  current: DEFAULT_LANG,

  init() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* storage unavailable */ }
    this.apply(SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG, { silent: true });
  },

  apply(lang, { silent = false } = {}) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    const from = this.current;
    this.current = lang;

    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const dict = STRINGS[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }

    // Direction-dependent components may need to re-evaluate their edges.
    if (window.__kgmModels) window.__kgmModels.refresh();
    // Re-render any visible form messages in the new language.
    if (window.__kgmForm) window.__kgmForm.refresh();

    if (!silent && from !== lang) {
      analytics.track('language_switch', { from_language: from, to_language: lang });
    }
  }
};

/* ---------------------------------------------------------------------------
   analytics — GA4 wrapper (consent-gated STUB). No Measurement ID (CONTENT REQUIRED).
   Event names mirror docs/visual-ux-direction.md §21.
   --------------------------------------------------------------------------- */
const analytics = {
  consentGranted: false, // wired to PDPL consent in a later phase

  standardParams() {
    return {
      language: i18n.current,
      page_direction: document.documentElement.getAttribute('dir') || 'ltr'
    };
  },

  track(event, params = {}) {
    const payload = { ...this.standardParams(), ...params };
    if (!this.consentGranted) {
      if (window.console) console.debug('[analytics:queued]', event, payload);
      return;
    }
    // When configured: window.gtag && window.gtag('event', event, payload);
    if (window.console) console.debug('[analytics:event]', event, payload);
  }
};

/* ---------------------------------------------------------------------------
   navigation — scroll state, mobile menu, lang switch, CTA + WhatsApp hooks,
   active-link highlight
   --------------------------------------------------------------------------- */
const navigation = {
  init() {
    this.header = document.querySelector('[data-header]');
    this.toggle = document.querySelector('[data-nav-toggle]');
    this.list = document.querySelector('[data-nav-list]');
    this.bindScrollState();
    this.bindMobileMenu();
    this.bindLangSwitch();
    this.bindCtas();
    this.bindWhatsApp();
    this.bindActiveLink();
  },

  bindScrollState() {
    if (!this.header) return;
    const onScroll = () => this.header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  },

  bindMobileMenu() {
    if (!this.toggle || !this.list) return;
    this.toggle.addEventListener('click', () => {
      const open = this.list.classList.toggle('is-open');
      this.toggle.setAttribute('aria-expanded', String(open));
    });
    this.list.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => this.closeMenu()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeMenu(); });
  },

  closeMenu() {
    if (!this.list) return;
    this.list.classList.remove('is-open');
    if (this.toggle) this.toggle.setAttribute('aria-expanded', 'false');
  },

  bindLangSwitch() {
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => i18n.apply(btn.getAttribute('data-lang')));
    });
  },

  bindCtas() {
    document.querySelectorAll('[data-cta="register"]').forEach((el) => {
      el.addEventListener('click', () => {
        analytics.track('register_cta_click', { cta_location: el.getAttribute('data-cta-location') || 'unknown' });
        const first = document.querySelector('[data-lead-form] input, [data-lead-form] select');
        if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 500);
      });
    });
  },

  bindWhatsApp() {
    const wa = document.querySelector('[data-whatsapp]');
    if (!wa) return;
    wa.addEventListener('click', (e) => {
      if (wa.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      analytics.track('whatsapp_click', { source: 'persistent' });
    });
  },

  bindActiveLink() {
    const links = Array.from(document.querySelectorAll('[data-nav-link]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    byId.forEach((_, id) => { const sec = document.getElementById(id); if (sec) io.observe(sec); });
  }
};

/* ---------------------------------------------------------------------------
   models — horizontal slider controls (RTL-aware) + model_view tracking
   --------------------------------------------------------------------------- */
const models = {
  init() {
    this.viewport = document.querySelector('[data-models-viewport]');
    this.track = document.querySelector('[data-models-track]');
    this.controls = document.querySelector('[data-models-controls]');
    this.prev = document.querySelector('[data-models-prev]');
    this.next = document.querySelector('[data-models-next]');
    if (!this.viewport || !this.track) return;

    this.cards = Array.from(this.track.children);

    // Controls only make sense when content overflows the viewport.
    const overflows = this.track.scrollWidth > this.viewport.clientWidth + 4;
    if (overflows && this.controls) this.controls.hidden = false;

    if (this.prev) this.prev.addEventListener('click', () => this.scrollByCard(-1));
    if (this.next) this.next.addEventListener('click', () => this.scrollByCard(1));

    this.viewport.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    this.trackVisibleModel();
    this.refresh();

    window.__kgmModels = this; // allow i18n direction changes to refresh edges
  },

  step() {
    const card = this.cards[0];
    if (!card) return this.viewport.clientWidth;
    const gap = parseFloat(getComputedStyle(this.track).columnGap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  },

  // Direction-aware: in RTL, "next" advances toward negative scrollLeft.
  scrollByCard(dir) {
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';
    const amount = this.step() * dir * (rtl ? -1 : 1);
    this.viewport.scrollBy({ left: amount, behavior: 'smooth' });
  },

  onScroll() {
    window.clearTimeout(this._t);
    this._t = window.setTimeout(() => { this.refresh(); this.trackVisibleModel(); }, 120);
  },

  refresh() {
    if (!this.prev || !this.next) return;
    const max = this.track.scrollWidth - this.viewport.clientWidth - 2;
    const x = Math.abs(this.viewport.scrollLeft); // abs handles RTL negative offsets
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';
    const atStart = x <= 2;
    const atEnd = x >= max;
    // Map logical start/end to prev/next per direction.
    this.prev.disabled = rtl ? atEnd : atStart;
    this.next.disabled = rtl ? atStart : atEnd;
  },

  trackVisibleModel() {
    const mid = this.viewport.getBoundingClientRect().left + this.viewport.clientWidth / 2;
    let closest = null; let dist = Infinity;
    this.cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - mid);
      if (d < dist) { dist = d; closest = card; }
    });
    if (closest && closest !== this._lastTracked) {
      this._lastTracked = closest;
      const name = closest.querySelector('.model-card__name');
      analytics.track('model_view', { model_name: name ? name.textContent.trim() : 'unknown', method: 'scroll' });
    }
  }
};

/* ---------------------------------------------------------------------------
   reveal — scroll-in animation (reduced-motion aware)
   --------------------------------------------------------------------------- */
const reveal = {
  init() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }
};

/* ---------------------------------------------------------------------------
   leadForm — FILL → VALIDATE (client). NO submission backend is wired.
   Fields (brief §9): Name, Phone, Emirate, Model of interest, PDPL consent.
   --------------------------------------------------------------------------- */

// Pure validators — return true when the value is acceptable.
const validators = {
  name: (v) => v.trim().length >= 2,
  // Lenient, UAE-aware: strip spacing/punctuation, allow optional +, 7–15 digits.
  // NOTE: exact strictness is a decision to confirm (technical-architecture §7).
  phone: (v) => /^\+?\d{7,15}$/.test(v.replace(/[\s\-().]/g, '')),
  select: (v) => v !== '' && v != null,
  consent: (checked) => checked === true
};

const leadForm = {
  init() {
    this.form = document.querySelector('[data-lead-form]');
    if (!this.form) return;

    this.status = this.form.querySelector('[data-form-status]');
    this.honeypot = this.form.querySelector('[name="company"]');
    this.consent = this.form.querySelector('[name="consent"]');
    this.startTime = Date.now();
    this.state = 'idle';   // 'idle' | 'errors' | 'ok'
    this.interacted = false;

    // Field definitions: element + validator + message key.
    this.fields = [
      { name: 'name', el: this.form.querySelector('#lead-name'), test: (el) => validators.name(el.value) },
      { name: 'phone', el: this.form.querySelector('#lead-phone'), test: (el) => validators.phone(el.value) },
      { name: 'emirate', el: this.form.querySelector('#lead-emirate'), test: (el) => validators.select(el.value) },
      { name: 'model', el: this.form.querySelector('#lead-model'), test: (el) => validators.select(el.value) }
    ].filter((f) => f.el);

    this.bindStart();
    this.bindLiveValidation();
    this.form.addEventListener('submit', (e) => this.onSubmit(e));

    window.__kgmForm = this;
  },

  msg(key) { return FORM_MESSAGES[i18n.current][key]; },

  bindStart() {
    this.form.addEventListener('input', () => {
      if (this.interacted) return;
      this.interacted = true;
      const model = this.form.querySelector('[name="model"]');
      analytics.track('form_start', { model_prefilled: Boolean(model && model.value) });
    }, { passive: true });
  },

  // After a first submit, validate on blur and clear errors as the user corrects.
  bindLiveValidation() {
    this.fields.forEach((f) => {
      const revalidate = () => {
        if (this.state === 'idle') return;
        f.test(f.el) ? this.clearError(f.el) : this.setError(f.el, this.msg(f.name));
      };
      f.el.addEventListener('blur', revalidate);
      f.el.addEventListener('input', revalidate);
      f.el.addEventListener('change', revalidate);
    });
    if (this.consent) {
      this.consent.addEventListener('change', () => {
        if (this.state === 'idle') return;
        validators.consent(this.consent.checked)
          ? this.clearError(this.consent)
          : this.setError(this.consent, this.msg('consent'));
      });
    }
  },

  // Returns [{ name, input }] for every failing field, in DOM order.
  validateAll() {
    const errors = [];
    this.fields.forEach((f) => { if (!f.test(f.el)) errors.push({ name: f.name, input: f.el }); });
    if (this.consent && !validators.consent(this.consent.checked)) {
      errors.push({ name: 'consent', input: this.consent });
    }
    return errors;
  },

  onSubmit(e) {
    e.preventDefault();
    analytics.track('form_submit');

    // Spam: honeypot must stay empty (bots fill it) — drop silently.
    if (this.honeypot && this.honeypot.value.trim() !== '') return;

    // Spam: submissions faster than ~2s are treated as automated.
    if (Date.now() - this.startTime < 2000) {
      this.state = 'errors';
      this.showStatus(this.msg('tooFast'), 'error');
      return;
    }

    const errors = this.validateAll();
    if (errors.length) {
      this.state = 'errors';
      errors.forEach((err) => this.setError(err.input, this.msg(err.name)));
      // Clear any fields that are now valid.
      this.allInputs().forEach((el) => {
        if (!errors.some((er) => er.input === el)) this.clearError(el);
      });
      analytics.track('form_error', { error_fields: errors.map((er) => er.name) });
      this.showStatus(this.msg('summary')(errors.length), 'error');
      errors[0].input.focus({ preventScroll: false });
      return;
    }

    this.clearAllErrors();
    this.onValid();
  },

  onValid() {
    // No transport configured — do NOT fake a submission or fire generate_lead.
    if (!SUBMIT_ENDPOINT) {
      this.state = 'ok';
      this.showStatus(this.msg('notConfigured'), 'ok');
      return;
    }
    // Later phase: POST to SUBMIT_ENDPOINT, then on server-confirmed success
    // fire analytics.track('generate_lead', {...}) and show the success state.
  },

  /* --- error rendering + ARIA wiring --- */
  allInputs() {
    const list = this.fields.map((f) => f.el);
    if (this.consent) list.push(this.consent);
    return list;
  },

  errorEl(input) {
    if (!input.id) input.id = 'consent-field';
    const id = `${input.id}-error`;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('p');
      el.className = 'field__error';
      el.id = id;
      const field = input.closest('.field') || input.closest('.field--consent') || input.parentElement;
      field.appendChild(el);
    }
    return el;
  },

  setError(input, message) {
    const el = this.errorEl(input);
    el.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', el.id);
    (input.closest('.field') || input.closest('.field--consent'))?.classList.add('has-error');
  },

  clearError(input) {
    const el = document.getElementById(`${input.id}-error`);
    if (el) el.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    (input.closest('.field') || input.closest('.field--consent'))?.classList.remove('has-error');
  },

  clearAllErrors() { this.allInputs().forEach((el) => this.clearError(el)); },

  showStatus(text, type) {
    if (!this.status) return;
    this.status.hidden = false;
    this.status.classList.toggle('is-error', type === 'error');
    this.status.classList.toggle('is-ok', type === 'ok');
    this.status.textContent = text;
  },

  // Re-render visible messages in the active language (called by i18n on switch).
  refresh() {
    if (this.state === 'idle') return;
    if (this.state === 'ok') { this.showStatus(this.msg('notConfigured'), 'ok'); return; }
    const errors = this.validateAll();
    if (!errors.length) {
      this.clearAllErrors();
      this.state = 'idle';
      if (this.status) this.status.hidden = true;
      return;
    }
    errors.forEach((err) => this.setError(err.input, this.msg(err.name)));
    this.showStatus(this.msg('summary')(errors.length), 'error');
  }
};

/* ---------------------------------------------------------------------------
   boot
   --------------------------------------------------------------------------- */
function boot() {
  document.documentElement.classList.add('js');
  i18n.init();
  navigation.init();
  models.init();
  reveal.init();
  leadForm.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
