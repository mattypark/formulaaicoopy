/* Menu: the header pill grows into a panel, links stagger in, the burger
   rotates to an X, and the label scrambles between "Menu" and "Close". */

const SCRAMBLE_CHAR = '•';
const SCRAMBLE_FRAMES = 20;
const SCRAMBLE_INTERVAL = 20;

/* Closed, the panel is parked behind the header pill at pill size. It is also
   fully transparent — on narrow screens it is wider than the pill, so without
   this it would peek out from behind it. */
function closedProps() {
  if (window.innerWidth <= 767) {
    return { width: '15.5rem', height: '2.7rem', y: '0.5rem', padding: '0rem', overflow: 'hidden', opacity: 0 };
  }
  return { width: '15rem', height: '2.7rem', y: '1.25rem', padding: '0rem', overflow: 'hidden', opacity: 0 };
}

function openProps() {
  if (window.innerWidth <= 991) {
    return { width: '16.2rem', height: '39rem', padding: '5rem 1rem 1rem 1rem' };
  }
  return { width: '18rem', height: '39rem', padding: '6.25rem 1.25rem 2.5rem 1.25rem' };
}

function scrambleText(el, newText) {
  const oldText = el.textContent;
  const length = Math.max(oldText.length, newText.length);
  let frame = 0;

  const interval = setInterval(() => {
    let display = '';

    for (let i = 0; i < length; i++) {
      const revealed = i < newText.length && frame / SCRAMBLE_FRAMES > i / length;
      display += revealed ? newText[i] : SCRAMBLE_CHAR;
    }

    el.textContent = display;
    frame++;

    if (frame > SCRAMBLE_FRAMES) {
      el.textContent = newText;
      clearInterval(interval);
    }
  }, SCRAMBLE_INTERVAL);
}

export function initMenu() {
  const btn = document.querySelector('.header__menu');
  const txt = document.querySelector('.header__menu-txt');
  const menu = document.querySelector('.menu__wrap');
  const topLine = document.querySelector('.header__menu-line.is-top');
  const bottomLine = document.querySelector('.header__menu-line.is-bottom');

  if (!btn || !txt || !menu) return;

  const items = menu.querySelectorAll('.menu__item');
  let isOpen = false;

  gsap.set(menu, closedProps());
  gsap.set(items, { opacity: 0 });

  const props = openProps();
  const menuTL = gsap.timeline({ paused: true });

  menuTL
    .to(menu, {
      y: 0,
      opacity: 1,
      width: props.width,
      height: props.height,
      padding: props.padding,
      duration: 0.4,
      ease: 'power2.out'
    })
    .to(items, { opacity: 1, stagger: 0.05, duration: 0.3 }, '-=0.2');

  const burgerTL = gsap.timeline({ paused: true });
  if (topLine && bottomLine) {
    burgerTL
      .to(topLine, { y: 0, rotate: 45, duration: 0.3, ease: 'power2.out' }, 0)
      .to(bottomLine, { y: 0, rotate: -45, duration: 0.3, ease: 'power2.out' }, 0);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    scrambleText(txt, 'Close');
    menuTL.play();
    burgerTL.play();
  }

  function close(delay = 0) {
    if (!isOpen) return;
    isOpen = false;
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    scrambleText(txt, 'Menu');

    gsap.to([...items].reverse(), { opacity: 0, stagger: 0.05, duration: 0.2 });
    menuTL.reverse(delay);
    burgerTL.reverse();
  }

  btn.addEventListener('click', e => {
    e.preventDefault();
    isOpen ? close() : open();
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => close());
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Re-measure on resize so the panel keeps the right size for the breakpoint.
  window.addEventListener('resize', () => {
    if (isOpen) return;
    gsap.set(menu, closedProps());
  });
}
