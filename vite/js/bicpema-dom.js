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
 * getCheckedRadioValue
 *
 * `input[name="..."]:checked` の戻り値を `HTMLInputElement` として取得し、
 * その `value` を返す。TypeScriptの型チェック上、`querySelector`の戻り値は
 * `Element | null`となり`value`プロパティを持たないため、このキャストを
 * 共通化する。選択中の要素がない場合は`null`を返す。
 *
 * @param {string} name ラジオボタングループのname属性
 * @returns {string | null}
 */
export function getCheckedRadioValue(name) {
  const el = /** @type {HTMLInputElement | null} */ (
    document.querySelector(`input[name="${name}"]:checked`)
  );
  return el ? el.value : null;
}

/**
 * setCheckedRadioByValue
 *
 * `input[name="..."]` のラジオボタン群のうち、`value`が引数と一致する要素の
 * みをチェック状態にする。TypeScriptの型チェック上、`querySelectorAll`の戻り値は
 * `NodeListOf<Element>`となり`checked`/`value`プロパティを持たないため、この
 * キャストを共通化する。
 *
 * @param {string} name ラジオボタングループのname属性
 * @param {string} value チェック状態にする要素のvalue
 */
export function setCheckedRadioByValue(name, value) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((el) => {
    if (el instanceof HTMLInputElement) {
      el.checked = el.value === value;
    }
  });
}
