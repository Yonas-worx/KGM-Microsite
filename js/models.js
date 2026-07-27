// models.js — renders The Models carousel from data/models.js.
window.KGM = window.KGM || {};

(function () {
  "use strict";

  let modelsData = [];
  let trackEl = null;
  let dotsEl = null;

  function t(key) {
    return window.KGM.i18n.t(key);
  }

  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function statRow(model) {
    return model.keyNumbers
      .map((kn) => {
        const value = kn && kn.value ? kn.value : "—";
        const label = kn && kn.label ? kn.label : t("models.contentRequired");

        return `
          <div class="stat">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${label}</div>
          </div>
        `;
      })
      .join("");
  }

  function renderSlide(model, index) {
    const desc = model.description
      ? `<p class="model-slide__desc">${model.description}</p>`
      : `
        <p class="model-slide__desc content-required-tag">
          ${t("models.contentRequired")}
        </p>
      `;

    return `
      <article
        class="model-slide"
        data-model-id="${model.id}"
        data-index="${index}"
        role="group"
        aria-roledescription="slide"
        aria-label="${model.name}"
      >
        <div class="model-slide__media">
          <span
            class="model-slide__ground"
            aria-hidden="true"
          ></span>

          <img
            src="${model.image}"
            alt="${model.name}"
            loading="${index === 0 ? "eager" : "lazy"}"
            width="900"
            height="600"
            draggable="false"
          >
        </div>

        <div class="model-slide__body">
          <div class="model-slide__eyebrow-row">
            <span class="model-slide__category">
              ${model.category || t("models.contentRequired")}
            </span>
          </div>

          <h3 class="model-slide__name">
            ${model.name}
          </h3>

          ${desc}

          <div class="model-stat-row">
            ${statRow(model)}
          </div>

          <div class="model-slide__actions">
            <button
              type="button"
              class="btn btn--primary"
              data-select-model="${model.id}"
            >
              ${t("models.cta")}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function goToIndex(index, behavior) {
    if (!trackEl) return;

    const scrollBehavior = behavior || "smooth";
    const slides = trackEl.querySelectorAll(".model-slide");

    const clampedIndex = Math.max(0, Math.min(index, slides.length - 1));

    const slide = slides[clampedIndex];

    if (!slide) return;

    trackEl.scrollTo({
      left: slide.offsetLeft - trackEl.offsetLeft,
      behavior: scrollBehavior,
    });

    updateDots(clampedIndex);
  }

  function updateDots(activeIndex) {
    if (!dotsEl) return;

    dotsEl.querySelectorAll("button").forEach((button, index) => {
      button.classList.toggle("is-active", index === activeIndex);
    });
  }

  function currentIndex() {
    if (!trackEl) return 0;

    const slides = [...trackEl.querySelectorAll(".model-slide")];

    let closestIndex = 0;
    let minimumDistance = Infinity;

    slides.forEach((slide, index) => {
      const distance = Math.abs(
        slide.offsetLeft - trackEl.offsetLeft - trackEl.scrollLeft,
      );

      if (distance < minimumDistance) {
        minimumDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function handleModelSelection(event) {
    const button = event.target.closest("[data-select-model]");

    if (!button) return;

    const modelId = button.dataset.selectModel;

    if (!modelId) return;

    /*
     * Select the clicked model before scrolling.
     */
    window.KGM.form?.prefillModel(modelId);

    /*
     * Track Register Interest CTA click.
     */
    window.KGM.analytics?.track("register_cta_click", {
      cta_location: "model_card",
      model_name: modelId,
    });

    /*
     * Scroll to Register Interest section.
     */
    const registerSection = document.getElementById("register");

    if (registerSection) {
      registerSection.scrollIntoView({
        behavior: reduceMotion() ? "auto" : "smooth",
        block: "start",
      });
    }

    /*
     * Select the model again after scrolling.
     * This ensures it remains selected if another script
     * updates or redraws the form during the scroll.
     */
    window.setTimeout(
      () => {
        window.KGM.form?.prefillModel(modelId);

        const nameInput = document.querySelector(
          '#register-form [name="name"]',
        );

        if (nameInput) {
          nameInput.focus({
            preventScroll: true,
          });
        }
      },
      reduceMotion() ? 50 : 650,
    );
  }

  function populateModelSelect(data) {
    const models = data || modelsData;

    const select = document.querySelector(
      '#register-form select[name="model"]',
    );

    if (!select) return;

    const existingValue = select.value;

    const placeholderText =
      select.querySelector('option[value=""]')?.textContent ||
      t("register.fields.modelPlaceholder") ||
      "Select a model";

    select.innerHTML = "";

    const placeholder = document.createElement("option");

    placeholder.value = "";
    placeholder.textContent = placeholderText;

    select.appendChild(placeholder);

    models.forEach((model) => {
      const option = document.createElement("option");

      option.value = model.id;
      option.textContent = model.name;

      select.appendChild(option);
    });

    const existingOption = [...select.options].some((option) => {
      return option.value === existingValue;
    });

    if (existingOption) {
      select.value = existingValue;
    }
  }

  function renderModels(data) {
    modelsData = Array.isArray(data) ? data : [];

    trackEl = document.getElementById("model-track");

    dotsEl = document.getElementById("carousel-dots");

    if (!trackEl) return;

    trackEl.innerHTML = modelsData.map(renderSlide).join("");

    populateModelSelect(modelsData);

    if (dotsEl) {
      dotsEl.innerHTML = modelsData
        .map(
          (_, index) => `
            <button
              type="button"
              aria-label="${index + 1}"
              data-dot="${index}"
            ></button>
          `,
        )
        .join("");

      dotsEl.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          goToIndex(Number(button.dataset.dot));
        });
      });

      updateDots(0);
    }

    const previousButton = document.getElementById("model-prev");

    const nextButton = document.getElementById("model-next");

    function directionSign() {
      return window.KGM.i18n.getDir() === "rtl" ? -1 : 1;
    }

    if (previousButton) {
      previousButton.addEventListener("click", () => {
        const newIndex = currentIndex() - directionSign();

        goToIndex(newIndex);

        const selectedModel =
          modelsData[Math.max(0, Math.min(newIndex, modelsData.length - 1))];

        window.KGM.analytics?.track("model_view", {
          model_name: selectedModel?.name || "",
          method: "arrow",
        });
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const newIndex = currentIndex() + directionSign();

        goToIndex(newIndex);

        const selectedModel =
          modelsData[Math.max(0, Math.min(newIndex, modelsData.length - 1))];

        window.KGM.analytics?.track("model_view", {
          model_name: selectedModel?.name || "",
          method: "arrow",
        });
      });
    }

    let scrollTimeout;

    trackEl.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(scrollTimeout);

        scrollTimeout = window.setTimeout(() => {
          const index = currentIndex();

          updateDots(index);

          window.KGM.analytics?.track("model_view", {
            model_name: modelsData[index]?.name || "",
            method: "swipe",
          });
        }, 160);
      },
      {
        passive: true,
      },
    );

    trackEl.addEventListener("keydown", (event) => {
      const isRTL = window.KGM.i18n.getDir() === "rtl";

      if (event.key === "ArrowRight") {
        event.preventDefault();

        goToIndex(currentIndex() + (isRTL ? -1 : 1));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        goToIndex(currentIndex() + (isRTL ? 1 : -1));
      }
    });

    trackEl.addEventListener("click", handleModelSelection);
  }

  function reflowOnLanguageChange() {
    if (!trackEl || !modelsData.length) return;

    trackEl.innerHTML = modelsData.map(renderSlide).join("");

    populateModelSelect(modelsData);

    goToIndex(0, "auto");
  }

  window.KGM.models = {
    renderModels,
    populateModelSelect,
    reflowOnLanguageChange,
  };
})();
