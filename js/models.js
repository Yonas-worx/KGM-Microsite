// models.js — lineup-only smooth carousel update.
window.KGM = window.KGM || {};

(function () {
  "use strict";

  const AUTOPLAY_SPEED = 28;
  const RESUME_DELAY = 900;

  let allModels = [];
  let visibleModels = [];
  let activeFilter = "all";
  let trackEl = null;

  let offset = 0;
  let animationFrame = null;
  let previousTime = null;
  let autoplayPaused = false;
  let resumeTimer = null;

  let dragging = false;
  let pointerStartX = 0;
  let dragStartOffset = 0;

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

  function getModelType(model) {
    const category = String(model.category || "").toLowerCase();
    return category.includes("pickup") ? "pickup" : "suv";
  }

  function renderSlide(model, index) {
    const name = escapeHtml(model.name);
    const id = escapeHtml(model.id);
    const image = escapeHtml(model.image);

    return `
      <article
        class="model-slide"
        data-model-id="${id}"
        data-index="${index}"
        role="group"
        aria-roledescription="slide"
        aria-label="${name}"
      >
        <img
          class="model-slide__image"
          src="${image}"
          alt="${name}"
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

  function cardWidth(card) {
    if (!card || !trackEl) return 0;

    const trackStyle = getComputedStyle(trackEl);
    const gap =
      parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;

    return card.getBoundingClientRect().width + gap;
  }

  function applyTransform() {
    if (!trackEl) return;
    trackEl.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  function recycleForward() {
    if (!trackEl || visibleModels.length < 2) return;

    let firstCard = trackEl.firstElementChild;
    let width = cardWidth(firstCard);

    while (firstCard && width > 0 && offset >= width) {
      offset -= width;
      trackEl.appendChild(firstCard);

      firstCard = trackEl.firstElementChild;
      width = cardWidth(firstCard);
    }
  }

  function recycleBackward() {
    if (!trackEl || visibleModels.length < 2) return;

    while (offset < 0) {
      const lastCard = trackEl.lastElementChild;
      if (!lastCard) break;

      trackEl.insertBefore(lastCard, trackEl.firstElementChild);
      offset += cardWidth(lastCard);
    }
  }

  function normalizePosition() {
    recycleForward();
    recycleBackward();
    applyTransform();
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
      !dragging &&
      !reduceMotion() &&
      visibleModels.length > 1
    ) {
      offset += AUTOPLAY_SPEED * (elapsed / 1000);
      normalizePosition();
    }

    animationFrame = requestAnimationFrame(autoplayFrame);
  }

  function startAutoplay() {
    if (animationFrame !== null) return;
    previousTime = null;
    animationFrame = requestAnimationFrame(autoplayFrame);
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

  function moveByCard(direction) {
    if (!trackEl || visibleModels.length < 2) return;

    pauseAutoplay();

    const firstCard = trackEl.firstElementChild;
    const distance = cardWidth(firstCard);
    const start = offset;
    const target = start + distance * direction;
    const duration = reduceMotion() ? 0 : 420;
    const startedAt = performance.now();

    function step(now) {
      const progress =
        duration === 0 ? 1 : Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      offset = start + (target - start) * eased;
      normalizePosition();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resumeAutoplay(RESUME_DELAY);
      }
    }

    requestAnimationFrame(step);
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

  function renderCurrentFilter() {
    visibleModels =
      activeFilter === "all"
        ? [...allModels]
        : allModels.filter((model) => getModelType(model) === activeFilter);

    if (!trackEl) return;

    offset = 0;
    trackEl.innerHTML = visibleModels
      .map((model, index) => renderSlide(model, index))
      .join("");

    applyTransform();
    previousTime = null;
    populateModelSelect(allModels);
    startAutoplay();
  }

  function setFilter(filter) {
    if (!["all", "suv", "pickup"].includes(filter)) return;

    activeFilter = filter;

    document.querySelectorAll("[data-model-filter]").forEach((button) => {
      const isActive = button.dataset.modelFilter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    renderCurrentFilter();
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

  function beginDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;

    dragging = true;
    pointerStartX = event.clientX;
    dragStartOffset = offset;
    pauseAutoplay();

    trackEl.classList.add("is-dragging");
    trackEl.setPointerCapture?.(event.pointerId);
  }

  function updateDrag(event) {
    if (!dragging) return;

    offset = dragStartOffset - (event.clientX - pointerStartX);
    normalizePosition();
  }

  function endDrag(event) {
    if (!dragging) return;

    dragging = false;
    trackEl.classList.remove("is-dragging");
    trackEl.releasePointerCapture?.(event.pointerId);
    resumeAutoplay(RESUME_DELAY);
  }

  function bindEvents() {
    document.getElementById("model-prev")?.addEventListener("click", () => {
      moveByCard(-1);
    });

    document.getElementById("model-next")?.addEventListener("click", () => {
      moveByCard(1);
    });

    document.querySelectorAll("[data-model-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        setFilter(button.dataset.modelFilter);
      });
    });

    trackEl.addEventListener("click", handleModelSelection);

    trackEl.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveByCard(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveByCard(1);
      }
    });

    trackEl.addEventListener("pointerdown", beginDrag);
    trackEl.addEventListener("pointermove", updateDrag);
    trackEl.addEventListener("pointerup", endDrag);
    trackEl.addEventListener("pointercancel", endDrag);

    trackEl.addEventListener("pointerenter", pauseAutoplay);
    trackEl.addEventListener("pointerleave", () => {
      if (!dragging) resumeAutoplay();
    });

    trackEl.addEventListener("focusin", pauseAutoplay);
    trackEl.addEventListener("focusout", () => resumeAutoplay());

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
