# 📋 CHANGELOG — 초토화군단 포트폴리오 2026

> 주요 변경사항을 날짜순(역순)으로 기록합니다.

---

## [2026-04-16]

### 🔧 하네스 엔지니어링 도입
- `.ai-harness.md` 생성 — AI 에이전트용 프로젝트 컨텍스트 문서
- `scripts/pre-deploy-check.sh` 생성 — 배포 전 자동 체크 스크립트
- `CHANGELOG.md` 생성 — 변경 이력 추적 시작

### 🐛 버그 수정
- `jang_new4.mp4` 파일이 Git Untracked 상태로 빠져 배포에 누락된 문제 수정
  - 원인: `git add`를 하지 않아 GitHub에 push되지 않음
  - 조치: `git add jangimg/jang_new4.mp4` → commit → push

---

## [2026-04-15]

### ✨ 히어로 영상 교체
- 히어로 배경 영상을 `jang_new4.mp4`로 교체 (4.4MB, 최적화된 버전)

---

## [2026-04-14]

### ✨ 프로젝트 쇼케이스 완성
- 20개 핵심 프로젝트 데이터 통합 (Notion 아카이브 + 레거시 사이트)
- 6개 카테고리 필터링 구현
- 프로젝트 상세 모달 구현

---

## [2026-04-12 ~ 04-13]

### 🎨 사이트 구조 구축
- 7개 메인 섹션 구현 (Hero → About → Career → Purples → Projects → Skills → Vision → Contact)
- GSAP ScrollTrigger 기반 스크롤 애니메이션
- Three.js 파티클 배경 (Vision 섹션)
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 다크 테마 디자인 시스템
