// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elCreate, elInit, initValue, uiInit } from "./init.js";
import {
  beforeColorCalculate,
  createStartimg,
  createSliderandRadio,
  drawSimulation,
} from "./logic.js";
import { cellophaneRemoveButtonFunction } from "./element-function.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(false, true, 1.0, 1.0, {
    panelSelector: "#p5Canvas",
  });
  let isFirstDraw = true;

  // 外部ファイルの読み込み
  p.preload = () => {
    state.cmfTable = p.loadTable(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fcmf.csv?alt=media&token=df4cb716-5da8-4640-822e-5107acbdb916",
      "csv",
      "header"
    ); // 等色関数のデータ
    state.osTable = p.loadTable(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fos_PC2_new_6.18.csv?alt=media&token=0ba4f938-5669-456b-81dc-e4c62c66ce46",
      "csv",
      "header"
    ); // 偏光板を一枚通したときの波長毎の強度分布 PC-最新
    state.dTableOPP = p.loadTable(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fdata_d_100_film3.csv?alt=media&token=68edd450-dd93-4b8b-851f-28c1ffe14999.csv",
      "csv",
      "header"
    ); //光路差の分散特性(380nmで100に規格化)
    state.dTable = p.loadTable(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fdata_d_100.csv?alt=media&token=eaf5a4d5-ab04-42fd-8245-eb4896a5eaf5",
      "csv",
      "header"
    );
    state.rTable = p.loadTable(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2FR.csv?alt=media&token=203b2f68-a0c0-42c2-af5e-df5c240ea27d",
      "csv",
      "header"
    ); //偏光板2枚目による強度補正分のdata
    state.img = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2F2025%3DDGI%3Dcellophane-color2_ELK%2Fwhite.png?alt=media&token=038ee120-ec5e-4440-8130-3b764f11d25e"
    );
    state.img2 = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2F2025%3DDGI%3Dcellophane-color2_ELK%2FR.jpg?alt=media&token=9e82b742-fe5b-4332-af54-5796f92bd9ba"
    );
  };

  // ★ setup関数
  p.setup = async () => {
    canvasController.fullScreen(p);
    elCreate(p);
    elInit(p);
    initValue(p);
    await beforeColorCalculate(p);
    p.camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
    createStartimg();
    createSliderandRadio(p);
    uiInit();
  };

  // ★ draw関数
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.windowResized = async () => {
    canvasController.resizeScreen(p);
    elInit(p);
    // cellophaneRemoveButtonFunctionは呼ぶたびにstate.colabNum(組数)を1減らす。
    // state.cellophaneNum(総枚数)は更新されないため、colabNumを基準に
    // 組の数だけ削除する
    while (state.colabNum > 0) {
      cellophaneRemoveButtonFunction(p);
    }
    initValue(p);
    p.camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
    await beforeColorCalculate(p);
  };

  p.keyPressed = () => {
    if (p.keyCode === p.UP_ARROW) {
      state.Cluster1isDead = false;
      state.BisDead = false;
      state.CisDead = false;
      state.Bcount = 0;
      state.Bdraw = 0;
      state.DrawisDead = false;
      state.drawT = 0;
      state.drawCount = 0;
      state.changeisDead = false;
    }
  };
};

new p5(sketch);
