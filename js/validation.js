// validation.js — pure validators. Return { valid: boolean }.
window.KGM = window.KGM || {};

(function () {
  // Lenient UAE-aware pattern: optional +971/00971 or leading 0, then 9 digits
  // starting 5 (mobile). Exact rule to be confirmed (technical-architecture §7).
  const UAE_PHONE_RE = /^(?:\+971|00971|0)?5\d{8}$/;

  function validateRequired(value) {
    return { valid: typeof value === 'string' && value.trim().length > 0 };
  }

  function validatePhone(value) {
    const clean = (value || '').replace(/[\s-]/g, '');
    return { valid: UAE_PHONE_RE.test(clean) };
  }

  function validateSelection(value) {
    return { valid: typeof value === 'string' && value.trim().length > 0 };
  }

  function validateConsent(checked) {
    return { valid: checked === true };
  }

  function validateHoneypot(value) {
    return { valid: !value };
  }

  function validateMinTime(startedAt, minMs) {
    minMs = minMs || 1500;
    return { valid: !startedAt || (Date.now() - startedAt) >= minMs };
  }

  window.KGM.validation = {
    validateRequired, validatePhone, validateSelection,
    validateConsent, validateHoneypot, validateMinTime,
  };
})();
