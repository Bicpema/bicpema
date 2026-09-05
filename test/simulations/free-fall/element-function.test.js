import { describe, it, expect, beforeEach } from "vitest";
import {
  onHeightChange,
  onReset,
  onPlayPause,
} from "../../../vite/simulations/free-fall/js/element-function.js";
import { Ball } from "../../../vite/simulations/free-fall/js/ball.js";
import { state } from "../../../vite/simulations/free-fall/js/state.js";

/**
 * p5.Element の value()/html() を模した最小限のモック
 * @param {number|string} initial
 */
function createMockElement(initial) {
  let value = initial;
  return {
    value: (newValue) => {
      if (newValue === undefined) return value;
      value = newValue;
      return undefined;
    },
    html: (text) => {
      value = text;
      return undefined;
    },
    text: () => value,
  };
}

beforeEach(() => {
  state.vtData = [];
  state.ytData = [];
  state.ball = new Ball(50);
  state.heightInput = createMockElement(50);
  state.dragCoefficientInput = createMockElement(0);
  state.playPauseButton = createMockElement("");
});

describe("onHeightChange", () => {
  it("下限(10)未満の入力は10にクランプする", () => {
    state.heightInput.value(5);

    onHeightChange();

    expect(state.heightInput.value()).toBe(10);
    expect(state.ball.height).toBe(10);
  });

  it("上限(100)を超える入力は100にクランプする", () => {
    state.heightInput.value(150);

    onHeightChange();

    expect(state.heightInput.value()).toBe(100);
    expect(state.ball.height).toBe(100);
  });

  it("範囲内の入力はそのままボールの高さに反映する", () => {
    state.heightInput.value(42);

    onHeightChange();

    expect(state.heightInput.value()).toBe(42);
    expect(state.ball.height).toBe(42);
  });

  it("数値でない入力は10にクランプする", () => {
    state.heightInput.value(NaN);

    onHeightChange();

    expect(state.heightInput.value()).toBe(10);
  });

  it("運動中は高さを変更してもリセットしない", () => {
    state.ball.start();
    state.ball.update(1);
    const heightBeforeChange = state.ball.height;
    state.heightInput.value(80);

    onHeightChange();

    expect(state.ball.height).toBe(heightBeforeChange);
  });
});

describe("onReset", () => {
  it("入力欄の値でボールをリセットする", () => {
    state.ball.start();
    state.ball.update(1);
    state.heightInput.value(30);
    state.dragCoefficientInput.value(0.5);

    onReset();

    expect(state.ball.initialHeight).toBe(30);
    expect(state.ball.height).toBe(30);
    expect(state.ball.dragCoefficient).toBe(0.5);
    expect(state.ball.isMoving).toBe(false);
  });

  it("開始/一時停止ボタンの表示を「▶ 開始」に戻す", () => {
    onReset();

    expect(state.playPauseButton.text()).toBe("▶ 開始");
  });

  it("数値でない高さ・空気抵抗係数の入力は範囲内にクランプする", () => {
    state.heightInput.value(NaN);
    state.dragCoefficientInput.value(NaN);

    onReset();

    expect(state.ball.initialHeight).toBe(10);
    expect(state.ball.dragCoefficient).toBe(0);
    expect(state.heightInput.value()).toBe(10);
    expect(state.dragCoefficientInput.value()).toBe(0);
  });

  it("範囲外の空気抵抗係数の入力は上限にクランプする", () => {
    state.dragCoefficientInput.value(5);

    onReset();

    expect(state.ball.dragCoefficient).toBe(2);
    expect(state.dragCoefficientInput.value()).toBe(2);
  });
});

describe("onPlayPause", () => {
  it("停止中に呼ぶと運動を開始し、ボタン表示を「一時停止」にする", () => {
    onPlayPause();

    expect(state.ball.isMoving).toBe(true);
    expect(state.playPauseButton.text()).toBe("一時停止");
  });

  it("運動中に呼ぶと運動を停止し、ボタン表示を「再開」にする", () => {
    state.ball.start();

    onPlayPause();

    expect(state.ball.isMoving).toBe(false);
    expect(state.playPauseButton.text()).toBe("再開");
  });

  it("地面に到達している（高さ1以下）ときは開始しない", () => {
    state.ball.height = 1;

    onPlayPause();

    expect(state.ball.isMoving).toBe(false);
  });
});
