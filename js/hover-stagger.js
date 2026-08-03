/* Character roll on hover.

   The label is duplicated and parked one line below. On hover both copies roll
   up together, character by character, so the original leaves as the clone
   arrives. A mask crops the overflow to the text band. */

const DIRECTION = 'up';
const STAGGER = 0.02;
const DURATION = 0.2;
const EASE = 'power1.inOut';

function applyMask(el) {
  el.style.position ||= 'relative';
  el.style.display ||= 'inline-block';
  el.style.overflow = 'hidden';

  el.style.webkitMaskImage = 'linear-gradient(#000 0 0)';
  el.style.maskImage = 'linear-gradient(#000 0 0)';
  el.style.webkitMaskSize = '100% 70%';
  el.style.maskSize = '100% 70%';
  el.style.webkitMaskPosition = 'center';
  el.style.maskPosition = 'center';
  el.style.webkitMaskRepeat = 'no-repeat';
  el.style.maskRepeat = 'no-repeat';
}

export function initHoverStagger() {
  if (typeof SplitType === 'undefined') return;

  document.querySelectorAll('[hover-stagger]').forEach(el => {
    const hoverTarget = el.closest('[hover-stagger-wrap]') || el;

    applyMask(el);

    const original = document.createElement('span');
    original.textContent = el.textContent;
    el.textContent = '';
    el.appendChild(original);

    const clone = original.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = 0;
    clone.style.top = DIRECTION === 'up' ? '100%' : '-100%';
    el.appendChild(clone);

    const splitMain = new SplitType(original, { types: 'chars' });
    const splitClone = new SplitType(clone, { types: 'chars' });

    const move = DIRECTION === 'up' ? -100 : 100;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: EASE, duration: DURATION, stagger: STAGGER }
    });

    tl.fromTo(splitMain.chars, { yPercent: 0 }, { yPercent: move })
      .fromTo(splitClone.chars, { yPercent: 0 }, { yPercent: move }, '<');

    hoverTarget.addEventListener('mouseenter', () => tl.restart());
    hoverTarget.addEventListener('mouseleave', () => tl.reverse());
  });
}
