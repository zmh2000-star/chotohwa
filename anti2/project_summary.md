# 2026 퍼플스 그룹 B2B 제휴 프로젝트 IT인프라 통합 요약 (2026-01-10)

## 1. 프로젝트 개요
본 프로젝트는 퍼플스 그룹의 2026년 B2B 확장 전략에 따라, 기업 파트너십 유치와 임직원 복지 솔루션 제안을 **디지털화하고 자동화**하는 것을 목표로 합니다. 1단계 시스템 인프라 구축과 2단계 프리미엄 UI/UX 리뉴얼을 거쳐 현재 통합 고도화 단계에 있습니다.

### 상세 기술 스택 (Target Architecture)
| 구분 | 기술 스택 | 비고 |
| :--- | :--- | :--- |
| **Frontend** | Next.js / Tailwind CSS | SSR 및 SEO 최적화 |
| **Backend** | Node.js (Turbo/Express) | 비즈니스 로직 및 API 서버 |
| **Database** | PostgreSQL (Supabase / Docker) | 컨테이너 환경 기반 데이터 관리 |
| **Utilities** | Supabase SDK / Marked.js | 인증, 스토리지 및 AI 분석 보조 |
| **Analytics** | Google Tag Manager (GTM) | 사용자 행동 추적 및 마케팅 데이터 수집 |

---

## 2. 시스템 통합 및 데이터 연동 (Infrastructure)
확장성과 유지보수 편의성을 위해 **Docker 컨테이너** 기반의 PostgreSQL 환경을 구축하였으며, Supabase를 통해 클라우드 기반 백엔드 통합을 수행합니다.

### 인프라 상세 정보
*   **Endpoint**: `https://yhmazwpnhzmnrrvyaqbx.supabase.co`
*   **Database Table**: `leads` (통합 리드 및 상담 기록 테이블)
*   **Data Flow**: 상담 신청/AI 진단 즉시 기록 → 관리자 대시보드 실시간 반영
*   **Security**: Row Level Security (RLS) 및 토큰 기반 인증 적용

### leads 테이블 상세 스키마
| 컬럼명 (Field) | 타입 (Type) | 제약/설명 (Description) |
| :--- | :--- | :--- |
| **id** | uuid | Primary Key (고유 식별값) |
| **created_at** | timestamp | 상담 신청 일시 (자동 생성) |
| **company_name** | text | 기업명 (필수) |
| **name** | text | 담당자 성함 (필수) |
| **phone** | text | 연락처 (필수) |
| **brand** | text | 선호 브랜드 (Purples, D.Noble 등) |
| **hr_concern** | text | AI 진단 기반 주요 인사 고민 |
| **memo** | text | 영업팀 개별 상담 메모 및 특이사항 |
| **utm_source** | text | 유입 채널 (Meta, Google, Naver 등) |
| **status** | text | 진행 상태 (New, In-Progress, Completed) |

### 마케팅 분석 데이터 필드
*   **기업/담당자**: 기업명, 업종, 직함, 연락처 등
*   **AI 진단 로그**: 연령대, 인사 고민(이직률 등), 선호 솔루션 비중
*   **어트리뷰션**: 유입 소스(UTM), 레퍼러, 디바이스 정보

---

## 3. 핵심 디자인 및 마케팅 엔진 (Premium Persona)
### 에어리 프리미엄 (Airy Premium) 디자인
*   **Dynamic Background**: Airy Mesh Gradient를 통한 현대적 감각 구현.
*   **Glassmorphism**: 2.0 버전의 고해상도 블러 및 깊이감 있는 UI 레이아웃.
*   **Success Story Marquee**: 3D 미니멀 아바타 기반의 파트너 성공 사례 자동화 마키 섹션 추가.

### 5-Track 솔루션 믹스
*   **Track A. 활력**: 언니의인맥 (MZ 소셜 네트워킹)
*   **Track B. 안정**: 디노블 (핵심 인재 성혼)
*   **Track C. 품격**: 퍼플스 (VVIP 하이엔드 컨시어지)
*   **Track D. 재시작**: 르매리 (재혼/만혼 솔루션)
*   **Track E. 전문가**: 이모의인맥 (진정성 있는 매칭 전략)

---

## 4. 영업 지원 및 데이터 관리 전술
*   **실시간 모니터링**: 접수된 제휴 문의 및 AI 컨설팅 로그 실시간 대시보드 출력.
*   **상세 상담 관리**: Lead별 상담 메모 기록 및 히스토리 아카이빙 강화.
*   **데이터 자산화**: 리드 정보를 CSV/Excel 포맷으로 추출하여 타겟 마케팅 및 CRM에 즉시 활용.

---
*최종 업데이트: 2026-01-10 (1/2단계 통합 고도화 성과 반영)*
