// whatsapp.js — click-to-chat link builder. Number + message are
// CONTENT REQUIRED (brief §13 items 10, 11); wired here without inventing them.
import { CONFIG } from './config.js';
import { t } from './i18n.js';
import { track } from './analytics.js';

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function buildLink() {
  if (!CONFIG.WHATSAPP_NUMBER_E164) return null;
  const msg = encodeURIComponent(t('whatsapp.defaultMessage') || '');
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER_E164.replace('+', '')}?text=${msg}`;
}

export function initWhatsapp() {
  document.querySelectorAll('[data-whatsapp-trigger]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const link = buildLink();
      const source = el.getAttribute('data-whatsapp-trigger') || 'unknown';
      if (!link) {
        e.preventDefault();
        showToast(t('whatsapp.toastPending'));
        track('whatsapp_click', { source, status: 'pending_number' });
        return;
      }
      track('whatsapp_click', { source });
      el.setAttribute('href', link);
    });
  });
}
