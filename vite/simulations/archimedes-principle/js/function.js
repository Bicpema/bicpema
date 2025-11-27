// function.jsはその他のメソッド管理専用のファイルです。

// メソッドの定義方法の例
// function exampleMethod() {
//   console.log("これは例です。");
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下にその他のメソッドを定義してください。

/**
 * 水槽を描画
 */
function drawWaterTank() {
  push();

  // 水槽の枠
  noFill();
  stroke(150);
  strokeWeight(4);
  rect(50, 150, 900, 370);

  // 水
  fill(100, 150, 255, 100);
  noStroke();
  rect(50, waterY, 900, 520 - waterY);

  // 水面の線
  stroke(100, 150, 255);
  strokeWeight(3);
  line(50, waterY, 950, waterY);

  // 水面のラベル
  fill(100, 150, 255);
  noStroke();
  textSize(16);
  textAlign(LEFT, CENTER);
  text("水面", 960, waterY);

  // 水の密度表示
  textSize(14);
  text(`水の密度: ${waterDensity.toFixed(1)} g/cm³`, 60, 165);

  pop();
}

/**
 * 説明テキストを描画
 */
function drawInstructions() {
  push();
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("アルキメデスの原理", 20, 20);

  textSize(14);
  text("物体をクリックして選択、ドラッグで移動できます。", 20, 50);

  // 凡例
  textSize(12);
  text("密度による色分け:", 700, 20);

  fill(255, 200, 100);
  circle(720, 50, 20);
  fill(255);
  text("< 0.5 g/cm³ (軽い)", 735, 50);

  fill(200, 150, 255);
  circle(720, 75, 20);
  fill(255);
  text("0.5-1.0 g/cm³", 735, 75);

  fill(100, 150, 255);
  circle(720, 100, 20);
  fill(255);
  text("1.0-1.5 g/cm³", 735, 100);

  fill(150, 150, 150);
  circle(720, 125, 20);
  fill(255);
  text("> 1.5 g/cm³ (重い)", 735, 125);

  pop();
}

/**
 * 新しい物体を追加
 */
function addNewObject() {
  const randomX = random(150, 850);
  const randomDensity = random(0.3, 2.5);
  objects.push(new FloatingObject(randomX, 200, 30, randomDensity));
}

/**
 * 選択された物体の密度スライダーを更新
 */
function updateDensityUI() {
  if (selectedObject) {
    densitySlider.show();
    densityLabel.show();
    densitySlider.value(selectedObject.density);
    densityLabel.html(
      `選択中の物体の密度: ${selectedObject.density.toFixed(2)} g/cm³`
    );
    selectedObject.density = densitySlider.value();
  } else {
    densitySlider.hide();
    densityLabel.hide();
  }
}
