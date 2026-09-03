// element-function.js は仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { TR } from "./class.js";

/**
 * 地層の追加ボタンを押した時の処理。
 * @param {*} p p5インスタンス
 * @returns {number} 新しく生成したtr要素の累計番号
 */
export function trAddButtonFunction(p) {
  state.trNum += 1;
  state.trSum += 1;
  const tr = new TR(state.trSum, p);
  state.trArr.push(tr);
  return state.trSum;
}

/**
 * 親ウィンドウから入力済みの地層データを引き継ぎ、行を復元する。
 * @param {*} p p5インスタンス
 */
export function loadOpenerLayers(p) {
  // 受け取った地点名入りURLから地点名を抽出
  let placeName = decodeURI(location.search);
  placeName = placeName.substring(1, placeName.length);

  // 親ウィンドウがない場合の処理
  if (!window.opener || window.opener.closed) {
    window.alert("親ウィンドウがありません。");
    return;
  }

  document.getElementById("place_name").innerHTML =
    placeName + "のデータを編集";
  document.title = placeName + "のデータを編集";

  // 入力済み地層データがあれば引き継ぎinputに入力
  const layers = window.opener.loadLayers(placeName);
  for (let i = 0; i < layers.length; i++) {
    trAddButtonFunction(p);
    document.getElementById("td1Input" + (i + 1)).value = layers[i][0];
    document.getElementById("td2Input" + (i + 1)).value = layers[i][1];
    document.getElementById("td3Select" + (i + 1)).value = layers[i][2];
  }
}
