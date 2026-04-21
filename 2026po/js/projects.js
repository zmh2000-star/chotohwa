/* ============================================
   프로젝트 데이터 & 필터 로직
   초토화 포트폴리오 2026
   노션 '프로젝트 20선' 기반 전면 재구성
   ============================================ */

// 프로젝트 데이터 (노션 프로젝트 20선 기반)
const PROJECTS = [

  /* ──────────────────────────────────────────
     카테고리 1: CRM·시스템/제품
     ────────────────────────────────────────── */
  {
    id: 'unin-crm-v2',
    title: 'UninCRM V2 — 바이브 코딩 기반 CRM 구축',
    category: 'crm',
    categoryLabel: 'CRM·시스템',
    year: '2026',
    role: 'Lead PM / Vibe Coder',
    desc: 'AI(Claude/Antigravity) 기반 바이브 코딩으로 Next.js + Supabase CRM 시스템을 1인 풀스택 구축. 대시보드, 고객관리, 예약/일정 캘린더 등 MVP 완성.',
    tags: ['Next.js', 'Supabase', 'AI', 'Vibe Coding'],
    achievement: '1인 풀스택 CRM 구축',
    color: '#9B59B6',
    icon: 'ai',
    featured: true,
    techStack: ['Next.js 14', 'Supabase(Postgres/RLS)', 'Tailwind/shadcn/ui', 'OpenAI API', 'Vercel'],
    details: [
      '대시보드: KPI 카드, 회원/등급 분포, 매출 추이, 활동 로그 실시간 시각화',
      '고객 관리: 통합 검색/필터, 리스트 테이블, 서버 액션 기반 고성능 필터링',
      '예약/일정: 월/주/일 캘린더, 신규 일정 등록, 타임존(KST) 이슈 해결',
      'AI 기반 컨설팅 노트 자동 생성, 고객 프로필 분석 기능',
      'Supabase RLS + pgvector 확장 고려한 스키마/아키텍처 설계'
    ],
    link: 'https://crm-project-six.vercel.app'
  },
  {
    id: 'crm-improvement',
    title: 'CRM 단계적 개선 전략 (As-Is → To-Be)',
    category: 'crm',
    categoryLabel: 'CRM·시스템',
    year: '2023–2025',
    role: 'IT 총괄 PM',
    desc: '레거시 CRM(카페24 기반)의 한계를 진단하고, 데이터 중심의 To-Be 아키텍처를 설계. 단계적 마이그레이션 로드맵 수립.',
    tags: ['CRM', '전략기획', '데이터설계'],
    achievement: 'To-Be 아키텍처 수립',
    color: '#2C3E50',
    icon: 'monitor',
    techStack: ['카페24', 'Google Sheets', 'Notion', 'ERD 설계'],
    details: [
      '기존 CRM(카페24) 한계점 진단 — 데이터 사일로, 수동 업무 과다',
      'To-Be 아키텍처 설계: API 연동 + 중앙 DB 통합 구조',
      '단계별 마이그레이션 로드맵 수립 (3단계, 18개월)',
      '비용-효과 시뮬레이션으로 경영진 설득'
    ]
  },
  {
    id: 'channel-talk',
    title: '채널톡 실시간 상담 개선 히스토리',
    category: 'crm',
    categoryLabel: 'CRM·시스템',
    year: '2022–2025',
    role: 'Service Planner',
    desc: '채널톡 도입부터 운영 최적화까지. 상담 시나리오 설계, 자동화 봇 구축, 상담 품질 KPI 관리 체계를 확립.',
    tags: ['채널톡', 'CS운영', '자동화'],
    achievement: '상담 응답률 90%+',
    color: '#1ABC9C',
    icon: 'shield',
    techStack: ['채널톡', '자동화 봇', 'KPI 대시보드'],
    details: [
      '채널톡 도입 전략 수립 및 초기 셋업',
      '상담 시나리오 트리 설계 (문의유형별 분기)',
      '자동 응답 봇 구축 — FAQ 자동 처리율 40% 달성',
      '상담 품질 KPI(응답시간, 해결률, CSAT) 대시보드 운영'
    ]
  },
  {
    id: 'privacy-process',
    title: '개인정보 삭제 프로세스 개선 (리스크 관리)',
    category: 'crm',
    categoryLabel: 'CRM·시스템',
    year: '2024',
    role: 'Project Lead',
    desc: '개인정보보호법 준수를 위한 체계적 삭제 프로세스 설계. 법적 리스크 최소화 및 운영 자동화를 동시에 달성.',
    tags: ['개인정보', '컴플라이언스', '리스크관리'],
    achievement: '법적 리스크 제로화',
    color: '#E74C3C',
    icon: 'shield',
    techStack: ['프로세스 설계', '법률 자문', '자동화 스크립트'],
    details: [
      '개인정보보호법 요구사항 분석 및 현행 갭 진단',
      '삭제 대상 데이터 분류 체계(보유기간별) 수립',
      '자동 삭제 스케줄러 설계 및 로그 감사 시스템 구축',
      '전사 교육 및 매뉴얼 배포'
    ]
  },

  /* ──────────────────────────────────────────
     카테고리 2: 데이터·그로스/리텐션
     ────────────────────────────────────────── */
  {
    id: 'rcs-retention',
    title: 'RCS 리텐션 캠페인 — 데이터 리터러시 기반 고객여정 개선',
    category: 'growth',
    categoryLabel: '데이터·그로스',
    year: '2024–2025',
    role: 'Growth Lead',
    desc: 'RCS 메시지를 활용한 고객 리텐션 캠페인. 데이터 분석 기반 고객 세그먼트 설계, A/B 테스트, 전환 퍼널 최적화.',
    tags: ['RCS', '리텐션', 'A/B테스트', '데이터'],
    achievement: '재구매율 2배 상승',
    color: '#3498DB',
    icon: 'megaphone',
    featured: true,
    techStack: ['RCS', 'Google Analytics', 'UTM 추적', 'A/B Testing'],
    details: [
      '고객 세그먼트별 RCS 메시지 시나리오 설계',
      'A/B 테스트를 통한 메시지 전환율 최적화',
      '고객 여정 퍼널 분석 — 이탈 지점 식별 및 개선',
      '데이터 리터러시 기반 의사결정 체계 구축'
    ]
  },
  {
    id: 'ad-tracking',
    title: '광고 유입 채널 트래킹 / ROAS 산출 체계',
    category: 'growth',
    categoryLabel: '데이터·그로스',
    year: '2023–2025',
    role: 'Data Planner',
    desc: 'GTM + UTM 기반 광고 채널별 유입-전환 추적 체계 구축. ROAS 자동 산출 대시보드로 마케팅 비용 최적화.',
    tags: ['GTM', 'ROAS', 'GA4', '데이터분석'],
    achievement: 'ROAS 측정 체계 확립',
    color: '#F39C12',
    icon: 'monitor',
    techStack: ['Google Tag Manager', 'GA4', 'UTM', 'Data Studio'],
    details: [
      'GTM 태깅 아키텍처 설계 — 채널별 트래킹 통합',
      'UTM 파라미터 관리 체계 및 네이밍 컨벤션 수립',
      'ROAS 자동 산출 대시보드 구축 (GA4 + Looker Studio)',
      '채널별 비용 대비 전환 성과 분석 → 예산 재배분 의사결정 지원'
    ]
  },
  {
    id: 'landing-sprint',
    title: '랜딩 스프린트 — 전환율 6~10배 개선 실험',
    category: 'growth',
    categoryLabel: '데이터·그로스',
    year: '2020–2024',
    role: 'Sprint Lead / UX Designer',
    desc: '구글 디자인 스프린트 방법론 도입. 퍼플스·디노블·르매리 랜딩페이지의 DB 전환율을 6~10배 향상.',
    tags: ['Design Sprint', 'CRO', 'UX', '전환율'],
    achievement: '전환율 10배 향상',
    color: '#FF3366',
    icon: 'rocket',
    featured: true,
    techStack: ['Figma', 'Google Sprint', 'Hotjar', 'GA4'],
    details: [
      '구글 디자인 스프린트 5일 프레임워크 국내 결혼정보 업계 최초 도입',
      '히트맵/스크롤맵 분석 → CTA 위치·카피 최적화',
      '다안(Multi-variant) 랜딩 A/B 테스트 — 최적 조합 도출',
      'DB 전환율 기존 대비 6~10배 향상 (퍼플스/디노블/르매리)'
    ]
  },

  /* ──────────────────────────────────────────
     카테고리 3: 브랜딩/IMC·콘텐츠
     ────────────────────────────────────────── */
  {
    id: 'imc-plan',
    title: 'IMC 통합 마케팅 커뮤니케이션 플랜',
    category: 'brand',
    categoryLabel: '브랜딩·콘텐츠',
    year: '2025',
    role: 'Marketing Planner',
    desc: '온·오프라인 채널을 아우르는 통합 마케팅 커뮤니케이션 전략. 브랜드 메시지 일관성 확보 및 채널별 KPI 설계.',
    tags: ['IMC', '마케팅전략', '브랜딩'],
    achievement: '통합 커뮤니케이션 체계',
    color: '#8E44AD',
    icon: 'megaphone',
    techStack: ['전략 프레임워크', '미디어 플래닝', 'ROI 분석'],
    details: [
      '브랜드 메시지 아키텍처(MSA) 수립',
      '채널별(디지털/오프라인/PR) 미디어 믹스 최적화',
      '연간 캠페인 캘린더 및 KPI 설계',
      '예산 배분 시뮬레이션 및 ROI 측정 체계'
    ]
  },
  {
    id: 'purples-renewal',
    title: '퍼플스 홈페이지 리뉴얼 (프리미엄 톤&매너)',
    category: 'brand',
    categoryLabel: '브랜딩·콘텐츠',
    year: '2017–2023',
    role: 'Product Owner / Designer',
    desc: '상류층 결혼정보회사의 프리미엄 브랜드 아이덴티티를 웹에 구현. 리뉴얼 이후 역대 최고 매출, 부산·대전 지사 확장.',
    tags: ['웹리뉴얼', 'Branding', 'UX/UI'],
    achievement: '역대 최고 매출 달성',
    color: '#C0392B',
    icon: 'crown',
    featured: true,
    techStack: ['Figma/Photoshop', 'HTML/CSS/JS', '반응형', 'SEO'],
    details: [
      '프리미엄 타겟 대상 브랜드 톤&매너 수립',
      'UX 리서치 기반 정보 아키텍처(IA) 재설계',
      '반응형 웹 구현 및 SEO 최적화',
      '리뉴얼 이후 역대 최고 매출 효과, 추가 지사(부산, 대전) 설립 기여'
    ],
    link: 'https://www.purples.co.kr/'
  },
  {
    id: 'video-content',
    title: '영상/콘텐츠 운영 개선 (레퍼런스/운영 체계)',
    category: 'brand',
    categoryLabel: '브랜딩·콘텐츠',
    year: '2023–2025',
    role: 'Content Director',
    desc: '사내 영상 콘텐츠 제작 프로세스 표준화. 레퍼런스 아카이빙 시스템, 외주 관리 체계, 콘텐츠 캘린더 운영.',
    tags: ['콘텐츠', '영상제작', '운영체계'],
    achievement: '콘텐츠 제작 프로세스 표준화',
    color: '#E67E22',
    icon: 'palette',
    techStack: ['영상 기획', 'Notion', '외주 관리'],
    details: [
      '영상 콘텐츠 레퍼런스 아카이빙 시스템 구축 (Notion DB)',
      '외주 제작사 관리 프로세스 표준화',
      '콘텐츠 캘린더 운영 및 SNS 채널 연동',
      '브랜드 가이드라인 기반 퀄리티 관리 체크리스트'
    ]
  },

  /* ──────────────────────────────────────────
     카테고리 4: 제휴/B2B·신사업
     ────────────────────────────────────────── */
  {
    id: 'b2b-integrated',
    title: 'B2B 통합 제휴 마케팅 & 영업 전개',
    category: 'biz',
    categoryLabel: 'B2B·신사업',
    year: '2026',
    role: 'Lead PM',
    desc: '세일즈 키트, 랜딩, 리드 관리, 추적, 마케팅 인프라를 연결한 B2B 통합 제휴 파이프라인 시스템 구축.',
    tags: ['B2B', 'GTM', '세일즈', '파이프라인'],
    achievement: '제휴 파이프라인 확립',
    color: '#27AE60',
    icon: 'store',
    featured: true,
    techStack: ['GTM', '랜딩 빌더', '마케팅 분석', 'CRM'],
    details: [
      '제안 → 리드 수집 → 리텐션 → 운영 흐름을 빠르게 구현',
      '랜딩 1~5호, 시크릿 페이지, 프라이빗 혜택관 등 구축',
      'GTM 및 추적 데이터를 활용한 마케팅 성과 측정 기틀 마련',
      '실물 중심 조직을 디지털 퍼널로 전환 — 경영진 설득 포함'
    ]
  },
  {
    id: 'b2b-landing',
    title: 'B2B 제휴 랜딩/관리자 페이지 (초고속 구현)',
    category: 'biz',
    categoryLabel: 'B2B·신사업',
    year: '2026',
    role: 'Product / Full-Stack',
    desc: '기획부터 디자인, 개발까지 초고속 구현. 제휴사별 맞춤 랜딩 + 관리자 대시보드를 2주 내 전달.',
    tags: ['초고속', '랜딩', '풀스택'],
    achievement: '2주 내 전체 구현',
    color: '#16A085',
    icon: 'rocket',
    techStack: ['HTML/CSS/JS', 'Notion', '반응형 랜딩'],
    details: [
      '기획-디자인-퍼블리싱-QA 전 과정 1인 수행',
      '제휴사별 맞춤형 랜딩 5종 + 공통 관리자 페이지 구축',
      'UTM 기반 제휴 채널별 전환 트래킹 연동',
      '2주 내 전체 구현 완료 — 리소스 최소화 성과 극대화'
    ]
  },

  /* ──────────────────────────────────────────
     카테고리 5: 인수/운영·조직
     ────────────────────────────────────────── */
  {
    id: 'sister-network',
    title: '언니의인맥 인수 및 운영 PM',
    category: 'org',
    categoryLabel: '인수/운영·조직',
    year: '2024–2025',
    role: 'Project Lead',
    desc: '결혼정보회사 인수 이후 운영 안정화 총괄. 실사·인수인계 체계화, 성과/리스크 진단, PG 도입 등 인프라 재정비.',
    tags: ['PMI', 'ROAS', '운영안정화'],
    achievement: 'PMI 안정화 완료',
    color: '#2980B9',
    icon: 'shield',
    techStack: ['데이터분석', '결제 인프라(토스페이먼츠)', 'KPI 설계'],
    details: [
      '실사/인수인계 자료 체계화 및 체크리스트 기반 진행 관리',
      '여정 기반 매출 분석, 서베이, VoE로 정성/정량 인사이트 확보',
      'PG(토스페이먼츠) 도입 등 결제/운영 인프라 재정비',
      '안정화 후 성과 지표 기반 운영 최적화 방향 도출'
    ]
  },
  {
    id: 'flow-collab',
    title: '협업툴 FLOW 전사 시범 운영',
    category: 'org',
    categoryLabel: '인수/운영·조직',
    year: '2022',
    role: 'Change Manager',
    desc: '협업툴(FLOW) 전사 도입을 위한 시범 운영 프로젝트. 업무 프로세스 디지털화 및 조직 문화 변혁 시도.',
    tags: ['협업도구', '조직변화', '디지털화'],
    achievement: '디지털 협업 문화 기반 조성',
    color: '#34495E',
    icon: 'store',
    techStack: ['FLOW', '업무 프로세스 설계', '변화관리'],
    details: [
      '협업 도구 비교 평가 및 FLOW 선정 근거 보고',
      'IT팀 중심 2개월 시범 운영 설계 및 실행',
      '부서별 업무 프로세스 템플릿 구축',
      '시범 운영 결과 보고 및 전사 확산 로드맵 제안'
    ]
  },
  {
    id: 'org-culture',
    title: 'IT/기획 조직문화·운영 체계 구축',
    category: 'org',
    categoryLabel: '인수/운영·조직',
    year: '2016–2025',
    role: 'IT총괄 / 기획본부장',
    desc: 'IT 인력 2명 → 20명까지 조직 확장. 채용, 온보딩, 평가체계, 개발 프로세스, 외주 관리 체계를 처음부터 설계.',
    tags: ['조직빌딩', '리더십', '프로세스'],
    achievement: '2명→20명 조직 빌딩',
    color: '#FF6600',
    icon: 'crown',
    featured: true,
    techStack: ['조직설계', '채용/온보딩', '성과관리', '애자일'],
    details: [
      'IT 인력 2명에서 20명까지 직접 채용·관리·육성',
      '개발/기획/디자인 협업 프로세스 표준화 (스프린트, 코드리뷰)',
      '성과 평가 체계 설계 및 전사 적용',
      '외주 개발사 관리 프로세스 (RFP, 평가, 검수 체크리스트)',
      '조직 문화 구축 — 1on1, 회고, 지식 공유 세션 정례화'
    ]
  },

  /* ──────────────────────────────────────────
     카테고리 6: 과거 포트폴리오 (디자인/개발)
     ────────────────────────────────────────── */
  {
    id: 'yanolja-chotohwa',
    title: '야놀자 초토화 — 서비스 리뉴얼 기획',
    category: 'legacy',
    categoryLabel: '디자인·개발',
    year: '2013',
    role: 'Service Planner / Designer',
    desc: '야놀자 전체 사이트 리뉴얼 기획. IA 설계부터 화면정의서까지 1인 완성. "초토화" 브랜드의 원점.',
    tags: ['서비스기획', '리뉴얼', 'IA'],
    achievement: '전체 서비스 IA 설계',
    color: '#FF5722',
    icon: 'map',
    techStack: ['Axure', 'Photoshop', '화면정의서'],
    details: [
      '야놀자 사이트 전체 리뉴얼 기획서 작성',
      '정보 아키텍처(IA) 설계 및 와이어프레임',
      '화면정의서 풀 세트 제작',
      '"초토화" 컨셉의 시작 — 강렬한 리뉴얼 제안'
    ],
    link: 'https://www.chotohwa.com/rock/sub/sub12.html'
  },
  {
    id: 'yanolja-community',
    title: '야놀자 커뮤니티 메인 리뉴얼',
    category: 'legacy',
    categoryLabel: '디자인·개발',
    year: '2013',
    role: 'Designer / Publisher',
    desc: '침체된 야놀자 커뮤니티 메인의 전면 리뉴얼. 기획부터 디자인, 코딩까지 원맨 프로젝트로 완수.',
    tags: ['디자인', '퍼블리싱', '리뉴얼'],
    achievement: '커뮤니티 활성화 기여',
    color: '#FF9800',
    icon: 'palette',
    techStack: ['Photoshop', 'HTML/CSS', 'jQuery'],
    details: [
      '기획부터 디자인, 퍼블리싱까지 전 과정 1인 수행',
      '침체된 커뮤니티의 사용자 참여율 개선',
      '이벤트 배너 시스템 및 카테고리 재설계'
    ],
    link: 'https://www.chotohwa.com/rock/sub/sub01.html'
  },
  {
    id: 'baroyeon-mobile',
    title: '바로연 모바일 리뉴얼',
    category: 'legacy',
    categoryLabel: '디자인·개발',
    year: '2019',
    role: 'Planner / Designer / Publisher',
    desc: '결혼정보회사 바로연의 모바일 사이트를 기획-디자인-퍼블리싱까지 전 과정 수행.',
    tags: ['모바일', 'UX/UI', '퍼블리싱'],
    achievement: '모바일 전환 완성',
    color: '#E91E63',
    icon: 'mobile',
    techStack: ['반응형 설계', 'HTML/CSS/JS', '모바일 UX'],
    details: [
      '모바일 퍼스트 UX 설계',
      '결혼정보회사 특성을 반영한 신뢰감 있는 디자인',
      'CTA 최적화 및 모바일 전환 퍼널 설계'
    ],
    link: 'https://www.chotohwa.com/rock/sub/sub15.html'
  },
  {
    id: 'hanatour-fnd',
    title: '하나투어 FND 화면정의서',
    category: 'legacy',
    categoryLabel: '디자인·개발',
    year: '2019',
    role: 'Service Planner',
    desc: '하나투어 현지투어·패스·입장권(FND) 카테고리 모바일 기획. 대규모 여행 플랫폼의 화면설계 경험.',
    tags: ['화면기획', 'FND', '여행플랫폼'],
    achievement: '대형 플랫폼 기획 경험',
    color: '#00BCD4',
    icon: 'map',
    techStack: ['Axure', 'PowerPoint', '화면정의서'],
    details: [
      '하나투어 FND 카테고리 전체 화면정의서 작성',
      '현지투어·패스·입장권 상품 탐색 플로우 설계',
      '유플리트 소속으로 참여 — 대형 여행 플랫폼 기획 경험'
    ]
  },
  {
    id: 'lotte-rentacar',
    title: '롯데렌터카 세일즈 사이트',
    category: 'legacy',
    categoryLabel: '디자인·개발',
    year: '2015',
    role: 'Web Designer',
    desc: '롯데렌터카의 세일즈 파트너용 사이트. 실질적인 DB 생성에 기여한 성과형 디자인.',
    tags: ['세일즈', '웹디자인', 'DB생성'],
    achievement: 'DB 생성 효과 극대화',
    color: '#F44336',
    icon: 'car',
    techStack: ['Photoshop', 'HTML/CSS', '랜딩 최적화'],
    details: [
      '세일즈 파트너 전용 랜딩 디자인 및 퍼블리싱',
      'DB 생성(리드 수집) 최적화 CTA 설계',
      '미래네트웍스 소속으로 참여 — 대기업 프로젝트 경험'
    ],
    link: 'https://www.chotohwa.com/rock/sub/sub04.html'
  }
];

// SVG 아이콘 라이브러리 (프로젝트 시각화용)
const PROJECT_ICONS = {
  crown: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 42L5 18l13 10 12-14 12 14 13-10-5 24H10z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.15"/><rect x="8" y="42" width="44" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/></svg>`,
  diamond: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 8l18 16-18 28L12 24l18-16z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.12"/><path d="M12 24h36" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><path d="M30 8l4 16m-4-16l-4 16" stroke="currentColor" stroke-width="1.5" opacity="0.5"/></svg>`,
  store: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="24" width="40" height="26" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><path d="M10 24l5-14h30l5 14" stroke="currentColor" stroke-width="2"/><path d="M20 24v-2a5 5 0 0 1 10 0v2M30 24v-2a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><rect x="22" y="34" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.1"/></svg>`,
  ai: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="18" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><circle cx="30" cy="30" r="6" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.2"/><path d="M30 12v6m0 24v6m-18-18h6m24 0h6" stroke="currentColor" stroke-width="2"/><path d="M17.3 17.3l4.2 4.2m17 17l4.2 4.2m0-25.4l-4.2 4.2m-17 17l-4.2 4.2" stroke="currentColor" stroke-width="1.5" opacity="0.6"/></svg>`,
  rocket: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 8c-4 8-6 18-6 28h12c0-10-2-20-6-28z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.12"/><path d="M24 36l-8 4 4-10m16 6l8 4-4-10" stroke="currentColor" stroke-width="1.5"/><circle cx="30" cy="24" r="4" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.15"/><path d="M26 44h8l-1 8h-6l-1-8z" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.2"/></svg>`,
  palette: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 8c-12 0-22 10-22 22s10 22 22 22c2 0 4-2 4-4 0-1-.5-2-1-3-.5-.8-1-1.5-1-2.5 0-2.2 1.8-4 4-4h5c7 0 13-5.5 13-13C54 16 43 8 30 8z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><circle cx="20" cy="22" r="3" fill="currentColor" opacity="0.6"/><circle cx="30" cy="17" r="3" fill="currentColor" opacity="0.5"/><circle cx="40" cy="22" r="3" fill="currentColor" opacity="0.4"/><circle cx="18" cy="34" r="3" fill="currentColor" opacity="0.7"/></svg>`,
  monitor: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="10" width="44" height="30" rx="3" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><path d="M8 32h44" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><path d="M25 40h10v6H25z" stroke="currentColor" stroke-width="1.5"/><path d="M20 46h20" stroke="currentColor" stroke-width="2"/><rect x="14" y="16" width="14" height="10" rx="1" fill="currentColor" fill-opacity="0.12"/><rect x="32" y="16" width="14" height="4" rx="1" fill="currentColor" fill-opacity="0.1"/><rect x="32" y="22" width="14" height="4" rx="1" fill="currentColor" fill-opacity="0.1"/></svg>`,
  map: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l12-4 12 4 12-4v36l-12 4-12-4-12 4V14z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"/><path d="M24 10v36m12-32v36" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="30" cy="28" r="6" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.15"/><path d="M30 34l-4 6h8l-4-6z" fill="currentColor" opacity="0.3"/></svg>`,
  mobile: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="6" width="28" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><path d="M16 14h28m-28 32h28" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="30" cy="50" r="2" fill="currentColor" opacity="0.4"/><rect x="22" y="20" width="16" height="8" rx="2" fill="currentColor" fill-opacity="0.12"/><rect x="22" y="32" width="10" height="4" rx="1" fill="currentColor" fill-opacity="0.1"/><rect x="22" y="38" width="16" height="4" rx="1" fill="currentColor" fill-opacity="0.08"/></svg>`,
  car: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 32h40v10H10z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><path d="M14 32l6-14h20l6 14" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="42" r="5" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.15"/><circle cx="42" cy="42" r="5" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.15"/><path d="M14 36h8m16 0h8" stroke="currentColor" stroke-width="1.5" opacity="0.4"/></svg>`,
  shield: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 6L10 16v14c0 12 8 20 20 24 12-4 20-12 20-24V16L30 6z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><path d="M22 30l6 6 10-12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  megaphone: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 12v36L18 38V22l24-10z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/><rect x="10" y="22" width="8" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.12"/><path d="M14 38v10c0 2 2 4 4 4h4l-4-14" stroke="currentColor" stroke-width="1.5"/><circle cx="46" cy="30" r="3" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.2"/></svg>`
};

// SVG 패턴 배경 생성 (프로젝트별 고유 비주얼)
function createCardVisual(project) {
  const iconSvg = PROJECT_ICONS[project.icon] || PROJECT_ICONS['monitor'];
  // 16진수 → RGB 변환
  const hex = project.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 이미지가 있는 경우: 실사 이미지 배경
  if (project.image) {
    return `
      <div class="card__visual" style="
        position: relative;
        aspect-ratio: 16/10;
        overflow: hidden;
        background: #0a0a0a;
      ">
        <!-- 실사 이미지 -->
        <img src="${project.image}" alt="${project.title}"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.85;transition:transform 0.5s ease, opacity 0.3s ease;"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'"
        />
        <!-- 이미지 로딩 실패 시 아이콘 폴백 -->
        <div style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;background:linear-gradient(135deg, rgba(${r},${g},${b},0.15), rgba(${r},${g},${b},0.05));">
          <div style="width:60px;height:60px;color:${project.color};">${iconSvg}</div>
        </div>
        <!-- 하단 그라데이션 오버레이 -->
        <div style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%, transparent 100%);pointer-events:none;"></div>
        <!-- 연도 표시 -->
        <span style="position:absolute;top:12px;right:16px;font-family:var(--font-mono);font-size:0.7rem;color:rgba(255,255,255,0.7);letter-spacing:0.1em;z-index:2;text-shadow:0 1px 4px rgba(0,0,0,0.8);">${project.year}</span>
        ${project.featured ? `<span style="position:absolute;top:12px;left:16px;padding:2px 8px;background:rgba(${r},${g},${b},0.7);border:1px solid rgba(${r},${g},${b},0.5);border-radius:9999px;font-size:0.6rem;color:#fff;font-family:var(--font-mono);letter-spacing:0.05em;z-index:2;">FEATURED</span>` : ''}
      </div>
    `;
  }

  // 이미지가 없는 경우: 기존 SVG 아이콘 비주얼
  return `
    <div class="card__visual" style="
      background: linear-gradient(135deg, rgba(${r},${g},${b},0.15) 0%, rgba(${r},${g},${b},0.05) 50%, rgba(${r},${g},${b},0.2) 100%);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 16/10;
      overflow: hidden;
    ">
      <!-- 장식 패턴 -->
      <div style="position:absolute;inset:0;opacity:0.04;">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-${project.id}" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${project.color}" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-${project.id})"/>
        </svg>
      </div>
      <!-- 글로우 원 -->
      <div style="position:absolute;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(${r},${g},${b},0.25),transparent 70%);filter:blur(20px);"></div>
      <!-- 아이콘 -->
      <div style="width:60px;height:60px;color:${project.color};position:relative;z-index:1;filter:drop-shadow(0 0 10px rgba(${r},${g},${b},0.4));">
        ${iconSvg}
      </div>
      <!-- 연도 표시 -->
      <span style="position:absolute;top:12px;right:16px;font-family:var(--font-mono);font-size:0.7rem;color:rgba(${r},${g},${b},0.6);letter-spacing:0.1em;">${project.year}</span>
      ${project.featured ? `<span style="position:absolute;top:12px;left:16px;padding:2px 8px;background:rgba(${r},${g},${b},0.2);border:1px solid rgba(${r},${g},${b},0.3);border-radius:9999px;font-size:0.6rem;color:${project.color};font-family:var(--font-mono);letter-spacing:0.05em;">FEATURED</span>` : ''}
    </div>
  `;
}

// 프로젝트 카드 HTML 생성
function createProjectCard(project, index) {
  return `
    <div class="card reveal reveal--delay-${(index % 6) + 1}" data-category="${project.category}" data-project-id="${project.id}">
      <div class="card__image-wrapper">
        ${createCardVisual(project)}
      </div>
      <div class="card__body">
        <span class="card__category">${project.categoryLabel} · ${project.year}</span>
        <h3 class="card__title">${project.title}</h3>
        <p class="card__desc">${project.desc}</p>
        <div class="card__tags">
          ${project.tags.map(tag => `<span class="badge badge--muted">${tag}</span>`).join('')}
        </div>
        ${project.achievement ? `<div class="card__achievement"><span class="badge badge--green">📈 ${project.achievement}</span></div>` : ''}
      </div>
    </div>
  `;
}

// 프로젝트 그리드 렌더링
function renderProjects(filter = 'all') {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map((p, i) => createProjectCard(p, i)).join('');

  // 렌더링 후 reveal 애니메이션 재적용
  requestAnimationFrame(() => {
    const cards = grid.querySelectorAll('.reveal');
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('reveal--visible');
      }, i * 100);
    });
  });

  // 카드 틸트 효과 재적용
  initCardTilt();
}

// 필터 탭 이벤트
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 활성 탭 변경
      tabs.forEach(t => t.classList.remove('filter-tab--active'));
      tab.classList.add('filter-tab--active');

      // 프로젝트 필터링
      const filter = tab.dataset.filter;
      renderProjects(filter);
    });
  });
}

// ─── 카드 틸트 호버 이펙트 (Phase 4) ───
function initCardTilt() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s ease';

      // 글로우 포인트
      const visual = card.querySelector('.card__visual');
      if (visual) {
        visual.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,51,51,0.08), transparent 50%), ${visual.style.background}`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}

// ─── 프리미엄 모달 ───
function initProjectModal() {
  const modalOverlay = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  if (!modalOverlay) return;

  // 카드 클릭 → 모달
  document.getElementById('projectGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    const projectId = card.dataset.projectId;
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    const iconSvg = PROJECT_ICONS[project.icon] || PROJECT_ICONS['monitor'];
    const hex = project.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // 기술 스택 렌더링
    const techStackHtml = project.techStack ? project.techStack.map(tech =>
      `<span class="modal__tech-badge">${tech}</span>`
    ).join('') : '';

    // 상세 업무 리스트 렌더링
    const detailsHtml = project.details ? project.details.map(detail =>
      `<li class="modal__detail-item">
        <span class="modal__detail-bullet" style="background: rgba(${r},${g},${b},0.5)"></span>
        ${detail}
      </li>`
    ).join('') : '';

    // 프리미엄 모달 내용
    modalBody.innerHTML = `
      <div class="modal__premium">
        <!-- 헤더 비주얼 -->
        <div class="modal__header-visual" style="background: linear-gradient(135deg, rgba(${r},${g},${b},0.25) 0%, rgba(${r},${g},${b},0.05) 100%);">
          <div class="modal__header-glow" style="background: radial-gradient(circle, rgba(${r},${g},${b},0.35), transparent 70%)"></div>
          <div class="modal__header-icon" style="color: ${project.color}">
            ${iconSvg}
          </div>
          ${project.featured ? `<span class="modal__featured-badge" style="border-color: rgba(${r},${g},${b},0.4); color: ${project.color}">★ FEATURED</span>` : ''}
          <span class="modal__header-year" style="color: rgba(${r},${g},${b},0.7)">${project.year}</span>
        </div>

        <!-- 메타 정보 -->
        <div class="modal__meta">
          <span class="modal__category">${project.categoryLabel}</span>
          <h2 class="modal__title">${project.title}</h2>
          <p class="modal__role">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
            ${project.role}
          </p>
          <p class="modal__desc">${project.desc}</p>
        </div>

        <!-- 성과 배지 -->
        ${project.achievement ? `
        <div class="modal__achievement" style="border-color: rgba(${r},${g},${b},0.2); background: rgba(${r},${g},${b},0.06);">
          <span class="modal__achievement-icon">📈</span>
          <div>
            <span class="modal__achievement-label">핵심 성과</span>
            <span class="modal__achievement-value" style="color: ${project.color}">${project.achievement}</span>
          </div>
        </div>
        ` : ''}

        <!-- 상세 업무 -->
        ${detailsHtml ? `
        <div class="modal__section">
          <h4 class="modal__section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            주요 업무
          </h4>
          <ul class="modal__detail-list">${detailsHtml}</ul>
        </div>
        ` : ''}

        <!-- 기술 스택 -->
        ${techStackHtml ? `
        <div class="modal__section">
          <h4 class="modal__section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>
            기술 스택
          </h4>
          <div class="modal__tech-stack">${techStackHtml}</div>
        </div>
        ` : ''}

        <!-- 태그 -->
        <div class="modal__section">
          <div class="modal__tags">
            ${project.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
          </div>
        </div>

        <!-- 외부 링크 -->
        ${project.link ? `
        <a href="${project.link}" target="_blank" rel="noopener" class="modal__link" style="border-color: rgba(${r},${g},${b},0.3); color: ${project.color}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          사이트 방문하기
        </a>
        ` : ''}
      </div>
    `;

    modalOverlay.classList.add('modal-overlay--active');
    document.body.style.overflow = 'hidden';
  });

  // 모달 닫기
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove('modal-overlay--active');
    document.body.style.overflow = '';
  }

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initFilterTabs();
  initProjectModal();
});
