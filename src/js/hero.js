/**
 * hero.js — Hero entrance + scroll-driven earth animation
 *
 * Earth behavior:
 *  - Hero:  centered, large
 *  - Scroll: drifts to top-right, shrinks moderately — stays visible throughout
 *  - Never leaves the viewport (lenis.darkroom.engineering 스타일)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHero(earthScene) {
  // ── Entrance animation ────────────────────────────────────────
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.call(() => document.documentElement.classList.remove('is-loading'));

  tl.to('.hero__name-inner', { y: 0, duration: 1.2, ease: 'power4.out' }, 0.3);
  tl.to('.hero__eyebrow', { y: 0, opacity: 1, duration: 0.8 }, 0.7);
  tl.to('.hero__title', { y: 0, opacity: 1, duration: 0.8 }, 0.9);
  tl.to('.hero__badge', { opacity: 1, duration: 1 }, 1.2);

  if (!earthScene?.mesh) return;

  const earth = earthScene.mesh;

  // ── Earth entrance scale-in ───────────────────────────────────
  // hero 안에서 로드된 경우에만 진입 애니메이션 실행
  // 이미 스크롤된 상태면 scrub tween이 올바른 scale로 초기화하도록 위임
  const heroEl = document.querySelector('.hero');
  const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : window.innerHeight;

  if (heroBottom > 0) {
    gsap.set(earth.scale, { x: 0.3, y: 0.3, z: 0.3 });
    gsap.to(earth.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: 'power3.out',
      delay: 0.2,
    });
  }

  // ── Hero text fade on scroll ──────────────────────────────────
  gsap.to('.hero__content', {
    opacity: 0,
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '50% top',
      scrub: true,
    },
  });

  // ── Earth: hero 벗어날 때 우상단으로 이동 + 축소 ─────────────────
  // 카메라(z=4.5, fov=45, 16:9) 수평 가시 범위 ≈ ±3.3 world units
  // 달 궤도(r=2.6) 포함 고려 → x=1.2, scale=0.5로 화면 안에 유지
  gsap.to(earth.position, {
    x: 1.2,
    y: 0.6,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    },
  });

  // fromTo로 FROM 값(1.0)을 명시 — scrub이 시작 크기를 항상 1.0으로 보장
  gsap.fromTo(
    earth.scale,
    { x: 1, y: 1, z: 1 },
    {
      x: 0.5,
      y: 0.5,
      z: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    },
  );

  // ── 스크롤 기반 추가 회전 ──────────────────────────────────────
  gsap.to(earth.rotation, {
    y: Math.PI * 2,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });
}
