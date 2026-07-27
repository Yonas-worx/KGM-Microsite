// models.js — smooth filtered lineup rail with hover expansion and looping autoplay.
window.KGM = window.KGM || {};

(function () {
  let allModels = [];
  let visibleModels = [];
  let activeFilter = 'suv';
  let trackEl = null;
  let autoTimer = null;
  let scrollTimer = null;

  function t(key) { return window.KGM.i18n.t(key); }
  function reduceMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function isRtl() { return window.KGM.i18n.getDir() === 'rtl'; }

  function renderSlide(model, index, duplicate) {
    return `
      <article class="model-slide" data-model-id="${model.id}" data-index="${index}" ${duplicate ? 'aria-hidden="true"' : ''} role="group" aria-roledescription="slide" aria-label="${model.name}">
        <img class="model-slide__image" src="${model.image}" alt="${duplicate ? '' : model.name}" loading="${index < 4 ? 'eager' : 'lazy'}" decoding="async">
        <span class="model-slide__shade" aria-hidden="true"></span>
        <div class="model-slide__content">
          <h3 class="model-slide__name">${model.name}</h3>
          <button type="button" class="model-slide__link" data-select-model="${model.id}">${t('models.cta')} <span aria-hidden="true">↗</span></button>
        </div>
      </article>`;
  }

  function renderCurrentFilter() {
    visibleModels = allModels.filter((model) => model.type === activeFilter);
    if (!trackEl) return;

    // A second copy makes the rail visually continuous. JS silently resets
    // to the first copy when it reaches the duplicate set.
    const first = visibleModels.map((model, index) => renderSlide(model, index, false)).join('');
    const second = visibleModels.length > 2
      ? visibleModels.map((model, index) => renderSlide(model, index, true)).join('')
      : '';
    trackEl.innerHTML = first + second;
    trackEl.scrollLeft = 0;
    populateModelSelect(allModels);
    startAuto();
  }

  function setFilter(filter) {
    if (filter !== 'suv' && filter !== 'pickup') return;
    activeFilter = filter;
    document.querySelectorAll('[data-model-filter]').forEach((button) => {
      const active = button.dataset.modelFilter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderCurrentFilter();
  }

  function cardStep() {
    const card = trackEl?.querySelector('.model-slide');
    if (!card) return 320;
    const gap = parseFloat(getComputedStyle(trackEl).gap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function normalizedScroll() {
    return Math.abs(trackEl.scrollLeft);
  }

  function scrollByCards(direction) {
    if (!trackEl) return;
    const sign = isRtl() ? -1 : 1;
    trackEl.scrollBy({ left: cardStep() * direction * sign, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  function resetLoopIfNeeded() {
    if (!trackEl || visibleModels.length <= 2) return;
    const originalWidth = trackEl.scrollWidth / 2;
    const current = normalizedScroll();
    if (current >= originalWidth - cardStep()) {
      trackEl.scrollTo({ left: 0, behavior: 'auto' });
    }
  }

  function stopAuto() {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = null;
  }

  function startAuto() {
    stopAuto();
    if (reduceMotion() || visibleModels.length < 2) return;
    autoTimer = window.setInterval(() => scrollByCards(1), 3600);
  }

  function populateModelSelect(data) {
    const select = document.querySelector('#register-form select[name="model"]');
    if (!select) return;
    const current = select.value;
    const placeholder = select.querySelector('option[value=""]');
    const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

    select.innerHTML = '';
    if (placeholder) select.appendChild(placeholder);
    sorted.forEach((model) => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      select.appendChild(option);
    });
    if ([...select.options].some((option) => option.value === current)) select.value = current;
  }

  function bindEvents() {
    document.getElementById('model-prev')?.addEventListener('click', () => {
      stopAuto();
      scrollByCards(-1);
      startAuto();
    });
    document.getElementById('model-next')?.addEventListener('click', () => {
      stopAuto();
      scrollByCards(1);
      startAuto();
    });

    document.querySelectorAll('[data-model-filter]').forEach((button) => {
      button.addEventListener('click', () => setFilter(button.dataset.modelFilter));
    });

    trackEl.addEventListener('scroll', () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(resetLoopIfNeeded, 140);
    }, { passive: true });

    trackEl.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      scrollByCards(event.key === 'ArrowRight' ? 1 : -1);
    });

    trackEl.addEventListener('click', (event) => {
      const button = event.target.closest('[data-select-model]');
      if (!button) return;
      const id = button.dataset.selectModel;
      window.KGM.form.prefillModel(id);
      window.KGM.analytics.track('register_cta_click', { cta_location: 'model_card', model_name: id });
      document.getElementById('register')?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => document.querySelector('#register-form [name="name"]')?.focus({ preventScroll: true }), 550);
    });

    trackEl.addEventListener('pointerenter', stopAuto);
    trackEl.addEventListener('pointerleave', startAuto);
    trackEl.addEventListener('focusin', stopAuto);
    trackEl.addEventListener('focusout', startAuto);
    document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
  }

  function renderModels(data) {
    allModels = Array.isArray(data) ? data : [];
    trackEl = document.getElementById('model-track');
    if (!trackEl) return;
    bindEvents();
    renderCurrentFilter();
  }

  function reflowOnLanguageChange() {
    if (!trackEl) return;
    renderCurrentFilter();
  }

  window.KGM.models = { renderModels, populateModelSelect, reflowOnLanguageChange, setFilter };
})();
