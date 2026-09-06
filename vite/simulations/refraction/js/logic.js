// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";
import { computeRefractionAngle, computeSnellRatio } from "./physics.js";
import {
  ANGLE_LIMIT_DEG,
  ROTATE_STEP_DEG,
  ROTATE_FAST_STEP_DEG,
  LONG_PRESS_ACTIVATE_FRAMES,
  LONG_PRESS_FAST_FRAMES,
  HIT_RADIUS_DIVISOR,
  REMOCON_HOTSPOT_X_NUMERATOR,
  REMOCON_HOTSPOT_TOP_Y_NUMERATOR,
  REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR,
  REMOCON_HOTSPOT_RATIO_DENOMINATOR,
  REMOCON_LABEL_OFFSET_NUMERATOR,
  REMOCON_LABEL_OFFSET_DENOMINATOR,
  REMOCON_LABEL_WIDTH_DIVISOR,
  REMOCON_LABEL_HEIGHT_DIVISOR,
  REMOCON_LABEL_Y_OFFSET_DIVISOR,
  LIGHT_SOURCE_LENGTH_DIVISOR,
  MODE_TAB_COUNT,
  MODE_TAB_WIDTH_DIVISOR,
  MODE_TAB_HEIGHT_DIVISOR,
  INCIDENT_ANGLE_COLOR,
  COMPLEMENT_ANGLE_COLOR,
  REFRACTED_ANGLE_COLOR,
  RAY_COLOR,
  AXIS_LINE_COLOR,
  ANGLE_ARC_DIAMETER_DIVISOR,
  ANGLE_LABEL_X_OFFSET_NUMERATOR,
  ANGLE_LABEL_Y_OFFSET_NUMERATOR,
  ANGLE_LABEL_OFFSET_DENOMINATOR,
} from "./constants.js";

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
  for (let i = 0; i < MODE_TAB_COUNT; i++) {
    p.fill(100);
    p.stroke(255);
    p.rect(
      p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR,
      0,
      p.width / MODE_TAB_WIDTH_DIVISOR,
      p.height / MODE_TAB_HEIGHT_DIVISOR,
      100
    );
    p.fill(255);
    p.noStroke();
    if (i == 0) {
      p.text(
        "animation",
        p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR,
        0,
        p.width / MODE_TAB_WIDTH_DIVISOR,
        p.height / MODE_TAB_HEIGHT_DIVISOR
      );
    }
    if (i == 1) {
      p.text(
        "animationMax",
        p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR,
        0,
        p.width / MODE_TAB_WIDTH_DIVISOR,
        p.height / MODE_TAB_HEIGHT_DIVISOR
      );
    }
    if (i == 2) {
      p.text(
        "line",
        p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR,
        0,
        p.width / MODE_TAB_WIDTH_DIVISOR,
        p.height / MODE_TAB_HEIGHT_DIVISOR
      );
    }
    if (i == 3) {
      p.text(
        "lineMax",
        p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR,
        0,
        p.width / MODE_TAB_WIDTH_DIVISOR,
        p.height / MODE_TAB_HEIGHT_DIVISOR
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
    p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR,
    p.width / 24,
    p.height / LIGHT_SOURCE_LENGTH_DIVISOR
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
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta < ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta += ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta += ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta > ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = ANGLE_LIMIT_DEG;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta > -ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta -= ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta -= ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta < -ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = -ANGLE_LIMIT_DEG;
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
    p.width -
      state.rotateRemocon.width +
      (REMOCON_LABEL_OFFSET_NUMERATOR * state.rotateRemocon.width) /
        REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height -
      state.rotateRemocon.height +
      state.rotateRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.rotateRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.rotateRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 -
      state.nRemocon.height +
      state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 + state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
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
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 +
              (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR,
            p.height / 2 -
              (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(...REFRACTED_ANGLE_COLOR);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            (3 * p.PI) / 2,
            state.theta2 + (3 * p.PI) / 2
          );
        }
      }
      if (state.theta1 < 0 && state.raysX <= p.width / 2) {
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 +
              (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR,
            p.height / 2 -
              (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(...REFRACTED_ANGLE_COLOR);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            state.theta2 + (3 * p.PI) / 2,
            (3 * p.PI) / 2
          );
        }
      }
    }
  } else {
    if (state.theta1 >= 0) {
      if (state.raysX >= p.width / 2) {
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
      }
    } else {
      if (state.raysX <= p.width / 2) {
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
      }
    }
  }
  p.stroke(...AXIS_LINE_COLOR);
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
  state.pg.fill(...RAY_COLOR);
  if (state.raysY < p.height / 2) {
    state.pg.fill(...RAY_COLOR, 255 * (1 - strength));
  }
  state.pg.ellipse(state.raysX, state.raysY, 5, 5);
  if (-1 < state.boundary && state.boundary < 1 && state.raysY < p.height / 2) {
    state.pg.fill(...RAY_COLOR, 255 * strength);
    state.pg.ellipse(state.raysX2, state.raysY2, 5, 5);
  }
  if (p.mouseIsPressed) {
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR
    ) {
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    if (
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 -
          state.nRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 -
          state.nRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR
    ) {
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    for (let i = 0; i < MODE_TAB_COUNT; i++) {
      if (
        p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR <
          p.mouseX &&
        p.mouseX <
          p.width -
            ((MODE_TAB_COUNT - i - 1) * p.width) / MODE_TAB_WIDTH_DIVISOR &&
        0 < p.mouseY &&
        p.mouseY < p.height / MODE_TAB_HEIGHT_DIVISOR
      ) {
        state.raysX =
          p.width / 2 -
          (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
            p.sin(state.theta1);
        state.raysY =
          p.height / 2 +
          (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
            p.cos(state.theta1);
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
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta < ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta += ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta += ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta > ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = ANGLE_LIMIT_DEG;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta > -ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta -= ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta -= ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta < -ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = -ANGLE_LIMIT_DEG;
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
    p.width -
      state.rotateRemocon.width +
      (REMOCON_LABEL_OFFSET_NUMERATOR * state.rotateRemocon.width) /
        REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height -
      state.rotateRemocon.height +
      state.rotateRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.rotateRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.rotateRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 -
      state.nRemocon.height +
      state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 + state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
}

function lineBackgroundSetting(p) {
  p.noFill();
  p.strokeWeight(5);
  p.stroke(255);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.theta1 > 0) {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(...REFRACTED_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          (3 * p.PI) / 2,
          state.theta2 + (3 * p.PI) / 2
        );
      }
    } else {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(...REFRACTED_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          state.theta2 + (3 * p.PI) / 2,
          (3 * p.PI) / 2
        );
      }
    }
    p.fill(255);
    p.noStroke();
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 -
        (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR,
      p.height / 2 +
        (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR
    );
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 +
        (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR,
      p.height / 2 +
        (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR
    );
    if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
      p.text(
        p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
        p.width / 2 +
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 -
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
    }
  } else {
    if (state.theta1 > 0) {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 -
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 +
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
    } else {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 -
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 +
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
    }
  }
  p.stroke(...AXIS_LINE_COLOR);
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
  p.stroke(...RAY_COLOR);
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1),
    p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1)
  );
  if (-1 < state.boundary && state.boundary < 1) {
    p.stroke(...RAY_COLOR, 255 * strength);
  } else {
    p.stroke(...RAY_COLOR);
  }
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 + p.width * p.sin(state.theta1),
    p.height / 2 + p.width * p.cos(state.theta1)
  );
  p.stroke(...RAY_COLOR, 255 * (1 - strength));
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
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta < ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta += ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta += ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta > ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = ANGLE_LIMIT_DEG;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta > -ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta -= ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta -= ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      if (state.lightRotateTheta < -ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = -ANGLE_LIMIT_DEG;
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
    p.width -
      state.rotateRemocon.width +
      (REMOCON_LABEL_OFFSET_NUMERATOR * state.rotateRemocon.width) /
        REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height -
      state.rotateRemocon.height +
      state.rotateRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.rotateRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.rotateRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 -
      state.nRemocon.height +
      state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 + state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
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
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 +
              (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR,
            p.height / 2 -
              (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(...REFRACTED_ANGLE_COLOR);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            (3 * p.PI) / 2,
            state.theta2 + (3 * p.PI) / 2
          );
        }
      }
      if (state.theta1 < 0 && state.raysX <= p.width / 2) {
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.text(
            p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
            p.width / 2 +
              (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR,
            p.height / 2 -
              (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
                ANGLE_LABEL_OFFSET_DENOMINATOR
          );
        }
        if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
          p.stroke(...REFRACTED_ANGLE_COLOR);
          p.noFill();
          p.arc(
            p.width / 2,
            p.height / 2,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            p.height / ANGLE_ARC_DIAMETER_DIVISOR,
            state.theta2 + (3 * p.PI) / 2,
            (3 * p.PI) / 2
          );
        }
      }
    }
  } else {
    if (state.theta1 >= 0) {
      if (state.raysX >= p.width / 2) {
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          state.theta1 + p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          -state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
      }
    } else {
      if (state.raysX <= p.width / 2) {
        p.stroke(...INCIDENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          state.theta1 + p.PI / 2,
          p.PI / 2
        );
        p.stroke(...COMPLEMENT_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.PI / 2,
          -state.theta1 + p.PI / 2
        );
        p.fill(255);
        p.noStroke();
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 -
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
        p.text(
          p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
          p.width / 2 +
            (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR,
          p.height / 2 +
            (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
              ANGLE_LABEL_OFFSET_DENOMINATOR
        );
      }
    }
  }
  p.stroke(...AXIS_LINE_COLOR);
  p.strokeWeight(5);
  p.line(p.width / 2, 0, p.width / 2, p.height);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

function animationMaxRays(p) {
  // beginDraw() and endDraw() is not supported in p5.js, and or often not needed;
  state.pg.noStroke();
  state.pg.fill(...RAY_COLOR);
  state.pg.ellipse(state.raysX, state.raysY, 5, 5);
  if (-1 < state.boundary && state.boundary < 1 && state.raysY < p.height / 2) {
    state.pg.ellipse(state.raysX2, state.raysY2, 5, 5);
  }
  if (p.mouseIsPressed) {
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR
    ) {
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    if (
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 -
          state.nRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR ||
      p.dist(
        (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height / 2 -
          state.nRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.nRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.nRemocon.width / HIT_RADIUS_DIVISOR
    ) {
      state.raysX =
        p.width / 2 -
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.sin(state.theta1);
      state.raysY =
        p.height / 2 +
        (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
          p.cos(state.theta1);
      state.raysX2 = p.width / 2;
      state.raysY2 = p.height / 2;
      state.pg.background(0);
    }
    for (let i = 0; i < MODE_TAB_COUNT; i++) {
      if (
        p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR <
          p.mouseX &&
        p.mouseX <
          p.width -
            ((MODE_TAB_COUNT - i - 1) * p.width) / MODE_TAB_WIDTH_DIVISOR &&
        0 < p.mouseY &&
        p.mouseY < p.height / MODE_TAB_HEIGHT_DIVISOR
      ) {
        state.raysX =
          p.width / 2 -
          (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
            p.sin(state.theta1);
        state.raysY =
          p.height / 2 +
          (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
            p.cos(state.theta1);
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
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta < ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta += ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta += ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta > ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = ANGLE_LIMIT_DEG;
      }
    }
    if (
      p.dist(
        p.width -
          state.rotateRemocon.width +
          (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.height -
          state.rotateRemocon.height +
          (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.rotateRemocon.height) /
            REMOCON_HOTSPOT_RATIO_DENOMINATOR,
        p.mouseX,
        p.mouseY
      ) <
        state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
      state.lightRotateTheta > -ANGLE_LIMIT_DEG &&
      state.count > LONG_PRESS_ACTIVATE_FRAMES
    ) {
      if (state.count > LONG_PRESS_FAST_FRAMES) {
        state.lightRotateTheta -= ROTATE_FAST_STEP_DEG;
      } else {
        state.lightRotateTheta -= ROTATE_STEP_DEG;
      }
      state.theta1 = p.radians(state.lightRotateTheta);
      state.theta2 = computeRefractionAngle(state.theta1, state.n12);
      state.n12 = state.n2 / state.n1;
      if (state.lightRotateTheta < -ANGLE_LIMIT_DEG) {
        state.lightRotateTheta = -ANGLE_LIMIT_DEG;
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
    p.width -
      state.rotateRemocon.width +
      (REMOCON_LABEL_OFFSET_NUMERATOR * state.rotateRemocon.width) /
        REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height -
      state.rotateRemocon.height +
      state.rotateRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.rotateRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.rotateRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2 - state.nRemocon.height);
  p.text(
    p.nf(state.n2, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 -
      state.nRemocon.height +
      state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
  p.image(state.nRemocon, 0, p.height / 2);
  p.text(
    p.nf(state.n1, 1, 1) + "'",
    (REMOCON_LABEL_OFFSET_NUMERATOR * state.nRemocon.width) /
      REMOCON_LABEL_OFFSET_DENOMINATOR,
    p.height / 2 + state.nRemocon.height / REMOCON_LABEL_Y_OFFSET_DIVISOR,
    state.nRemocon.width / REMOCON_LABEL_WIDTH_DIVISOR,
    state.nRemocon.height / REMOCON_LABEL_HEIGHT_DIVISOR
  );
}

function lineMaxBackgroundSetting(p) {
  p.noFill();
  p.strokeWeight(5);
  p.stroke(255);
  if (-1 < state.boundary && state.boundary < 1) {
    if (state.theta1 > 0) {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(...REFRACTED_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          (3 * p.PI) / 2,
          state.theta2 + (3 * p.PI) / 2
        );
      }
    } else {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
        p.stroke(...REFRACTED_ANGLE_COLOR);
        p.arc(
          p.width / 2,
          p.height / 2,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          p.height / ANGLE_ARC_DIAMETER_DIVISOR,
          state.theta2 + (3 * p.PI) / 2,
          (3 * p.PI) / 2
        );
      }
    }
    p.fill(255);
    p.noStroke();
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 -
        (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR,
      p.height / 2 +
        (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR
    );
    p.text(
      p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
      p.width / 2 +
        (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR,
      p.height / 2 +
        (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
          ANGLE_LABEL_OFFSET_DENOMINATOR
    );
    if (state.theta1 != p.PI / 2 && state.theta1 != -p.PI / 2) {
      p.text(
        p.nf(p.abs(p.degrees(state.theta2)), 1, 1) + "'",
        p.width / 2 +
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 -
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
    }
  } else {
    if (state.theta1 > 0) {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        state.theta1 + p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        -state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 -
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 +
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
    } else {
      p.stroke(...INCIDENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        state.theta1 + p.PI / 2,
        p.PI / 2
      );
      p.stroke(...COMPLEMENT_ANGLE_COLOR);
      p.arc(
        p.width / 2,
        p.height / 2,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.height / ANGLE_ARC_DIAMETER_DIVISOR,
        p.PI / 2,
        -state.theta1 + p.PI / 2
      );
      p.fill(255);
      p.noStroke();
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 -
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
      p.text(
        p.nf(p.abs(p.degrees(state.theta1)), 1, 1) + "'",
        p.width / 2 +
          (ANGLE_LABEL_X_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR,
        p.height / 2 +
          (ANGLE_LABEL_Y_OFFSET_NUMERATOR * p.width) /
            ANGLE_LABEL_OFFSET_DENOMINATOR
      );
    }
  }
  p.stroke(...AXIS_LINE_COLOR);
  p.strokeWeight(5);
  p.line(p.width / 2, 0, p.width / 2, p.height);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

function lineMaxRays(p) {
  p.strokeWeight(5);
  p.stroke(...RAY_COLOR);
  p.line(
    p.width / 2,
    p.height / 2,
    p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1),
    p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1)
  );
  p.stroke(...RAY_COLOR);
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
