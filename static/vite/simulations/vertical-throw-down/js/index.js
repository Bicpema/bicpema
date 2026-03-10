// preload関数
// setup関数よりも前に一度だけ呼び出される。
function preload() {
  // ローディング画面を表示
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    z-index: 9999;
    font-size: 24px;
    font-family: sans-serif;
  `;

  // スピナーを作成
  const spinner = document.createElement("div");
  spinner.style.cssText = `
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;

  // スピナーのアニメーションを定義
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // テキストを作成
  const loadingText = document.createElement("div");
  loadingText.textContent = "読み込み中です...";

  loadingDiv.appendChild(spinner);
  loadingDiv.appendChild(loadingText);
  document.body.appendChild(loadingDiv);

  font = loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
  );
  tallBuildingImage = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FtallBuilding.png?alt=media&token=0c3ed88a-8055-46f6-a46d-da8c924446e3"
  );
  groundImage = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
  );
  ballImage = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FbrownBall.png?alt=media&token=573180c7-0aff-40cd-b31c-51b5e83dda2e"
  );
}

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  // ローディング画面を削除
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.remove();
  }

  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
function draw() {
  background(255);

  // ボールの状態を更新 (dt = 1/FPS)
  ball.update(1 / FPS);

  // スケーリングを適用してボールと地面を描画
  scale(width / 1000);
  ball.display((1000 * height) / width);
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
