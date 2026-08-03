/* "How it works" right column.

   The column itself scrolls forever via a CSS marquee. This just re-reads each
   title's position every frame and fades it by how far up the window it has
   travelled — so lines brighten as they rise and sit at 20% at the bottom.

   Position is measured, not tracked, so it stays correct regardless of where
   the CSS animation happens to be. */

const FLOOR_OPACITY = 0.2;
const FADE_FINISH = 0.15;

export function initHow() {
  const container = document.querySelector('.how__right');
  if (!container) return;

  const titles = container.querySelectorAll('.how__right-title');
  if (!titles.length) return;

  function frame() {
    const containerRect = container.getBoundingClientRect();
    const containerHeight = containerRect.height;

    titles.forEach(title => {
      const rect = title.getBoundingClientRect();
      const top = rect.top - containerRect.top;
      const bottom = top + rect.height;

      let opacity = FLOOR_OPACITY;

      if (bottom > 0 && top < containerHeight) {
        let norm = 1 - bottom / containerHeight;
        norm = Math.min(Math.max(norm, 0), 1);

        let progress = norm / (1 - FADE_FINISH);
        progress = Math.min(Math.max(progress, 0), 1);

        opacity = FLOOR_OPACITY + progress * (1 - FLOOR_OPACITY);
      }

      title.style.opacity = opacity;
    });

    requestAnimationFrame(frame);
  }

  frame();
}
