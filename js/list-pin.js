/* The pinned slide stack.

   Each slide pins for one viewport height while its content shrinks, tips back
   on the X axis and picks up a small random Z rotation — so the outgoing slide
   reads as a card falling away behind the one arriving. A second trigger fades
   it out slightly later, which keeps the fade from eating the tilt.

   The last slide is skipped: nothing follows it, so it stays put. */

export function initListPin() {
  const slides = document.querySelectorAll('.list__main__wrap .list__main__slide');
  if (!slides.length) return;

  slides.forEach((slide, index) => {
    if (index === slides.length - 1) return;

    const contentWrapper = slide.querySelector('.list__main__content__wrap');
    const content = slide.querySelector('.list__main__content');
    if (!contentWrapper || !content) return;

    gsap.to(content, {
      rotationZ: (Math.random() - 0.5) * 10,
      scale: 0.7,
      rotationX: 40,
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
