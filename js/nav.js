// js/nav.js
(() => {
  const boot = () => {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#primary-nav');
    if (!btn || !nav) return false;

    const close = () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target)) close();
    });

    return true;
  };

  // try now, otherwise retry a few times for include.js injection timing
  if (boot()) return;

  let tries = 0;
  const t = setInterval(() => {
    tries++;
    if (boot() || tries >= 30) clearInterval(t); // ~3 seconds max
  }, 100);
})();
