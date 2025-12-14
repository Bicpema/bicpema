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
