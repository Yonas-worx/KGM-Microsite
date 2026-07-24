// validation.js — pure validators. Return { valid: boolean }.

// Lenient UAE-aware pattern: optional +971/00971 or leading 0, then 9 digits
// starting 5 (mobile). Exact rule to be confirmed (technical-architecture §7).
const UAE_PHONE_RE = /^(?:\+971|00971|0)?5\d{8}$/;

export function validateRequired(value) {
  return { valid: typeof value === 'string' && value.trim().length > 0 };
}

export function validatePhone(value) {
  const clean = (value || '').replace(/[\s-]/g, '');
  return { valid: UAE_PHONE_RE.test(clean) };
}

export function validateSelection(value) {
  return { valid: typeof value === 'string' && value.trim().length > 0 };
}

export function validateConsent(checked) {
  return { valid: checked === true };
}

export function validateHoneypot(value) {
  // Honeypot must stay empty — a filled value indicates a bot.
  return { valid: !value };
}

export function validateMinTime(startedAt, minMs = 1500) {
  return { valid: !startedAt || (Date.now() - startedAt) >= minMs };
}
