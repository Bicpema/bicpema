// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";
import { computeRefractionAngle, computeSnellRatio } from "./physics.js";

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.background(0);
  if (state.simulationMode == "animation") {
    animationRays(p);
    animationBackgroundSetting(p);
    animationOperation(p);
    animationCalculate(p);
  }
  if (state.simulationMode == "line") {
    lineRays(p);
    lineBackgroundSetting(p);
    lineOperation(p);
    lineCalculate(p);
  }
  if (state.simulationMode == "animationMax") {
    animationMaxRays(p);
    animationMaxBackgroundSetting(p);
    animationMaxOperation(p);
    animationMaxCalculate(p);
  }
  if (state.simulationMode == "lineMax") {
    lineMaxRays(p);
    lineMaxBackgroundSetting(p);
    lineMaxOperation(p);
    lineMaxCalculate(p);
  }
  lightResource(p);
  drawModeTabs(p);
}

/**
 * 右上の表示モード切り替えタブを描画する。
 * @param {*} p p5インスタンス
 */
function drawModeTabs(p) {
  p.noFill();
  p.stroke(255);
  p.push();
  // "animationMax"がボタン幅(width/8)に収まるよう縮小する
  p.textSize(p.width / 75);
  for (let i = 0; i < 4; i++) {
    p.fill(100);
    p.stroke(255);
    p.rect(
      p.width - ((4 - i) * p.width) / 8,
      0,
      p.width / 8,
      p.height / 20,
      100
    );
    p.fill(255);
    p.noStroke();
    if (i == 0) {
      p.text(
        "animation",
        p.width - ((4 - i) * p.width) / 8,
        0,
        p.width / 8,
        p.height / 20
      );
    }
    if (i == 1) {
      p.text(
        "animationMax",
        p.width - ((4 - i) * p.width) / 8,
        0,
        p.width / 8,
        p.height / 20
      );
    }
    if (i == 2) {
      p.text(
        "line",
        p.width - ((4 - i) * p.width) / 8,
        0,
        p.width / 8,
        p.height / 20
      );
    }
    if (i == 3) {
      p.text(
        "lineMax",
        p.width - ((4 - i) * p.width) / 8,
        0,
        p.width / 8,
        p.height / 20
      );
    }
  }
  p.pop();
}

/**
 * 光源（レーザー光源）を描画する。
 * @param {*} p p5インスタンス
 */
function lightResource(p) {
  p.strokeWeight(1);
  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.fill(0);
  p.stroke(255);
  p.rotate(p.radians(state.lightRotateTheta));
  p.rect(
    -p.width / 48,
    p.height / 2 - p.height / 6,
    p.width / 24,
    p.height / 6
  );
  p.pop();
}

// ============================================================
// animation モード
// ============================================================

function animationCalculate(p) {
  state.theta1 = p.radians(state.lightRotateTheta);
  state.n12 = state.n2 / state.n1;
  state.theta2 = computeRefractionAngle(state.theta1, state.n12);
  state.boundary = computeSnellRatio(state.theta1, state.n12);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
      if (state.raysY > p.height / 2) {
        state.raysSpeedX = state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
        state.raysSpeedY = state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
      } else {
        state.raysSpeedX = state.raysSpeed * p.cos(state.theta2 + p.PI / 2);
        state.raysSpeedY = state.raysSpeed * p.sin(state.theta2 + p.PI / 2);
        state.raysX2 -= state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
        state.raysY2 += state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
      }
    } else {
      state.raysSpeedX = state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
      state.raysSpeedY = state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
    }
    state.raysX -= state.raysSpeedX;
    state.raysY -= state.raysSpeedY;
  } else {
    state.raysSpeedX = state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
    state.raysSpeedY = state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
    if (state.theta1 > 0) {
      if (state.raysX > p.width / 2) {
        state.raysX -= state.raysSpeedX;
        state.raysY += state.raysSpeedY;
      } else {
        state.raysX -= state.raysSpeedX;
        state.raysY -= state.raysSpeedY;
      }
    }
    if (state.theta1 < 0) {
      if (state.raysX > p.width / 2) {
        state.raysX -= state.raysSpeedX;
        state.raysY -= state.raysSpeedY;
      } else {
        state.raysX -= state.raysSpeedX;
        state.raysY += state.raysSpeedY;
      }
    }
  }
}

function animationOperation(p) {
  if (p.mouseIsPressed) {
    state.count++;
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (3 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta < 90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta += 0.5;
      } else {
        state.lightRotateTheta += 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta > 90) {
        state.lightRotateTheta = 90;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (7 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta > -90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta -= 0.5;
      } else {
        state.lightRotateTheta -= 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta < -90) {
        state.lightRotateTheta = -90;
      }
    }
    state.theta1 = p.radians(state.lightRotateTheta);
    state.theta2 = computeRefractionAngle(state.theta1, state.n12);
    state.n12 = state.n2 / state.n1;
  } else {
    state.count = 0;
  }
  p.fill(255);
  p.noStroke();
  p.image(
    state.rotateRemocon,
    p.width - state.rotateRemocon.width,
    p.height - state.rotateRemocon.height
  );
  p.text(
    p.nf(p.abs(state.lightRotateTheta), 1, 1) + "'",
    p.width - state.rotateRemocon.width + (5 * state.rotateRemocon.width) / 12,
    p.height - state.rotateRemocon.height + state.rotateRemocon.height / 4,
    state.rotateRemocon.width / 3,
    state.rotateRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 - state.nRemocon.height + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
  p.stroke(255);
}

function animationBackgroundSetting(p) {
  p.noFill();
  p.strokeWeight(5);
  p.stroke(255);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.raysY <= p.height / 2) {
      if (state.theta1 >= 0 && state.raysX >= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 + (2 * p.width) / 50,
            p.height / 2 - (4 * p.width) / 50
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(0, 255, 0);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / 10,
            p.height / 10,
            (3 * p.PI) / 2,
            state.theta2 + (3 * p.PI) / 2
          );
        }
      }
      if (state.theta1 < 0 && state.raysX <= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 + (2 * p.width) / 50,
            p.height / 2 - (4 * p.width) / 50
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(0, 255, 0);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / 10,
            p.height / 10,
            state.theta2 + (3 * p.PI) / 2,
            (3 * p.PI) / 2
          );
        }
      }
    }
  } else {
    if (state.theta1 >= 0) {
      if (state.raysX >= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
      }
    } else {
      if (state.raysX <= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
      }
    }
  }
  p.stroke(255, 100);
  p.strokeWeight(5);
  p.line(p.width / 2, 0, p.width / 2, p.height);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

function animationRays(p) {
  const s = p.sq(
    (state.n1 * p.cos(state.theta1) - state.n2 * p.cos(state.theta2)) /
      (state.n1 * p.cos(state.theta1) + state.n2 * p.cos(state.theta2))
  );
  const pr = p.sq(
    (state.n1 * p.cos(state.theta2) - state.n2 * p.cos(state.theta1)) /
      (state.n1 * p.cos(state.theta2) + state.n2 * p.cos(state.theta1))
  );
  const strength = (s + pr) / 2;
  // beginDraw() and endDraw() is not supported in p5.js, and or often not needed;
  state.pg.noStroke();
  state.pg.fill(255, 0, 0);
  if (state.raysY < p.height / 2) {
    state.pg.fill(255, 0, 0, 255 * (1 - strength));
  }
  state.pg.ellipse(state.raysX, state.raysY, 5, 5);
  if (-1 < state.boundary && state.boundary < 1 && state.raysY < p.height / 2) {
    state.pg.fill(255, 0, 0, 255 * strength);
    state.pg.ellipse(state.raysX2, state.raysY2, 5, 5);
  }
  if (p.mouseIsPressed) {
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (3 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 ||
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (7 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20
    ) {
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    if (
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 + (3 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20 ||
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 + (7 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20 ||
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 - state.nRemocon.height + (3 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20 ||
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 - state.nRemocon.height + (7 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20
    ) {
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    for (let i = 0; i < 4; i++) {
      if (
        p.width - ((4 - i) * p.width) / 8 < p.mouseX &&
        p.mouseX < p.width - ((4 - i - 1) * p.width) / 8 &&
        0 < p.mouseY &&
        p.mouseY < p.height / 20
      ) {
        state.raysX =
          p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
        state.raysY =
          p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
        state.raysX2 = p.width / 2;
        state.raysY2 = p.height / 2;
        state.pg.background(0);
      }
    }
  }
  // beginDraw() and endDraw() is not supported in p5.js, and or often not needed;
  p.image(state.pg, 0, 0);
}

// ============================================================
// line モード
// ============================================================

function lineCalculate(p) {
  state.theta1 = p.radians(state.lightRotateTheta);
  state.n12 = state.n2 / state.n1;
  state.theta2 = computeRefractionAngle(state.theta1, state.n12);
  state.boundary = computeSnellRatio(state.theta1, state.n12);
}

function lineOperation(p) {
  if (p.mouseIsPressed) {
    state.count++;
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (3 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta < 90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta += 0.5;
      } else {
        state.lightRotateTheta += 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta > 90) {
        state.lightRotateTheta = 90;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (7 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta > -90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta -= 0.5;
      } else {
        state.lightRotateTheta -= 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta < -90) {
        state.lightRotateTheta = -90;
      }
    }
    state.theta1 = p.radians(state.lightRotateTheta);
    state.theta2 = computeRefractionAngle(state.theta1, state.n12);
    state.n12 = state.n2 / state.n1;
  } else {
    state.count = 0;
  }
  p.fill(255);
  p.noStroke();
  p.image(
    state.rotateRemocon,
    p.width - state.rotateRemocon.width,
    p.height - state.rotateRemocon.height
  );
  p.text(
    p.nf(p.abs(state.lightRotateTheta), 1, 1) + "'",
    p.width - state.rotateRemocon.width + (5 * state.rotateRemocon.width) / 12,
    p.height - state.rotateRemocon.height + state.rotateRemocon.height / 4,
    state.rotateRemocon.width / 3,
    state.rotateRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 - state.nRemocon.height + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
}

function lineBackgroundSetting(p) {
  p.noFill();
  p.strokeWeight(5);
  p.stroke(255);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.theta1 > 0) {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(0, 255, 0);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          (3 * p.PI) / 2,
          state.theta2 + (3 * p.PI) / 2
        );
      }
    } else {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(0, 255, 0);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          state.theta2 + (3 * p.PI) / 2,
          (3 * p.PI) / 2
        );
      }
    }
    p.fill(255);
    p.noStroke();
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 - (2 * p.width) / 50,
      p.height / 2 + (4 * p.width) / 50
    );
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 + (2 * p.width) / 50,
      p.height / 2 + (4 * p.width) / 50
    );
    if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
      p.text(
        p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
        p.width / 2 + (2 * p.width) / 50,
        p.height / 2 - (4 * p.width) / 50
      );
    }
  } else {
    if (state.theta1 > 0) {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 - (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 + (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
    } else {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 - (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 + (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
    }
  }
  p.stroke(255, 100);
  p.strokeWeight(5);
  p.line(p.width / 2, 0, p.width / 2, p.height);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

function lineRays(p) {
  const s = p.sq(
    (state.n1 * p.cos(state.theta1) - state.n2 * p.cos(state.theta2)) /
      (state.n1 * p.cos(state.theta1) + state.n2 * p.cos(state.theta2))
  );
  const pr = p.sq(
    (state.n1 * p.cos(state.theta2) - state.n2 * p.cos(state.theta1)) /
      (state.n1 * p.cos(state.theta2) + state.n2 * p.cos(state.theta1))
  );
  const strength = (s + pr) / 2;
  p.strokeWeight(5);
  p.stroke(255, 0, 0);
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1),
    p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1)
  );
  if (-1 < state.boundary && state.boundary < 1) {
    p.stroke(255, 0, 0, 255 * strength);
  } else {
    p.stroke(255, 0, 0);
  }
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 + p.width * p.sin(state.theta1),
    p.height / 2 + p.width * p.cos(state.theta1)
  );
  p.stroke(255, 0, 0, 255 * (1 - strength));
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 + p.width * p.sin(state.theta2),
    p.height / 2 - p.width * p.cos(state.theta2)
  );
}

// ============================================================
// animationMax モード
// ============================================================

function animationMaxCalculate(p) {
  state.theta1 = p.radians(state.lightRotateTheta);
  state.n12 = state.n2 / state.n1;
  state.theta2 = computeRefractionAngle(state.theta1, state.n12);
  state.boundary = computeSnellRatio(state.theta1, state.n12);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
      if (state.raysY > p.height / 2) {
        state.raysSpeedX = state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
        state.raysSpeedY = state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
      } else {
        state.raysSpeedX = state.raysSpeed * p.cos(state.theta2 + p.PI / 2);
        state.raysSpeedY = state.raysSpeed * p.sin(state.theta2 + p.PI / 2);
        state.raysX2 -= state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
        state.raysY2 += state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
      }
    } else {
      state.raysSpeedX = state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
      state.raysSpeedY = state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
    }
    state.raysX -= state.raysSpeedX;
    state.raysY -= state.raysSpeedY;
  } else {
    state.raysSpeedX = state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
    state.raysSpeedY = state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
    if (state.theta1 > 0) {
      if (state.raysX > p.width / 2) {
        state.raysX -= state.raysSpeedX;
        state.raysY += state.raysSpeedY;
      } else {
        state.raysX -= state.raysSpeedX;
        state.raysY -= state.raysSpeedY;
      }
    }
    if (state.theta1 < 0) {
      if (state.raysX > p.width / 2) {
        state.raysX -= state.raysSpeedX;
        state.raysY -= state.raysSpeedY;
      } else {
        state.raysX -= state.raysSpeedX;
        state.raysY += state.raysSpeedY;
      }
    }
  }
}

function animationMaxOperation(p) {
  if (p.mouseIsPressed) {
    state.count++;
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (3 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta < 90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta += 0.5;
      } else {
        state.lightRotateTheta += 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta > 90) {
        state.lightRotateTheta = 90;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (7 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta > -90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta -= 0.5;
      } else {
        state.lightRotateTheta -= 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta < -90) {
        state.lightRotateTheta = -90;
      }
    }
    state.theta1 = p.radians(state.lightRotateTheta);
    state.theta2 = computeRefractionAngle(state.theta1, state.n12);
    state.n12 = state.n2 / state.n1;
  } else {
    state.count = 0;
  }
  p.fill(255);
  p.image(
    state.rotateRemocon,
    p.width - state.rotateRemocon.width,
    p.height - state.rotateRemocon.height
  );
  p.noStroke();
  p.text(
    p.nf(p.abs(state.lightRotateTheta), 1, 1) + "'",
    p.width - state.rotateRemocon.width + (5 * state.rotateRemocon.width) / 12,
    p.height - state.rotateRemocon.height + state.rotateRemocon.height / 4,
    state.rotateRemocon.width / 3,
    state.rotateRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 - state.nRemocon.height + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
  p.stroke(255);
}

function animationMaxBackgroundSetting(p) {
  p.noFill();
  p.strokeWeight(5);
  p.stroke(255);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.raysY <= p.height / 2) {
      if (state.theta1 >= 0 && state.raysX >= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 + (2 * p.width) / 50,
            p.height / 2 - (4 * p.width) / 50
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(0, 255, 0);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / 10,
            p.height / 10,
            (3 * p.PI) / 2,
            state.theta2 + (3 * p.PI) / 2
          );
        }
      }
      if (state.theta1 < 0 && state.raysX <= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 + (2 * p.width) / 50,
            p.height / 2 - (4 * p.width) / 50
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(0, 255, 0);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / 10,
            p.height / 10,
            state.theta2 + (3 * p.PI) / 2,
            (3 * p.PI) / 2
          );
        }
      }
    }
  } else {
    if (state.theta1 >= 0) {
      if (state.raysX >= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
      }
    } else {
      if (state.raysX <= p.width / 2) {
        p.stroke(255, 0, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(0, 255, 255);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 - (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 + (2 * p.width) / 50,
          p.height / 2 + (4 * p.width) / 50
        );
      }
    }
  }
  p.stroke(255, 100);
  p.strokeWeight(5);
  p.line(p.width / 2, 0, p.width / 2, p.height);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

function animationMaxRays(p) {
  // beginDraw() and endDraw() is not supported in p5.js, and or often not needed;
  state.pg.noStroke();
  state.pg.fill(255, 0, 0);
  state.pg.ellipse(state.raysX, state.raysY, 5, 5);
  if (-1 < state.boundary && state.boundary < 1 && state.raysY < p.height / 2) {
    state.pg.ellipse(state.raysX2, state.raysY2, 5, 5);
  }
  if (p.mouseIsPressed) {
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (3 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 ||
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (7 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20
    ) {
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    if (
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 + (3 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20 ||
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 + (7 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20 ||
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 - state.nRemocon.height + (3 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20 ||
      p.dist(
        (9 * state.nRemocon.width) / 10,
        p.height / 2 - state.nRemocon.height + (7 * state.nRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / 20
    ) {
      state.raysX =
        p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
      state.raysY =
        p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    for (let i = 0; i < 4; i++) {
      if (
        p.width - ((4 - i) * p.width) / 8 < p.mouseX &&
        p.mouseX < p.width - ((4 - i - 1) * p.width) / 8 &&
        0 < p.mouseY &&
        p.mouseY < p.height / 20
      ) {
        state.raysX =
          p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
        state.raysY =
          p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
        state.raysX2 = p.width / 2;
        state.raysY2 = p.height / 2;
        state.pg.background(0);
      }
    }
  }
  // beginDraw() and endDraw() is not supported in p5.js, and or often not needed;
  p.image(state.pg, 0, 0);
}

// ============================================================
// lineMax モード
// ============================================================

function lineMaxCalculate(p) {
  state.theta1 = p.radians(state.lightRotateTheta);
  state.n12 = state.n2 / state.n1;
  state.theta2 = computeRefractionAngle(state.theta1, state.n12);
  state.boundary = computeSnellRatio(state.theta1, state.n12);
}

function lineMaxOperation(p) {
  if (p.mouseIsPressed) {
    state.count++;
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (3 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta < 90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta += 0.5;
      } else {
        state.lightRotateTheta += 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta > 90) {
        state.lightRotateTheta = 90;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (9 * state.rotateRemocon.width) / 10,
        p.height -
          state.rotateRemocon.height +
          (7 * state.rotateRemocon.height) / 10,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / 20 &&
      state.lightRotateTheta > -90 &&
      state.count > 10
    ) {
      if (state.count > 30) {
        state.lightRotateTheta -= 0.5;
      } else {
        state.lightRotateTheta -= 0.1;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta < -90) {
        state.lightRotateTheta = -90;
      }
    }
    state.theta1 = p.radians(state.lightRotateTheta);
    state.theta2 = computeRefractionAngle(state.theta1, state.n12);
    state.n12 = state.n2 / state.n1;
  } else {
    state.count = 0;
  }
  p.fill(255);
  p.noStroke();
  p.image(
    state.rotateRemocon,
    p.width - state.rotateRemocon.width,
    p.height - state.rotateRemocon.height
  );
  p.text(
    p.nf(p.abs(state.lightRotateTheta), 1, 1) + "'",
    p.width - state.rotateRemocon.width + (5 * state.rotateRemocon.width) / 12,
    p.height - state.rotateRemocon.height + state.rotateRemocon.height / 4,
    state.rotateRemocon.width / 3,
    state.rotateRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 - state.nRemocon.height + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (5 * state.nRemocon.width) / 12,
    p.height / 2 + state.nRemocon.height / 4,
    state.nRemocon.width / 3,
    state.nRemocon.height / 2
  );
}

function lineMaxBackgroundSetting(p) {
  p.noFill();
  p.strokeWeight(5);
  p.stroke(255);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.theta1 > 0) {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(0, 255, 0);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          (3 * p.PI) / 2,
          state.theta2 + (3 * p.PI) / 2
        );
      }
    } else {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(0, 255, 0);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / 10,
          p.height / 10,
          state.theta2 + (3 * p.PI) / 2,
          (3 * p.PI) / 2
        );
      }
    }
    p.fill(255);
    p.noStroke();
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 - (2 * p.width) / 50,
      p.height / 2 + (4 * p.width) / 50
    );
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 + (2 * p.width) / 50,
      p.height / 2 + (4 * p.width) / 50
    );
    if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
      p.text(
        p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
        p.width / 2 + (2 * p.width) / 50,
        p.height / 2 - (4 * p.width) / 50
      );
    }
  } else {
    if (state.theta1 > 0) {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 - (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 + (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
    } else {
      p.stroke(255, 0, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(0, 255, 255);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / 10,
        p.height / 10,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 - (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 + (2 * p.width) / 50,
        p.height / 2 + (4 * p.width) / 50
      );
    }
  }
  p.stroke(255, 100);
  p.strokeWeight(5);
  p.line(p.width / 2, 0, p.width / 2, p.height);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

function lineMaxRays(p) {
  p.strokeWeight(5);
  p.stroke(255, 0, 0);
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1),
    p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1)
  );
  p.stroke(255, 0, 0);
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 + p.width * p.sin(state.theta1),
    p.height / 2 + p.width * p.cos(state.theta1)
  );
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 + p.width * p.sin(state.theta2),
    p.height / 2 - p.width * p.cos(state.theta2)
  );
}
