document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");

  const boxes = document.querySelectorAll(".price-box");
  const buttons = document.querySelectorAll(".price-tabs button");

  function showService(target) {
    boxes.forEach(box => {
      const isActive = box.id === target;
      box.style.display = isActive ? "block" : "none";
      box.setAttribute("aria-hidden", String(!isActive));
    });

    buttons.forEach(btn => {
      const isActive = btn.dataset.service === target;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });
  }

  boxes.forEach(box => {
    box.setAttribute("role", "tabpanel");
    box.setAttribute("aria-labelledby", `price-tab-${box.id}`);
    box.tabIndex = 0;
  });

  // 初期表示
  if (Array.from(boxes).some(box => box.id === service)) {
    showService(service);
  } else {
    showService("web");
  }

  document.querySelector(".price-tabs").hidden = false;
  document.querySelector(".price-tabs-lead").hidden = false;

  // ボタン操作
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.service;
      showService(target);
      history.replaceState(null, "", `?service=${target}`);
    });
  });

  document.querySelector(".price-tabs")?.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = Array.from(buttons).indexOf(document.activeElement);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextButton = buttons[(currentIndex + direction + buttons.length) % buttons.length];
    nextButton.click();
    nextButton.focus();
  });
});
