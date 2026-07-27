// models.js — smooth filtered lineup rail with continuous autoplay.
window.KGM = window.KGM || {};

(function () {
  let allModels = [];
  let visibleModels = [];
  let activeFilter = "suv";
  let trackEl = null;
  let animationFrame = null;
  let previousTime = null;
  let scrollTimer = null;
  let autoplayPaused = false;

  const AUTOPLAY_SPEED = 24;

  function t(key) {
    return window.KGM.i18n.t(key);
  }

  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isRtl() {
    return window.KGM.i18n.getDir() === "rtl";
  }

  function renderSlide(model, index, duplicate) {
    return `
      <article
        class="model-slide"
        data-model-id="${model.id}"
        data-index="${index}"
        ${duplicate ? 'aria-hidden="true"' : ""}
        role="group"
        aria-roledescription="slide"
        aria-label="${model.name}"
      >
        <img
          class="model-slide__image"
          src="${model.image}"
          alt="${duplicate ? "" : model.name}"
          loading="${index < 4 ? "eager" : "lazy"}"
          decoding="async"
        >

        <span class="model-slide__shade" aria-hidden="true"></span>

        <div class="model-slide__content">
          <h3 class="model-slide__name">${model.name}</h3>

          <button
            type="button"
            class="model-slide__link"
            data-select-model="${model.id}"
          >
            ${t("models.cta")}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    `;
  }

  function renderCurrentFilter() {
    visibleModels = allModels.filter((model) => model.type === activeFilter);

    if (!trackEl) return;

    const firstCopy = visibleModels
      .map((model, index) => renderSlide(model, index, false))
      .join("");

    const secondCopy =
      visibleModels.length > 1
        ? visibleModels
            .map((model, index) => renderSlide(model, index, true))
            .join("")
        : "";

    trackEl.innerHTML = firstCopy + secondCopy;

    trackEl.scrollTo({
      left: 0,
      behavior: "auto",
    });

    previousTime = null;

    populateModelSelect(allModels);
    startContinuousAutoplay();
  }

  function setFilter(filter) {
    if (filter !== "suv" && filter !== "pickup") return;

    activeFilter = filter;

    document.querySelectorAll("[data-model-filter]").forEach((button) => {
      const active = button.dataset.modelFilter === filter;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    renderCurrentFilter();
  }

  function cardStep() {
    const card = trackEl?.querySelector(".model-slide");

    if (!card) return 320;

    const gap = parseFloat(getComputedStyle(trackEl).gap || "0") || 0;

    return card.getBoundingClientRect().width + gap;
  }

  function originalTrackWidth() {
    if (!trackEl || visibleModels.length < 2) return 0;

    return trackEl.scrollWidth / 2;
  }

  function normalizedScroll() {
    if (!trackEl) return 0;

    return Math.abs(trackEl.scrollLeft);
  }

  function resetLoopIfNeeded() {
    if (!trackEl || visibleModels.length < 2) return;

    const loopWidth = originalTrackWidth();
    const current = normalizedScroll();

    if (current >= loopWidth) {
      const overflow = current - loopWidth;
      const direction = isRtl() ? -1 : 1;

      trackEl.scrollTo({
        left: overflow * direction,
        behavior: "auto",
      });
    }
  }

  function continuousAutoplay(timestamp) {
    if (!trackEl) return;

    if (previousTime === null) {
      previousTime = timestamp;
    }

    const elapsed = timestamp - previousTime;
    previousTime = timestamp;

    if (!autoplayPaused && !reduceMotion() && visibleModels.length > 1) {
      const direction = isRtl() ? -1 : 1;
      const movement = AUTOPLAY_SPEED * (elapsed / 1000);

      trackEl.scrollLeft += movement * direction;

      resetLoopIfNeeded();
    }

    animationFrame = window.requestAnimationFrame(continuousAutoplay);
  }

  function startContinuousAutoplay() {
    if (animationFrame) return;

    previousTime = null;
    animationFrame = window.requestAnimationFrame(continuousAutoplay);
  }

  function pauseAutoplay() {
    autoplayPaused = true;
  }

  function resumeAutoplay() {
    autoplayPaused = false;
    previousTime = null;
  }

  function scrollByCards(direction) {
    if (!trackEl) return;

    const directionSign = isRtl() ? -1 : 1;

    trackEl.scrollBy({
      left: cardStep() * direction * directionSign,
      behavior: reduceMotion() ? "auto" : "smooth",
    });
  }

  function populateModelSelect(data) {
    const select = document.querySelector(
      '#register-form select[name="model"]',
    );

    if (!select) return;

    const current = select.value;
    const placeholder = select.querySelector('option[value=""]');

    const sorted = [...data].sort((a, b) =>
      a.name.localeCompare(b.name, "en", {
        sensitivity: "base",
      }),
    );

    select.innerHTML = "";

    if (placeholder) {
      select.appendChild(placeholder);
    }

    sorted.forEach((model) => {
      const option = document.createElement("option");

      option.value = model.id;
      option.textContent = model.name;

      select.appendChild(option);
    });

    if ([...select.options].some((option) => option.value === current)) {
      select.value = current;
    }
  }

  function bindEvents() {
    document.getElementById("model-prev")?.addEventListener("click", () => {
      pauseAutoplay();
      scrollByCards(-1);

      window.setTimeout(resumeAutoplay, 900);
    });

    document.getElementById("model-next")?.addEventListener("click", () => {
      pauseAutoplay();
      scrollByCards(1);

      window.setTimeout(resumeAutoplay, 900);
    });

    document.querySelectorAll("[data-model-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        setFilter(button.dataset.modelFilter);
      });
    });

    trackEl.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(scrollTimer);

        scrollTimer = window.setTimeout(resetLoopIfNeeded, 80);
      },
      { passive: true },
    );

    trackEl.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();
      pauseAutoplay();

      scrollByCards(event.key === "ArrowRight" ? 1 : -1);

      window.setTimeout(resumeAutoplay, 900);
    });

    trackEl.addEventListener("click", (event) => {
      const button = event.target.closest("[data-select-model]");

      if (!button) return;

      const id = button.dataset.selectModel;

      window.KGM.form.prefillModel(id);

      window.KGM.analytics.track("register_cta_click", {
        cta_location: "model_card",
        model_name: id,
      });

      document.getElementById("register")?.scrollIntoView({
        behavior: reduceMotion() ? "auto" : "smooth",
        block: "start",
      });

      window.setTimeout(() => {
        document
          .querySelector('#register-form [name="name"]')
          ?.focus({ preventScroll: true });
      }, 550);
    });

    trackEl.addEventListener("pointerenter", pauseAutoplay);
    trackEl.addEventListener("pointerleave", resumeAutoplay);
    trackEl.addEventListener("focusin", pauseAutoplay);
    trackEl.addEventListener("focusout", resumeAutoplay);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseAutoplay();
      } else {
        resumeAutoplay();
      }
    });
  }

  function renderModels(data) {
    allModels = Array.isArray(data) ? data : [];

    trackEl = document.getElementById("model-track");

    if (!trackEl) return;

    bindEvents();
    renderCurrentFilter();
  }

  function reflowOnLanguageChange() {
    if (!trackEl) return;

    renderCurrentFilter();
  }

  window.KGM.models = {
    renderModels,
    populateModelSelect,
    reflowOnLanguageChange,
    setFilter,
  };
})();
