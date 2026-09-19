const topBtn = document.querySelector(".top-page-navi");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    topBtn.classList.add("active");
  } else {
    topBtn.classList.remove("active");
  }
});


 /*
    ===========================
    Hamburger Menu Control
    ===========================
    【目的】
    ・ハンバーガーボタンでSPメニューを開閉
    ・同時にボタンの見た目を × に変形

    【CSS連動】
    ・.hamburger.is-open
    ・.sp-menu.is-open
  */

document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.querySelector(".hamburger"); // ボタン
  const spMenu = document.querySelector(".sp-menu"); // SPメニュー本体

  if (!hamburger || !spMenu) return; // ← これだけ追加

  spMenu.setAttribute("aria-hidden", "true");

  hamburger.addEventListener("click", () => {
    // ハンバーガー → ×（戻るボタン）へ切り替え
    hamburger.classList.toggle("is-open");

    // SPメニューを表示／非表示
    spMenu.classList.toggle("is-open");
    const isOpen = spMenu.classList.contains("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    spMenu.setAttribute("aria-hidden", String(!isOpen));
  });

});
