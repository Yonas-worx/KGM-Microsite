// consent.js — PDPL consent gate. Governs analytics; records the choice.
window.KGM = window.KGM || {};

(function () {
  const STORAGE_KEY = 'kgm-consent';
  let currentChoice = null;

  function getConsent() {
    return currentChoice;
  }

  function record(choice) {
    currentChoice = choice;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        choice,
        timestamp: new Date().toISOString(),
        // PDPL/consent wording is CONTENT REQUIRED (brief §13 item 12) — this
        // records only *that* a choice was made, not final legal text.
        textVersion: 'draft-v0',
      }));
    } catch (e) { /* storage may be unavailable */ }
    if (choice === 'accepted') window.KGM.analytics.grantConsent();
    else window.KGM.analytics.revokeConsent();
  }

  function initConsent() {
    const banner = document.getElementById('consent-banner');
    const acceptBtn = document.getElementById('consent-accept');
    const declineBtn = document.getElementById('consent-decline');
    if (!banner) return;

    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (e) { /* ignore */ }

    if (stored && stored.choice) {
      currentChoice = stored.choice;
      if (stored.choice === 'accepted') window.KGM.analytics.grantConsent();
      return;
    }

    requestAnimationFrame(() => banner.classList.add('is-visible'));

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      record('accepted');
      banner.classList.remove('is-visible');
    });
    if (declineBtn) declineBtn.addEventListener('click', () => {
      record('declined');
      banner.classList.remove('is-visible');
    });
  }

  window.KGM.consent = { getConsent, initConsent };
})();
