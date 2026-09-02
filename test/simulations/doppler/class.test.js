import { describe, it, expect, beforeEach } from "vitest";
import { SOUND } from "../../../vite/simulations/doppler/js/class.js";
import { state } from "../../../vite/simulations/doppler/js/state.js";
import { FPS } from "../../../vite/simulations/doppler/js/init.js";

const stubP = { noFill: () => {}, ellipse: () => {} };

beforeEach(() => {
  state.clickedCount = false;
});

describe("SOUND", () => {
  it("初期状態は指定した座標・半径を持つ", () => {
    const sound = new SOUND(100, 5);

    expect(sound.soundx).toBe(100);
    expect(sound.radi).toBe(5);
  });

  it("再生中(clickedCount=true)は音速(340m/s)で半径が広がる", () => {
    const sound = new SOUND(100, 0);
    state.clickedCount = true;

    sound._draw(stubP);

    expect(sound.radi).toBeCloseTo(340 / FPS, 10);
  });

  it("停止中(clickedCount=false)は半径が変化しない", () => {
    const sound = new SOUND(100, 10);
    state.clickedCount = false;

    sound._draw(stubP);

    expect(sound.radi).toBe(10);
  });

  it("複数フレーム再生し続けると半径は音速×経過時間に比例して広がる", () => {
    const sound = new SOUND(100, 0);
    state.clickedCount = true;

    for (let i = 0; i < 10; i++) sound._draw(stubP);

    expect(sound.radi).toBeCloseTo((340 / FPS) * 10, 8);
  });
});
