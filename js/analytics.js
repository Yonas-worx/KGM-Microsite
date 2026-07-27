// analytics.js — GA4 wrapper. No-ops until consent is granted AND a
// Measurement ID is configured (CONTENT REQUIRED — see config.js).
window.KGM = window.KGM || {};

(function () {
  const CONFIG = window.KGM.CONFIG;
  let consentGranted = false;
  let gaLoaded = false;

  function loadGaScript() {
    if (gaLoaded || !CONFIG.GA4_MEASUREMENT_ID) return;
    gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA4_MEASUREMENT_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.GA4_MEASUREMENT_ID, { send_page_view: true });
  }

  function grantConsent() {
    consentGranted = true;
    loadGaScript();
  }

  function revokeConsent() {
    consentGranted = false;
  }

  function track(event, params) {
    params = params || {};
    const payload = { language: window.KGM.i18n.getLang(), page_direction: window.KGM.i18n.getDir(), ...params };
    if (!consentGranted || !CONFIG.GA4_MEASUREMENT_ID) {
      // Staged/no-op: log to console only so the event map can be verified
      // during build without a live Measurement ID (CONTENT REQUIRED).
      console.debug('[analytics:noop]', event, payload);
      return;
    }
    if (window.gtag) window.gtag('event', event, payload);
  }

  window.KGM.analytics = { grantConsent, revokeConsent, track };
})();
