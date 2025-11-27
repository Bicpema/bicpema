// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

// メソッドの定義方法の例
// function exampleMethod() {
//   console.log("これは例です。");
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下に仮想DOMメソッドを定義してください。

let lastClickTime = 0;
const DOUBLE_CLICK_DELAY = 300; // ダブルクリック判定時間（ミリ秒）

/**
 * マウスが押された時の処理
 */
function mousePressed() {
  const scaledMouseX = mouseX / (width / 1000);
  const scaledMouseY = mouseY / (width / 1000);
  const currentTime = millis();
  
  // ダブルクリック判定
  const isDoubleClick = currentTime - lastClickTime < DOUBLE_CLICK_DELAY;
  lastClickTime = currentTime;
  
  // クリックされた本を探す
  for (let book of books) {
    if (book.isMouseOver(scaledMouseX, scaledMouseY)) {
      if (isDoubleClick) {
        // ダブルクリック: 編集モードを切り替え
        // 他の本の編集モードを終了
        for (let other of books) {
          if (other !== book && other.isEditing) {
            other.isEditing = false;
          }
        }
        book.toggleEdit();
      } else if (!book.isEditing) {
        // シングルクリック: ドラッグ開始（編集モードでない場合のみ）
        book.startDrag(scaledMouseX, scaledMouseY);
      }
      break;
    }
  }
}

/**
 * マウスが離された時の処理
 */
function mouseReleased() {
  // 全ての本のドラッグを終了
  for (let book of books) {
    book.stopDrag();
  }
}
