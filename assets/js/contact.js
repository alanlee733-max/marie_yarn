/* 문의 페이지 — 탭 전환 및 폼 처리 */

document.addEventListener("DOMContentLoaded", () => {
  /* 연락처 정보는 data.js 한 곳에서 관리 */
  const emailEl = document.querySelector("[data-site-email]");
  if (emailEl) {
    emailEl.innerHTML = `<a class="link-more" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`;
  }

  const hoursEl = document.querySelector("[data-site-hours]");
  if (hoursEl) hoursEl.textContent = SITE.hours;

  /* 도매 문의의 관심 브랜드 목록 */
  const brandSelect = document.querySelector("[data-brand-options]");
  if (brandSelect) {
    brandSelect.insertAdjacentHTML(
      "beforeend",
      BRANDS.map((b) => `<option value="${esc(b.slug)}">${esc(b.name)}</option>`).join("")
    );
  }

  /* ---------- 탭 ---------- */
  const tabs = [
    { tab: document.getElementById("tab-general"), panel: document.getElementById("panel-general") },
    { tab: document.getElementById("tab-wholesale"), panel: document.getElementById("panel-wholesale") },
  ].filter((t) => t.tab && t.panel);

  function select(index) {
    tabs.forEach((t, i) => {
      t.tab.setAttribute("aria-selected", String(i === index));
      t.panel.hidden = i !== index;
    });
  }

  tabs.forEach((t, i) => t.tab.addEventListener("click", () => select(i)));

  /* contact.html?type=wholesale 로 들어오면 도매 탭부터 */
  if (new URLSearchParams(location.search).get("type") === "wholesale") select(1);

  /* ---------- 폼 제출 ----------
     아직 백엔드가 없다. 연동 전까지는 안내만 띄운다. */
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const notice = form.querySelector(".notice");
      if (notice) {
        notice.textContent =
          "문의 폼은 아직 연동 전입니다. 메일 발송 연동(Formspree·Resend 등)이 필요합니다. " +
          "당장은 " + SITE.email + " 으로 보내주세요.";
        notice.setAttribute("data-show", "true");
      }
    });
  });
});
