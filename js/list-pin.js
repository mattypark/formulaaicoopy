/* The pinned slide stack.

   Each slide pins for one viewport height while its content shrinks, tilts and
   picks up a small random Z rotation — so the outgoing slide reads as a card
   falling away behind the one arriving. A second trigger fades it out slightly
   later, which keeps the fade from eating the tilt.

   transformPerspective is what makes the tilt read as depth: the top edge
   recedes while the bottom edge advances toward the viewer. Without it a
   rotationX is only a vertical squash, which reads as the card folding flat
   rather than leaning into 3D. Perspective is set per-element rather than on
   the parent so it can't affect stacking or layout of the pinned wrappers.

   The last slide is skipped: nothing follows it, so it stays put. */

/* Tuning knobs for the outgoing-slide motion.
   Raise PERSPECTIVE to flatten the keystone, raise TILT for a deeper lean. */
const PERSPECTIVE = 1800;
const TILT = 15;       // deg — top recedes, bottom advances
const SHRINK = 0.85;
const SKEW = 7;        // deg of random Z spread

export function initListPin() {
  const slides = document.querySelectorAll('.list__main__wrap .list__main__slide');
  if (!slides.length) return;

  slides.forEach((slide, index) => {
    if (index === slides.length - 1) return;

    const contentWrapper = slide.querySelector('.list__main__content__wrap');
    const content = slide.querySelector('.list__main__content');
    if (!contentWrapper || !content) return;

    gsap.to(content, {
      transformPerspective: PERSPECTIVE,
      rotationZ: (Math.random() - 0.5) * SKEW,
      scale: SHRINK,
      rotationX: TILT,
      ease: 'power1.in',
      scrollTrigger: {
        pin: contentWrapper,
        trigger: slide,
        start: 'top 0%',
        end: '+=' + window.innerHeight,
        scrub: true
      }
    });

    gsap.to(content, {
      autoAlpha: 0,
      ease: 'power1.in',
      scrollTrigger: {
        trigger: content,
        start: 'top -80%',
        end: '+=' + 0.5 * window.innerHeight,
        scrub: true
      }
    });
  });
}
