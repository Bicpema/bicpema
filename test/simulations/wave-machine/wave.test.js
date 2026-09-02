import { describe, it, expect, beforeEach } from "vitest";
import { IncidentWave } from "../../../vite/simulations/wave-machine/js/incident-wave.js";
import { ReflectedWave } from "../../../vite/simulations/wave-machine/js/reflected-wave.js";
import { Medium } from "../../../vite/simulations/wave-machine/js/medium.js";
import {
  state,
  MEDIUM_QUANTITY,
} from "../../../vite/simulations/wave-machine/js/state.js";

const stubP = {
  sin: Math.sin,
  radians: (deg) => (deg * Math.PI) / 180,
  height: 200,
  width: 1000,
  strokeWeight: () => {},
  stroke: () => {},
  line: () => {},
  noStroke: () => {},
  fill: () => {},
  ellipse: () => {},
};

beforeEach(() => {
  state.speed = 1;
  state.fixedIs = true;
});

describe("IncidentWave", () => {
  it("波がまだ到達していない位置ではthetaが0のまま", () => {
    const wave = new IncidentWave(stubP, 0, 0, 0, 5, false);

    wave.calculate();

    expect(wave.theta).toBe(0);
  });

  it("波が到達すると1フレームごとにthetaが減少する（媒質が振動を始める）", () => {
    const wave = new IncidentWave(stubP, 0, 0, 0, 0, false);

    wave.calculate(); // time: 0 -> 1 (number=0 < time=0 は false)
    wave.calculate(); // number=0 < time=1 -> true: theta--

    expect(wave.theta).toBeLessThan(0);
  });

  it("thetaは-30で下げ止まる", () => {
    const wave = new IncidentWave(stubP, 0, 0, 0, 0, false);

    for (let i = 0; i < 200; i++) wave.calculate();

    expect(wave.theta).toBe(-30);
  });

  it("posyは高さとthetaから y = (height/100) * sin(radians(6*theta)) で計算される", () => {
    const wave = new IncidentWave(stubP, 0, 0, 0, 0, false);

    for (let i = 0; i < 10; i++) wave.calculate();

    expect(wave.posy).toBeCloseTo(
      (stubP.height / 100) * Math.sin((6 * wave.theta * Math.PI) / 180),
      10
    );
  });
});

describe("ReflectedWave", () => {
  it("固定端(fixedIs=true)で反射すると位相が反転する（thetaが正方向に増加する）", () => {
    state.fixedIs = true;
    const wave = new ReflectedWave(stubP, 0, 0, 0, 0, true);

    for (let i = 0; i < 110; i++) wave.calculate();

    expect(wave.theta).toBeGreaterThan(0);
  });

  it("自由端(fixedIs=false)で反射すると位相は反転しない（thetaが負方向に増加する）", () => {
    state.fixedIs = false;
    const wave = new ReflectedWave(stubP, 0, 0, 0, 0, true);

    for (let i = 0; i < 110; i++) wave.calculate();

    expect(wave.theta).toBeLessThan(0);
  });

  it("固定端反射のthetaは30で上げ止まる", () => {
    state.fixedIs = true;
    const wave = new ReflectedWave(stubP, 0, 0, 0, 0, true);

    for (let i = 0; i < 300; i++) wave.calculate();

    expect(wave.theta).toBe(30);
  });
});

describe("Medium", () => {
  it("入射波と反射波のうち自分のインデックスに対応する変位の合計が位置になる（波の重ね合わせ）", () => {
    const medium = new Medium(stubP, 0, 0, 0);
    state.incidentWaves = [{ posy: 3 }, { posy: 5 }];
    state.reflectedWaves = [{ posy: 2 }, { posy: 7 }];

    medium.calculate();

    // MEDIUM_QUANTITY=100 のため index%100 は自身のindexそのまま。
    // number=0 の medium には index0 の波のみが対応する。
    expect(medium.posy).toBeCloseTo(3 + 2, 10);
  });

  it("対応する波が存在しなければ変位は0になる", () => {
    const medium = new Medium(stubP, 0, 0, MEDIUM_QUANTITY - 1);
    state.incidentWaves = [{ posy: 3 }];
    state.reflectedWaves = [{ posy: 2 }];

    medium.calculate();

    expect(medium.posy).toBe(0);
  });
});
