// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

// メソッドの定義方法の例
// function exampleMethod() {
//   console.log("これは例です。");
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下に仮想DOMメソッドを定義してください。

/**
 * マウスが押された時の処理
 */
function mousePressed() {
  const scaledMouseX = mouseX / (width / 1000);
  const scaledMouseY = mouseY / (width / 1000);

  // クリックされた物体を探す
  let found = false;
  for (let obj of objects) {
    if (obj.isMouseOver(scaledMouseX, scaledMouseY)) {
      obj.startDrag(scaledMouseX, scaledMouseY);
      selectedObject = obj;
      found = true;
      break;
    }
  }

  // 物体以外をクリックした場合、選択を解除
  if (!found) {
    selectedObject = null;
  }
}

/**
 * マウスが離された時の処理
 */
function mouseReleased() {
  for (let obj of objects) {
    obj.stopDrag();
  }
}
