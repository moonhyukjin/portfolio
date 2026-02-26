/**
 * skills.js — Skills & Experience section animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initSkills() {
  // ── Header reveal ─────────────────────────────────────────────
  gsap.from('.skills__header > *', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.skills__header',
      start: 'top 80%',
    },
  });

  // ── Skill cards staggered entrance ───────────────────────────
  gsap.to('.skill-card', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      grid: 'auto',
      from: 'start',
    },
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.skills__grid',
      start: 'top 80%',
    },
  });

  // ── Experience items ──────────────────────────────────────────
  gsap.to('.experience__item', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.experience__list',
      start: 'top 80%',
    },
  });

  // ── Education items ───────────────────────────────────────────
  gsap.to('.education__item', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.education__list',
      start: 'top 80%',
    },
  });

  // ── Accent line sweep on skill cards hover via CSS ────────────
  // (handled in SCSS via ::before pseudo element)
}
