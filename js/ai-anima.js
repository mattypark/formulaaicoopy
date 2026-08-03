/* The small AI grids cross-fade between alternate renders on a loop —
   each overlay blurs in, holds, then blurs back out before the next. */

const IMAGES = [
  '.is-img-anima-1',
  '.is-img-anima-2',
  '.is-img-anima-3',
  '.is-img-anima-4',
  '.is-img-anima-5'
];

export function initAiAnima() {
  const targets = IMAGES.filter(sel => document.querySelector(sel));
  if (!targets.length) return;

  gsap.set(IMAGES, { opacity: 0, scale: 0.96, filter: 'blur(6px)' });

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { duration: 0.8, ease: 'power2.out' }
  });

  targets.forEach((sel, i) => {
    tl.to(sel, { opacity: 1, scale: 1, filter: 'blur(0px)' }, i * 1.6)
      .to(sel, { opacity: 0, scale: 0.96, filter: 'blur(6px)', duration: 0.6 }, i * 1.6 + 1.1);
  });
}
