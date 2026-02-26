/**
 * projects.js — 가로 타임라인 (연혁선) + 클릭 모달
 * - 중앙 수평선 기준으로 카드 위·아래 교대 배치
 * - 연도 마커 → 카드 슬롯 순서로 렌더링
 * - GSAP pin + scrub으로 세로 스크롤 → 가로 이동
 */

import { gsap } from 'gsap';
import { getLenis } from './scroll.js';

// ── 프로젝트 데이터 (총 41개, 실제 경력 + 팀 프로젝트) ─────────────────────────
const PROJECTS = [
  // === 2025 ===
  {
    index: 0,
    num: '01',
    client: 'SPC그룹',
    title: 'SPC 매거진\n리뉴얼',
    year: '2025',
    period: '2025.03 — 2025.04',
    role: '퍼블리싱',
    desc: 'SPC그룹 온라인 매거진 사이트를 WordPress 기반으로 부분 리뉴얼하는 작업을 담당했습니다. 기존 테마 구조를 유지하며 신규 섹션 마크업 및 스타일 작업을 진행했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/spc-magazine.png',
  },

  // === 2024 ===
  {
    index: 1,
    num: '02',
    client: '비비테리아',
    title: '비비테리아\n페이지 구축',
    year: '2024',
    period: '2024.12 — 2025.02',
    role: '퍼블리싱',
    desc: '비비테리아 브랜드 홈페이지를 WordPress 기반으로 신규 구축하는 작업을 담당했습니다. 커스텀 테마를 적용하여 반응형 레이아웃 및 콘텐츠 페이지를 퍼블리싱했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
  },
  {
    index: 2,
    num: '03',
    client: '라미체',
    title: '라미체\n몽골어 버전',
    year: '2024',
    period: '2024.11 — 2024.11',
    role: '퍼블리싱',
    desc: '라미체 기존 웹사이트의 몽골어 버전 구축을 담당했습니다. GSAP 기반 스크롤 인터랙션을 적용하며 다국어 대응 반응형 페이지를 퍼블리싱했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'GSAP'],
  },
  {
    index: 3,
    num: '04',
    client: 'BGF',
    title: 'BGF SC 포탈\n추가 개발',
    year: '2024',
    period: '2024.10 — 2024.10',
    role: '퍼블리싱',
    desc: 'BGF 공급업체 포탈(SC Portal) 추가 페이지 퍼블리싱을 단독으로 담당했습니다. 기존 디자인 시스템에 맞게 신규 메뉴 및 데이터 입력 UI를 마크업했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
  },
  {
    index: 4,
    num: '05',
    client: 'MY names',
    title: 'MY names\n소개 페이지',
    year: '2024',
    period: '2024.06 — 2024.06',
    role: '퍼블리싱',
    desc: 'MY names 브랜드 소개 랜딩페이지를 단독으로 구축했습니다. GSAP를 활용한 스크롤 인터랙션으로 브랜드 정체성을 시각적으로 전달하는 페이지를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'GSAP'],
    image: '/projects/my-names.png',
  },
  {
    index: 5,
    num: '06',
    client: 'Munkh',
    title: 'Munkh\n몽골 쇼핑몰',
    year: '2024',
    period: '2024.04 — 2024.06',
    role: '퍼블리싱',
    desc: '몽골 현지 쇼핑몰 munkh의 유지보수 작업에 참여했습니다. 퍼스트몰 CMS 기반으로 반응형 페이지를 관리하며 신규 UI 작업을 진행했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', '퍼스트몰 CMS'],
    image: '/projects/munkh.png',
  },

  // === 2023 ===
  {
    index: 6,
    num: '07',
    client: '전기기술인협회',
    title: '전기기술인협회\n홈페이지 리뉴얼',
    year: '2023',
    period: '2023.12 — 2024.05',
    role: '퍼블리싱',
    desc: '한국전기기술인협회 공식 홈페이지 전면 리뉴얼을 단독으로 담당했습니다. 사용자·관리자 페이지 전체를 반응형으로 퍼블리싱하며 기존 UI를 신규 디자인으로 통일했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/keea.png',
    featured: true,
  },
  {
    index: 7,
    num: '08',
    client: 'Easy Charger',
    title: 'Easy Charger\n웹앱',
    year: '2023',
    period: '2023.10 — 2024.01',
    role: '퍼블리싱',
    desc: 'EV 전기차 충전기 관리 웹앱의 사용자 페이지 퍼블리싱을 전담했습니다. 총 103개 사용자 화면을 반응형으로 구현하며 bottom-sheet draggable 기능을 직접 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/easy-charger.png',
    featured: true,
  },
  {
    index: 8,
    num: '09',
    client: 'KG MOBILITY',
    title: 'KG MOBILITY\n브랜드 사이트',
    year: '2023',
    period: '2023.05 — 2023.07',
    role: '퍼블리싱',
    desc: 'KG MOBILITY(구 쌍용자동차) 공식 홈페이지 구축 프로젝트에서 관리자 페이지 91개를 전담 퍼블리싱했습니다. Sneat Bootstrap 테마를 활용하여 일관된 관리자 UI를 구성했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'],
    image: '/projects/kg-mobility.png',
    featured: true,
  },
  {
    index: 9,
    num: '10',
    client: '삼성카드',
    title: '삼성카드\n프로모션 운영',
    year: '2023',
    period: '2023.03 — 2025.05',
    role: '퍼블리싱',
    desc: '삼성카드 월별 프로모션 랜딩페이지 제작 및 운영 업무를 담당했습니다. 매월 말 12시 정각 배포 사이클에 맞춰 진행하는 다양한 랜딩페이지를 반응형 마크업 및 QA를 지속적으로 진행했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/samsung-card.png',
    featured: true,
  },

  // === 2022 ===
  {
    index: 10,
    num: '11',
    client: '서울특별시',
    title: '서울시립병원\n소개 페이지',
    year: '2022',
    period: '2022.12 — 2022.12',
    role: '퍼블리싱',
    desc: '서울특별시 시립병원 소개 페이지를 단독으로 구축했습니다. Swiper를 활용한 슬라이드 구성과 clip-path 속성을 적용하여 공공기관 특성에 맞는 UI를 퍼블리싱했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Swiper'],
    image: '/projects/seoul-hospital.png',
  },
  {
    index: 11,
    num: '12',
    client: 'LG그룹',
    title: 'LG ESG\n사이트 구축',
    year: '2022',
    period: '2022.12 — 2023.01',
    role: '퍼블리싱',
    desc: 'LG그룹 ESG 페이지 추가 및 리뉴얼 작업에 참여했습니다. GSAP ScrollTrigger를 활용한 스크롤 인터랙션으로 그룹 지속가능경영 성과를 시각적으로 전달하는 페이지를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'GSAP', 'ScrollTrigger'],
    image: '/projects/lg-esg.gif',
    featured: true,
  },
  {
    index: 12,
    num: '13',
    client: '사자고',
    title: '사자고\n쇼핑몰',
    year: '2022',
    period: '2022.11 — 2023.05',
    role: '퍼블리싱',
    desc: '사자고 쇼핑몰 리뉴얼 프로젝트에서 관리자 페이지 55개를 전담 퍼블리싱했습니다. prefers-color-scheme 미디어쿼리를 활용하여 다크모드를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/sajago.png',
  },
  {
    index: 13,
    num: '14',
    client: 'BNP파리바 카디프생명',
    title: 'BNP파리바 카디프\n홈페이지 운영',
    year: '2022',
    period: '2022.10 — 2024.12',
    role: '유지보수 & 운영',
    desc: 'BNP파리바 카디프생명 공식 홈페이지 유지보수 및 신규 페이지 제작을 담당했습니다. Morpheus CMS를 활용하여 보험 상품 안내 페이지를 금융 규정에 맞게 안정적으로 운영했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Morpheus CMS'],
    image: '/projects/cardif.png',
    featured: true,
  },
  {
    index: 14,
    num: '15',
    client: '롯데이노베이트',
    title: '롯데 NFT\n플랫폼',
    year: '2022',
    period: '2022.10 — 2023.02',
    role: '프론트엔드 개발',
    desc: '롯데이노베이트 NFT 플랫폼 구축에 참여하여 사용자·관리자 페이지 퍼블리싱을 담당했습니다. React·Next.js 기반으로 styled-components를 활용한 CSS-in-JS 방식으로 컴포넌트를 구현했습니다.',
    stack: ['React', 'Next.js', 'styled-components', 'JavaScript'],
    image: '/projects/lotte-nft.png',
    featured: true,
  },
  {
    index: 15,
    num: '16',
    client: 'GRU',
    title: 'GRU\n주보',
    year: '2022',
    period: '2022.09 — 2022.09',
    role: '퍼블리싱',
    desc: 'GRU 디지털 주보 홈페이지의 사용자·관리자 페이지 전체를 단독으로 구축했습니다. Namespace Pattern을 활용하여 프로젝트별 반복 스크립트를 재사용 가능한 구조로 작성했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'],
  },
  {
    index: 16,
    num: '17',
    client: '킹덤스토리',
    title: '킹덤스토리\n게임 프로모션',
    year: '2022',
    period: '2022.08 — 2022.08',
    role: '퍼블리싱',
    desc: '모바일 게임 킹덤스토리 홍보 랜딩페이지를 단독으로 구축했습니다. fullpage.js 섹션 전환 시 GSAP 모션과 parallax 효과를 적용하여 게임 세계관을 몰입감 있게 전달했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'GSAP', 'fullpage.js', 'Swiper'],
    image: '/projects/kingdom-story.gif',
  },
  {
    index: 17,
    num: '18',
    client: '제나',
    title: '제나\n통합 관리자',
    year: '2022',
    period: '2022.04 — 2022.05',
    role: '프론트엔드 개발',
    desc: '제나 플랫폼 통합 관리자 대시보드 구축에 참여하여 관리자 페이지 퍼블리싱을 담당했습니다. React 기반으로 SVG 커스텀 차트와 Chart.js를 활용한 데이터 시각화 UI를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Chart.js'],
  },
  {
    index: 18,
    num: '19',
    client: '헤이마리',
    title: '헤이마리\n쇼핑몰',
    year: '2022',
    period: '2022.02 — 2023.05',
    role: '퍼블리싱',
    desc: '헤이마리 쇼핑몰 구축 및 장기 유지보수를 담당했습니다. WordPress child theme를 활용하여 테마를 커스터마이징하고 반응형 레이아웃과 콘텐츠 페이지를 지속 관리했습니다.',
    stack: ['WordPress', 'HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/heymari.png',
  },

  // === 2021 ===
  {
    index: 19,
    num: '20',
    client: '폭스바겐',
    title: '폭스바겐 아테온\n프로모션',
    year: '2021',
    period: '2021.12 — 2021.12',
    role: '퍼블리싱',
    desc: '폭스바겐 아테온 출시 프로모션 페이지를 단독으로 구축했습니다. video.js를 활용하여 영상 재생을 제어하고 각 영상 구간마다 텍스트 모션을 추가하여 차량 특장점을 전달했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'video.js'],
  },
  {
    index: 20,
    num: '21',
    client: '제나',
    title: '제나 BSMA\n플랫폼',
    year: '2021',
    period: '2021.09 — 2021.10',
    role: '퍼블리싱',
    desc: '제나 BSMA 플랫폼의 사용자 페이지 2개를 단독으로 구축했습니다. Swiper를 활용한 슬라이드 커스터마이징과 모달 흔들림 방지 처리를 적용했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Swiper'],
  },
  {
    index: 21,
    num: '22',
    client: '코맥스',
    title: '코맥스\n브랜드 사이트',
    year: '2021',
    period: '2021.08 — 2021.11',
    role: '퍼블리싱',
    desc: '코맥스 홈페이지 리뉴얼 프로젝트에서 사용자·관리자 페이지 퍼블리싱에 참여했습니다. JavaScript로 스크롤 인터랙션을 구현하며 영문 다국어 반응형 페이지를 작업했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/commax.gif',
    featured: true,
  },
  {
    index: 22,
    num: '23',
    client: '소프트웨어중심협의회 · 경기대',
    title: '소프트웨어중심협의회\n경기대학교',
    year: '2021',
    period: '2021.08 — 2021.11',
    role: '퍼블리싱',
    desc: '소프트웨어중심협의회 경기대학교 홈페이지 구축에서 전체 61개 페이지의 80%를 담당했습니다. Swiper의 direction: rtl 속성을 활용하여 역방향 슬라이드를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Swiper'],
    image: '/projects/kyonggi-univ.gif',
  },
  {
    index: 23,
    num: '24',
    client: '디지털트윈',
    title: '디지털트윈\n플랫폼 소개',
    year: '2021',
    period: '2021.08 — 2021.11',
    role: '퍼블리싱',
    desc: '디지털트윈 관리자 페이지 16개를 단독으로 구축했습니다. SVG를 활용하여 설계도 내부 각 영역에 호버 인터랙션을 구현한 것이 주요 작업이었습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'],
  },
  {
    index: 24,
    num: '25',
    client: 'SKYER, INC',
    title: 'SKYER, INC\n브랜드 사이트',
    year: '2021',
    period: '2021.08 — 2021.08',
    role: '퍼블리싱',
    desc: 'SKYER, INC 기업 브랜드 홈페이지 구축 프로젝트에서 전체 5개 페이지의 50%를 담당했습니다. Swiper와 AOS를 활용하여 적응형 기반의 인터랙션 페이지를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Swiper', 'AOS'],
    image: '/projects/skyer.png',
  },
  {
    index: 25,
    num: '26',
    client: '올코딩',
    title: '올코딩\n교육 플랫폼',
    year: '2021',
    period: '2021.06 — 2021.06',
    role: '퍼블리싱',
    desc: '코딩 교육 플랫폼 올코딩의 사용자 페이지 3개를 담당하여 구축했습니다. WordPress 테마 및 CMS를 활용하여 강의 목록·수강 페이지를 반응형으로 퍼블리싱했습니다.',
    stack: ['WordPress', 'HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/allcoding.png',
  },
  {
    index: 26,
    num: '27',
    client: '반품마켓',
    title: '반품마켓\n쇼핑몰',
    year: '2021',
    period: '2021.04 — 2021.08',
    role: '퍼블리싱',
    desc: '반품마켓 퍼블리싱 프로젝트에서 관리자 페이지 24개를 전담하고 사용자 페이지 일부를 담당했습니다. 웹앱 형식에 맞춰 jquery.mobile을 활용하여 모바일 UI를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'jquery.mobile', 'Bootstrap'],
    image: '/projects/return-market.png',
  },
  {
    index: 27,
    num: '28',
    client: '트리플에이전시',
    title: '커리업로드\nReact Native 앱',
    year: '2021',
    period: '2021.04 — 2021.06',
    role: '앱 개발',
    desc: '트리플에이전시 커리어 관리 앱 퍼블리싱 프로젝트에 참여하여 54개 화면 중 30%를 담당했습니다. React Native 기반으로 앱 화면을 구현하며 첫 모바일 앱 퍼블리싱을 경험했습니다.',
    stack: ['React Native', 'JavaScript', 'CSS-in-JS'],
    image: '/projects/triple-agency.png',
    featured: true,
  },
  {
    index: 28,
    num: '29',
    client: 'WWF 코리아',
    title: 'WWF\n어스아워 캠페인',
    year: '2021',
    period: '2021.03 — 2021.03',
    role: '퍼블리싱',
    desc: 'WWF 코리아 어스아워 환경 캠페인 페이지 2개를 단독으로 구축했습니다. 호버 이벤트를 모바일 환경에서 클릭 이벤트로 전환하는 처리를 적용하여 반응형 인터랙션을 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/wwf-earth-hour.png',
  },
  {
    index: 29,
    num: '30',
    client: '잼메이츠',
    title: '잼메이츠\n커뮤니티 플랫폼',
    year: '2021',
    period: '2021.03 — 계속',
    role: '퍼블리싱',
    desc: '음악인 커뮤니티 플랫폼 잼메이츠의 구축 및 유지보수를 담당했습니다. WordPress CMS와 Swiper coverflow 모드를 활용하여 팀 매칭 기능의 반응형 페이지를 구현했습니다.',
    stack: ['WordPress', 'HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Swiper'],
    image: '/projects/jammates.png',
  },
  {
    index: 30,
    num: '31',
    client: '고마바이오텍',
    title: '고마바이오텍\n홈페이지',
    year: '2021',
    period: '2021.02 — 2021.03',
    role: '퍼블리싱',
    desc: '고마바이오텍 관리자 홈페이지 75개 페이지를 단독으로 구축했습니다. Bootstrap 템플릿을 기반으로 반응형 관리자 UI를 구성하며 Bootstrap 활용 역량을 키웠습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'],
    image: '/projects/komabiotech.png',
  },
  {
    index: 31,
    num: '32',
    client: '닥터킨베인',
    title: '닥터킨베인\n의료 홈페이지',
    year: '2021',
    period: '2021.02 — 2021.05',
    role: '퍼블리싱',
    desc: '닥터킨베인 홈페이지 구축에서 전체 73개 페이지의 95%를 담당했습니다. 이미지와 텍스트가 혼합된 레이아웃에서 반응형 이질감을 없애기 위해 vw 단위를 활용하여 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/dr-kinbane.png',
  },
  {
    index: 32,
    num: '33',
    client: '스타폴리오',
    title: '스타폴리오\n포트폴리오 플랫폼',
    year: '2021',
    period: '2021.01 — 2021.02',
    role: '퍼블리싱',
    desc: '스타폴리오 홈페이지 구축 프로젝트에 참여하여 48개 페이지 중 일부를 담당했습니다. 다양한 해상도에서 깨지지 않는 반응형 테이블을 구현하는 작업을 진행했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/starfolio.png',
  },

  // === 2020 ===
  {
    index: 33,
    num: '34',
    client: '한샘',
    title: '한샘\n홈플래너',
    year: '2020',
    period: '2020.12 — 2020.12',
    role: '퍼블리싱',
    desc: '한샘 홈플래너 서비스 소개 랜딩페이지 1개를 단독으로 구축했습니다. HTML/CSS/jQuery를 활용하여 반응형 레이아웃을 퍼블리싱했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/hanssem-homeplanner.png',
  },
  {
    index: 34,
    num: '35',
    client: '코인버틀러',
    title: '코인버틀러\n핀테크 서비스',
    year: '2020',
    period: '2020.11 — 2020.11',
    role: '퍼블리싱',
    desc: '코인버틀러 랜딩페이지 및 관리자 페이지 총 10개를 단독으로 구축했습니다. 사용자 페이지는 반응형으로 직접 구현하고, 관리자 페이지는 Bootstrap 템플릿을 적용하여 구성했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'],
    image: '/projects/coin-butler.png',
  },
  {
    index: 35,
    num: '36',
    client: 'KT · 제나',
    title: '제나 KT MEC\n플랫폼',
    year: '2020',
    period: '2020.12 — 2020.12',
    role: '퍼블리싱',
    desc: '제나 KT MEC 사용자 페이지 구축 프로젝트에서 전체 22개 페이지의 20%를 담당했습니다. flex 레이아웃을 활용하여 반응형 페이지를 구현했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
  },
  {
    index: 36,
    num: '37',
    client: '제나',
    title: '제나 규제자유특구\n플랫폼',
    year: '2020',
    period: '2020.11 — 2020.11',
    role: '퍼블리싱',
    desc: '제나 규제 자유특구 홈페이지 2개 페이지를 단독으로 구축했습니다. Slick를 활용한 슬라이드 커스터마이징을 적용하여 반응형 페이지를 퍼블리싱했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Slick'],
  },
  {
    index: 37,
    num: '38',
    client: '한국야쿠르트',
    title: '한국야쿠르트\n랜선 견학',
    year: '2020',
    period: '2020.10 — 2020.10',
    role: '퍼블리싱',
    desc: '한국야쿠르트 랜선 견학 홈페이지 추가 개발에 참여하여 5개 페이지의 50%를 담당했습니다. HTML/CSS/jQuery를 활용하여 이벤트 페이지를 반응형으로 퍼블리싱했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/yakult-tour.png',
  },
  {
    index: 38,
    num: '39',
    client: '랩스온라인',
    title: '랩스온라인\n교육 플랫폼',
    year: '2020',
    period: '2020.09 — 2020.10',
    role: '퍼블리싱',
    desc: '랩스온라인 사용자 페이지 구축 프로젝트에 참여하여 전체 17개 페이지의 일부를 담당했습니다. HTML/CSS/jQuery를 활용하여 반응형 페이지를 퍼블리싱한 첫 실무 프로젝트였습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/labs-online.png',
  },
  {
    index: 39,
    num: '40',
    client: '현대큐밍',
    title: '현대큐밍\n브랜드 사이트',
    year: '2020',
    period: '2020.09 — 2020.12',
    role: '퍼블리싱',
    desc: '현대큐밍 홈페이지 유지보수 프로젝트에 참여하여 전체 작업의 40%를 담당했습니다. HTML/CSS/jQuery를 활용하여 기존 페이지 수정 및 신규 페이지 작업을 진행했습니다.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    image: '/projects/hyundai-cuming.png',
  },

  // === 2026 (팀 프로젝트) ===
  {
    index: 40,
    num: '41',
    client: '9DOG',
    title: '9DOG\n프론트엔드 팀포트폴리오',
    year: '2026',
    period: '2026.01 — 2026.02',
    role: '기획, 디자인, 퍼블리싱, 프론트엔드',
    desc: '프론트엔드 부트캠프 팀 프로젝트로, 반려견 맞춤 사료 및 간식 정기구독 서비스를 구축했습니다. 기획부터 디자인, 퍼블리싱, 프론트엔드 개발까지 전 과정을 팀원들과 함께 담당했습니다.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
    image: '/projects/9Dog.png',
    type: '팀프로젝트',
    featured: true,
    link: 'https://github.com/FRONTENDBOOTCAMP-15th/final-06-GuDog?tab=readme-ov-file#9dog---%EB%B0%98%EB%A0%A4%EA%B2%AC-%EB%A7%9E%EC%B6%A4-%EC%82%AC%EB%A3%8C-%EB%B0%8F-%EA%B0%84%EC%8B%9D-%EC%A0%95%EA%B8%B0%EA%B5%AC%EB%8F%85-%EC%84%9C%EB%B9%84%EC%8A%A4',
  },
];

export function initProjects() {
  const track = document.getElementById('projectsTimeline');
  if (!track) return;

  const { yearEls, yearsList } = _renderTimeline(track);

  // 렌더 직후 (GSAP 이동 전) 자연 위치 기록
  const trackRect = track.getBoundingClientRect();
  const yearOffsets = {};
  yearsList.forEach((year) => {
    yearOffsets[year] = yearEls[year].getBoundingClientRect().left - trackRect.left;
  });

  const getScrollAmt = () => -(track.scrollWidth - window.innerWidth);

  const st = _initHorizontalScroll(track, getScrollAmt, (self) => {
    _updateActiveBtn(self.progress, getScrollAmt, yearOffsets, yearsList);
  });

  _initModal(track);
  _initYearNav(track, st, getScrollAmt, yearOffsets);
}

// ── 프로젝트 유형 & 타입 색상 ────────────────────────────────────
const TYPE_COLORS = {
  신규작업: '#22c55e', // 에메랄드 그린 — 성장, 새 출발
  리뉴얼작업: '#60a5fa', // 소프트 블루 — 개선, 변화
  운영건: '#f59e0b', // 앰버 — 지속성, 안정
  팀프로젝트: '#a78bfa', // 바이올렛 — 협업, 개인 작업
};

function _getProjectType(p) {
  if (p.type) return p.type;
  if (p.title.includes('리뉴얼')) return '리뉴얼작업';
  if (p.period.includes('계속') || p.role.includes('유지보수') || p.title.includes('추가 개발'))
    return '운영건';
  return '신규작업';
}

// ── 타임라인 렌더링 ──────────────────────────────────────────────
function _renderTimeline(track) {
  // 최신순 정렬 & 연도 그룹핑
  const sorted = [...PROJECTS].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  const yearsList = [];
  const byYear = {};
  sorted.forEach((p) => {
    if (!byYear[p.year]) {
      byYear[p.year] = [];
      yearsList.push(p.year);
    }
    byYear[p.year].push(p);
  });

  const yearEls = {}; // year → DOM element
  let slotIdx = 0; // 위·아래 교대

  yearsList.forEach((year) => {
    // 연도 마커
    const yearEl = document.createElement('div');
    yearEl.className = 'tl-year-slot';
    yearEl.dataset.year = year;
    yearEl.innerHTML = `
      <div class="tl-slot__mid">
        <span class="tl-year-label">${year}</span>
      </div>
    `;
    track.appendChild(yearEl);
    yearEls[year] = yearEl;

    // 카드 슬롯
    byYear[year].forEach((p) => {
      const isAbove = slotIdx % 2 === 0;
      slotIdx++;

      const slot = document.createElement('div');
      slot.className = `tl-slot tl-slot--${isAbove ? 'above' : 'below'}`;
      const type = _getProjectType(p);
      const typeColor = TYPE_COLORS[type];
      slot.style.setProperty('--accent', typeColor);

      slot.innerHTML = `
        <div class="project-card${p.featured ? ' project-card--featured' : ''}" data-index="${p.index}" role="button" tabindex="0" aria-label="${p.title.replace('\n', ' ')} 상세보기">
          <div class="project-card__body">
            <div class="project-card__head">
              <span class="project-card__category" data-type="${type}" style="--badge-color:${typeColor}; --badge-bg:${typeColor}1f;">${type}</span>
              <span class="project-card__num">${p.num} / 41</span>
            </div>
            <p class="project-card__client">${p.client}</p>
            <h3 class="project-card__title">${p.title.replace('\n', '<br>')}</h3>
            <div class="project-card__foot">
              <span class="project-card__year">${p.year}</span>
              <span class="project-card__cta">View detail →</span>
            </div>
          </div>
        </div>
        <div class="tl-slot__mid">
          <span class="tl-dot"></span>
        </div>
      `;
      track.appendChild(slot);
    });
  });

  return { yearEls, yearsList };
}

// ── GSAP 가로 스크롤 ──────────────────────────────────────────────
function _initHorizontalScroll(track, getScrollAmt, onUpdate) {
  const tween = gsap.to(track, {
    x: getScrollAmt,
    ease: 'none',
    scrollTrigger: {
      trigger: '.projects',
      start: 'top top',
      end: () => `+=${Math.abs(getScrollAmt())}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate,
    },
  });
  return tween.scrollTrigger;
}

// ── 연도 네비게이션 ───────────────────────────────────────────────
function _initYearNav(_track, st, getScrollAmt, yearOffsets) {
  const nav = document.getElementById('projectsYearNav');
  if (!nav) return;

  nav.querySelectorAll('.year-nav__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const year = btn.dataset.year;
      const slotPos = yearOffsets[year] ?? 0;
      const totalAmt = Math.abs(getScrollAmt());
      const progress = Math.max(0, Math.min(1, slotPos / totalAmt));
      const targetY = st.start + progress * (st.end - st.start);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

// ── 활성 연도 버튼 업데이트 ───────────────────────────────────────
function _updateActiveBtn(progress, getScrollAmt, yearOffsets, yearsList) {
  const currentX = progress * Math.abs(getScrollAmt());
  let activeYear = yearsList[0];

  yearsList.forEach((year) => {
    // 해당 연도 마커가 뷰포트 왼쪽 절반을 지나쳤으면 활성
    if (yearOffsets[year] <= currentX + window.innerWidth * 0.4) {
      activeYear = year;
    }
  });

  document.querySelectorAll('.year-nav__btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.year === activeYear);
  });
}

// ── 라이트박스 ───────────────────────────────────────────────────
function _initLightbox() {
  const lb = document.createElement('div');
  lb.className = 'img-lightbox';
  lb.innerHTML = `
    <img class="img-lightbox__img" alt="" />
    <button class="img-lightbox__close" aria-label="닫기">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 2l12 12M14 2L2 14" />
      </svg>
    </button>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.img-lightbox__img');
  const closeLb = () => lb.classList.remove('is-open');

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLb();
  });
  lb.querySelector('.img-lightbox__close').addEventListener('click', closeLb);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
  });

  return { lb, lbImg };
}

// ── 모달 ─────────────────────────────────────────────────────────
function _initModal(track) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const backdrop = modal.querySelector('.project-modal__backdrop');
  const closeBtn = modal.querySelector('.project-modal__close');
  const modalImg = modal.querySelector('#modalImg');
  const { lb, lbImg } = _initLightbox();

  // 모달 이미지 클릭 → 라이트박스
  modalImg.addEventListener('click', () => {
    if (modalImg.hidden || !modalImg.src) return;
    lbImg.src = modalImg.src;
    lbImg.alt = modalImg.alt;
    lb.classList.add('is-open');
  });

  // 카드 클릭 (data-index가 있는 .project-card)
  track.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card[data-index]');
    if (!card) return;
    _openModal(modal, PROJECTS[parseInt(card.dataset.index, 10)]);
  });

  track.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.project-card[data-index]');
    if (!card) return;
    e.preventDefault();
    _openModal(modal, PROJECTS[parseInt(card.dataset.index, 10)]);
  });

  const close = () => _closeModal(modal);
  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      modal.classList.contains('is-open') &&
      !lb.classList.contains('is-open')
    )
      close();
  });
}

function _openModal(modal, data) {
  const type = _getProjectType(data);
  const accent = TYPE_COLORS[type];

  modal.querySelector('#modalCategory').textContent = type;
  modal.querySelector('#modalTitle').textContent = data.title.replace('\n', ' ');
  modal.querySelector('#modalClient').textContent = data.client;
  modal.querySelector('#modalPeriod').textContent = data.period;
  modal.querySelector('#modalRole').textContent = data.role;
  modal.querySelector('#modalDesc').textContent = data.desc;

  modal.querySelector('#modalStack').innerHTML = data.stack
    .map((s) => `<li class="modal-tag">${s}</li>`)
    .join('');

  const linkEl = modal.querySelector('#modalLink');
  if (data.link) {
    linkEl.href = data.link;
    linkEl.hidden = false;
  } else {
    linkEl.hidden = true;
  }

  const imgEl = modal.querySelector('.project-modal__image');
  const img = modal.querySelector('#modalImg');
  const deco = modal.querySelector('#modalDeco');
  if (data.image) {
    img.src = data.image;
    img.alt = data.title.replace('\n', ' ');
    img.hidden = false;
    deco.hidden = true;
    imgEl.classList.add('has-image');
    imgEl.style.removeProperty('background');
    imgEl.style.removeProperty('--accent');
  } else {
    img.hidden = true;
    img.src = '';
    deco.hidden = false;
    imgEl.classList.remove('has-image');
    imgEl.style.background = '#0a0a0f';
    imgEl.style.setProperty('--accent', accent);
  }

  modal.dataset.savedScrollY = window.scrollY; // 현재 위치 저장
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  getLenis()?.stop();

  gsap.fromTo(
    '.project-modal__container',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
  );
}

function _closeModal(modal) {
  gsap.to('.project-modal__container', {
    y: 24,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      // 저장된 위치로 먼저 복원 후 overflow 해제 (ST 점프 방지)
      window.scrollTo({ top: parseInt(modal.dataset.savedScrollY ?? 0, 10), behavior: 'instant' });
      document.body.style.overflow = '';
      getLenis()?.start();
    },
  });
}
