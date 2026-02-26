/**
 * contact.js — Contact section animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initContact() {
  // ── Heading reveal ────────────────────────────────────────────
  gsap.to('.contact__heading-inner', {
    y: 0,
    duration: 1.1,
    stagger: 0.15,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 75%',
    },
  });

  // ── Links fade in ─────────────────────────────────────────────
  gsap.to('.contact__link', {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact__links',
      start: 'top 85%',
    },
  });

  // ── Footer ────────────────────────────────────────────────────
  gsap.from('.contact__footer', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact__footer',
      start: 'top 90%',
    },
  });
}
