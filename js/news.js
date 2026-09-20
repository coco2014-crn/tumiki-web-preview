/* =========================
トップページの新着情報取得
index.html の「最新3件」を表示する処理
========================= */

const topNewsList = document.getElementById("top-news-list");

/* top-news-list が存在する時だけ実行 */
if (topNewsList) {

  /* newsData の先頭から3件取得 */
  const latestNews = newsData.slice(0, 3);

  /* 1件ずつHTML生成 */
  latestNews.forEach((news) => {
    const li = document.createElement("li");

    /* URLが設定されているか確認 */
    const hasUrl = news.url && news.url.trim() !== "";

    /* URLありならaタグ、なしならdivタグ生成 */
    li.innerHTML = hasUrl
      ? `
        <a href="${news.url}">
          <span class="news-date">${formatDate(news.date)}</span>

          <span class="news-title">
            ${news.title}
            ${createNewBadge(news.date)}
          </span>
        </a>
      `
      : `
        <div class="news-item">
          <span class="news-date">${formatDate(news.date)}</span>

          <span class="news-title">
            ${news.title}
            ${createNewBadge(news.date)}
          </span>
        </div>
      `;

    /* ul に追加 */
    topNewsList.appendChild(li);
  });
}



/* =========================
日付表示変換
2026-05-08 → 2026.05.08
========================= */

function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}



/* =========================
NEWバッジ生成
公開日から0〜7日なら NEW 表示
========================= */

function createNewBadge(dateString) {
  const today = new Date();

  const postDate = new Date(dateString);

  const diffTime = today - postDate;

  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  /* 公開日から0〜7日ならNEW表示 */
  if (diffDays >= 0 && diffDays <= 7) {
    return `<span class="news-new">NEW</span>`;
  }

  return "";
}



/* =========================
news.html の一覧取得
========================= */

const newsList = document.getElementById("news-list");



/* =========================
年月フィルター取得
========================= */

if (newsList && typeof newsData !== "undefined" && Array.isArray(newsData)) {

const currentYear = document.getElementById("current-year");

const currentMonth = document.getElementById("current-month");

const prevMonthBtn = document.getElementById("prev-month");

const nextMonthBtn = document.getElementById("next-month");



/* =========================
現在表示中の年月
========================= */

// 日付のみのデータは閲覧環境の暦日で判定し、未来日を一覧から除外する。
const today = new Date();
const todayKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
const publishedNews = newsData.filter(news => /^\d{4}-\d{2}-\d{2}$/.test(news.date) && news.date <= todayKey)
  .sort((a, b) => b.date.localeCompare(a.date));
const latest = publishedNews[0];
let currentDate = latest
  ? new Date(Number(latest.date.slice(0, 4)), Number(latest.date.slice(5, 7)) - 1, 1)
  : new Date(today.getFullYear(), today.getMonth(), 1);



/* =========================
初回表示
========================= */

renderNews();
document.querySelector(".news-filter").hidden = publishedNews.length === 0;

/* =========================
← 前月ボタン
========================= */

if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {

    /* 月を1つ戻す */
    currentDate.setMonth(currentDate.getMonth() - 1);

    /* 再描画 */
    renderNews();
  });
}



/* =========================
→ 次月ボタン
========================= */

if (nextMonthBtn) {
  nextMonthBtn.addEventListener("click", () => {

    /* 月を1つ進める */
    currentDate.setMonth(currentDate.getMonth() + 1);

    /* 再描画 */
    renderNews();
  });
}



/* =========================
news.html 表示処理
========================= */

function renderNews() {

  /* news-list が無ければ終了 */
  if (!newsList) return;

  /* 一旦リセット */
  const fragment = document.createDocumentFragment();



  /* 現在の年と月取得 */
  const year = currentDate.getFullYear();

  const month = currentDate.getMonth() + 1;



  /* 画面上の年月表示更新 */
  currentYear.textContent = year;

  currentMonth.textContent = month;



  /* 該当年月の記事だけ取得 */
  const filteredNews = publishedNews.filter((news) => {
    const newsDate = new Date(`${news.date}T00:00:00`);

    return (
      newsDate.getFullYear() === year &&
      newsDate.getMonth() + 1 === month
    );
  });



  /* 該当記事が0件の場合 */
  if (filteredNews.length === 0) {

    newsList.innerHTML = `
      <li class="news-empty">
        ${publishedNews.length ? "この月のお知らせはありません。" : "公開済みのお知らせはありません。"}
      </li>
    `;

    return;
  }



  /* 記事を1件ずつ生成 */
  filteredNews.forEach((news) => {

    const li = document.createElement("li");



    /* URL有無確認 */
    const hasUrl = news.url && news.url.trim() !== "";



    /* 画像設定
       画像未設定時はデフォルト画像 */
    const imagePath = news.image
      ? news.image
      : "img/news/news-default.webp";



    /* HTML生成 */
    li.innerHTML = `
      ${
        hasUrl
          ? `<a href="${news.url}" class="news-card">`
          : `<div class="news-card">`
      }

        <div class="news-card-image">

          <img src="${imagePath}" alt="${news.title}" width="1200" height="900" loading="lazy">

        </div>

        <div class="news-card-content">

          <span class="news-card-date">
            ${formatDate(news.date)}
          </span>

          <h3 class="news-card-title">

            ${news.title}

            ${createNewBadge(news.date)}

          </h3>

          ${
            hasUrl
              ? `<p class="news-card-link">詳しく見る →</p>`
              : ""
          }

        </div>

      ${hasUrl ? `</a>` : `</div>`}
    `;



    /* ul に追加 */
    fragment.appendChild(li);
  });
  newsList.replaceChildren(fragment);
}
}
