/* =========================================================
   제품 카탈로그 — 필터 · 정렬
   필터 상태를 URL 쿼리에 반영해서 공유와 뒤로가기가 동작하게 한다.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  const filterEl = document.getElementById("filters");
  const countEl = document.getElementById("result-count");
  const sortEl = document.getElementById("sort");
  const toggleEl = document.getElementById("filter-toggle");

  /* ---------- 필터 옵션 구성 (데이터에서 자동 추출) ---------- */

  const usedWeights = WEIGHT_ORDER.filter((w) => PRODUCTS.some((p) => p.yarnWeight === w));

  const usedMaterials = [
    ...new Set(PRODUCTS.flatMap((p) => p.fiber.map((f) => f.material))),
  ].sort();

  const familyHex = {};
  const usedFamilies = [];
  PRODUCTS.forEach((p) =>
    p.colorways.forEach((c) => {
      if (!familyHex[c.colorFamily]) {
        familyHex[c.colorFamily] = c.hex;
        usedFamilies.push(c.colorFamily);
      }
    })
  );

  function group(title, key, options) {
    return `
      <div class="filter-group">
        <h3>${esc(title)}</h3>
        ${options
          .map(
            (o) => `
          <label class="filter-opt">
            <input type="checkbox" data-key="${key}" value="${esc(o.value)}">
            ${o.swatch ? `<span class="sw" style="background:${esc(o.swatch)}"></span>` : ""}
            <span>${esc(o.label)}</span>
          </label>`
          )
          .join("")}
      </div>`;
  }

  filterEl.innerHTML = [
    group("브랜드", "brand", BRANDS.map((b) => ({ value: b.slug, label: b.name }))),
    group(
      "굵기",
      "weight",
      usedWeights.map((w) => ({ value: w, label: weightLabel(w) }))
    ),
    group("소재", "material", usedMaterials.map((m) => ({ value: m, label: m }))),
    group(
      "색 계열",
      "family",
      usedFamilies.map((f) => ({
        value: f,
        label: FAMILY_LABELS[f] || f,
        swatch: familyHex[f],
      }))
    ),
    group("상태", "stock", [
      { value: "in_stock", label: "판매 중" },
      { value: "incoming", label: "입고 예정" },
    ]),
    '<button class="btn btn--ghost btn--block" id="reset-filters" type="button">필터 초기화</button>',
  ].join("");

  /* ---------- URL ↔ 필터 동기화 ---------- */

  const KEYS = ["brand", "weight", "material", "family", "stock"];

  function readUrl() {
    const q = new URLSearchParams(location.search);
    const state = {};
    KEYS.forEach((k) => {
      const raw = q.get(k);
      state[k] = raw ? raw.split(",").filter(Boolean) : [];
    });
    state.sort = q.get("sort") || "new";
    return state;
  }

  function writeUrl(state) {
    const q = new URLSearchParams();
    KEYS.forEach((k) => {
      if (state[k].length) q.set(k, state[k].join(","));
    });
    if (state.sort !== "new") q.set("sort", state.sort);
    const qs = q.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  function applyStateToInputs(state) {
    filterEl.querySelectorAll("input[type=checkbox]").forEach((input) => {
      input.checked = state[input.dataset.key].includes(input.value);
    });
    if (sortEl) sortEl.value = state.sort;
  }

  function readInputs() {
    const state = {};
    KEYS.forEach((k) => (state[k] = []));
    filterEl.querySelectorAll("input[type=checkbox]:checked").forEach((input) => {
      state[input.dataset.key].push(input.value);
    });
    state.sort = sortEl ? sortEl.value : "new";
    return state;
  }

  /* ---------- 필터링 ---------- */

  function matches(p, state) {
    if (state.brand.length && !state.brand.includes(p.brandSlug)) return false;
    if (state.weight.length && !state.weight.includes(p.yarnWeight)) return false;
    if (state.stock.length && !state.stock.includes(p.stock)) return false;

    if (state.material.length) {
      const mats = p.fiber.map((f) => f.material);
      if (!state.material.some((m) => mats.includes(m))) return false;
    }

    if (state.family.length) {
      const fams = p.colorways.map((c) => c.colorFamily);
      if (!state.family.some((f) => fams.includes(f))) return false;
    }

    return true;
  }

  function sortList(list, sort) {
    const out = [...list];
    if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "price_asc") out.sort((a, b) => a.retailPrice - b.retailPrice);
    else if (sort === "price_desc") out.sort((a, b) => b.retailPrice - a.retailPrice);
    else out.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
    return out;
  }

  function render() {
    const state = readInputs();
    writeUrl(state);

    const list = sortList(PRODUCTS.filter((p) => matches(p, state)), state.sort);

    countEl.innerHTML = `총 <strong>${list.length}</strong>개의 실`;

    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="empty-state">
           <h3>조건에 맞는 실이 없습니다</h3>
           <p>필터를 줄여서 다시 찾아보세요.</p>
         </div>`;

    grid.classList.toggle("product-grid", list.length > 0);
  }

  /* ---------- 이벤트 ---------- */

  filterEl.addEventListener("change", render);
  if (sortEl) sortEl.addEventListener("change", render);

  document.addEventListener("click", (e) => {
    if (e.target.closest("#reset-filters")) {
      filterEl.querySelectorAll("input[type=checkbox]").forEach((i) => (i.checked = false));
      if (sortEl) sortEl.value = "new";
      render();
    }
  });

  if (toggleEl) {
    toggleEl.addEventListener("click", () => {
      const open = filterEl.getAttribute("data-open") === "true";
      filterEl.setAttribute("data-open", String(!open));
      toggleEl.setAttribute("aria-expanded", String(!open));
    });
  }

  applyStateToInputs(readUrl());
  render();
});
