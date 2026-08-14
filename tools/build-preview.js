/* =========================================================
   단일 파일 미리보기 빌드
   ---------------------------------------------------------
   실제 사이트 파일(*.html, assets/**)을 읽어서 하나의 HTML로 합친다.
   웹에 올려 링크 하나로 보여주기 위한 것이고, 원본을 고치면
   이 스크립트를 다시 돌리기만 하면 된다. 미리보기를 손으로 고치지 말 것.

     node tools/build-preview.js

   결과: dist/preview.html
   ========================================================= */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* 라우트 이름 → 원본 파일. 순서가 곧 미리보기의 페이지 순서다. */
const ROUTES = [
  { name: "home", file: "index.html", title: "marie yarn — 해외 뜨개실 수입 · 유통", init: "initHome" },
  { name: "products", file: "products.html", title: "전체 제품 — marie yarn", init: "initCatalog" },
  { name: "product", file: "product.html", title: "제품 상세 — marie yarn", init: "initProductDetail" },
  { name: "brands", file: "brands.html", title: "취급 브랜드 — marie yarn", init: "initBrands" },
  { name: "guide", file: "guide.html", title: "실 고르기 가이드 — marie yarn", init: null },
  { name: "about", file: "about.html", title: "회사 소개 — marie yarn", init: null },
  { name: "contact", file: "contact.html", title: "문의 — marie yarn", init: "initContact" },
  { name: "faq", file: "faq.html", title: "자주 묻는 질문 — marie yarn", init: null },
  { name: "privacy", file: "privacy.html", title: "개인정보처리방침 — marie yarn", init: "initPrivacy" },
];

/* ---------- 링크 다시 쓰기 ----------
   멀티 페이지의 products.html?x=1 을 해시 라우팅의 #products?x=1 로 바꾼다. */
function rewriteLinks(html) {
  return html
    .replace(/href="index\.html"/g, 'href="#home"')
    .replace(
      /href="([a-z0-9-]+)\.html(\?[^"#]*)?(#[^"]*)?"/g,
      (_, page, query, hash) => {
        /* brands.html#nordfil 처럼 앵커만 있는 경우 ?b= 로 옮긴다 */
        const q = query || (hash ? `?b=${hash.slice(1)}` : "");
        return `href="#${page}${q}"`;
      }
    );
}

/* ---------- 조각 추출 ---------- */
function extract(html, re, label, file) {
  const m = html.match(re);
  if (!m) throw new Error(`${file}에서 ${label}을 찾지 못했습니다`);
  return m[1];
}

const indexHtml = read("index.html");
const header = rewriteLinks(
  extract(indexHtml, /(<header class="site-header">[\s\S]*?<\/header>)/, "header", "index.html")
);
const footer = rewriteLinks(
  extract(indexHtml, /(<footer class="site-footer">[\s\S]*?<\/footer>)/, "footer", "index.html")
);

const templates = {};
for (const r of ROUTES) {
  const html = read(r.file);
  templates[r.name] = rewriteLinks(
    extract(html, /<main id="main">([\s\S]*?)<\/main>/, "<main>", r.file)
  ).trim();
}

/* ---------- 스크립트 ----------
   페이지 스크립트는 DOMContentLoaded 에도 스스로 붙지만,
   미리보기에서는 대상 요소가 없으면 곧바로 빠져나오므로 부작용이 없다. */
const css = read("assets/css/style.css");
const scripts = [
  "assets/js/data.js",
  "assets/js/main.js",
  "assets/js/home.js",
  "assets/js/catalog.js",
  "assets/js/product-detail.js",
  "assets/js/brands.js",
  "assets/js/contact.js",
].map(read).join("\n");

const titles = Object.fromEntries(ROUTES.map((r) => [r.name, r.title]));
const inits = Object.fromEntries(ROUTES.filter((r) => r.init).map((r) => [r.name, r.init]));

/* ---------- 조립 ---------- */
/* charset 선언이 없으면 호스팅에 따라 한글이 통째로 깨진다.
   문서 맨 앞에 두어야 효과가 있다. */
const out = `<meta charset="utf-8">
<title>marie yarn</title>

<style>
${css}

/* ---------- 미리보기 전용 ---------- */
.preview-bar {
  background: var(--ink);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12.5px;
  line-height: 1.6;
  text-align: center;
  padding: 9px 24px;
}
.preview-bar strong { color: #fff; font-weight: 600; }
.preview-bar span { opacity: 0.6; }
</style>

<div class="preview-bar">
  <strong>미리보기</strong> — 브랜드 · 제품 · 가격 · 사업자 정보는 모두 샘플입니다.
  <span>실제 데이터로 교체 전 화면 확인용입니다.</span>
</div>

${header}

<main id="main"></main>

${footer}

<script>window.PREVIEW_MODE = true;</script>

<script>
${scripts}
</script>

<script>
/* ---------- 해시 라우터 ---------- */
const TEMPLATES = ${JSON.stringify(templates, null, 0)};
const TITLES = ${JSON.stringify(titles, null, 0)};
const INITS = ${JSON.stringify(inits, null, 0)};

/* privacy.html 안에 있던 인라인 스크립트를 여기로 옮겨 담는다 */
function initPrivacy() {
  const el = document.querySelector("[data-privacy-email]");
  if (el) el.textContent = SITE.email;
}

function currentRoute() {
  const raw = location.hash.replace(/^#/, "");
  const name = raw.split("?")[0];
  return TEMPLATES[name] ? name : "home";
}

function renderRoute() {
  const name = currentRoute();
  const main = document.getElementById("main");

  main.innerHTML = TEMPLATES[name];
  document.title = TITLES[name];

  /* 네비게이션 현재 위치 표시 */
  document.querySelectorAll("#nav a").forEach((a) => {
    const target = (a.getAttribute("href") || "").replace(/^#/, "").split("?")[0];
    if (target === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  /* 모바일 메뉴가 열려 있으면 닫는다 */
  const nav = document.getElementById("nav");
  if (nav) nav.setAttribute("data-open", "false");

  window.scrollTo(0, 0);

  initCommon(main);
  const fn = INITS[name];
  if (fn && typeof window[fn] === "function") window[fn]();
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
</script>
`;

fs.mkdirSync(path.join(ROOT, "dist"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "dist/preview.html"), out);

const kb = (Buffer.byteLength(out) / 1024).toFixed(0);
console.log(`dist/preview.html 생성 완료 — ${ROUTES.length}개 화면, ${kb}KB`);
