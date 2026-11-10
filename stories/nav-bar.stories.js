import html from "./nav-bar.html?bicpema";

export default {
  title: "UI/ナビバー",
  parameters: { layout: "fullscreen" }
};

/**
 * ナビバーを描画する。ナビバーは画面上部に固定表示されるため、
 * 高さを持つ枠（transformで固定の基準をこの枠にする）の中に配置する。
 * @param {string} markup - ナビバーのHTML
 * @returns {HTMLElement} ストーリーのルート要素
 */
function render(markup) {
  const root = document.createElement("div");
  root.className =
    "relative h-[200px] w-full bg-neutral-100 [transform:translateZ(0)]";
  root.innerHTML = markup;
  return root;
}

/** `title`属性を指定したナビバー。左端の戻るボタン・サイト名・シミュレーション名が並ぶ。 */
export const Default = { render: () => render(html) };

/** 長いタイトルは1行に収まらない場合に省略表示される。 */
export const LongTitle = {
  render: () =>
    render(
      html.replace(
        "ドップラー効果",
        "とても長いシミュレーション名がナビバーの幅に収まらない場合の表示確認用タイトル"
      )
    ),
  parameters: { viewport: { defaultViewport: "mobile1" } }
};
