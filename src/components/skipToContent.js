document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.querySelector('.skip-to-content');

  if (!skipLink) return;

  skipLink.addEventListener('click', (event) => {
    event.preventDefault();

    const target = document.querySelector('#main-content');
    if (target) {
      target.setAttribute('tabindex', '-1'); 
      target.focus(); 
    }
  });
});
