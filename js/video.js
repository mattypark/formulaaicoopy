/* Lazy background video.

   Sources stay in data-src until the block is near the viewport, then load and
   autoplay muted. Playback that the browser blocks is queued and retried on the
   first real user gesture. Honours reduced-motion and Save-Data. */

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = !!(navigator.connection && navigator.connection.saveData);
const pending = new Set();

function ensureAttrs(video) {
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('webkit-playsinline', '');
  video.loop = true;
  video.preload = 'none';

  const poster = video.getAttribute('data-poster');
  if (poster && !video.poster) video.poster = poster;
}

function setPosterBgForBlock(block) {
  const video = block.querySelector('video');
  const posterDiv = block.querySelector('.video-poster');
  const poster = video?.getAttribute('data-poster') || block.getAttribute('data-poster');

  if (poster && posterDiv) {
    posterDiv.style.backgroundImage = `url("${poster}")`;
  }
}

function setSources(video) {
  const sources = video.querySelectorAll('source[data-src]');
  let applied = 0;

  sources.forEach(s => {
    if (!s.src) {
      s.src = s.dataset.src;
      applied++;
    }
  });

  if (applied) video.load();
}

function tryPlay(video) {
  if (prefersReducedMotion || saveData) return;
  if (video.getAttribute('data-autoplay') === 'false') return;

  const play = () => video.play().then(() => true).catch(() => false);

  if (video.readyState >= 2) {
    play().then(ok => { if (!ok) pending.add(video); });
  } else {
    video.addEventListener('loadeddata', () => {
      play().then(ok => { if (!ok) pending.add(video); });
    }, { once: true });
  }
}

function unlock() {
  if (!pending.size) return;
  pending.forEach(v => v.play().catch(() => {}));
  pending.clear();
}

export function initVideo() {
  const blocks = Array.from(document.querySelectorAll('.w-background-video'));
  if (!blocks.length) return;

  ['touchstart', 'pointerdown', 'keydown', 'scroll'].forEach(ev =>
    window.addEventListener(ev, unlock, { passive: true })
  );

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const video = e.target;
      const prev = video.previousElementSibling;
      const posterDiv = prev?.classList?.contains('video-poster') ? prev : null;

      if (e.isIntersecting) {
        ensureAttrs(video);
        setSources(video);
        tryPlay(video);

        video.addEventListener('loadeddata', () => {
          if (posterDiv) posterDiv.classList.add('video-faded');
        }, { once: true });
      } else {
        try { video.pause(); } catch (_) {}
      }
    });
  }, { rootMargin: '0px 0px 300px 0px', threshold: 0.1 });

  blocks.forEach(block => {
    const video = block.querySelector('video');
    if (!video) return;

    setPosterBgForBlock(block);
    ensureAttrs(video);
    io.observe(video);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    blocks.forEach(b =>
      b.querySelectorAll('video').forEach(v => {
        try { v.pause(); } catch (_) {}
      })
    );
  });
}
