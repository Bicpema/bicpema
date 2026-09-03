import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import {
  computeConvexLensImageDistance,
  computeConcaveLensImageDistance,
  computeMagnification,
} from "./physics.js";

const state = {
  headImg: null,
  convexLensImg: null,
  concaveLensImg: null,
  candleImg: null,
  fImg: null,
  ledImg: null,
};

const sketch = (p) => {
  p.preload = () => {
    state.headImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FheadImg.png?alt=media&token=60e35b0a-2592-4864-9576-b93f584fadf3"
    );
    state.convexLensImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FconvexLensImg.png?alt=media&token=f1ead4c8-c3d6-48e5-9ce0-9d58472ddc4e"
    );
    state.concaveLensImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FconcaveLensImg.png?alt=media&token=532033e6-c0c0-42bd-9233-299598280f91"
    );
    state.candleImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FcandleImg.png?alt=media&token=bd84d70f-cd4a-4982-ad30-14aa8fc3d623"
    );
    state.fImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FfImg.png?alt=media&token=11fe7f35-31c9-4c5e-900f-a5f36ecfd2bc"
    );
    state.ledImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FledImg.png?alt=media&token=b8959687-c7c6-4734-907b-7aedd30bee0f"
    );
  };

  p.setup = () => {
    fullScreen(p);
    buttonCreation(p);
    initSettings(p);
    buttonSettings(p);
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    gridDraw(p);
    lensDraw(p);
    baseDraw(p);
    if (objectSelect.value() == "F") {
      opticalPathDisplay(p, state.fImg);
      objectAndVirtualImageDisplay(p, state.fImg);
      screenDisplay(p, state.fImg);
      focusDraw(p, state.fImg);
      imgWidth = state.fImg.width;
      imgHeight = state.fImg.height;
    } else if (objectSelect.value() == "LED") {
      opticalPathDisplay(p, state.ledImg);
      objectAndVirtualImageDisplay(p, state.ledImg);
      screenDisplay(p, state.ledImg);
      focusDraw(p, state.ledImg);
      imgWidth = state.ledImg.width;
      imgHeight = state.ledImg.height;
    } else if (objectSelect.value() == "ろうそく") {
      opticalPathDisplay(p, state.candleImg);
      objectAndVirtualImageDisplay(p, state.candleImg);
      screenDisplay(p, state.candleImg);
      focusDraw(p, state.candleImg);
      imgWidth = state.candleImg.width;
      imgHeight = state.candleImg.height;
    }
  };

  p.windowResized = () => {
    fullScreen(p);
    initSettings(p);
    buttonSettings(p);
  };
};

new p5(sketch);

//フルスクリーン
function fullScreen(p) {
  const canvas = p.createCanvas(p.windowWidth, p.windowHeight - 60, p.P2D);
  canvas.parent("p5Canvas");
}

//ボタン
let objectXSlider, screenXSlider, focusLengthSlider, lensSelect, objectSelect;

//ボタンの生成
function buttonCreation(p) {
  objectXSlider = p.createSlider(0, (4 * p.width) / 10, 0);
  screenXSlider = p.createSlider(0, (4 * p.width) / 10, (4 * p.width) / 10);
  focusLengthSlider = p.createSlider(0, (4 * p.width) / 10, (2 * p.width) / 10);
  lensSelect = p.createSelect();
  let lensOptionArr = [
    "凸レンズ",
    "凹レンズ",
    "半分の凸レンズ",
    "縞々のスリットの凸レンズ",
  ];
  for (let i = 0; i < lensOptionArr.length; i++)
    lensSelect.option(lensOptionArr[i]);
  objectSelect = p.createSelect();
  let objectOptionArr = ["F", "LED", "ろうそく"];
  for (let i = 0; i < objectOptionArr.length; i++)
    objectSelect.option(objectOptionArr[i]);
}
//ボタンの初期設定
function buttonSettings(p) {
  objectXSlider
    .size((4 * p.width) / 10, 2)
    .position(p.width / 10, 60 + (3 * p.height) / 4)
    .attribute("max", (4 * p.width) / 10);
  screenXSlider
    .size((4 * p.width) / 10, 2)
    .position(p.width / 2, 60 + (3 * p.height) / 4)
    .attribute("max", (4 * p.width) / 10);
  focusLengthSlider
    .size((4 * p.width) / 10, 2)
    .position(p.width / 10, 60 + (6 * p.height) / 10)
    .attribute("max", (4 * p.width) / 10);
  lensSelect
    .size((4 * p.width) / 10, p.height / 16)
    .position(p.width / 10, p.windowHeight - p.height / 16);
  objectSelect
    .size((4 * p.width) / 10, p.height / 16)
    .position(p.width / 2, p.windowHeight - p.height / 16);
}

//変数の設定
let lensWidth,
  lensHeight,
  screenWidth,
  screenHeight,
  objectY,
  blurValue,
  imgWidth,
  imgHeight,
  pg;

//初期設定
function initSettings(p) {
  lensWidth = p.width / 48;
  lensHeight = 7 * lensWidth;
  screenWidth = lensWidth / 3;
  screenHeight = lensHeight;
  state.headImg.resize(p.width / 10, 0);
  state.convexLensImg.resize(lensWidth, lensHeight);
  state.concaveLensImg.resize(lensWidth, lensHeight);
  state.candleImg.resize(0, p.height / 8);
  state.fImg.resize(0, p.height / 8);
  state.ledImg.resize(0, p.height / 8);
  objectY = p.height / 2 - state.candleImg.height;
  blurValue = 0;
  imgWidth = state.fImg.width;
  imgHeight = state.fImg.height;
  pg = p.createGraphics(screenHeight, screenHeight / 2);
  pg = p.createGraphics(screenHeight, screenHeight / 2);
  p.noFill();
  p.stroke(255);
  p.strokeWeight(3);
  p.textSize(p.width / 75);
  p.textAlign(p.CENTER, p.CENTER);
}

//方眼の描画
function gridDraw(p) {
  //背景色
  p.background(0);

  //焦点の線の描画
  p.stroke(255, 255);
  p.line(
    p.width / 2 - ((4 * p.width) / 10 - focusLengthSlider.value()),
    p.height / 2 - 30,
    p.width / 2 - ((4 * p.width) / 10 - focusLengthSlider.value()),
    p.height / 2 + 30
  );
  p.line(
    p.width / 2 + ((4 * p.width) / 10 - focusLengthSlider.value()),
    p.height / 2 - 30,
    p.width / 2 + ((4 * p.width) / 10 - focusLengthSlider.value()),
    p.height / 2 + 30
  );

  //背景方眼の描画
  p.strokeWeight(3);
  //水平方向の軸
  p.line(p.width / 10, p.height / 2, (9 * p.width) / 10, p.height / 2);
  //垂直方向の軸
  p.line(p.width / 10, p.height / 4, p.width / 10, p.height / 2);

  //水平方向の方眼
  for (let i = 0; i <= 75; i++) {
    if (i % 5 == 0) {
      p.noStroke();
      p.text(
        15 - i / 5,
        ((p.width / 2 - p.width / 10) * i) / 75 + p.width / 10,
        p.height / 2 + p.width / 75
      );
      p.text(
        i / 5,
        ((p.width / 2 - p.width / 10) * i) / 75 + p.width / 2,
        p.height / 2 + p.width / 75
      );
      p.stroke(255, 100);
      p.strokeWeight(1);
    } else {
      p.strokeWeight(0.5);
    }
    p.line(
      ((p.width / 2 - p.width / 10) * i) / 75 + p.width / 10,
      p.height / 4,
      ((p.width / 2 - p.width / 10) * i) / 75 + p.width / 10,
      p.height / 2
    );
    p.line(
      ((p.width / 2 - p.width / 10) * i) / 75 + p.width / 2,
      p.height / 4,
      ((p.width / 2 - p.width / 10) * i) / 75 + p.width / 2,
      p.height / 2
    );
  }

  //垂直方向の方眼
  for (let i = 0; i <= 20; i++) {
    if (i % 5 == 0) {
      p.noStroke();
      p.text(
        i / 5,
        p.width / 10 - p.width / 75,
        p.height / 2 - ((p.height / 4) * i) / 20
      );
      p.stroke(255, 100);
      p.strokeWeight(1);
    } else {
      p.strokeWeight(0.5);
    }
    p.line(
      p.width / 10,
      p.height / 2 - ((p.height / 4) * i) / 20,
      (9 * p.width) / 10,
      p.height / 2 - ((p.height / 4) * i) / 20
    );
  }
  p.stroke(255, 255);
}

//レンズの描画
function lensDraw(p) {
  if (lensSelect.value() == "凸レンズ") {
    p.image(
      state.convexLensImg,
      p.width / 2 - lensWidth / 2,
      p.height / 2 - lensHeight / 2
    );
  } else if (lensSelect.value() == "凹レンズ") {
    p.image(
      state.concaveLensImg,
      p.width / 2 - lensWidth / 2,
      p.height / 2 - lensHeight / 2
    );
  } else if (lensSelect.value() == "半分の凸レンズ") {
    p.image(
      state.convexLensImg,
      p.width / 2 - lensWidth / 2,
      p.height / 2 - lensHeight / 2
    );
  } else if (lensSelect.value() == "縞々のスリットの凸レンズ") {
    p.image(
      state.convexLensImg,
      p.width / 2 - lensWidth / 2,
      p.height / 2 - lensHeight / 2
    );
  }
}

//土台の描画
function baseDraw(p) {
  p.fill(0);
  p.rect(p.width / 10, (3 * p.height) / 4, (4 * p.width) / 5, p.height / 4);
  p.line(
    objectXSlider.value() + p.width / 10,
    p.height / 2,
    objectXSlider.value() + p.width / 10,
    (3 * p.height) / 4
  );
  p.rect(
    objectXSlider.value() - 25 + p.width / 10,
    (3 * p.height) / 4 - 25,
    50,
    25
  );
}

//点線の手続き
function dashedLine(p, aX, aY, bX, bY) {
  p.drawingContext.setLineDash([5, 5]);
  p.line(aX, aY, bX, bY);
  p.drawingContext.setLineDash([]);
}

//光線の描画
function opticalPathDisplay(p, img) {
  //変数の設定
  let a = (4 * p.width) / 10 - objectXSlider.value(),
    b,
    m,
    theta_1,
    theta_2;

  //凸レンズの場合
  if (lensSelect.value() == "凸レンズ") {
    if (a > (4 * p.width) / 10 - focusLengthSlider.value()) {
      b =
        (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
        (a - ((4 * p.width) / 10 - focusLengthSlider.value()));
      m = b / a;
      theta_1 = p.atan((img.height * m + img.height) / b);
      theta_2 = p.atan(img.height / a);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY
      );
      p.line(
        p.width / 2,
        objectY,
        p.width - state.headImg.width,
        objectY + (p.width / 2 - state.headImg.width) * p.tan(theta_1)
      );
      let theta_3 = p.atan((img.height / 2 + img.height * m) / b);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY + img.height / 2
      );
      p.line(
        p.width / 2,
        objectY + img.height / 2,
        p.width - state.headImg.width,
        (p.width / 2 - state.headImg.width) * p.tan(theta_3) +
          objectY +
          img.height / 2
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width - state.headImg.width,
        objectY + (a + p.width / 2 - state.headImg.width) * p.tan(theta_2)
      );
      let theta_4 = p.atan((img.height * m - img.height / 2) / b);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        p.height / 2 + img.height / 2
      );
      p.line(
        p.width / 2,
        p.height / 2 + img.height / 2,
        p.width - state.headImg.width,
        (p.width / 2 - state.headImg.width) * p.tan(theta_4) +
          p.height / 2 +
          img.height / 2
      );
      if (img.height * m < lensHeight / 2) {
        p.line(
          objectXSlider.value() + p.width / 10,
          objectY,
          p.width / 2,
          p.height / 2 + img.height * m
        );
        p.line(
          p.width / 2,
          p.height / 2 + img.height * m,
          p.width - state.headImg.width,
          p.height / 2 + img.height * m
        );
      }
    }
    if (a <= (4 * p.width) / 10 - focusLengthSlider.value()) {
      b =
        (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
        ((4 * p.width) / 10 - focusLengthSlider.value() - a);
      m = b / a;
      theta_1 = p.atan(
        img.height / ((4 * p.width) / 10 - focusLengthSlider.value())
      );
      theta_2 = p.atan(img.height / a);
      dashedLine(
        p,
        state.headImg.width,
        p.height / 2 -
          (p.width / 2 - state.headImg.width) * p.tan(theta_1) -
          img.height,
        p.width / 2,
        objectY
      );
      dashedLine(
        p,
        state.headImg.width,
        p.height / 2 - (p.width / 2 - state.headImg.width) * p.tan(theta_2),
        objectXSlider.value() + p.width / 10,
        objectY
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY
      );
      p.line(
        p.width / 2,
        objectY,
        p.width - state.headImg.width,
        objectY + (p.width / 2 - state.headImg.width) * p.tan(theta_1)
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width - state.headImg.width,
        objectY + (a + p.width / 2 - state.headImg.width) * p.tan(theta_2)
      );
    }
  }

  //凹レンズの場合
  if (lensSelect.value() == "凹レンズ") {
    b =
      (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
      (a + ((4 * p.width) / 10 - focusLengthSlider.value()));
    m = b / a;
    theta_1 = p.atan(
      img.height / ((4 * p.width) / 10 - focusLengthSlider.value())
    );
    theta_2 = p.atan(
      (img.height * m) / ((4 * p.width) / 10 - focusLengthSlider.value())
    );
    p.line(objectXSlider.value() + p.width / 10, objectY, p.width / 2, objectY);
    dashedLine(
      p,
      p.width / 2 - ((4 * p.width) / 10 - focusLengthSlider.value()),
      p.height / 2,
      p.width / 2,
      p.height / 2 -
        ((4 * p.width) / 10 - focusLengthSlider.value()) * p.tan(theta_1)
    );
    p.line(
      p.width / 2,
      objectY,
      p.width - state.headImg.width,
      p.height / 2 -
        (p.width / 2 - state.headImg.width) * p.tan(theta_1) -
        img.height
    );
    p.line(
      objectXSlider.value() + p.width / 10,
      objectY,
      p.width / 2,
      p.height / 2 - img.height * m
    );
    p.line(
      p.width / 2,
      p.height / 2 - img.height * m,
      p.width - state.headImg.width,
      p.height / 2 - img.height * m
    );
    dashedLine(
      p,
      p.width / 2 - b,
      p.height / 2 - img.height * m,
      p.width / 2,
      p.height / 2 - img.height * m
    );
    dashedLine(
      p,
      p.width / 2,
      p.height / 2 - img.height * m,
      p.width - state.headImg.width,
      p.height / 2 +
        (p.width / 2 - state.headImg.width) * p.tan(theta_2) -
        img.height * m
    );
    let theta_3 = p.atan(img.height / a);
    p.line(
      objectXSlider.value() + p.width / 10,
      objectY,
      p.width - state.headImg.width,
      p.height / 2 + (p.width / 2 - state.headImg.width) * p.tan(theta_3)
    );
  }

  //半分の凸レンズの場合
  if (lensSelect.value() == "半分の凸レンズ") {
    if (a > focusLengthSlider.value()) {
      b =
        (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
        (a - ((4 * p.width) / 10 - focusLengthSlider.value()));
      m = b / a;
      theta_1 = p.atan((img.height * m + img.height) / b);
      theta_2 = p.atan(img.height / a);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY
      );
      p.line(
        p.width / 2,
        objectY,
        p.width - state.headImg.width,
        objectY + (p.width / 2 - state.headImg.width) * p.tan(theta_1)
      );
      let theta_3 = p.atan((img.height / 2 + img.height * m) / b);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY + img.height / 2
      );
      p.line(
        p.width / 2,
        objectY + img.height / 2,
        p.width - state.headImg.width,
        (p.width / 2 - state.headImg.width) * p.tan(theta_3) +
          objectY +
          img.height / 2
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width - state.headImg.width,
        objectY + (a + p.width / 2 - state.headImg.width) * p.tan(theta_2)
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        p.height / 2 + img.height / 2
      );
      if (img.height * m < lensHeight / 2) {
        p.line(
          objectXSlider.value() + p.width / 10,
          objectY,
          p.width / 2,
          p.height / 2 + img.height * m
        );
      }
    }
    if (a <= focusLengthSlider.value()) {
      b = (a * focusLengthSlider.value()) / (focusLengthSlider.value() - a);
      m = b / a;
      theta_1 = p.atan(img.height / focusLengthSlider.value());
      theta_2 = p.atan(img.height / a);
      dashedLine(
        p,
        state.headImg.width,
        p.height / 2 -
          (p.width / 2 - state.headImg.width) * p.tan(theta_1) -
          img.height,
        p.width / 2,
        objectY
      );
      dashedLine(
        p,
        state.headImg.width,
        p.height / 2 - (p.width / 2 - state.headImg.width) * p.tan(theta_2),
        objectXSlider.value() + p.width / 10,
        objectY
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY
      );
      p.line(
        p.width / 2,
        objectY,
        p.width - state.headImg.width,
        objectY + (p.width / 2 - state.headImg.width) * p.tan(theta_1)
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width - state.headImg.width,
        objectY + (a + p.width / 2 - state.headImg.width) * p.tan(theta_2)
      );
    }
    p.fill(100);
    p.stroke(100);
    p.rect(
      p.width / 2 - lensWidth / 2,
      p.height / 2,
      lensWidth / 2,
      lensHeight / 2
    );
    p.stroke(255);
  }

  //縞々のスリットを入れた凸レンズの場合
  if (lensSelect.value() == "縞々のスリットの凸レンズ") {
    if (a > (4 * p.width) / 10 - focusLengthSlider.value()) {
      b =
        (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
        (a - ((4 * p.width) / 10 - focusLengthSlider.value()));
      m = b / a;
      theta_1 = p.atan((img.height * m + img.height) / b);
      theta_2 = p.atan(img.height / a);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY
      );
      let theta_3 = p.atan((img.height / 2 + img.height * m) / b);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY + img.height / 2
      );
      p.line(
        p.width / 2,
        objectY + img.height / 2,
        p.width - state.headImg.width,
        (p.width / 2 - state.headImg.width) * p.tan(theta_3) +
          objectY +
          img.height / 2
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        p.height / 2
      );
      let theta_4 = p.atan((img.height * m - img.height / 2) / b);
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        p.height / 2 + img.height / 2
      );
      p.line(
        p.width / 2,
        p.height / 2 + img.height / 2,
        p.width - state.headImg.width,
        (p.width / 2 - state.headImg.width) * p.tan(theta_4) +
          p.height / 2 +
          img.height / 2
      );
      if (img.height * m < lensHeight / 2) {
        p.line(
          objectXSlider.value() + p.width / 10,
          objectY,
          p.width / 2,
          p.height / 2 + img.height * m
        );
        if (
          p.height / 2 + img.height * m <
            p.height / 2 + state.candleImg.height - lensHeight / 12 ||
          p.height / 2 + img.height * m >
            p.height / 2 + state.candleImg.height + lensHeight / 12
        ) {
          p.line(
            p.width / 2,
            p.height / 2 + img.height * m,
            p.width - state.headImg.width,
            p.height / 2 + img.height * m
          );
        }
      }
    }
    if (a <= (4 * p.width) / 10 - focusLengthSlider.value()) {
      b =
        (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
        ((4 * p.width) / 10 - focusLengthSlider.value() - a);
      m = b / a;
      theta_1 = p.atan(
        img.height / ((4 * p.width) / 10 - focusLengthSlider.value())
      );
      theta_2 = p.atan(img.height / a);
      dashedLine(
        p,
        state.headImg.width,
        p.height / 2 -
          (p.width / 2 - state.headImg.width) * p.tan(theta_1) -
          img.height,
        p.width / 2,
        objectY
      );
      dashedLine(
        p,
        state.headImg.width,
        p.height / 2 - (p.width / 2 - state.headImg.width) * p.tan(theta_2),
        objectXSlider.value() + p.width / 10,
        objectY
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width / 2,
        objectY
      );
      p.line(
        p.width / 2,
        objectY,
        p.width - state.headImg.width,
        objectY + (p.width / 2 - state.headImg.width) * p.tan(theta_1)
      );
      p.line(
        objectXSlider.value() + p.width / 10,
        objectY,
        p.width - state.headImg.width,
        objectY + (a + p.width / 2 - state.headImg.width) * p.tan(theta_2)
      );
    }
    p.fill(100);
    p.stroke(100);
    p.rect(
      p.width / 2 - lensWidth / 2,
      p.height / 2 - lensHeight / 12,
      lensWidth / 2,
      lensHeight / 6
    );
    p.rect(
      p.width / 2 - lensWidth / 2,
      p.height / 2 - state.candleImg.height - lensHeight / 12,
      lensWidth / 2,
      lensHeight / 6
    );
    p.rect(
      p.width / 2 - lensWidth / 2,
      p.height / 2 + state.candleImg.height - lensHeight / 12,
      lensWidth / 2,
      lensHeight / 6
    );
    p.stroke(255);
  }
}

//物体と虚像の描画
function objectAndVirtualImageDisplay(p, img) {
  //変数の設定
  let a = (4 * p.width) / 10 - objectXSlider.value();
  let b;
  let m;

  //物体の描画
  p.noFill();
  p.image(img, objectXSlider.value() - img.width / 2 + p.width / 10, objectY);
  p.stroke(255, 0, 0);
  p.rect(
    objectXSlider.value() - img.width / 2 + p.width / 10,
    objectY,
    img.width,
    img.height
  );
  p.noStroke();
  p.fill(255);
  p.text(
    "レンズからの距離:" +
      p.str(
        (15 * (1 - objectXSlider.value() / ((4 * p.width) / 10))).toFixed(1)
      ) +
      " cm",
    objectXSlider.value() + p.width / 10,
    (3 * p.height) / 4 + (1.5 * p.width) / 75
  );
  p.stroke(255);
  p.noFill();

  //虚像の描画

  //凸レンズの場合
  if (lensSelect.value() == "凸レンズ") {
    if (a <= (4 * p.width) / 10 - focusLengthSlider.value()) {
      b = computeConvexLensImageDistance(
        a,
        (4 * p.width) / 10 - focusLengthSlider.value()
      );
      m = computeMagnification(b, a);
      p.image(
        img,
        p.width / 2 - b - (img.width * m) / 2,
        p.height / 2 - img.height * m,
        img.width * m,
        img.height * m
      );
      p.stroke(0, 0, 255);
      p.stroke(255);
      p.push();
      p.translate(
        p.width - state.headImg.width,
        p.height / 2 -
          img.height +
          (p.width / 2 - state.headImg.width) *
            p.tan(
              p.atan(
                img.height / ((4 * p.width) / 10 - focusLengthSlider.value())
              )
            )
      );
      p.rotate(p.PI / 10);
      p.image(state.headImg, 0, 0);
      p.pop();
    }
  }

  //凹レンズの場合
  if (lensSelect.value() == "凹レンズ") {
    b = computeConcaveLensImageDistance(
      a,
      (4 * p.width) / 10 - focusLengthSlider.value()
    );
    m = computeMagnification(b, a);
    p.image(
      img,
      p.width / 2 - b - (img.width * m) / 2,
      p.height / 2 - img.height * m,
      img.width * m,
      img.height * m
    );
    p.stroke(0, 0, 255);
    p.rect(
      p.width / 2 - b - (img.width * m) / 2,
      p.height / 2 - img.height * m,
      img.width * m,
      img.height * m
    );
    p.stroke(255);
    p.push();
    p.translate(
      p.width - state.headImg.width,
      p.height / 2 -
        (p.width / 2 - state.headImg.width) *
          p.tan(
            p.atan(
              img.height / ((4 * p.width) / 10 - focusLengthSlider.value())
            )
          ) -
        img.height
    );
    p.rotate(-p.PI / 10);
    p.image(state.headImg, 0, 0);
    p.pop();
  }

  //半分の凸レンズの場合
  if (lensSelect.value() == "半分の凸レンズ") {
    if (a <= (4 * p.width) / 10 - focusLengthSlider.value()) {
      b =
        (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
        ((4 * p.width) / 10 - focusLengthSlider.value() - a);
      m = b / a;
      p.image(
        img,
        p.width / 2 - b - (img.width * m) / 2,
        p.height / 2 - img.height * m,
        img.width * m,
        img.height * m
      );
      p.stroke(0, 0, 255);
      p.rect(
        p.width / 2 - b - (img.width * m) / 2,
        p.height / 2 - img.height * m,
        img.width * m,
        img.height * m
      );
      p.stroke(255);
      p.push();
      p.translate(
        p.width - state.headImg.width,
        p.height / 2 -
          img.height +
          (p.width / 2 - state.headImg.width) *
            p.tan(
              p.atan(
                img.height / ((4 * p.width) / 10 - focusLengthSlider.value())
              )
            )
      );
      p.rotate(p.PI / 10);
      p.image(state.headImg, 0, 0);
      p.pop();
    }
  }

  //縞々の凸レンズの場合
  if (lensSelect.value() == "縞々のスリットの凸レンズ") {
    if (a <= (4 * p.width) / 10 - focusLengthSlider.value()) {
      b =
        (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
        ((4 * p.width) / 10 - focusLengthSlider.value() - a);
      m = b / a;
      p.image(
        img,
        p.width / 2 - b - (img.width * m) / 2,
        p.height / 2 - img.height * m,
        img.width * m,
        img.height * m
      );
      p.stroke(0, 0, 255);
      p.rect(
        p.width / 2 - b - (img.width * m) / 2,
        p.height / 2 - img.height * m,
        img.width * m,
        img.height * m
      );
      p.stroke(255);
      p.push();
      p.translate(
        p.width - state.headImg.width,
        p.height / 2 -
          img.height +
          (p.width / 2 - state.headImg.width) *
            p.tan(
              p.atan(
                img.height / ((4 * p.width) / 10 - focusLengthSlider.value())
              )
            )
      );
      p.rotate(p.PI / 10);
      p.image(state.headImg, 0, 0);
      p.pop();
    }
  }
}

//スクリーンの描画
function screenDisplay(p, img) {
  let a = (4 * p.width) / 10 - objectXSlider.value();
  let b =
    (a * ((4 * p.width) / 10 - focusLengthSlider.value())) /
    (a - ((4 * p.width) / 10 - focusLengthSlider.value()));
  let m = b / a;
  p.fill(255);
  p.noStroke();
  p.text(
    "レンズからの距離:" +
      p.str((15 * (screenXSlider.value() / ((4 * p.width) / 10))).toFixed(1)) +
      " cm",
    screenXSlider.value() + (5 * p.width) / 10,
    (3 * p.height) / 4 + (1.5 * p.width) / 75
  );
  p.stroke(255);
  if (lensSelect.value() != "凹レンズ") {
    if (a > (4 * p.width) / 10 - focusLengthSlider.value()) {
      blurValue = p.map(
        p.abs(b - screenXSlider.value()),
        screenXSlider.value(),
        0,
        10,
        0
      );
      if (p.abs(blurValue) > 10) {
        blurValue = 10;
      }
      // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
      pg.background(0);
      pg.push();
      pg.translate(screenHeight / 2 - (img.width * m) / 2, 0);
      pg.scale(-1, -1);
      if (lensSelect.value() == "半分の凸レンズ") {
        pg.tint(255, 100);
      }
      if (lensSelect.value() == "縞々のスリットの凸レンズ") {
        pg.tint(255, 75);
        if (
          p.height / 2 + img.height * m <
            p.height / 2 + state.candleImg.height - lensHeight / 12 ||
          p.height / 2 + img.height * m >
            p.height / 2 + state.candleImg.height + lensHeight / 12
        ) {
          pg.tint(255, 100);
        }
      }
      pg.image(
        img,
        -img.width * m,
        -img.height * m,
        img.width * m,
        img.height * m
      );
      pg.tint(255, 255);
      pg.pop();
      pg.filter(p.BLUR, p.abs(blurValue));
      // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
      p.image(
        pg,
        screenXSlider.value() +
          p.width / 2 -
          screenHeight / 2 +
          screenWidth / 2,
        p.height / 2 - screenHeight - 10
      );
      p.noFill();
      p.stroke(0, 255, 0);
      p.rect(
        screenXSlider.value() +
          p.width / 2 -
          screenHeight / 2 +
          screenWidth / 2,
        p.height / 2 - (3 * screenHeight) / 2 - 10,
        screenHeight,
        screenHeight
      );
      p.stroke(255);
      dashedLine(
        p,
        screenXSlider.value() +
          p.width / 2 -
          screenHeight / 2 +
          screenWidth / 2,
        p.height / 2 - screenHeight - 10,
        screenXSlider.value() +
          p.width / 2 +
          screenHeight / 2 +
          screenWidth / 2,
        p.height / 2 - screenHeight - 10
      );
      p.fill(255, 150);
      p.rect(
        screenXSlider.value() + p.width / 2,
        p.height / 2 - screenHeight / 2,
        screenWidth,
        screenHeight
      );
      p.stroke(0, 255, 0);
      p.line(
        screenXSlider.value() + p.width / 2,
        p.height / 2 - screenHeight / 2,
        screenXSlider.value() + p.width / 2,
        p.height / 2 + screenHeight / 2
      );
      p.stroke(255);
      p.line(
        screenXSlider.value() + p.width / 2,
        p.height / 2 + lensHeight / 2,
        screenXSlider.value() + p.width / 2,
        (3 * p.height) / 4
      );
      p.fill(100);
      p.rect(
        screenXSlider.value() + p.width / 2 - 25,
        (3 * p.height) / 4 - 25,
        50,
        25
      );
      p.strokeWeight(1);
      p.fill(255);
      for (let i = 0; i <= screenHeight / 2 / (p.height / (4 * 20)); i++) {
        if (i % 5 == 0) {
          p.stroke(255, 255);
          p.line(
            screenXSlider.value() +
              p.width / 2 -
              screenHeight / 2 +
              screenWidth / 2,
            p.height / 2 - screenHeight + (p.height / (4 * 20)) * i - 10,
            screenXSlider.value() +
              p.width / 2 +
              screenHeight / 2 +
              screenWidth / 2 +
              7,
            p.height / 2 - screenHeight + +(p.height / (4 * 20)) * i - 10
          );
          p.stroke(255, 50);
          p.line(
            screenXSlider.value() +
              p.width / 2 -
              screenHeight / 2 +
              screenWidth / 2,
            p.height / 2 - screenHeight + (p.height / (4 * 20)) * i - 10,
            screenXSlider.value() +
              p.width / 2 +
              screenHeight / 2 +
              screenWidth / 2,
            p.height / 2 - screenHeight + (p.height / (4 * 20)) * i - 10
          );
          p.text(
            i / 5,
            // スライダー最大値でも目盛りラベルがcanvas右端をはみ出さないよう、
            // 右端からの余白(p.width/70)を狭くしている
            screenXSlider.value() +
              p.width / 2 +
              screenHeight / 2 +
              screenWidth / 2 +
              p.width / 70,
            p.height / 2 - screenHeight + (p.height / (4 * 20)) * i - 10
          );
        }
        p.stroke(255, 50);
        p.line(
          screenXSlider.value() +
            p.width / 2 -
            screenHeight / 2 +
            screenWidth / 2,
          p.height / 2 - screenHeight + (p.height / (4 * 20)) * i - 10,
          screenXSlider.value() +
            p.width / 2 +
            screenHeight / 2 +
            screenWidth / 2,
          p.height / 2 - screenHeight + (p.height / (4 * 20)) * i - 10
        );
      }
      p.strokeWeight(3);
      p.stroke(255, 0, 0);
      p.noFill();
      p.rect(
        screenXSlider.value() + p.width / 2 + screenWidth / 2 - img.width / 2,
        p.height / 2 - screenHeight - 10,
        img.width,
        img.height
      );
      p.stroke(255, 255);
    }
  }
}

//焦点の描画
function focusDraw(p, img) {
  p.tint(255, 255);
  p.fill(255, 255);
  p.noStroke();
  p.text(
    "focus",
    p.width / 2 - ((4 * p.width) / 10 - focusLengthSlider.value()),
    p.height / 2 + p.width / 50 + (1.5 * p.width) / 75
  );
  p.text(
    "焦点距離:" +
      p.str(
        p
          .map(
            (4 * p.width) / 10 - focusLengthSlider.value(),
            (4 * p.width) / 10,
            0,
            15,
            0
          )
          .toFixed(1)
      ) +
      " cm",
    p.width / 2 - ((4 * p.width) / 10 - focusLengthSlider.value()),
    (6 * p.height) / 10 + (1.5 * p.width) / 75
  );
  p.stroke(255);
}
