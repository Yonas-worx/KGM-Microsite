// models.js — seamless, continuous KGM lineup carousel.
window.KGM = window.KGM || {};

(function () {
  "use strict";

  const AUTOPLAY_SPEED = 26;
  const RESUME_DELAY = 900;

  let allModels = [];
  let visibleModels = [];
  let activeFilter = "suv";
  let trackEl = null;
  let animationFrame = null;
  let previousTime = null;
  let loopWidth = 0;
  let autoplayPaused = false;
  let resumeTimer = null;
  let resizeTimer = null;

  function t(key) {
    return window.KGM.i18n.t(key);
  }

  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderSlide(model, index, duplicate) {
    const name = escapeHtml(model.name);
    const id = escapeHtml(model.id);
    const image = escapeHtml(model.image);

    return `
      <article
        class="model-slide"
        data-model-id="${id}"
        data-index="${index}"
        ${duplicate ? 'aria-hidden="true"' : ""}
        role="group"
        aria-roledescription="slide"
        aria-label="${name}"
      >
        <img
          class="model-slide__image"
          src="${image}"
          alt="${duplicate ? "" : name}"
          loading="${index < 4 ? "eager" : "lazy"}"
          decoding="async"
          draggable="false"
        />

        <span class="model-slide__shade" aria-hidden="true"></span>

        <div class="model-slide__content">
          <h3 class="model-slide__name">${name}</h3>

          <button
            type="button"
            class="model-slide__link"
            data-select-model="${id}"
          >
            ${escapeHtml(t("models.cta"))}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    `;
  }

  function measureLoop() {
    if (!trackEl || visibleModels.length < 2) {
      loopWidth = 0;
      return;
    }

    loopWidth = trackEl.scrollWidth / 2;
  }

  function normalizePosition() {
    if (!trackEl || loopWidth <= 0) return;

    while (trackEl.scrollLeft >= loopWidth) {
      trackEl.scrollLeft -= loopWidth;
    }

    while (trackEl.scrollLeft < 0) {
      trackEl.scrollLeft += loopWidth;
    }
  }

  function renderCurrentFilter() {
    visibleModels = allModels.filter((model) => model.type === activeFilter);

    if (!trackEl) return;

    stopAutoplay();

    const originalSlides = visibleModels
      .map((model, index) => renderSlide(model, index, false))
      .join("");

    const duplicateSlides =
      visibleModels.length > 1
        ? visibleModels
            .map((model, index) => renderSlide(model, index, true))
            .join("")
        : "";

    trackEl.innerHTML = originalSlides + duplicateSlides;
    trackEl.scrollLeft = 0;

    requestAnimationFrame(() => {
      measureLoop();
      previousTime = null;
      startAutoplay();
    });

    populateModelSelect(allModels);
  }

  function setFilter(filter) {
    if (filter !== "suv" && filter !== "pickup") return;

    activeFilter = filter;

    document.querySelectorAll("[data-model-filter]").forEach((button) => {
      const isActive = button.dataset.modelFilter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    renderCurrentFilter();
  }

  function cardStep() {
    const card = trackEl?.querySelector(".model-slide");
    if (!card) return 320;

    const style = getComputedStyle(trackEl);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;

    return card.getBoundingClientRect().width + gap;
  }

  function autoplayFrame(timestamp) {
    if (!trackEl) return;

    if (previousTime === null) {
      previousTime = timestamp;
    }

    const elapsed = Math.min(timestamp - previousTime, 50);
    previousTime = timestamp;

    if (
      !autoplayPaused &&
      !reduceMotion() &&
      visibleModels.length > 1 &&
      loopWidth > 0
    ) {
      trackEl.scrollLeft += AUTOPLAY_SPEED * (elapsed / 1000);
      normalizePosition();
    }

    animationFrame = requestAnimationFrame(autoplayFrame);
  }

  function startAutoplay() {
    if (animationFrame !== null) return;

    previousTime = null;
    animationFrame = requestAnimationFrame(autoplayFrame);
  }

  function stopAutoplay() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    previousTime = null;
  }

  function pauseAutoplay() {
    autoplayPaused = true;
    previousTime = null;
    window.clearTimeout(resumeTimer);
  }

  function resumeAutoplay(delay = 0) {
    window.clearTimeout(resumeTimer);

    resumeTimer = window.setTimeout(() => {
      autoplayPaused = false;
      previousTime = null;
    }, delay);
  }

  function scrollByCards(direction) {
    if (!trackEl || visibleModels.length === 0) return;

    if (direction < 0 && trackEl.scrollLeft <= 1 && loopWidth > 0) {
      trackEl.scrollLeft += loopWidth;
    }

    trackEl.scrollBy({
      left: cardStep() * direction,
      behavior: reduceMotion() ? "auto" : "smooth",
    });
  }

  function populateModelSelect(data) {
    const select = document.querySelector(
      '#register-form select[name="model"]',
    );

    if (!select) return;

    const currentValue = select.value;
    const placeholderText =
      select.querySelector('option[value=""]')?.textContent ||
      t("register.fields.modelPlaceholder");

    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = placeholderText;
    select.appendChild(placeholder);

    [...data]
      .sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
      )
      .forEach((model) => {
        const option = document.createElement("option");
        option.value = model.id;
        option.textContent = model.name;
        select.appendChild(option);
      });

    if ([...select.options].some((option) => option.value === currentValue)) {
      select.value = currentValue;
    }
  }

  function handleModelSelection(event) {
    const button = event.target.closest("[data-select-model]");
    if (!button) return;

    const id = button.dataset.selectModel;

    window.KGM.form?.prefillModel(id);
    window.KGM.analytics?.track("register_cta_click", {
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
  }

  function bindEvents() {
    document.getElementById("model-prev")?.addEventListener("click", () => {
      pauseAutoplay();
      scrollByCards(-1);
      resumeAutoplay(RESUME_DELAY);
    });

    document.getElementById("model-next")?.addEventListener("click", () => {
      pauseAutoplay();
      scrollByCards(1);
      resumeAutoplay(RESUME_DELAY);
    });

    document.querySelectorAll("[data-model-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        setFilter(button.dataset.modelFilter);
      });
    });

    trackEl.addEventListener("scroll", normalizePosition, { passive: true });

    trackEl.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      pauseAutoplay();
      scrollByCards(event.key === "ArrowRight" ? 1 : -1);
      resumeAutoplay(RESUME_DELAY);
    });

    trackEl.addEventListener("click", handleModelSelection);

    trackEl.addEventListener("pointerenter", pauseAutoplay);
    trackEl.addEventListener("pointerleave", () => resumeAutoplay());
    trackEl.addEventListener("pointerdown", pauseAutoplay);
    trackEl.addEventListener("pointerup", () => resumeAutoplay(RESUME_DELAY));
    trackEl.addEventListener("touchstart", pauseAutoplay, { passive: true });
    trackEl.addEventListener(
      "touchend",
      () => resumeAutoplay(RESUME_DELAY),
      { passive: true },
    );
    trackEl.addEventListener("focusin", pauseAutoplay);
    trackEl.addEventListener("focusout", () => resumeAutoplay());

    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measureLoop();
        normalizePosition();
      }, 150);
    });

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
