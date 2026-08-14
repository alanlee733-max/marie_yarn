/* 브랜드 목록 */

function initBrands() {
  const list = document.getElementById("brand-list");
  if (!list) return;

  list.innerHTML = BRANDS.map((b) => {
    const count = PRODUCTS.filter((p) => p.brandSlug === b.slug).length;
    return `
      <article class="brand-row" id="${esc(b.slug)}">
        <div>
          <h2 class="br-name">${esc(b.name)}</h2>
          <p class="br-country">${esc(b.country)} · ${count}종 취급</p>
        </div>
        <p class="br-story">${esc(b.story)}</p>
        <a class="btn btn--ghost" href="${href("products", "brand=" + encodeURIComponent(b.slug))}">
          ${esc(b.name)} 제품 보기
        </a>
      </article>`;
  }).join("");

  /* ?b=브랜드슬러그 또는 #브랜드슬러그 로 들어오면 해당 위치로 */
  const anchor =
    urlParams().get("b") ||
    (!window.PREVIEW_MODE && location.hash ? location.hash.slice(1) : "");

  if (anchor) {
    const target = document.getElementById(anchor);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", initBrands);
