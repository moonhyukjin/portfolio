/**
 * main.js — Portfolio entry point
 *
 * Init order:
 *  1. SCSS styles
 *  2. Lenis smooth scroll + GSAP ScrollTrigger
 *  3. Three.js Earth scene
 *  4. Section animations
 *  5. Navigation
 */

import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './scss/main.scss';

import { initScroll } from './js/scroll.js';
import { initEarth } from './js/earth.js';
import { initNav } from './js/nav.js';
import { initHero } from './js/hero.js';
import { initAbout } from './js/about.js';
import { initSkills } from './js/skills.js';
import { initProjects } from './js/projects.js';
import { initContact } from './js/contact.js';

// ── 1. Smooth scroll (must be first) ─────────────────────────────
initScroll();

// ── 2. Three.js Earth ────────────────────────────────────────────
const earth = initEarth();

// ── 3. Section animations ─────────────────────────────────────────
// Wait one tick so GSAP ScrollTrigger can measure layout
requestAnimationFrame(() => {
  initHero(earth);
  initAbout(earth);
  initSkills();
  initProjects();
  initContact();
  initNav();

  // 초기화 완료 → 로더 제거
  const loader = document.getElementById('page-loader');
  document.documentElement.classList.remove('is-loading');
  document.body.style.opacity = '';
  if (loader) {
    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }
});
