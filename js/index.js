// トップページFAQの開閉状態とアクセシビリティ属性を同期
const homeFaqItems = document.querySelectorAll(".home-faq .faq-item");

// Recalculate an open answer after wrapping or font loading changes its height.
const homeFaqResizeObserver = new ResizeObserver((entries) => {
  entries.forEach(({ target }) => {
    const answer = target.closest(".faq-answer");
    if (answer.getAttribute("aria-hidden") === "false") {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

// Keep the existing SNS nodes and links; move them with the header breakpoint.
document.addEventListener("DOMContentLoaded", () => {
  const headerInner = document.querySelector(".home-page .header-inner");
  const menu = headerInner?.querySelector(".sp-menu");
  const toggle = headerInner?.querySelector(".hamburger");
  const social = headerInner?.querySelector(".icon-navi");
  if (!menu || !toggle || !social) return;

  const compactHeader = window.matchMedia("(max-width: 1023px)");
  const syncMenu = () => {
    const isOpen = compactHeader.matches && toggle.getAttribute("aria-expanded") === "true";
    menu.inert = !isOpen;
    menu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("home-menu-open", isOpen);
  };
  const closeMenu = () => {
    toggle.classList.remove("is-open");
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "メニューを開く");
    syncMenu();
  };
  const placeSocial = () => {
    const focusInMenu = menu.contains(document.activeElement);
    const focusOnToggle = document.activeElement === toggle;
    (compactHeader.matches ? menu : headerInner).append(social);
    closeMenu();
    if (focusInMenu || focusOnToggle) {
      (compactHeader.matches ? toggle : headerInner.querySelector(".pc-nav a")).focus();
    }
  };

  placeSocial();
  compactHeader.addEventListener("change", placeSocial);
  new MutationObserver(syncMenu).observe(toggle, { attributes: true, attributeFilter: ["aria-expanded"] });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (!compactHeader.matches || toggle.getAttribute("aria-expanded") !== "true") return;
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    } else if (event.key === "Tab") {
      const links = [...menu.querySelectorAll("a[href]")];
      const last = links.at(-1);
      if (event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.focus();
      }
    }
  });
});

homeFaqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  homeFaqResizeObserver.observe(answer.querySelector("p"));

  question.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("active");

    homeFaqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      const otherAnswer = otherItem.querySelector(".faq-answer");
      otherAnswer.setAttribute("aria-hidden", "true");
      otherAnswer.style.maxHeight = null;
    });

    if (shouldOpen) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
      answer.setAttribute("aria-hidden", "false");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});
