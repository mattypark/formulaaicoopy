/* Entry point.

   GSAP and SplitType load from CDN with `defer`, so they are guaranteed to be
   parsed before this module body runs — but not before this file is *fetched*.
   Waiting for DOMContentLoaded covers both. */

import { initTheme } from './theme.js';
import { initZoom } from './zoom.js';
import { initPreloader } from './preloader.js';
import { initHero, initCarousel } from './hero.js';
import { initMenu } from './menu.js';
import { initProgress, initHeaderFooterCollision, initCurrentYear } from './progress.js';
import { initListPin } from './list-pin.js';
import { initHow } from './how.js';
import { initFaq } from './faq.js';
import { initDots } from './dots.js';
import { initFlashText } from './flash-text.js';
import { initHoverStagger } from './hover-stagger.js';
import { initAiAnima } from './ai-anima.js';
import { initVideo } from './video.js';
import { initUpload } from './upload.js';
import { initCookies } from './cookies.js';

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

ready(() => {
  if (typeof gsap === 'undefined') {
    console.error('GSAP failed to load — animations are disabled.');
    document.documentElement.classList.remove('is-loading');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Chrome-level state first, so nothing paints in the wrong theme or scale.
  initTheme();
  initZoom();
  initCurrentYear();

  // Layout-independent behaviour.
  initMenu();
  initFaq();
  initUpload();
  initProgress();
  initHeaderFooterCollision();
  initHoverStagger();

  // Motion.
  initHero();
  initCarousel();
  initFlashText();
  initAiAnima();
  initListPin();
  initHow();
  initDots();
  initVideo();
  initCookies();

  // The preloader hands off to the hero intro, so it goes last.
  initPreloader();

  // Pinned slides measure against viewport height — remeasure after a resize.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
});
