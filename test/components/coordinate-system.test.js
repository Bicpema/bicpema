import { describe, it, expect } from "vitest";
import { CoordinateSystem } from "../../vite/ts/components/coordinate-system.js";

describe("CoordinateSystem", () => {
  it("既定では恒等変換にY軸反転のみが入る", () => {
    const cs = new CoordinateSystem();
    expect(cs.toPx(3, 4)).toEqual({ x: 3, y: -4 });
  });

  it("原点・スケール・Y軸反転を適用してピクセルへ変換する", () => {
    const cs = new CoordinateSystem({ originX: 100, originY: 200, scaleX: 10 });
    expect(cs.toPx(2, 3)).toEqual({ x: 120, y: 170 });
    expect(cs.toPx(0, 0)).toEqual({ x: 100, y: 200 });
  });

  it("scaleYを個別に指定できる", () => {
    const cs = new CoordinateSystem({ scaleX: 10, scaleY: 2 });
    expect(cs.toPx(1, 1)).toEqual({ x: 10, y: -2 });
  });

  it("flipY: false では画面座標のまま下向きが正", () => {
    const cs = new CoordinateSystem({ originY: 50, scaleX: 5, flipY: false });
    expect(cs.toPxY(2)).toBe(60);
    expect(cs.toPhysY(60)).toBe(2);
  });

  it("ピクセルから物理座標へ逆変換すると元に戻る", () => {
    const cs = new CoordinateSystem({
      originX: 30,
      originY: 80,
      scaleX: 4,
      scaleY: 8
    });
    const px = cs.toPx(1.5, -2.25);
    const back = cs.toPhys(px.x, px.y);
    expect(back.x).toBeCloseTo(1.5);
    expect(back.y).toBeCloseTo(-2.25);
  });

  it("長さの変換は符号を持たない", () => {
    const cs = new CoordinateSystem({ scaleX: 10, scaleY: 3 });
    expect(cs.lengthToPxX(-2)).toBe(20);
    expect(cs.lengthToPxY(-2)).toBe(6);
  });

  it("scaleが0なら例外を投げる", () => {
    expect(() => new CoordinateSystem({ scaleX: 0 })).toThrow(RangeError);
    expect(() => new CoordinateSystem({ scaleX: 1, scaleY: 0 })).toThrow(
      RangeError
    );
  });

  it("withScaleは原点とY反転を保ってスケールだけを変える", () => {
    const cs = new CoordinateSystem({ originX: 10, originY: 20, scaleX: 2 });
    const next = cs.withScale(5);
    expect(next.originX).toBe(10);
    expect(next.originY).toBe(20);
    expect(next.scaleY).toBe(5);
    expect(next.flipY).toBe(true);
  });

  describe("gridValuesX / gridValuesY", () => {
    it("原点を含み、原点から外側へstep刻みの値を昇順で返す", () => {
      const cs = new CoordinateSystem({ originX: 50, scaleX: 10 });
      // px 0..100 は物理座標 -5..5
      expect(cs.gridValuesX(0, 100, 2)).toEqual([-4, -2, 0, 2, 4]);
    });

    it("範囲の端ちょうどの値も含む", () => {
      const cs = new CoordinateSystem({ originX: 50, scaleX: 10 });
      expect(cs.gridValuesX(0, 100, 5)).toEqual([-5, 0, 5]);
    });

    it("Y軸反転でも物理座標の昇順で返す", () => {
      const cs = new CoordinateSystem({ originY: 50, scaleX: 10 });
      expect(cs.gridValuesY(0, 100, 2)).toEqual([-4, -2, 0, 2, 4]);
    });

    it("グリッド値をtoPxへ渡すと原点基準のピクセル位置になる", () => {
      const cs = new CoordinateSystem({ originX: 50, scaleX: 10 });
      const xs = cs.gridValuesX(0, 100, 2.5).map((v) => cs.toPxX(v));
      expect(xs).toEqual([0, 25, 50, 75, 100]);
    });

    it("minとmaxが逆でも同じ結果を返す", () => {
      const cs = new CoordinateSystem({ originX: 50, scaleX: 10 });
      expect(cs.gridValuesX(100, 0, 5)).toEqual(cs.gridValuesX(0, 100, 5));
    });

    it("stepが正でなければ例外を投げる", () => {
      const cs = new CoordinateSystem();
      expect(() => cs.gridValuesX(0, 10, 0)).toThrow(RangeError);
      expect(() => cs.gridValuesY(0, 10, -1)).toThrow(RangeError);
    });
  });
});
