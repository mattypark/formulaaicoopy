/* Page-level zoom in 0.1 steps, persisted across visits.
   Feeds --user-zoom, which html { font-size } multiplies — so the whole rem-based
   layout scales together rather than just the text. */

const STEP = 0.1;
const KEY = 'site-user-zoom';
const MIN = 0.6;
const MAX = 1.6;

export function initZoom() {
  const root = document.documentElement;

  let zoom = parseFloat(localStorage.getItem(KEY) || '1');
  if (!Number.isFinite(zoom) || zoom <= 0) zoom = 1;

  function apply() {
    root.style.setProperty('--user-zoom', String(zoom));
    localStorage.setItem(KEY, String(zoom));
  }

  function nudge(delta) {
    zoom = Math.min(MAX, Math.max(MIN, Math.round((zoom + delta) * 100) / 100));
    apply();
  }

  apply();

  document.querySelectorAll('[data-zoom-in]').forEach(el =>
    el.addEventListener('click', () => nudge(STEP))
  );
  document.querySelectorAll('[data-zoom-out]').forEach(el =>
    el.addEventListener('click', () => nudge(-STEP))
  );
  document.querySelectorAll('[data-zoom-reset]').forEach(el =>
    el.addEventListener('click', () => { zoom = 1; apply(); })
  );
}
