/* 브랜드 목록 */

document.addEventListener("DOMContentLoaded", () => {
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
        <a class="btn btn--ghost" href="products.html?brand=${encodeURIComponent(b.slug)}">
          ${esc(b.name)} 제품 보기
        </a>
      </article>`;
  }).join("");

  /* 주소에 #브랜드슬러그 가 있으면 해당 위치로 */
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});
