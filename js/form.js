// form.js — orchestrates Register Interest: FILL → VALIDATE → NOTIFY.
import { CONFIG } from './config.js';
import { t } from './i18n.js';
import { track } from './analytics.js';
import { getConsent } from './consent.js';
import {
  validateRequired, validatePhone, validateSelection,
  validateConsent, validateHoneypot, validateMinTime,
} from './validation.js';

let formStarted = false;
let mountedAt = null;

function setFieldError(fieldEl, errorEl, message) {
  const invalid = Boolean(message);
  fieldEl.setAttribute('data-invalid', String(invalid));
  if (errorEl) errorEl.textContent = message || '';
  const input = fieldEl.querySelector('input, select');
  if (input) input.setAttribute('aria-invalid', String(invalid));
}

function runValidation(form) {
  const errors = {};

  const name = form.elements.name.value;
  if (!validateRequired(name).valid) errors.name = t('register.errors.name');

  const phone = form.elements.phone.value;
  if (!validateRequired(phone).valid || !validatePhone(phone).valid) errors.phone = t('register.errors.phone');

  const emirate = form.elements.emirate.value;
  if (!validateSelection(emirate).valid) errors.emirate = t('register.errors.emirate');

  const model = form.elements.model.value;
  if (!validateSelection(model).valid) errors.model = t('register.errors.model');

  const consent = form.elements.consent.checked;
  if (!validateConsent(consent).valid) errors.consent = t('register.errors.consent');

  return errors;
}

function applyErrors(form, errors) {
  ['name', 'phone', 'emirate', 'model', 'consent'].forEach((name) => {
    const fieldEl = form.querySelector(`[data-field="${name}"]`);
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    if (fieldEl) setFieldError(fieldEl, errorEl, errors[name]);
  });
}

async function submitPayload(payload) {
  if (!CONFIG.SUBMIT_ENDPOINT) {
    // CONTENT REQUIRED — brief §13 item 8. No backend invented; the form
    // is fully wired and will work the moment an endpoint is supplied.
    return { ok: false, reason: 'no_endpoint' };
  }
  try {
    const res = await fetch(CONFIG.SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  } catch (e) {
    return { ok: false, reason: 'network' };
  }
}

export function initForm() {
  const form = document.getElementById('register-form');
  if (!form) return;
  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('[type="submit"]');

  mountedAt = Date.now();

  form.addEventListener(
    'focusin',
    () => {
      if (formStarted) return;
      formStarted = true;
      track('form_start', { model_prefilled: Boolean(form.elements.model.value) });
    },
    { once: true },
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    track('form_submit', {});

    const errors = runValidation(form);
    const honeypot = validateHoneypot(form.elements.company_website?.value);
    const timing = validateMinTime(mountedAt);

    if (Object.keys(errors).length > 0) {
      applyErrors(form, errors);
      track('form_error', { error_fields: Object.keys(errors) });
      const firstInvalid = form.querySelector('[data-invalid="true"] input, [data-invalid="true"] select');
      firstInvalid?.focus();
      return;
    }
    applyErrors(form, {});

    if (!honeypot.valid || !timing.valid) {
      // Silently drop suspected bot submissions without alarming the user.
      statusEl.dataset.state = 'success';
      statusEl.textContent = t('register.success');
      form.reset();
      return;
    }

    submitBtn.setAttribute('disabled', 'true');
    submitBtn.textContent = t('register.submitting');
    statusEl.removeAttribute('data-state');
    statusEl.textContent = '';

    const payload = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      emirate: form.elements.emirate.value,
      model: form.elements.model.value,
      consent: { granted: true, timestamp: new Date().toISOString(), textVersion: 'draft-v0' },
      analyticsConsent: getConsent() === 'accepted',
      source: 'kgm-uae-microsite',
    };

    const result = await submitPayload(payload);

    submitBtn.removeAttribute('disabled');
    submitBtn.textContent = t('register.submit');

    if (result.ok) {
      statusEl.dataset.state = 'success';
      statusEl.textContent = t('register.success');
      track('generate_lead', { model_of_interest: payload.model, emirate: payload.emirate });
      form.reset();
    } else if (result.reason === 'no_endpoint') {
      // Build-stage transparency: submission is validated and payload-ready,
      // but no live endpoint is connected yet (CONTENT REQUIRED).
      statusEl.dataset.state = 'success';
      statusEl.textContent = `${t('register.success')} (${t('register.endpointNotice')})`;
      track('generate_lead', { model_of_interest: payload.model, emirate: payload.emirate, staging: true });
      form.reset();
    } else {
      statusEl.dataset.state = 'error';
      statusEl.textContent = t('register.error');
    }
  });
}

export function prefillModel(modelId) {
  const select = document.querySelector('#register-form select[name="model"]');
  if (select) select.value = modelId;
}
