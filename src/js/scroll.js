/**
 * scroll.js — Lenis smooth scroll + GSAP ScrollTrigger integration
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  });

  // Connect Lenis RAF to GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP lag smoothing so Lenis controls timing
  gsap.ticker.lagSmoothing(0);

  // Keep ScrollTrigger in sync with Lenis scroll position
  lenis.on('scroll', ScrollTrigger.update);

  // ── 개발용 마커 (확인 후 false로 변경) ──────────────────────────
  // ScrollTrigger.defaults({ markers: true });

  return lenis;
}

export function getLenis() {
  return lenis;
}

/**
 * Scroll to a target element or position smoothly via Lenis.
 * @param {string|number} target — CSS selector or scroll position
 */
export function scrollTo(target) {
  lenis?.scrollTo(target, { duration: 1.4 });
}
