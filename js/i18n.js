// i18n.js — language state, EN/AR switching, RTL direction control.
// Plain script (no fetch, no ES modules) so it works under file:// with no server.
window.KGM = window.KGM || {};

(function () {
  const DICTS = { en: window.KGM_CONTENT_EN, ar: window.KGM_CONTENT_AR };
  let currentLang = window.KGM.CONFIG.DEFAULT_LANGUAGE;
  const listeners = [];

  function resolveKey(dict, key) {
    return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
  }

  function t(key) {
    const dict = DICTS[currentLang] || {};
    const val = resolveKey(dict, key);
    if (val === undefined) {
      console.warn(`[i18n] Missing key "${key}" for language "${currentLang}"`);
      return '';
    }
    return val;
  }

  function getLang() {
    return currentLang;
  }

  function getDir() {
    return currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  function onLanguageChange(fn) {
    listeners.push(fn);
  }

  function applyStrings() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val) el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      const val = t(key);
      if (val) el.setAttribute('aria-label', val);
    });
    document.title = t('meta.title') || document.title;
  }

  function switchLanguage(lang, opts) {
    opts = opts || {};
    if (lang !== 'en' && lang !== 'ar') return;
    const scrollRatio = document.documentElement.scrollTop /
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', getDir());
    applyStrings();
    document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
    });
    try {
      localStorage.setItem('kgm-lang', lang);
    } catch (e) { /* storage may be unavailable */ }
    requestAnimationFrame(() => {
      const target = scrollRatio * (document.documentElement.scrollHeight - window.innerHeight);
      if (Number.isFinite(target)) window.scrollTo({ top: target, behavior: 'auto' });
    });
    if (!opts.silent) listeners.forEach((fn) => fn(lang));
  }

  function initI18n() {
    let initial = window.KGM.CONFIG.DEFAULT_LANGUAGE;
    try {
      const stored = localStorage.getItem('kgm-lang');
      if (stored === 'en' || stored === 'ar') initial = stored;
    } catch (e) { /* ignore */ }
    switchLanguage(initial, { silent: true });
  }

  window.KGM.i18n = { t, getLang, getDir, onLanguageChange, switchLanguage, initI18n };
})();
