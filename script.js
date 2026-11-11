// Lightweight interactions: scroll reveal, mobile navigation and demo patient search.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const searchInput = document.getElementById('patientSearch');
const searchButton = document.getElementById('searchButton');
searchButton?.addEventListener('click', () => {
  const value = searchInput.value.trim();
  if (!value) {
    searchInput.focus();
    searchInput.placeholder = 'Enter a patient ID to search';
    return;
  }
  // This is a front-end demo only; connect this action to a secure backend for real patient records.
  searchButton.textContent = value.toUpperCase() === 'DM-2048' ? 'Patient found ✓' : 'Demo only';
  window.setTimeout(() => { searchButton.textContent = 'Find patient'; }, 1800);
});
searchInput?.addEventListener('keydown', event => {
  if (event.key === 'Enter') searchButton?.click();
});
