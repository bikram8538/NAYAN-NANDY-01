(() => {
  'use strict';

  const menuButton = document.getElementById('menuButton');
  const menu = document.getElementById('mainNav');
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  };

  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  document.getElementById('year').textContent = String(new Date().getFullYear());

  const productSelect = document.getElementById('productSelect');
  document.querySelectorAll('[data-enquire]').forEach(link => {
    link.addEventListener('click', () => {
      productSelect.value = link.dataset.enquire;
    });
  });

  const filters = Array.from(document.querySelectorAll('.filter'));
  const tiles = Array.from(document.querySelectorAll('.gallery__tile'));
  let filteredTiles = [...tiles];
  let currentImageIndex = 0;

  function setFilter(value) {
    filters.forEach(button => {
      const active = button.dataset.filter === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    tiles.forEach(tile => { tile.hidden = value !== 'all' && tile.dataset.category !== value; });
    filteredTiles = tiles.filter(tile => !tile.hidden);
  }

  filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => setFilter(link.dataset.filterLink));
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function displayImage(index) {
    if (!filteredTiles.length) return;
    currentImageIndex = (index + filteredTiles.length) % filteredTiles.length;
    const tile = filteredTiles[currentImageIndex];
    lightboxImage.src = tile.dataset.image;
    lightboxImage.alt = tile.querySelector('img').alt;
    lightboxCaption.textContent = `${tile.dataset.caption} · ${currentImageIndex + 1} of ${filteredTiles.length}`;
  }

  tiles.forEach(tile => tile.addEventListener('click', () => {
    currentImageIndex = filteredTiles.indexOf(tile);
    displayImage(currentImageIndex);
    lightbox.showModal();
    lightboxClose.focus();
  }));
  document.getElementById('lightboxPrev').addEventListener('click', () => displayImage(currentImageIndex - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => displayImage(currentImageIndex + 1));
  lightboxClose.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); displayImage(currentImageIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); displayImage(currentImageIndex + 1); }
  });

  let startX = null;
  lightboxImage.addEventListener('touchstart', event => {
    startX = event.changedTouches[0]?.screenX ?? null;
  }, { passive: true });
  lightboxImage.addEventListener('touchend', event => {
    if (startX === null) return;
    const distance = (event.changedTouches[0]?.screenX ?? startX) - startX;
    if (Math.abs(distance) > 45) displayImage(currentImageIndex + (distance < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  const form = document.getElementById('enquiryForm');
  const formStatus = document.getElementById('formStatus');
  const extractInquiry = () => {
    if (!form.reportValidity()) return null;
    const fields = new FormData(form);
    return [
      'Hello NAYAN NANDY, I would like to enquire about your products.',
      '',
      `Name: ${fields.get('fullName')}`,
      `Company: ${fields.get('company') || 'Not specified'}`,
      `Email: ${fields.get('email')}`,
      `Phone: ${fields.get('phone')}`,
      `Product: ${fields.get('product')}`,
      `Quantity / Packing: ${fields.get('quantity') || 'Not specified'}`,
      `Message: ${fields.get('message')}`
    ].join('\n');
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const inquiry = extractInquiry();
    if (!inquiry) return;
    const url = `https://wa.me/919475236106?text=${encodeURIComponent(inquiry)}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.append(link);
    link.click();
    link.remove();
    formStatus.textContent = 'WhatsApp is opening with your enquiry. Please review the message and tap Send there.';
  });

  document.getElementById('emailSubmit').addEventListener('click', () => {
    const inquiry = extractInquiry();
    if (!inquiry) return;
    const url = `mailto:sales@nayannandy.com?subject=${encodeURIComponent('Product enquiry — NAYAN NANDY')}&body=${encodeURIComponent(inquiry)}`;
    window.location.href = url;
    formStatus.textContent = 'Your email application is opening. Please review the message and send it from your email account.';
  });
})();
