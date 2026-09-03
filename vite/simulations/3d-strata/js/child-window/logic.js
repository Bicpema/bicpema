// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。
// このファイルでは、入力された地層データを親ウィンドウ（index.html）へ
// window.opener経由でリアルタイムに反映する処理を行います。

import { state } from "./state.js";

/**
 * 入力中の地層データを親ウィンドウに送信し、平面データの選択肢を更新する。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  // 取得した地層データの配列
  const strataData = [];

  // input要素からvalueを取得
  for (let i = 0; i < state.trArr.length; i++) {
    strataData.push([
      state.trArr[i].td1Input.value(),
      state.trArr[i].td2Input.value(),
      state.trArr[i].td3Select.value(),
    ]);
  }

  // ヘッダー部分のhtml要素から地点名を取得
  let name = document.getElementById("place_name").innerHTML;
  name = name.split("のデータを編集")[0];

  // 地点名と地層データが格納された配列を生成し、親ウィンドウに送信
  window.opener.submit([name, strataData]);

  // 平面データの設定を常に更新
  window.opener.placeRefreshFunction();
  window.opener.firstPlaceSelectFunction();
  window.opener.secondPlaceSelectFunction();
  window.opener.thirdPlaceSelectFunction();
}
