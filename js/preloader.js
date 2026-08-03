/* Preloader: counter steps up, image stack cycles, everything blurs out,
   then `preloader:done` fires and the hero intro takes over.
   Returning visitors get the whole thing at 5x speed. */

const VISIT_KEY = 'preloader_visited_v2';
const COUNTER_STEPS = [0, 17, 35, 58, 76, 89, 100];
const COUNTER_DURATION = 2.5;

function lockScroll() {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

function finish(imageInterval, speed) {
  document.documentElement.classList.remove('is-loading');
  document.dispatchEvent(new CustomEvent('preloader:done'));
  if (imageInterval) clearInterval(imageInterval);
  gsap.delayedCall(1 * speed, unlockScroll);
}

export function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const numberEl = document.querySelector('.preloader__number');
  const images = document.querySelectorAll('.preloader__images-in');

  const isReturningUser = localStorage.getItem(VISIT_KEY) === '1';
  const speed = isReturningUser ? 1 / 5 : 1;
  localStorage.setItem(VISIT_KEY, '1');

  window.scrollTo(0, 0);
  lockScroll();

  // Cycle which image sits on top of the stack.
  let imageInterval = null;
  if (images.length) {
    let index = 0;
    imageInterval = setInterval(() => {
      images.forEach((img, i) => {
        img.style.zIndex = i === index ? 9 : 1;
      });
      index = (index + 1) % images.length;
    }, 500 * speed);
  }

  if (numberEl) {
    if (isReturningUser) {
      numberEl.textContent = 'Synced';
      gsap.fromTo(
        numberEl,
        { opacity: 0, y: 8, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.2, delay: 0.1, ease: 'power2.out' }
      );
    } else {
      const tlNumber = gsap.timeline({ delay: 0.5 });
      const legDuration = COUNTER_DURATION / (COUNTER_STEPS.length - 1);

      COUNTER_STEPS.forEach((val, i) => {
        const prev = i === 0 ? 0 : COUNTER_STEPS[i - 1];
        tlNumber.to({ n: prev }, {
          n: val,
          duration: legDuration,
          ease: 'power2.out',
          onUpdate() {
            numberEl.textContent = Math.round(this.targets()[0].n);
          }
        });
      });
    }
  }

  const tl = gsap.timeline({ onComplete: () => finish(imageInterval, speed) });

  tl.set('.preloader > *', { visibility: 'visible' });

  tl.fromTo(
    '.preloader > *',
    { opacity: 0, filter: 'blur(20px)' },
    { opacity: 1, filter: 'blur(0px)', duration: 1 * speed, stagger: 0.05 * speed, ease: 'power2.out' }
  );

  tl.to('.preloader > *', {
    opacity: 0,
    filter: 'blur(20px)',
    duration: 1 * speed,
    delay: 2.5 * speed,
    stagger: 0.05 * speed,
    ease: 'power2.in'
  });

  tl.to(preloader, { opacity: 0, duration: 0.6 * speed, ease: 'power2.in' });
}
