// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { setupSimulation, resizeSimulation } from "./init.js";
import { drawSimulation } from "./logic.js";
import { onKeyPressed } from "./element-function.js";

/** 等色関数のデータCSVのURL */
const CMF_TABLE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fcmf.csv?alt=media&token=df4cb716-5da8-4640-822e-5107acbdb916";
/** 偏光板を一枚通したときの波長毎の強度分布のデータCSVのURL(PC-最新) */
const OS_TABLE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fos_PC2_new_6.18.csv?alt=media&token=0ba4f938-5669-456b-81dc-e4c62c66ce46";
/** 光路差の分散特性(380nmで100に規格化)のデータCSVのURL(OPPフィルム用) */
const D_TABLE_OPP_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fdata_d_100_film3.csv?alt=media&token=68edd450-dd93-4b8b-851f-28c1ffe14999.csv";
/** 光路差の分散特性(380nmで100に規格化)のデータCSVのURL(セロハンテープ用) */
const D_TABLE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fdata_d_100.csv?alt=media&token=eaf5a4d5-ab04-42fd-8245-eb4896a5eaf5";
/** 偏光板2枚目による強度補正分のデータCSVのURL */
const R_TABLE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2FR.csv?alt=media&token=203b2f68-a0c0-42c2-af5e-df5c240ea27d";
/** 貼り付け用の白画像のURL */
const WHITE_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2F2025%3DDGI%3Dcellophane-color2_ELK%2Fwhite.png?alt=media&token=038ee120-ec5e-4440-8130-3b764f11d25e";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(false, true, 1.0, 1.0, {
    panelSelector: "#p5Canvas",
  });
  let isFirstDraw = true;

  p.preload = () => {
    state.cmfTable = p.loadTable(CMF_TABLE_URL, "csv", "header"); // 等色関数のデータ
    state.osTable = p.loadTable(OS_TABLE_URL, "csv", "header"); // 偏光板を一枚通したときの波長毎の強度分布 PC-最新
    state.dTableOPP = p.loadTable(D_TABLE_OPP_URL, "csv", "header"); //光路差の分散特性(380nmで100に規格化)
    state.dTable = p.loadTable(D_TABLE_URL, "csv", "header");
    state.rTable = p.loadTable(R_TABLE_URL, "csv", "header"); //偏光板2枚目による強度補正分のdata
    state.img = p.loadImage(WHITE_IMAGE_URL);
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    setupSimulation(p);
  };

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.keyPressed = () => {
    onKeyPressed(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    resizeSimulation(p);
  };
};

new p5(sketch);
