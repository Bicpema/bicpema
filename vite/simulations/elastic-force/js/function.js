/**
 * 壁を描画
 */
function drawWall() {
  push();
  fill(150);
  stroke(255);
  strokeWeight(2);
  rect(50, 0, 50, height / (width / 1000));
  
  // 壁の模様（ハッチング）
  stroke(100);
  strokeWeight(1);
  for (let i = 0; i < height / (width / 1000); i += 20) {
    line(50, i, 100, i + 20);
  }
  pop();
}

/**
 * グラフの表示/非表示を切り替え
 */
function toggleGraph() {
  graphVisible = !graphVisible;
  if (graphVisible) {
    graph.style("display", "block");
    toggleGraphButton.html("グラフを非表示");
    updateGraph();
  } else {
    graph.style("display", "none");
    toggleGraphButton.html("グラフを表示");
  }
}

/**
 * バネ定数の設定を適用
 */
function applySettings() {
  const k1 = parseFloat(spring1Input.value());
  const k2 = parseFloat(spring2Input.value());
  const k3 = parseFloat(spring3Input.value());
  
  // 入力値の検証
  if (isNaN(k1) || isNaN(k2) || isNaN(k3) || k1 <= 0 || k2 <= 0 || k3 <= 0) {
    alert("バネ定数は0より大きい数値を入力してください。");
    return;
  }
  
  if (springs.length >= 3) {
    springs[0].springConstant = k1;
    springs[1].springConstant = k2;
    springs[2].springConstant = k3;
  }
  
  // グラフが表示されている場合は更新
  if (graphVisible) {
    updateGraph();
  }
}
