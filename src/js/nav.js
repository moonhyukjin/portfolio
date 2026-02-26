/**
 * nav.js — Navigation: scroll state, hamburger toggle, smooth anchor links
 */

import { scrollTo } from './scroll.js';

export function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  const allLinks = links?.querySelectorAll('a');

  // ── Scroll state (add .scrolled after 60px) ──────────────────
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Hamburger toggle ─────────────────────────────────────────
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    links.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ── Active section tracking ──────────────────────────────────
  const sections = ['about', 'skills', 'projects', 'contact'].map((id) =>
    document.getElementById(id),
  ).filter(Boolean);

  const setActive = (id) => {
    allLinks?.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((sec) => observer.observe(sec));

  // ── Smooth anchor scrolling via Lenis ────────────────────────
  allLinks?.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;

      e.preventDefault();

      // Close mobile menu if open
      hamburger?.classList.remove('open');
      links?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      const target = document.querySelector(href);
      if (target) scrollTo(target);
    });
  });
}
