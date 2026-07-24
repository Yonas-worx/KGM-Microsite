// models.js — renders The Models carousel from data/models.json.
import { t, getLang, getDir } from './i18n.js';
import { track } from './analytics.js';
import { prefillModel } from './form.js';

let modelsData = [];
let track_ = null;
let dotsEl = null;

function statRow(model) {
  return model.keyNumbers
    .map((kn) => {
      const value = kn && kn.value ? kn.value : '—';
      const label = kn && kn.label ? kn.label : t('models.contentRequired');
      return `
        <div class="stat">
          <div class="stat-value">${value}</div>
          <div class="stat-label">${label}</div>
        </div>`;
    })
    .join('');
}

function renderSlide(model, index) {
  const desc = model.description
    ? `<p class="model-slide__desc">${model.description}</p>`
    : `<p class="model-slide__desc content-required-tag">${t('models.contentRequired')}</p>`;

  return `
    <article class="model-slide" data-model-id="${model.id}" data-index="${index}" role="group" aria-roledescription="slide" aria-label="${model.name}">
      <div class="model-slide__media">
        <span class="model-slide__ground" aria-hidden="true"></span>
        <img src="${model.image}" alt="${model.name}" loading="${index === 0 ? 'eager' : 'lazy'}" width="900" height="600">
      </div>
      <div class="model-slide__body">
        <div class="model-slide__eyebrow-row">
          <span class="model-slide__category">${model.category || t('models.contentRequired')}</span>
        </div>
        <h3 class="model-slide__name">${model.name}</h3>
        ${desc}
        <div class="model-stat-row">${statRow(model)}</div>
        <div class="model-slide__actions">
          <button type="button" class="btn btn--primary" data-select-model="${model.id}">${t('models.cta')}</button>
        </div>
      </div>
    </article>`;
}

function goToIndex(i, behavior = 'smooth') {
  const slides = track_.querySelectorAll('.model-slide');
  const clamped = Math.max(0, Math.min(i, slides.length - 1));
  const slide = slides[clamped];
  if (!slide) return;
  track_.scrollTo({ left: slide.offsetLeft - track_.offsetLeft, behavior });
  updateDots(clamped);
}

function updateDots(activeIndex) {
  if (!dotsEl) return;
  dotsEl.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('is-active', i === activeIndex);
  });
}

function currentIndex() {
  const slides = [...track_.querySelectorAll('.model-slide')];
  let closest = 0;
  let min = Infinity;
  slides.forEach((s, i) => {
    const d = Math.abs(s.offsetLeft - track_.offsetLeft - track_.scrollLeft);
    if (d < min) { min = d; closest = i; }
  });
  return closest;
}

export function renderModels(data) {
  modelsData = data;
  track_ = document.getElementById('model-track');
  dotsEl = document.getElementById('carousel-dots');
  if (!track_) return;

  track_.innerHTML = modelsData.map(renderSlide).join('');

  if (dotsEl) {
    dotsEl.innerHTML = modelsData
      .map((_, i) => `<button type="button" aria-label="${i + 1}" data-dot="${i}"></button>`)
      .join('');
    dotsEl.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => goToIndex(Number(btn.dataset.dot)));
    });
    updateDots(0);
  }

  const prevBtn = document.getElementById('model-prev');
  const nextBtn = document.getElementById('model-next');
  const dirSign = () => (getDir() === 'rtl' ? -1 : 1);

  prevBtn?.addEventListener('click', () => {
    goToIndex(currentIndex() - dirSign());
    track('model_view', { model_name: modelsData[currentIndex()]?.name, method: 'arrow' });
  });
  nextBtn?.addEventListener('click', () => {
    goToIndex(currentIndex() + dirSign());
    track('model_view', { model_name: modelsData[currentIndex()]?.name, method: 'arrow' });
  });

  let scrollTimeout;
  track_.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const idx = currentIndex();
      updateDots(idx);
      track('model_view', { model_name: modelsData[idx]?.name, method: 'swipe' });
    }, 160);
  }, { passive: true });

  track_.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goToIndex(currentIndex() + (getDir() === 'rtl' ? -1 : 1));
    if (e.key === 'ArrowLeft') goToIndex(currentIndex() + (getDir() === 'rtl' ? 1 : -1));
  });

  track_.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-select-model]');
    if (!btn) return;
    const id = btn.getAttribute('data-select-model');
    prefillModel(id);
    track('model_view', { model_name: id, method: 'select' });
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('#register-form [name="name"]')?.focus();
  });

  populateModelSelect(modelsData, getLang());
}

export function populateModelSelect(data = modelsData) {
  const select = document.querySelector('#register-form select[name="model"]');
  if (!select) return;
  const placeholder = select.querySelector('option[value=""]');
  select.innerHTML = '';
  if (placeholder) select.appendChild(placeholder);
  data.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.name;
    select.appendChild(opt);
  });
}

export function reflowOnLanguageChange() {
  if (!track_ || !modelsData.length) return;
  track_.innerHTML = modelsData.map(renderSlide).join('');
  goToIndex(0, 'auto');
}
