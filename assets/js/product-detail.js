/* =========================================================
   제품 상세 — product.html?slug=fjord-merino
   ========================================================= */

function initProductDetail() {
  const root = document.getElementById("detail-root");
  if (!root) return;

  const slug = urlParams().get("slug");
  const p = slug ? getProduct(slug) : null;

  if (!p) {
    root.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <h3>찾으시는 실이 없습니다</h3>
        <p>주소가 잘못되었거나 판매가 종료된 제품입니다.</p>
        <p style="margin-top:24px"><a class="btn btn--ghost" href="${href("products")}">전체 제품 보기</a></p>
      </div>`;
    const section = document.getElementById("related-section");
    if (section) section.hidden = true;
    return;
  }

  const brand = getBrand(p.brandSlug);
  document.title = `${p.name} — ${brand ? brand.name : ""} | ${SITE.name}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", p.description.slice(0, 150));

  /* 목록 카드에서 보던 색과 같은 색으로 열려야 한다 */
  let current = coverColorway(p);

  /* ---------- 필요 볼 수 (참고값) ----------
     완성품별 대략적인 소요 실 길이를 볼 수로 환산한다. */
  const NEEDS = [
    { name: "목도리", meters: 400 },
    { name: "비니", meters: 200 },
    { name: "성인 스웨터", meters: 1200 },
  ];

  function ballHint() {
    const items = NEEDS.map(
      (n) => `${n.name} 약 ${Math.ceil(n.meters / p.lengthMeter)}볼`
    ).join(" · ");
    return `
      <div class="usage-hint">
        <strong>얼마나 필요할까요?</strong>
        ${esc(items)}
        <br>1볼 ${p.lengthMeter}m 기준으로 계산한 참고값입니다. 게이지와 사이즈에 따라 달라집니다.
      </div>`;
  }

  /* ---------- 스펙 표 ---------- */
  function specTable() {
    const rows = [
      ["소재", fiberText(p.fiber)],
      ["중량 / 실 길이", `${p.weightGram}g / ${p.lengthMeter}m (1볼)`],
      ["굵기", `${weightLabel(p.yarnWeight)} (${p.yarnWeight})`],
      ["권장 게이지", p.gauge],
      ["권장 대바늘", p.needleSize],
      ["권장 코바늘", p.hookSize || "—"],
      ["세탁 방법", p.careInstructions],
      ["원산지", p.origin],
    ];
    return `
      <table class="spec-table">
        <caption>제품 사양</caption>
        <tbody>
          ${rows
            .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
            .join("")}
        </tbody>
      </table>`;
  }

  /* ---------- 렌더 ---------- */
  function render() {
    root.innerHTML = `
      <div class="detail-media">
        ${skeinFrame(current.hex, `${p.name} ${current.name} 실타래`, {
          large: true,
          badge: stockBadge(p.stock),
        })}
        <p class="swatch-note">
          화면 색과 실물 색은 차이가 있을 수 있습니다. 실물 스와치 사진은 준비 중입니다.
        </p>
      </div>

      <div class="detail-info">
        <nav class="breadcrumb" aria-label="위치">
          <a href="${href("products")}">제품</a><span>/</span>
          <a href="${href("brands", "b=" + encodeURIComponent(p.brandSlug))}">${esc(brand ? brand.name : "")}</a><span>/</span>
          ${esc(p.name)}
        </nav>

        <p class="detail-brand">${esc(brand ? brand.name : "")} · ${esc(brand ? brand.country : "")}</p>
        <h1 class="detail-title">${esc(p.name)}</h1>
        <p class="detail-desc">${esc(p.description)}</p>

        <p class="detail-price">
          ${won(p.retailPrice)}
          <small>1볼 ${p.weightGram}g 기준</small>
        </p>

        <div class="colorway-block">
          <div class="colorway-head">
            <span class="colorway-label">색상 ${p.colorways.length}종</span>
            <span class="colorway-current" id="cw-current"></span>
          </div>
          <div class="colorway-grid" id="cw-grid"></div>
        </div>

        <div class="buy-block">${buyBlock(p)}</div>

        ${ballHint()}
        ${specTable()}
      </div>`;

    renderColorways();
  }

  function renderColorways() {
    const grid = document.getElementById("cw-grid");
    const label = document.getElementById("cw-current");

    grid.innerHTML = p.colorways
      .map(
        (c) => `
        <button class="cw"
                style="--c:${esc(c.hex)}"
                data-code="${esc(c.code)}"
                data-stock="${esc(c.stock)}"
                aria-pressed="${c.code === current.code}"
                title="${esc(c.name)} (${esc(c.code)})">
          <span class="sr-only">${esc(c.name)}</span>
        </button>`
      )
      .join("");

    label.textContent =
      `${current.name} · ${current.code}` +
      (current.stock === "sold_out" ? " (품절)" : "");

    grid.querySelectorAll(".cw").forEach((btn) => {
      btn.addEventListener("click", () => {
        current = p.colorways.find((c) => c.code === btn.dataset.code);
        /* 실타래 색만 바꾸면 되므로 전체를 다시 그리지 않는다 */
        const skein = root.querySelector(".detail-media .skein");
        if (skein) {
          skein.style.setProperty("--c", current.hex);
          skein.setAttribute("aria-label", `${p.name} ${current.name} 실타래`);
        }
        renderColorways();
      });
    });
  }

  render();

  /* ---------- 같은 브랜드의 다른 실 ---------- */
  const related = document.getElementById("related-grid");
  const section = document.getElementById("related-section");
  if (related) {
    const list = PRODUCTS.filter((x) => x.brandSlug === p.brandSlug && x.slug !== p.slug);
    related.innerHTML = list.map(productCard).join("");
    if (section) section.hidden = list.length === 0;
    const head = document.getElementById("related-title");
    if (head) head.textContent = `${brand ? brand.name : ""}의 다른 실`;
  }
}

document.addEventListener("DOMContentLoaded", initProductDetail);
