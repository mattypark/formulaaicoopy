/* Light/dark theme. Persists to localStorage and swaps paired
   .theme-light / .theme-dark images inside each parent. */

const STORAGE_KEY = 'isDarkMode';
const EVENT_NAME = 'theme:changed';

/* Each image slot may hold a pair: .theme-light for light mode, .theme-dark for
   dark. Show whichever matches, hide the other. */
function swapPairedImages(isDark) {
  document.querySelectorAll('.theme-light').forEach(lightImg => {
    const parent = lightImg.parentElement;
    if (!parent) return;

    const darkImg = parent.querySelector('.theme-dark');
    if (!darkImg) return;

    lightImg.style.display = isDark ? 'none' : 'block';
    darkImg.style.display = isDark ? 'block' : 'none';
  });
}

function apply(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  swapPairedImages(isDark);
  document.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { isDark } }));
}

export function initTheme() {
  let isDark = localStorage.getItem(STORAGE_KEY) === 'true';
  apply(isDark);

  document.querySelectorAll('[data-theme-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      isDark = !isDark;
      localStorage.setItem(STORAGE_KEY, String(isDark));
      apply(isDark);
    });
  });
}
