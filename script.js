document.addEventListener("DOMContentLoaded", () => {
  // --- ページ内リンクで飛んだ元の場所に戻る機能 ---
  const backButton = document.getElementById("back-button");
  let previousScrollPosition = 0;
  let isJumped = false;

  // ページ内リンクのクリックイベント
  document.querySelectorAll("a.in-page-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // 現在のスクロール位置を保存
      previousScrollPosition = window.scrollY;
      isJumped = true;

      // 戻るボタンを表示する
      if (backButton) {
        backButton.classList.add("show");
      }
    });
  });

  // 戻るボタンのクリックイベント
  if (backButton) {
    backButton.addEventListener("click", () => {
      if (isJumped) {
        window.scrollTo({
          top: previousScrollPosition,
          behavior: "smooth",
        });
        backButton.classList.remove("show");
        isJumped = false;

        // URLのハッシュを消去
        history.replaceState(
          null,
          null,
          window.location.pathname + window.location.search,
        );
      }
    });
  }
});
