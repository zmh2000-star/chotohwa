#!/bin/bash
# =========================================
# 🔥 초토화군단 포트폴리오 — 배포 전 자동 체크
# 용도: git push 전에 실행하여 누락/오류 사전 방지
# 사용법: bash scripts/pre-deploy-check.sh
# =========================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
WARN=0
FAIL=0

# 유틸 함수 (|| true 로 set -e 우회)
pass() { echo -e "  ${GREEN}✅ $1${NC}"; PASS=$((PASS + 1)); }
warn() { echo -e "  ${YELLOW}⚠️  $1${NC}"; WARN=$((WARN + 1)); }
fail() { echo -e "  ${RED}❌ $1${NC}"; FAIL=$((FAIL + 1)); }

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🔥 초토화 포트폴리오 — 배포 전 체크${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ─── 1. HTML에서 참조하는 파일이 실제로 존재하는지 확인 ───
echo -e "${BLUE}[1/5] 리소스 참조 확인${NC}"

MISSING=0
while IFS= read -r file; do
    if [[ "$file" =~ ^(http|https|data:|#|mailto:|javascript:) ]]; then
        continue
    fi
    if [ ! -f "$file" ]; then
        fail "누락된 파일: $file"
        MISSING=$((MISSING + 1))
    fi
done < <(grep -oE '(src|href)="([^"]+)"' index.html | sed 's/.*="\(.*\)"/\1/' | sort -u)

if [ "$MISSING" -eq 0 ]; then
    pass "index.html의 모든 참조 파일이 존재합니다"
fi

# ─── 2. Git Untracked 파일 중 참조되는 것이 있는지 ───
echo -e "${BLUE}[2/5] Git 추적 상태 확인${NC}"

UNTRACKED_REFS=0
for file in $(git ls-files --others --exclude-standard 2>/dev/null); do
    BASENAME=$(basename "$file")
    if grep -rq "$BASENAME" index.html js/ css/ 2>/dev/null; then
        fail "참조 중이지만 Git 미추적: $file"
        UNTRACKED_REFS=$((UNTRACKED_REFS + 1))
    fi
done

if [ "$UNTRACKED_REFS" -eq 0 ]; then
    pass "참조된 모든 파일이 Git에 추적 중입니다"
fi

# ─── 3. 대용량 파일 경고 ───
echo -e "${BLUE}[3/5] 대용량 파일 검사${NC}"

LARGE_FILES=0
while IFS= read -r file; do
    SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    if [ -n "$SIZE" ]; then
        SIZE_MB=$((SIZE / 1024 / 1024))
        if [ "$SIZE_MB" -gt 50 ]; then
            fail "50MB 초과 (GitHub 제한 위험): $file (${SIZE_MB}MB)"
            LARGE_FILES=$((LARGE_FILES + 1))
        elif [ "$SIZE_MB" -gt 10 ]; then
            warn "대용량 파일: $file (${SIZE_MB}MB)"
        fi
    fi
done < <(find . -type f -not -path './.git/*' -not -path './node_modules/*' -size +5M 2>/dev/null)

if [ "$LARGE_FILES" -eq 0 ]; then
    pass "50MB 초과 파일 없음"
fi

# ─── 4. HTML 구문 기본 검사 ───
echo -e "${BLUE}[4/5] HTML 기본 검사${NC}"

if grep -q '<!DOCTYPE html>' index.html; then
    pass "DOCTYPE 선언 존재"
else
    fail "DOCTYPE 선언 누락"
fi

if grep -q '<title>' index.html; then
    pass "title 태그 존재"
else
    fail "title 태그 누락"
fi

# ─── 5. JS/CSS 파일 존재 확인 ───
echo -e "${BLUE}[5/5] 스크립트/스타일 파일 확인${NC}"

JS_MISSING=0
for jsfile in js/projects.js js/hero-3d.js js/scroll-engine.js js/easter-eggs.js js/main.js; do
    if [ ! -f "$jsfile" ]; then
        fail "JS 파일 누락: $jsfile"
        JS_MISSING=$((JS_MISSING + 1))
    fi
done

CSS_MISSING=0
for cssfile in css/reset.css css/design-system.css css/layout.css css/components.css css/animations.css; do
    if [ ! -f "$cssfile" ]; then
        fail "CSS 파일 누락: $cssfile"
        CSS_MISSING=$((CSS_MISSING + 1))
    fi
done

if [ "$JS_MISSING" -eq 0 ] && [ "$CSS_MISSING" -eq 0 ]; then
    pass "모든 JS/CSS 파일 존재"
fi

# ─── 결과 요약 ───
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  결과: ${GREEN}✅ ${PASS} 통과${NC}  ${YELLOW}⚠️ ${WARN} 경고${NC}  ${RED}❌ ${FAIL} 실패${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo -e "  ${RED}⛔ 실패 항목이 있습니다. 배포 전 수정하세요.${NC}"
    echo ""
    exit 1
else
    echo ""
    echo -e "  ${GREEN}🚀 배포 준비 완료!${NC}"
    echo ""
    exit 0
fi
