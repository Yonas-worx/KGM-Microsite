// form.js — orchestrates Register Interest:
// FILL → VALIDATE → NOTIFY.
window.KGM = window.KGM || {};

(function () {
  "use strict";

  const {
    validateRequired,
    validatePhone,
    validateSelection,
    validateConsent,
    validateHoneypot,
    validateMinTime,
  } = window.KGM.validation;

  let formStarted = false;
  let mountedAt = null;
  let pendingModelId = null;

  function t(key) {
    return window.KGM.i18n.t(key);
  }

  function setFieldError(fieldElement, errorElement, message) {
    const invalid = Boolean(message);

    fieldElement.setAttribute("data-invalid", String(invalid));

    if (errorElement) {
      errorElement.textContent = message || "";
    }

    const input = fieldElement.querySelector("input, select");

    if (input) {
      input.setAttribute("aria-invalid", String(invalid));
    }
  }

  function clearModelError(form) {
    if (!form) return;

    const fieldElement = form.querySelector('[data-field="model"]');

    const errorElement = form.querySelector('[data-error-for="model"]');

    if (fieldElement) {
      setFieldError(fieldElement, errorElement, "");
    }
  }

  function runValidation(form) {
    const errors = {};

    const name = form.elements.name.value;

    if (!validateRequired(name).valid) {
      errors.name = t("register.errors.name");
    }

    const phone = form.elements.phone.value;

    if (!validateRequired(phone).valid || !validatePhone(phone).valid) {
      errors.phone = t("register.errors.phone");
    }

    const emirate = form.elements.emirate.value;

    if (!validateSelection(emirate).valid) {
      errors.emirate = t("register.errors.emirate");
    }

    const model = form.elements.model.value;

    if (!validateSelection(model).valid) {
      errors.model = t("register.errors.model");
    }

    const consent = form.elements.consent.checked;

    if (!validateConsent(consent).valid) {
      errors.consent = t("register.errors.consent");
    }

    return errors;
  }

  function applyErrors(form, errors) {
    ["name", "phone", "emirate", "model", "consent"].forEach((name) => {
      const fieldElement = form.querySelector(`[data-field="${name}"]`);

      const errorElement = form.querySelector(`[data-error-for="${name}"]`);

      if (fieldElement) {
        setFieldError(fieldElement, errorElement, errors[name]);
      }
    });
  }

  async function submitPayload(payload) {
    const CONFIG = window.KGM.CONFIG;

    if (!CONFIG.SUBMIT_ENDPOINT) {
      return {
        ok: false,
        reason: "no_endpoint",
      };
    }

    try {
      const response = await fetch(CONFIG.SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return {
        ok: response.ok,
      };
    } catch (error) {
      return {
        ok: false,
        reason: "network",
      };
    }
  }

  function prefillModel(modelId) {
    if (!modelId) return false;

    pendingModelId = String(modelId);

    const form = document.getElementById("register-form");

    const select = document.querySelector(
      '#register-form select[name="model"]',
    );

    if (!select) {
      return false;
    }

    const matchingOption = [...select.options].find((option) => {
      return option.value === pendingModelId;
    });

    if (!matchingOption) {
      return false;
    }

    select.value = pendingModelId;

    /*
     * Trigger both events so any other form scripts
     * detect the selected model.
     */
    select.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );

    select.dispatchEvent(
      new Event("change", {
        bubbles: true,
      }),
    );

    clearModelError(form);

    return select.value === pendingModelId;
  }

  function applyPendingModel() {
    if (!pendingModelId) return;

    prefillModel(pendingModelId);
  }

  function initForm() {
    const form = document.getElementById("register-form");

    if (!form) return;

    const statusElement = document.getElementById("form-status");

    const submitButton = form.querySelector('[type="submit"]');

    mountedAt = Date.now();

    /*
     * Apply a model that may have been selected
     * before the form finished initializing.
     */
    applyPendingModel();

    form.addEventListener(
      "focusin",
      () => {
        if (formStarted) return;

        formStarted = true;

        window.KGM.analytics?.track("form_start", {
          model_prefilled: Boolean(form.elements.model.value),
        });
      },
      {
        once: true,
      },
    );

    form.elements.model?.addEventListener("change", () => {
      if (form.elements.model.value) {
        pendingModelId = form.elements.model.value;

        clearModelError(form);
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      window.KGM.analytics?.track("form_submit", {});

      const errors = runValidation(form);

      const honeypotField = form.elements.company_website;

      const honeypot = validateHoneypot(
        honeypotField ? honeypotField.value : "",
      );

      const timing = validateMinTime(mountedAt);

      if (Object.keys(errors).length > 0) {
        applyErrors(form, errors);

        window.KGM.analytics?.track("form_error", {
          error_fields: Object.keys(errors),
        });

        const firstInvalid = form.querySelector(
          '[data-invalid="true"] input, [data-invalid="true"] select',
        );

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }

      applyErrors(form, {});

      if (!honeypot.valid || !timing.valid) {
        if (statusElement) {
          statusElement.dataset.state = "success";

          statusElement.textContent = t("register.success");
        }

        form.reset();
        pendingModelId = null;

        return;
      }

      submitButton?.setAttribute("disabled", "true");

      if (submitButton) {
        submitButton.textContent = t("register.submitting");
      }

      if (statusElement) {
        statusElement.removeAttribute("data-state");

        statusElement.textContent = "";
      }

      const payload = {
        name: form.elements.name.value.trim(),

        phone: form.elements.phone.value.trim(),

        emirate: form.elements.emirate.value,

        model: form.elements.model.value,

        consent: {
          granted: true,
          timestamp: new Date().toISOString(),
          textVersion: "draft-v0",
        },

        analyticsConsent: window.KGM.consent.getConsent() === "accepted",

        source: "kgm-uae-microsite",
      };

      const result = await submitPayload(payload);

      submitButton?.removeAttribute("disabled");

      if (submitButton) {
        submitButton.textContent = t("register.submit");
      }

      if (result.ok) {
        if (statusElement) {
          statusElement.dataset.state = "success";

          statusElement.textContent = t("register.success");
        }

        window.KGM.analytics?.track("generate_lead", {
          model_of_interest: payload.model,

          emirate: payload.emirate,
        });

        form.reset();
        pendingModelId = null;
      } else if (result.reason === "no_endpoint") {
        if (statusElement) {
          statusElement.dataset.state = "success";

          statusElement.textContent =
            `${t("register.success")} ` + `(${t("register.endpointNotice")})`;
        }

        window.KGM.analytics?.track("generate_lead", {
          model_of_interest: payload.model,

          emirate: payload.emirate,

          staging: true,
        });

        form.reset();
        pendingModelId = null;
      } else {
        if (statusElement) {
          statusElement.dataset.state = "error";

          statusElement.textContent = t("register.error");
        }
      }
    });
  }

  window.KGM.form = {
    initForm,
    prefillModel,
    applyPendingModel,
  };
})();
