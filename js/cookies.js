/* Cookie notice. Hidden until the preloader finishes, then eased in two
   seconds later so it doesn't compete with the hero reveal. */

const KEY = 'cookie-choice';

export function initCookies() {
  const cookies = document.querySelector('.cookies');
  if (!cookies) return;

  if (localStorage.getItem(KEY)) {
    cookies.classList.add('is-dismissed');
    return;
  }

  gsap.set(cookies, { opacity: 0, y: 10 });

  document.addEventListener('preloader:done', () => {
    gsap.delayedCall(2, () => {
      gsap.to(cookies, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    });
  }, { once: true });

  function dismiss(choice) {
    localStorage.setItem(KEY, choice);
    gsap.to(cookies, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => cookies.classList.add('is-dismissed')
    });
  }

  cookies.querySelector('.cookies__modal__close')?.addEventListener('click', () => dismiss('dismissed'));
  cookies.querySelector('[data-cookie-accept]')?.addEventListener('click', () => dismiss('all'));
  cookies.querySelector('[data-cookie-settings]')?.addEventListener('click', () => dismiss('essential'));
}
