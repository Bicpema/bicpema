function preload() {
  font = loadFont("../../assets/fonts/ZenMaruGothic-Regular.ttf");
}

function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  loadTestDataButtonFunction();
}

let coordinateData;
function draw() {
  background(255);

  // データ登録モーダルを開いている時にオービットコントロールを無効化
  let dataRegisterModalIs = $("#dataRegisterModal").is(":hidden");
  if (dataRegisterModalIs) {
    orbitControl();
  }

  // 緯度や経度、深さに応じてスケールを計算する
  coordinateData = calculateValue(setRadioButton.value(), unitSelect.value());

  // 計算したスケールを実際に適応
  backgroundSetting(coordinateData);
  // coordinateSystem.line();
  // coordinateSystem.scale();
  // 方位の描画
  drawDirMark(-600, -600);

  // 地点名の回転
  rotateTime += 3;

  // それぞれの地点のボーリングデータの描画
  for (let key in dataInputArr) {
    drawStrata(key, rotateTime, coordinateData);
  }

  // それぞれの地層をつなぐ
  connectStrata();
}

function windowResized() {
  canvasController.resizeScreen();
}
