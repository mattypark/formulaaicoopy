/* Footer dots field.

   A grid of dots that idles through a slow "chaos → figure → chaos" cycle and
   also reacts to the cursor: dots near the pointer shrink toward MIN_SCALE.
   The grid is rebuilt whenever the breakpoint changes so density stays sane. */

const CLOUD_RADIUS = 12;
const TOTAL_DURATION = 1;
const FIGURE_PAUSE = 1;
const GROUPS = 20;
const CHAOS_OPACITY = 0.35;

const MAX_DISTANCE = 200;
const MIN_SCALE = 0.25;

function getMode() {
  const w = window.innerWidth;
  if (w >= 992) return 'desktop';
  if (w >= 768) return 'tablet';
  return 'mobile';
}

function gridFor(mode) {
  if (mode === 'desktop') return { cols: 52, rows: 15 };
  if (mode === 'tablet') return { cols: 32, rows: 12 };
  return { cols: 20, rows: 10 };
}

function build(field, mode) {
  const { cols, rows } = gridFor(mode);

  field.innerHTML = '';
  field.style.gridTemplateColumns = `repeat(${cols}, min-content)`;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < cols * rows; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.dataset.col = i % cols;
    dot.dataset.row = Math.floor(i / cols);
    frag.appendChild(dot);
  }
  field.appendChild(frag);

  return { cols, rows };
}

/* Pick a blob of dots around a random centre — the "figure" the field
   resolves into between chaotic phases. */
function pickFigure(dots, cols, rows) {
  const cx = Math.random() * cols;
  const cy = Math.random() * rows;

  return dots.filter(dot => {
    const dx = Number(dot.dataset.col) - cx;
    const dy = Number(dot.dataset.row) - cy;
    return Math.hypot(dx, dy) < CLOUD_RADIUS * 0.45;
  });
}

function runIdleCycle(dots, cols, rows) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: FIGURE_PAUSE });

  // Chaotic scatter — random dots light up in groups.
  tl.to(dots, {
    opacity: () => CHAOS_OPACITY + Math.random() * (1 - CHAOS_OPACITY),
    duration: TOTAL_DURATION,
    ease: 'none',
    stagger: { each: TOTAL_DURATION / GROUPS, from: 'random' }
  });

  // Resolve into a figure.
  tl.call(() => {
    const figure = pickFigure(dots, cols, rows);
    dots.forEach(d => d.classList.remove('is-on'));
    figure.forEach(d => d.classList.add('is-on'));
  });

  tl.to(dots, { opacity: 1, duration: TOTAL_DURATION * 0.5, ease: 'power1.out' });

  return tl;
}

export function initDots() {
  const field = document.getElementById('dotsField');
  if (!field) return;

  let lastMode = null;
  let idleTL = null;
  let dots = [];

  function rebuild() {
    const mode = getMode();
    if (mode === lastMode) return;
    lastMode = mode;

    const { cols, rows } = build(field, mode);
    dots = Array.from(field.querySelectorAll('.dot'));

    if (idleTL) idleTL.kill();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      idleTL = runIdleCycle(dots, cols, rows);
    }
  }

  rebuild();
  window.addEventListener('resize', rebuild);

  // Cursor proximity — dots duck away from the pointer.
  document.addEventListener('mousemove', e => {
    if (!dots.length) return;

    const fieldRect = field.getBoundingClientRect();
    if (e.clientY < fieldRect.top - MAX_DISTANCE || e.clientY > fieldRect.bottom + MAX_DISTANCE) return;

    dots.forEach(dot => {
      const rect = dot.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      const t = Math.min(distance / MAX_DISTANCE, 1);
      const scale = MIN_SCALE + t * (1 - MIN_SCALE);

      dot.style.transform = `scale(${scale})`;
    });
  }, { passive: true });
}
