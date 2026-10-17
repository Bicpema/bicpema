import p5 from "p5";

/**
 * p5のスケッチをstoryとして描画するためのヘルパー。
 * storyの切り替えで要素が破棄された際に `p.remove()` で後始末する。
 * @param {(p: p5) => void} sketch - p5インスタンスモードのスケッチ
 * @param {{ width?: number, height?: number }} size - 親要素のサイズ（px）
 * @returns {HTMLElement} スケッチを描画する親要素
 */
export function createP5Story(sketch, { width = 400, height = 300 } = {}) {
  const container = document.createElement("div");
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  /** @type {p5 | null} */
  let instance = null;

  // 親要素がDOMに追加されてからスケッチを開始し、取り外されたら破棄する
  const observer = new MutationObserver(() => {
    if (container.isConnected && !instance) {
      instance = new p5(sketch, container);
    } else if (!container.isConnected && instance) {
      instance.remove();
      instance = null;
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return container;
}
