export default {
  title: "UI/フォーム部品",
  parameters: { layout: "centered" }
};

/**
 * 設定モーダルの白背景パネルを模した枠に、フォーム部品を並べる。
 * @param {string} body - 枠内に入れるHTML
 * @returns {HTMLElement} ストーリーのルート要素
 */
function render(body) {
  const root = document.createElement("div");
  root.className = "w-[360px] rounded bg-white p-4 text-neutral-900";
  root.innerHTML = body;
  return root;
}

/** `.form-label` と `.form-control`（range・number・select）。設定モーダル内の入力欄の共通スタイル。 */
export const Default = {
  render: () =>
    render(`
      <div class="mb-3">
        <label for="speed" class="form-label">速度</label>
        <input type="range" class="form-control" id="speed" min="0" max="10" value="5" />
      </div>
      <div class="mb-3">
        <label for="mass" class="form-label">質量 [kg]</label>
        <input type="number" class="form-control" id="mass" value="1.5" step="0.1" />
      </div>
      <div>
        <label for="mode" class="form-label">表示モード</label>
        <select class="form-control" id="mode">
          <option>ベクトル</option>
          <option>グラフ</option>
        </select>
      </div>
    `)
};

/** 入力欄を小さくしたい場合は、`.form-control` に続けて `px-2 py-1 text-sm` を指定する。 */
export const Compact = {
  render: () =>
    render(`
      <label for="compact" class="form-label">振幅</label>
      <input type="number" class="form-control px-2 py-1 text-sm" id="compact" value="3" />
    `)
};

/** `disabled` の入力欄。 */
export const Disabled = {
  render: () =>
    render(`
      <label for="disabled" class="form-label">固定値</label>
      <input type="number" class="form-control" id="disabled" value="9.8" disabled />
    `)
};
