// whatsapp.js — click-to-chat link builder. Number + message are
// CONTENT REQUIRED (brief §13 items 10, 11); wired here without inventing them.
window.KGM = window.KGM || {};

(function () {
  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function buildLink() {
    const CONFIG = window.KGM.CONFIG;
    if (!CONFIG.WHATSAPP_NUMBER_E164) return null;
    const msg = encodeURIComponent(window.KGM.i18n.t('whatsapp.defaultMessage') || '');
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER_E164.replace('+', '')}?text=${msg}`;
  }

  function initWhatsapp() {
    document.querySelectorAll('[data-whatsapp-trigger]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const link = buildLink();
        const source = el.getAttribute('data-whatsapp-trigger') || 'unknown';
        if (!link) {
          e.preventDefault();
          showToast(window.KGM.i18n.t('whatsapp.toastPending'));
          window.KGM.analytics.track('whatsapp_click', { source, status: 'pending_number' });
          return;
        }
        window.KGM.analytics.track('whatsapp_click', { source });
        el.setAttribute('href', link);
      });
    });
  }

  window.KGM.whatsapp = { initWhatsapp };
})();
