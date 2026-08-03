/* Scroll percentage in the header pill, plus the header/footer collision:
   the pill gets out of the way once the footer is on screen. */

export function initProgress() {
  const el = document.getElementById('progress');
  if (!el) return;

  let last = -1;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const raw = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    const pct = Math.round(Math.min(Math.max(raw, 0), 100));

    if (pct !== last) {
      el.textContent = pct + '%';
      last = pct;
    }

    requestAnimationFrame(update);
  }

  update();
}

export function initHeaderFooterCollision() {
  const header = document.querySelector('.header');
  const footer = document.querySelector('.footer');
  const menu = document.querySelector('.menu');

  if (!header || !footer || !menu) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        header.classList.toggle('is-hidden', entry.isIntersecting);
        menu.classList.toggle('is-hidden', entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(footer);
}

/* Year stamps in the hero and footer. */
export function initCurrentYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = year;
  });
}
