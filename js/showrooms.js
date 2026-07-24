// showrooms.js — renders Showrooms from data/showrooms.json.
// Addresses, hours, coordinates and map provider are CONTENT REQUIRED
// (brief §13 items 5–7); the component renders N showrooms generically
// so real data drops in without code changes.
import { t } from './i18n.js';
import { track } from './analytics.js';

function directionsUrl(showroom) {
  if (showroom.coordinates && showroom.coordinates.lat && showroom.coordinates.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${showroom.coordinates.lat},${showroom.coordinates.lng}`;
  }
  if (showroom.address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(showroom.address)}`;
  }
  return null;
}

function renderCard(showroom, index) {
  const name = showroom.name || `${t('showrooms.eyebrow')} ${index + 1}`;
  const address = showroom.address || `<span class="content-required-tag">${t('showrooms.addressLabel')} — CONTENT REQUIRED</span>`;
  const hours = showroom.hours || `<span class="content-required-tag">${t('showrooms.hoursLabel')} — CONTENT REQUIRED</span>`;
  const dirUrl = directionsUrl(showroom);

  return `
    <article class="showroom-card" data-showroom-id="${showroom.id}">
      <h3 class="showroom-card__name">${name}</h3>
      <div class="showroom-card__map">${t('showrooms.mapPlaceholder')}</div>
      <p class="showroom-card__row"><strong>${t('showrooms.addressLabel')}</strong> ${address}</p>
      <p class="showroom-card__row"><strong>${t('showrooms.hoursLabel')}</strong> ${hours}</p>
      <div class="showroom-card__actions">
        ${dirUrl
          ? `<a class="btn btn--primary btn--sm" href="${dirUrl}" target="_blank" rel="noopener" data-directions="${showroom.id}">${t('showrooms.directions')}</a>`
          : `<button type="button" class="btn btn--ghost btn--sm" disabled title="${t('showrooms.mapPlaceholder')}">${t('showrooms.directions')}</button>`}
      </div>
    </article>`;
}

export function renderShowrooms(data) {
  const grid = document.getElementById('showroom-grid');
  if (!grid) return;
  grid.innerHTML = data.map(renderCard).join('');

  grid.querySelectorAll('[data-directions]').forEach((el) => {
    el.addEventListener('click', () => {
      track('directions_click', { showroom_name: el.dataset.directions });
    });
  });
  grid.querySelectorAll('.showroom-card').forEach((el) => {
    el.addEventListener('click', () => {
      track('showroom_view', { showroom_name: el.dataset.showroomId });
    }, { passive: true, once: true });
  });
}
