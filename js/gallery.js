// gallery.js — renders the editorial Gallery scene from data/gallery.json.
import { track } from './analytics.js';

export function renderGallery(data) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = data
    .map((item) => {
      const wideClass = item.type === 'wide' ? ' gallery-frame--wide' : '';
      const productClass = item.type === 'product' ? ' gallery-frame--product' : '';
      const scrim = item.type === 'product' ? '' : '<span class="gallery-frame__scrim" aria-hidden="true"></span>';
      const caption = item.caption
        ? `<span class="gallery-frame__caption">${item.caption}</span>`
        : '';
      return `
        <figure class="gallery-frame${wideClass}${productClass}" data-gallery-id="${item.id}">
          ${scrim}
          <img src="${item.image}" alt="${item.caption || ''}" loading="lazy">
          ${caption}
        </figure>`;
    })
    .join('');

  grid.querySelectorAll('[data-gallery-id]').forEach((el) => {
    el.addEventListener('click', () => {
      track('gallery_interact', { method: 'open', item: el.dataset.galleryId });
    }, { passive: true });
  });
}
