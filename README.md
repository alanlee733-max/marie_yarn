# marie yarn

해외 뜨개실 수입 · 유통 홈페이지 v1.

정적 HTML + 바닐라 JS로 만들어져 빌드 도구가 필요 없습니다.
기획 문서는 [`docs/v1-plan.md`](docs/v1-plan.md)에 있습니다.

---

## 미리보기

`index.html`을 브라우저로 열면 바로 보입니다.

다만 제품 상세(`product.html?slug=...`)는 주소 쿼리를 읽기 때문에
로컬 서버로 여는 편이 정확합니다.

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

## 파일 구조

```
index.html         홈
products.html      카탈로그 (브랜드 · 굵기 · 소재 · 색 계열 필터)
product.html       제품 상세 — ?slug=fjord-merino
brands.html        브랜드 목록
guide.html         실 고르기 가이드
about.html         회사 소개
contact.html       문의 (일반 / 도매 탭)
faq.html           자주 묻는 질문
privacy.html       개인정보처리방침 ⚠️ 오픈 전 작성 필요

assets/css/style.css
assets/js/
  data.js          ★ 사이트 설정 · 브랜드 · 제품 데이터 — 대부분의 수정은 여기서
  main.js          공통 유틸 · 제품 카드 · 구매 버튼
  home.js  catalog.js  product-detail.js  brands.js  contact.js
```

---

## 자주 하게 될 작업

### 네이버 스토어 연결하기

`assets/js/data.js` 맨 위 `SITE.naverStoreUrl`을 실제 스토어 주소로 바꿉니다.
헤더 · 푸터 · 구매 버튼의 모든 링크가 여기를 참조합니다.

```js
naverStoreUrl: "https://smartstore.naver.com/실제스토어주소",
```

제품별로 상품 페이지가 따로 있으면 각 제품의 `naverProductUrl`에 넣습니다.
비워두면 스토어 메인으로 연결됩니다.

```js
naverProductUrl: "https://smartstore.naver.com/marieyarn/products/1234567890",
```

### 제품 추가하기

`assets/js/data.js`의 `PRODUCTS` 배열에 항목을 하나 더 넣습니다.
필터 옵션(브랜드 · 굵기 · 소재 · 색 계열)은 데이터에서 자동으로 만들어지므로
따로 손댈 곳이 없습니다.

`colorways`는 반드시 배열로 유지하세요.
나중에 장바구니를 붙일 때 이 배열이 그대로 상품 옵션이 됩니다.

### 사업자 정보 · 연락처 바꾸기

`data.js`의 `SITE.business`와 `SITE.email` / `SITE.phone` / `SITE.hours`를 수정하면
모든 페이지 푸터에 반영됩니다.

---

## 아직 안 된 것

| 항목 | 상태 |
|---|---|
| 제품 사진 | CSS로 그린 실타래 플레이스홀더 사용 중. 실물 사진 필요 |
| 브랜드 · 제품 데이터 | **전부 샘플입니다.** 실제 취급 브랜드로 교체 필요 |
| 사업자 정보 | 자리만 잡혀 있음 (`000-00-00000`) |
| 문의 폼 · 구독 폼 | 화면만 있고 전송은 안 됨. Formspree · Resend 등 연동 필요 |
| 개인정보처리방침 | 항목 구조만 있는 초안. 오픈 전 작성 필수 |
| 로고 | 텍스트 로고 사용 중 |

### 제품 사진으로 교체하는 법

현재는 컬러웨이의 hex 값으로 실타래를 그리고 있습니다.
`assets/js/main.js`의 `skeinFrame()` 함수가 만드는 `<div class="skein">`을
`<img>`로 바꾸면 됩니다. 카드 이미지 비율은 4:5로 잡혀 있습니다.
