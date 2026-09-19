// セクションfaqのトグル
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    // 他を閉じる
    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      const otherAnswer = otherItem.querySelector(".faq-answer");
      otherAnswer.setAttribute("aria-hidden", "true");
      otherAnswer.style.maxHeight = null;
    });

    // 今押したやつだけ開く
    if (!isOpen) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
      answer.setAttribute("aria-hidden", "false");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});
