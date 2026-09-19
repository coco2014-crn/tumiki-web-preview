const serviceButtons = document.querySelectorAll("#serviceFilter button");
const categoryButtons = document.querySelectorAll("#categoryFilter button");
const cards = document.querySelectorAll(".portfolio-card");

let activeService = "all";
let activeCategory = "all";

// サービスフィルター
serviceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    serviceButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeService = btn.dataset.service;
    filterCards();
  });
});

// 業種フィルター
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    filterCards();
  });
});

function filterCards() {
  let visibleCount = 0;
  serviceButtons.forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.service === activeService)));
  categoryButtons.forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.category === activeCategory)));
  cards.forEach(card => {
    const service = card.dataset.service;
    const category = card.dataset.category;

    const matchService = activeService === "all" || service === activeService;
    const matchCategory = activeCategory === "all" || category === activeCategory;

    if (matchService && matchCategory) {
      card.style.display = "block";
      visibleCount += 1;
    } else {
      card.style.display = "none";
    }
  });
  document.getElementById("portfolio-empty").hidden = visibleCount !== 0;
}

// ページが読み込まれた瞬間にフィルターを実行する
window.addEventListener("DOMContentLoaded", () => {
  filterCards();
});