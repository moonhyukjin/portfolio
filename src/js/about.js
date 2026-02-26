/**
 * about.js — About section: pinned scroll + sequential sentence SlideUp
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAbout(earthScene) {
  const sentences = gsap.utils.toArray('.about__sentence');

  // 초기 상태: 전부 숨김
  gsap.set(sentences, { y: 52, opacity: 0 });

  // ── 핀 고정 + 순차 SlideUp 타임라인 ─────────────────────────
  // end: '+= N * innerHeight' 만큼 스크롤하는 동안 섹션이 고정되며
  // 그 사이에 문장 3개가 순서대로 등장
  const pinDuration = window.innerHeight * (sentences.length + 0.8);

  // 카운터는 pin과 같은 ST의 onEnter로 연결 — 별도 ST 등록 시 spacer 오차 방지
  let countersRan = false;
  const runCounters = () => {
    if (countersRan) return;
    countersRan = true;
    document.querySelectorAll('.js-count-inline').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        delay: 0.2,
        onUpdate() {
          el.textContent = Math.round(obj.val);
        },
      });
    });
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about',
      start: 'top top',
      end: `+=${pinDuration}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      onEnter: runCounters,
    },
  });

  // 첫 번째 문장 (scrub 타임라인)
  tl.to(sentences[0], { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });

  // 두 번째, 세 번째 문장: 앞 문장 뒤에 간격 두고 등장
  sentences.slice(1).forEach((el) => {
    tl.to({}, { duration: 0.5 }); // 문장 사이 정지 구간
    tl.to(el, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
  });

  // 마지막 문장 뒤 여운 (핀이 바로 풀리지 않도록)
  tl.to({}, { duration: 0.4 });

  // ── 달: about 진입 시 항상 좌측에서 나타나도록 스냅 ─────────────
  // moonPivot.rotation.y = π + 2kπ 일 때 달이 지구 왼쪽에 위치
  const pivot = earthScene?.moonOrbit;
  if (pivot) {
    const snapMoonLeft = () => {
      const cur = pivot.rotation.y;
      const k = Math.ceil((cur - Math.PI) / (Math.PI * 2));
      gsap.to(pivot.rotation, {
        y: Math.PI + k * Math.PI * 2,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    ScrollTrigger.create({
      trigger: '.about',
      start: 'top 80%',
      onEnter: snapMoonLeft,
    });
  }

  // ── Earth positioning for about section ──────────────────────
  if (!earthScene?.mesh) return;
  const earth = earthScene.mesh;

  gsap.matchMedia().add({
    // 데스크탑: 우측에 배치, 수직 중앙
    '(min-width: 769px)': () => {
      gsap.to(earth.position, {
        x: 1.0,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top bottom',
          end: 'top 30%',
          scrub: 1.5,
        },
      });
    },

    // 모바일: 하단 중앙
    '(max-width: 768px)': () => {
      gsap.to(earth.position, {
        x: 0,
        y: -1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top bottom',
          end: 'top 30%',
          scrub: 1.5,
        },
      });
    },
  });
}
