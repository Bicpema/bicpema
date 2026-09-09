/**
 * getCanvasElement
 *
 * `document.getElementById(id)` の戻り値を `HTMLCanvasElement | null` として
 * 取得する。TypeScriptの型チェック上、`getElementById`の戻り値は
 * `HTMLElement | null`となるため、canvas要素として利用する箇所で
 * このキャストとnullチェックを共通化する。
 *
 * @param {string} id 取得したいcanvas要素のid
 * @returns {HTMLCanvasElement | null}
 */
export function getCanvasElement(id) {
  return /** @type {HTMLCanvasElement | null} */ (document.getElementById(id));
}

/**
 * getSelectElement
 *
 * `document.getElementById(id)` の戻り値を `HTMLSelectElement | null` として
 * 取得する。TypeScriptの型チェック上、`getElementById`の戻り値は
 * `HTMLElement | null`となるため、`<select>`要素の`options`・`value`・
 * `remove(index)`などを利用する箇所でこのキャストを共通化する。
 *
 * @param {string} id 取得したいselect要素のid
 * @returns {HTMLSelectElement | null}
 */
export function getSelectElement(id) {
  return /** @type {HTMLSelectElement | null} */ (document.getElementById(id));
}
