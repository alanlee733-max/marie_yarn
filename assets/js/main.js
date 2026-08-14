/* =========================================================
   marie yarn — 공통 스크립트
   모든 페이지에서 data.js 다음에 로드된다.
   ========================================================= */

/* ---------- 유틸 ---------- */

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function won(n) {
  return typeof n === "number" ? n.toLocaleString("ko-KR") + "원" : "가격 문의";
}

function getBrand(slug) {
  return BRANDS.find((b) => b.slug === slug);
}

function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** [{메리노울,80},{실크,20}] → "메리노울 80% · 실크 20%" */
function fiberText(fiber) {
  return fiber.map((f) => `${f.material} ${f.percent}%`).join(" · ");
}

function weightLabel(w) {
  return WEIGHT_LABELS[w] || w;
}

/* ---------- 네이버 스토어 연결 ----------
   제품별 상품 URL이 있으면 그쪽으로, 없으면 스토어 메인으로 보낸다.
   나중에 네이버페이 결제형 API로 바꿀 때 이 함수만 교체하면 된다. */
function naverUrl(product) {
  return product && product.naverProductUrl ? product.naverProductUrl : SITE.naverStoreUrl;
}

/* ---------- 대표 색상 고르기 ----------
   목록에서 첫 번째 색을 그대로 쓰면 대개 아이보리라 카드가 전부 하얗게 보인다.
   가장 채도가 높은 색을 대표로 세워야 목록에서 실이 구분된다.
   실제 대표 사진이 준비되면 이 함수는 필요 없어진다. */
function chroma(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function coverColorway(p) {
  const pool = p.colorways.filter((c) => c.stock !== "sold_out");
  const list = pool.length ? pool : p.colorways;
  return list.reduce((best, c) => (chroma(c.hex) > chroma(best.hex) ? c : best), list[0]);
}

/* ---------- 실타래 플레이스홀더 ----------
   실제 사진이 준비되면 아래 innerHTML을 <img>로 교체한다. */
function skeinFrame(hex, label, opts = {}) {
  const badge = opts.badge || "";
  const big = opts.large ? " skein--lg" : "";
  return `
    <div class="skein-frame">
      ${badge}
      <div class="skein${big}" style="--c:${esc(hex)}" role="img" aria-label="${esc(label)}"></div>
    </div>`;
}

function stockBadge(stock) {
  if (stock === "incoming") return '<span class="badge badge--incoming">입고 예정</span>';
  if (stock === "sold_out") return '<span class="badge badge--sold">품절</span>';
  if (stock === "discontinued") return '<span class="badge badge--sold">단종</span>';
  return "";
}

/* ---------- 컬러칩 ---------- */
function chipsMarkup(colorways, max = 8) {
  const shown = colorways.slice(0, max);
  const rest = colorways.length - shown.length;
  const chips = shown
    .map((c) => `<span class="chip" style="--c:${esc(c.hex)}" title="${esc(c.name)}"></span>`)
    .join("");
  return `<div class="chips" aria-label="색상 ${colorways.length}종">${chips}${
    rest > 0 ? `<span class="chip-more">+${rest}</span>` : ""
  }</div>`;
}

/* ---------- 제품 카드 ---------- */
function productCard(p) {
  const brand = getBrand(p.brandSlug);
  const cover = coverColorway(p);
  return `
    <a class="product-card" href="product.html?slug=${encodeURIComponent(p.slug)}">
      ${skeinFrame(cover.hex, `${p.name} 실타래`, { badge: stockBadge(p.stock) })}
      <p class="card-brand">${esc(brand ? brand.name : "")}</p>
      <h3 class="card-name">${esc(p.name)}</h3>
      <p class="card-meta">${esc(weightLabel(p.yarnWeight))} · ${esc(fiberText(p.fiber))}</p>
      <p class="card-meta">${p.weightGram}g / ${p.lengthMeter}m</p>
      <p class="card-price">${won(p.retailPrice)}</p>
      ${chipsMarkup(p.colorways)}
    </a>`;
}

/* ---------- 구매 버튼 ----------
   재고 상태에 따라 CTA가 달라진다.
   판매 중 → 네이버 스토어 / 입고 예정 → 알림 / 품절 → 문의 */
function buyBlock(p) {
  const url = esc(naverUrl(p));
  if (p.stock === "in_stock") {
    return `
      <a class="btn btn--naver btn--lg btn--block" href="${url}" target="_blank" rel="noopener">
        네이버 스토어에서 구매
      </a>
      <a class="btn btn--ghost btn--block" href="contact.html">이 실 문의하기</a>
      <p class="buy-note">결제는 네이버 스마트스토어에서 진행됩니다. 새 창으로 열립니다.</p>`;
  }
  if (p.stock === "incoming") {
    return `
      <button class="btn btn--primary btn--lg btn--block" data-subscribe-scroll>입고 알림 받기</button>
      <a class="btn btn--ghost btn--block" href="${url}" target="_blank" rel="noopener">
        네이버 스토어 둘러보기
      </a>
      <p class="buy-note">입고되면 등록하신 이메일로 가장 먼저 알려드립니다.</p>`;
  }
  return `
    <span class="btn btn--lg btn--block btn--disabled">품절</span>
    <a class="btn btn--ghost btn--block" href="contact.html">재입고 문의하기</a>`;
}

/* ---------- 페이지 초기화 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  /* 모바일 네비게이션 */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  /* 네이버 스토어 링크는 SITE 한 곳에서 관리 */
  document.querySelectorAll("[data-naver-store]").forEach((el) => {
    el.setAttribute("href", SITE.naverStoreUrl);
  });

  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.setAttribute("href", SITE.instagram);
  });

  /* 사업자정보 — 값이 바뀌면 data.js 만 고치면 된다 */
  const biz = document.querySelector("[data-biz]");
  if (biz) {
    const b = SITE.business;
    biz.innerHTML = `
      <div class="biz-row">
        <span>상호 ${esc(b.company)}</span>
        <span>대표 ${esc(b.ceo)}</span>
        <span>사업자등록번호 ${esc(b.regNo)}</span>
      </div>
      <div class="biz-row">
        <span>주소 ${esc(b.address)}</span>
        <span>이메일 ${esc(SITE.email)}</span>
      </div>
      <p class="copyright">© ${new Date().getFullYear()} ${esc(SITE.name)}. All rights reserved.</p>`;
  }

  /* 구독 폼 — 아직 백엔드가 없다 */
  document.querySelectorAll("[data-subscribe-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.parentElement.querySelector(".form-note");
      if (note) {
        note.textContent =
          "폼은 아직 연동 전입니다. 메일 발송(스티비·메일침프 등) 연결이 필요합니다.";
      }
    });
  });

  /* 상세 페이지의 '입고 알림 받기' → 하단 구독 폼으로 */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-subscribe-scroll]");
    if (!btn) return;
    const target = document.getElementById("subscribe");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = target.querySelector("input");
      if (input) setTimeout(() => input.focus(), 400);
    }
  });
});
