/* Hero intro + the two counter-rotating carousel loops.

   The title reveals word by word: each word pops in hot orange, warms to amber,
   then settles to the real ink colour. Words inside a .u-fonts-50 span settle at
   50% opacity instead of full, which is how the two-tone headline is built. */

const HOT = '#F94A00';
const WARM = '#FD7B03';

/* Wrap every word in the element in a span, remembering the opacity it should
   land on so the two-tone headline survives the animation. */
function splitHeroWords(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const words = node.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();

    words.forEach(word => {
      if (!word.trim()) {
        frag.appendChild(document.createTextNode(word));
        return;
      }

      const span = document.createElement('span');
      span.className = 'hero-flash-word';
      span.textContent = word;

      const isDimmed = !!node.parentElement.closest('.u-fonts-50');
      span.dataset.finalOpacity = isDimmed ? 0.5 : 1;

      frag.appendChild(span);
    });

    node.parentNode.replaceChild(frag, node);
  });
}

function playHeroIntro() {
  const tl = gsap.timeline();

  document.querySelectorAll('[data-hero-text]').forEach(el => {
    splitHeroWords(el);

    const words = el.querySelectorAll('.hero-flash-word');

    gsap.set(words, { opacity: 0, color: HOT });
    gsap.set(el, { opacity: 1 });

    tl.to(words, {
      stagger: 0.2,
      ease: 'power2.out',
      keyframes: [
        { opacity: 1, color: HOT, duration: 0.05 },
        { color: WARM, duration: 0.05 },
        {
          opacity: i => words[i].dataset.finalOpacity,
          color: 'var(--fonts-100)',
          duration: 0.05
        }
      ]
    }, 0);
  });

  tl.to('.header__left-link', { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.1);
  tl.to(['.header__main', '.menu__wrap-main'], { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.2);
  tl.to('.is-header-btn', { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.35);
  tl.to('.hero__upload', { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.25);
  tl.to('.hero__carousel__item', { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 0.3);
  tl.to('.hero__slider__item', { opacity: 1, x: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 0.35);
}

export function initHero() {
  gsap.set('[data-hero-text]', { opacity: 0 });
  gsap.set('.header__left-link, .header__main, .menu__wrap-main, .is-header-btn', { opacity: 0, y: 24, scale: 0.9 });
  gsap.set('.hero__upload, .hero__carousel__item', { opacity: 0, scale: 0.5 });
  gsap.set('.hero__slider__item', { opacity: 0, x: 40, scale: 0.9 });

  document.addEventListener('preloader:done', playHeroIntro, { once: true });
}

/* The ring spins one way, the photos inside spin the other way at the same
   rate, so each photo stays upright while orbiting. */
export function initCarousel() {
  const ring = document.querySelector('.hero__carousel__in');
  const imgs = document.querySelectorAll('.hero__carousel__img');

  if (ring) {
    gsap.to(ring, { rotate: 360, duration: 32, ease: 'none', repeat: -1 });
  }

  if (imgs.length) {
    gsap.to(imgs, { rotate: -360, duration: 32, ease: 'none', repeat: -1 });
  }
}
