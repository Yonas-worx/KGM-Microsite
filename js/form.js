// form.js — orchestrates Register Interest: FILL → VALIDATE → NOTIFY.
window.KGM = window.KGM || {};

(function () {
  const { validateRequired, validatePhone, validateSelection,
    validateConsent, validateHoneypot, validateMinTime } = window.KGM.validation;

  let formStarted = false;
  let mountedAt = null;

  function t(key) { return window.KGM.i18n.t(key); }

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
    const CONFIG = window.KGM.CONFIG;
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

  function initForm() {
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
        window.KGM.analytics.track('form_start', { model_prefilled: Boolean(form.elements.model.value) });
      },
      { once: true },
    );

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      window.KGM.analytics.track('form_submit', {});

      const errors = runValidation(form);
      const honeypotField = form.elements.company_website;
      const honeypot = validateHoneypot(honeypotField ? honeypotField.value : '');
      const timing = validateMinTime(mountedAt);

      if (Object.keys(errors).length > 0) {
        applyErrors(form, errors);
        window.KGM.analytics.track('form_error', { error_fields: Object.keys(errors) });
        const firstInvalid = form.querySelector('[data-invalid="true"] input, [data-invalid="true"] select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      applyErrors(form, {});

      if (!honeypot.valid || !timing.valid) {
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
        analyticsConsent: window.KGM.consent.getConsent() === 'accepted',
        source: 'kgm-uae-microsite',
      };

      const result = await submitPayload(payload);

      submitBtn.removeAttribute('disabled');
      submitBtn.textContent = t('register.submit');

      if (result.ok) {
        statusEl.dataset.state = 'success';
        statusEl.textContent = t('register.success');
        window.KGM.analytics.track('generate_lead', { model_of_interest: payload.model, emirate: payload.emirate });
        form.reset();
      } else if (result.reason === 'no_endpoint') {
        statusEl.dataset.state = 'success';
        statusEl.textContent = `${t('register.success')} (${t('register.endpointNotice')})`;
        window.KGM.analytics.track('generate_lead', { model_of_interest: payload.model, emirate: payload.emirate, staging: true });
        form.reset();
      } else {
        statusEl.dataset.state = 'error';
        statusEl.textContent = t('register.error');
      }
    });
  }

  function prefillModel(modelId) {
    const select = document.querySelector('#register-form select[name="model"]');
    if (select) select.value = modelId;
  }

  window.KGM.form = { initForm, prefillModel };
})();
