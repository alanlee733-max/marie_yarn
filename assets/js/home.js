/* 홈 화면 렌더링 */

document.addEventListener("DOMContentLoaded", () => {
  /* 히어로 실타래 — 대표 색 3개 */
  const art = document.getElementById("hero-art");
  if (art) {
    const picks = ["#ddceb6", "#7d8560", "#a8613f"];
    art.innerHTML = picks
      .map(
        (hex) =>
          `<div><div class="skein" style="--c:${hex}" role="presentation"></div></div>`
      )
      .join("");
  }

  /* 취급 브랜드 */
  const strip = document.getElementById("brand-strip");
  if (strip) {
    strip.innerHTML = BRANDS.map(
      (b) => `
      <a href="brands.html#${esc(b.slug)}">
        <div class="bs-name">${esc(b.name)}</div>
        <div class="bs-country">${esc(b.country)}</div>
      </a>`
    ).join("");
  }

  /* 추천 실 */
  const featured = document.getElementById("featured-products");
  if (featured) {
    featured.innerHTML = PRODUCTS.filter((p) => p.featured).map(productCard).join("");
  }

  /* 색 계열 큐레이션 — 클릭하면 카탈로그 필터로 이어진다 */
  const familyGrid = document.getElementById("family-grid");
  if (familyGrid) {
    const counts = {};
    const swatches = {};

    PRODUCTS.forEach((p) => {
      const seen = new Set();
      p.colorways.forEach((c) => {
        if (!seen.has(c.colorFamily)) {
          seen.add(c.colorFamily);
          counts[c.colorFamily] = (counts[c.colorFamily] || 0) + 1;
        }
        (swatches[c.colorFamily] = swatches[c.colorFamily] || []).push(c.hex);
      });
    });

    const families = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 6);

    familyGrid.innerHTML = families
      .map((f) => {
        const sw = swatches[f]
          .slice(0, 3)
          .map((hex) => `<span style="background:${esc(hex)}"></span>`)
          .join("");
        return `
        <a class="family-tile" href="products.html?family=${encodeURIComponent(f)}">
          <div class="family-swatches">${sw}</div>
          <div class="family-name">${esc(FAMILY_LABELS[f] || f)}</div>
          <div class="family-count">${counts[f]}종의 실</div>
        </a>`;
      })
      .join("");
  }
});
