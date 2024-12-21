// 波の発射ボタンを押したときの処理
function launchButtonFunction() {
  if (waveColabNum > 0) {
    // モーダルで設定した數分だけwaveArrに波を追加
    for (let i = 0; i < waveColabNum; i++) {
      let newWave = new incidenceWave(
        waveColabArr[i].waveLengthInput,
        waveColabArr[i].amplitudeInput,
        waveColabArr[i].frequencyInput,
        waveColabArr[i].colorInput,
        waveColabArr[i].waveNumInput,
        waveColabArr[i].waveTypeInput
      );
      waveArr.push(newWave);
      waveNum += 1;
    }
  }
  moveIs = true;
  controlButton.html("停止");
}

// 一時停止ボタンを押したときの処理
function controlButtonFunction() {
  if (moveIs == false) {
    moveIs = true;
    controlButton.html("停止");
  } else {
    moveIs = false;
    controlButton.html("再開");
  }
}

// リセットボタンを押したときの処理
function resetButtonFunction() {
  valueInit();
  timer.html(nf(time / FPS, 2, 2));
}

// ボタンの組を追加するボタンを押したときの処理
function waveColabAddButtonFunction() {
  waveColabNum += 1;
  let dom = new DOM(waveColabNum);
  waveColabArr.push(dom);
}

// ボタンの組を削除するボタンを押したときの処理
function waveColabRemoveButtonFunction() {
  if (waveColabNum > 0) {
    waveColabArr.pop(-1);
    let targetDom = select("#parentDiv-" + waveColabNum);
    targetDom.remove();
    waveColabNum -= 1;
  }
}
