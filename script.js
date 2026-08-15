const header = document.querySelector('#siteHeader');
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('.mobile-menu');

const updateHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.classList.toggle('is-open', !isOpen);
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const labels = {
      search: 'Search — coming soon.',
      bag: 'Shopping bag — coming soon.'
    };
    window.alert(labels[action] || 'Coming soon.');
  });
});
