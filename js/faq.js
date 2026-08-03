/* Single-open FAQ accordion. Height animates to the measured scrollHeight,
   then the panel is display:none'd once the transition has run. */

const CLOSE_DELAY = 350;

function collapse(item) {
  item.classList.remove('active');

  const content = item.querySelector('.faq__content');
  const icon = item.querySelector('.faq__icon');

  content.style.height = '0px';
  content.style.opacity = '0';
  setTimeout(() => { content.style.display = 'none'; }, CLOSE_DELAY);
  icon.textContent = '+';
}

function expand(item) {
  item.classList.add('active');

  const content = item.querySelector('.faq__content');
  const icon = item.querySelector('.faq__icon');

  content.style.display = 'block';
  void content.offsetWidth; // force reflow so the height transition runs
  content.style.height = content.scrollHeight + 'px';
  content.style.opacity = '1';
  icon.textContent = '-';
}

export function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const title = item.querySelector('.faq__item-title');
    const content = item.querySelector('.faq__content');
    const icon = item.querySelector('.faq__icon');
    if (!title || !content || !icon) return;

    content.style.display = 'none';
    content.style.height = '0px';
    content.style.opacity = '0';
    icon.textContent = '+';

    title.addEventListener('click', () => {
      const wasOpen = item.classList.contains('active');

      items.forEach(other => {
        if (other !== item && other.classList.contains('active')) collapse(other);
      });

      wasOpen ? collapse(item) : expand(item);
    });
  });
}
