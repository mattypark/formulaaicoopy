/* Scroll-triggered word flash — the same orange→ink reveal as the hero, but
   fired by ScrollTrigger as each headline enters the viewport. */

const HOT = '#F94A00';

function splitToWords(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    const words = node.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();

    words.forEach(word => {
      if (!word.trim()) {
        frag.appendChild(document.createTextNode(word));
        return;
      }

      const span = document.createElement('span');
      span.className = 'flash-word';
      span.textContent = word;
      frag.appendChild(span);
    });

    node.parentNode.replaceChild(frag, node);
  });
}

function wire(el, finalColor) {
  splitToWords(el);

  const words = el.querySelectorAll('.flash-word');
  if (!words.length) return;

  gsap.set(words, { opacity: 0, color: HOT });

  gsap.to(words, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    stagger: 0.04,
    ease: 'power2.out',
    keyframes: [
      { opacity: 1, color: HOT, duration: 0.05 },
      { color: '#FD7B03', duration: 0.05 },
      { opacity: 1, color: finalColor, duration: 0.05 }
    ]
  });
}

export function initFlashText() {
  document.querySelectorAll('.flash-text, [data-flash]').forEach(el => wire(el, 'var(--fonts-100)'));

  // Headlines on the coloured slides always resolve to white.
  document.querySelectorAll('[data-flash-stb]').forEach(el => wire(el, '#ffffff'));
}
