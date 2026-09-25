/**
 * getCanvasElement
 *
 * `document.getElementById(id)` の戻り値を `HTMLCanvasElement | null` として
 * 取得する。TypeScriptの型チェック上、`getElementById`の戻り値は
 * `HTMLElement | null`となるため、canvas要素として利用する箇所で
 * このキャストとnullチェックを共通化する。
 *
 * @param id 取得したいcanvas要素のid
 */
export function getCanvasElement(id: string): HTMLCanvasElement | null {
  return document.getElementById(id) as HTMLCanvasElement | null;
}

/**
 * getCheckedRadioValue
 *
 * `input[name="..."]:checked` の戻り値を `HTMLInputElement` として取得し、
 * その `value` を返す。TypeScriptの型チェック上、`querySelector`の戻り値は
 * `Element | null`となり`value`プロパティを持たないため、このキャストを
 * 共通化する。選択中の要素がない場合は`null`を返す。
 *
 * @param name ラジオボタングループのname属性
 */
export function getCheckedRadioValue(name: string): string | null {
  const el = document.querySelector(
    `input[name="${name}"]:checked`
  ) as HTMLInputElement | null;
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
 * @param name ラジオボタングループのname属性
 * @param value チェック状態にする要素のvalue
 */
export function setCheckedRadioByValue(name: string, value: string): void {
  document.querySelectorAll(`input[name="${name}"]`).forEach((el) => {
    if (el instanceof HTMLInputElement) {
      el.checked = el.value === value;
    }
  });
}

/**
 * getSelectElement
 *
 * `document.getElementById(id)` の戻り値を `HTMLSelectElement | null` として
 * 取得する。TypeScriptの型チェック上、`getElementById`の戻り値は
 * `HTMLElement | null`となるため、`<select>`要素の`options`・`value`・
 * `remove(index)`などを利用する箇所でこのキャストを共通化する。
 *
 * @param id 取得したいselect要素のid
 */
export function getSelectElement(id: string): HTMLSelectElement | null {
  return document.getElementById(id) as HTMLSelectElement | null;
}
