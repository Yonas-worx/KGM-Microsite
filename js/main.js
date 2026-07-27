// main.js — boot sequence. Plain script (no ES modules, no fetch) so the
// site works by simply opening index.html — no local server required.
window.KGM = window.KGM || {};

(function () {
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const panel = document.getElementById('mobile-nav');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  function initLangSwitch() {
    document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang-btn');
        const from = window.KGM.i18n.getLang();
        window.KGM.i18n.switchLanguage(lang);
        window.KGM.analytics.track('language_switch', { from_language: from, to_language: lang });
      });
    });
  }

  function initRegisterCtaTracking() {
    document.querySelectorAll('[data-register-cta]').forEach((el) => {
      el.addEventListener('click', () => {
        window.KGM.analytics.track('register_cta_click', { cta_location: el.getAttribute('data-register-cta') });
      });
    });
  }

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  function initJourneyThread() {
    const stages = document.querySelectorAll('.journey-thread__stage');
    const sections = ['hero', 'models', 'showrooms', 'register']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!stages.length || !sections.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target);
          stages.forEach((s, i) => s.classList.toggle('is-active', i === idx));
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => io.observe(s));
  }

  function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (mql.matches) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }

    const play = () => video.play().catch(() => {});
    video.addEventListener('canplay', play, { once: true });
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      play();
    });
    if (video.readyState >= 3) play();
  }

  function boot() {
    window.KGM.i18n.initI18n();

    const models = window.KGM_MODELS || [];
    const showrooms = window.KGM_SHOWROOMS || [];

    window.KGM.models.renderModels(models);
    window.KGM.showrooms.renderShowrooms(showrooms);
    window.KGM.models.populateModelSelect(models);

    window.KGM.form.initForm();
    window.KGM.consent.initConsent();
    window.KGM.whatsapp.initWhatsapp();
    initHeaderScroll();
    initMobileNav();
    initLangSwitch();
    initRegisterCtaTracking();
    initReveal();
    initJourneyThread();
    initHeroVideo();

    window.KGM.i18n.onLanguageChange(() => {
      window.KGM.models.reflowOnLanguageChange();
      window.KGM.models.populateModelSelect(models);
      window.KGM.showrooms.renderShowrooms(showrooms);
    });

    document.body.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
