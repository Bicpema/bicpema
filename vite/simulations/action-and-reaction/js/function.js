// function.jsはその他のメソッド管理専用のファイルです。

// メソッドの定義方法の例
// function exampleMethod() {
//   console.log("これは例です。");
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下にその他のメソッドを定義してください。

/**
 * 本を追加する関数
 */
function addBook() {
  const randomX = random(100, 700);
  const randomMass = random(0.5, 2.0);
  const newBook = new Book(randomX, 100, randomMass); // 高い位置から落下
  books.push(newBook);
}

/**
 * 机を描画する関数
 */
function drawTable() {
  push();
  fill(160, 82, 45); // 茶色
  stroke(100);
  strokeWeight(2);
  rect(50, tableY, 900, 20, 5); // 机の天板

  // 机の脚
  rect(100, tableY + 20, 15, 100);
  rect(835, tableY + 20, 15, 100);

  // ラベル
  fill(255);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text("机", 500, tableY + 10);
  pop();
}
