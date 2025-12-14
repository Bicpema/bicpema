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
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    z-index: 9999;
    font-size: 24px;
    font-family: sans-serif;
    color: white;
  `;

  // スピナーを作成
  const spinner = document.createElement("div");
  spinner.style.cssText = `
    width: 50px;
    height: 50px;
    border: 5px solid #333;
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
  background(0); // 黒い背景

  // ボールの状態を更新 (dt = 1/FPS)
  ball.update(1 / FPS);

  // カメラの設定
  camera(200, -150, 300, 0, 0, 0, 0, 1, 0);

  // ライティング
  ambientLight(100);
  directionalLight(255, 255, 255, -0.5, 0.5, -1);

  // ボールと台を描画
  ball.display();
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
