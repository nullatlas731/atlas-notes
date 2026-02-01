(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ===== Year in footer
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Theme toggle (persisted)
  const themeToggle = $('[data-theme-toggle]');
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', storedTheme);
  } else {
    // Default: dark
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const updateThemeIcon = () => {
    if (!themeToggle) return;
    const t = document.documentElement.getAttribute('data-theme');
    themeToggle.innerHTML = t === 'light' ? '<span aria-hidden="true">☀</span>' : '<span aria-hidden="true">☾</span>';
  };
  updateThemeIcon();

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
  });

  // ===== Active nav link highlight
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $$('[data-navlink]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.classList.add('active');
  });

  // ===== Mobile nav toggle
  const nav = $('[data-nav]');
  const navToggle = $('[data-nav-toggle]');
  navToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(!!isOpen));
  });

  // Close mobile nav when clicking a link
  $$('[data-navlink]').forEach(a => {
    a.addEventListener('click', () => {
      if (nav?.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ===== Projects filter
  const chips = $$('.chip');
  const projects = $$('.project');
  if (chips.length && projects.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.dataset.filter || 'all';
        projects.forEach(card => {
          const tags = (card.dataset.tags || '').toLowerCase().split(/\s+/).filter(Boolean);
          const show = filter === 'all' || tags.includes(filter);
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  // ===== Contact form validation (front-end only)
  const form = $('[data-contact-form]');
  const status = $('[data-form-status]');
  const setStatus = (msg) => { if (status) status.textContent = msg; };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements.namedItem('name')?.value?.trim() || '';
    const email = form.elements.namedItem('email')?.value?.trim() || '';
    const message = form.elements.namedItem('message')?.value?.trim() || '';

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name.length < 2) return setStatus('Please enter a name (at least 2 characters).');
    if (!emailOk) return setStatus('Please enter a valid email address.');
    if (message.length < 10) return setStatus('Please write a message (at least 10 characters).');

    // No backend: simulate success
    setStatus('Message looks good ✅ (No backend connected — wire it up to actually send.)');
    form.reset();
  });
})();
