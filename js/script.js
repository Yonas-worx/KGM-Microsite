/* =============================================================================
   KGM UAE Microsite — Foundation Script (ES module)
   Sources: docs/technical-architecture.md (§4, §6, §10)

   Scope of THIS foundation:
   - language state + EN/AR switching (html lang/dir)
   - navigation behavior (scroll state, mobile menu)
   - Register Interest CTA behavior
   - basic GA4 event hooks (consent-gated stub, no Measurement ID)
   - scroll-reveal (reduced-motion aware)

   Deliberately NOT implemented here (later phases):
   - form validation + submission transport (NO backend / endpoint invented)
   - real content loading, model/gallery/showroom data rendering
   - map + WhatsApp links (CONTENT REQUIRED: number, coordinates, provider)

   CONTENT NOTE: the Arabic strings below are WORKING PLACEHOLDERS for UI chrome
   only, so the switcher and RTL layout are demonstrable. ALL final copy (EN and
   professional AR translation) is CONTENT REQUIRED (project-brief §13). Marketing
   copy is intentionally left as visible [CONTENT REQUIRED] placeholders in the DOM.
   ========================================================================== */

'use strict';

/* ---------------------------------------------------------------------------
   i18n — language state + EN/AR switching
   Only structural UI chrome is translated here. data-i18n keys map to strings.
   --------------------------------------------------------------------------- */
const STRINGS = {
  en: {
    'a11y.skip': 'Skip to content',
    'nav.menu': 'Menu',
    'nav.models': 'Models',
    'nav.gallery': 'Gallery',
    'nav.showrooms': 'Showrooms',
    'nav.register': 'Register',
    'cta.register': 'Register Interest',
    'hero.title': 'KGM is in the UAE',
    'hero.sub': '[CONTENT REQUIRED: hero supporting line]',
    'hero.explore': 'Explore the models',
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
    'register.lead': '[CONTENT REQUIRED: short supporting line]',
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
    'nav.menu': 'القائمة',
    'nav.models': 'الطُّرُز',
    'nav.gallery': 'المعرض',
    'nav.showrooms': 'صالات العرض',
    'nav.register': 'التسجيل',
    'cta.register': 'سجّل اهتمامك',
    'hero.title': 'KGM في الإمارات',
    'hero.sub': '[محتوى مطلوب: سطر داعم للواجهة]',
    'hero.explore': 'استكشف الطُّرُز',
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
    'register.lead': '[محتوى مطلوب: سطر داعم قصير]',
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
// URL/language strategy is NOT YET CONFIRMED (technical-architecture §6).
// Foundation reads a saved preference only; no URL scheme is assumed.
const STORAGE_KEY = 'kgm-lang';

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

    // Apply chrome strings
    const dict = STRINGS[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    // Reflect active state on the switcher
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }

    if (!silent && from !== lang) {
      analytics.track('language_switch', { from_language: from, to_language: lang });
    }
  }
};

/* ---------------------------------------------------------------------------
   analytics — GA4 wrapper (consent-gated STUB)
   No Measurement ID is set (CONTENT REQUIRED). Events are queued/logged only;
   nothing is sent until GA4 + PDPL consent are configured in a later phase.
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
    // Consent gate: do not dispatch to GA4 until consent is granted.
    if (!this.consentGranted) {
      if (window.console) console.debug('[analytics:queued]', event, payload);
      return;
    }
    // When configured: window.gtag && window.gtag('event', event, payload);
    if (window.console) console.debug('[analytics:event]', event, payload);
  }
};

/* ---------------------------------------------------------------------------
   navigation — scroll state, mobile menu, language switch, CTA hooks
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
  },

  bindScrollState() {
    if (!this.header) return;
    const onScroll = () => {
      this.header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  },

  bindMobileMenu() {
    if (!this.toggle || !this.list) return;
    this.toggle.addEventListener('click', () => {
      const open = this.list.classList.toggle('is-open');
      this.toggle.setAttribute('aria-expanded', String(open));
    });
    // Close the menu after choosing a destination
    this.list.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => this.closeMenu());
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });
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
        analytics.track('register_cta_click', {
          cta_location: el.getAttribute('data-cta-location') || 'unknown'
        });
        // Move focus to the form for keyboard users after the anchor scroll.
        const form = document.querySelector('[data-lead-form] input, [data-lead-form] select');
        if (form) window.setTimeout(() => form.focus({ preventScroll: true }), 500);
      });
    });
  },

  bindWhatsApp() {
    // Link is disabled until number + default message are confirmed (CONTENT REQUIRED).
    const wa = document.querySelector('[data-whatsapp]');
    if (!wa) return;
    wa.addEventListener('click', (e) => {
      if (wa.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      analytics.track('whatsapp_click', { source: 'persistent' });
    });
  }
};

/* ---------------------------------------------------------------------------
   reveal — scroll-in animation (IntersectionObserver, reduced-motion aware)
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
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }
};

/* ---------------------------------------------------------------------------
   form — foundation hooks only (NO submission backend)
   Fires form_start; blocks submit with an honest "not configured" status.
   Full validation + transport arrive in a later phase.
   --------------------------------------------------------------------------- */
const leadForm = {
  init() {
    this.form = document.querySelector('[data-lead-form]');
    if (!this.form) return;
    this.status = this.form.querySelector('[data-form-status]');

    let started = false;
    this.form.addEventListener('input', () => {
      if (!started) {
        started = true;
        analytics.track('form_start', {
          model_prefilled: Boolean(this.form.querySelector('[name="model"]').value)
        });
      }
    }, { once: false });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault(); // No endpoint is configured — do not fake a submission.
      if (this.status) {
        this.status.hidden = false;
        this.status.textContent =
          'Submission endpoint not yet configured (CONTENT REQUIRED).';
      }
    });
  }
};

/* ---------------------------------------------------------------------------
   boot
   --------------------------------------------------------------------------- */
function boot() {
  document.documentElement.classList.add('js');
  i18n.init();
  navigation.init();
  reveal.init();
  leadForm.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
