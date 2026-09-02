import { describe, it, expect } from "vitest";
import {
  computePistonY,
  advanceStage,
} from "../../../vite/simulations/heat-engine/js/physics.js";

describe("computePistonY", () => {
  it("stage0の開始時(t=0)はピストンが160の位置にある", () => {
    expect(computePistonY(0, 0, 160)).toBeCloseTo(160, 10);
  });

  it("stage0の終了時(t=duration)はピストンが130まで上昇する（おもりを持ち上げる）", () => {
    expect(computePistonY(0, 160, 160)).toBeCloseTo(130, 10);
  });

  it("stage1ではピストンが130から80までさらに上昇する（おもりを取り除く）", () => {
    expect(computePistonY(1, 0, 160)).toBeCloseTo(130, 10);
    expect(computePistonY(1, 160, 160)).toBeCloseTo(80, 10);
  });

  it("stage2ではピストンが80から130まで下降する（放熱）", () => {
    expect(computePistonY(2, 0, 160)).toBeCloseTo(80, 10);
    expect(computePistonY(2, 160, 160)).toBeCloseTo(130, 10);
  });

  it("stage3ではピストンが130から160まで下降し元の状態に戻る", () => {
    expect(computePistonY(3, 0, 160)).toBeCloseTo(130, 10);
    expect(computePistonY(3, 160, 160)).toBeCloseTo(160, 10);
  });

  it("各段階の途中(t=duration/2)では中間位置になる", () => {
    expect(computePistonY(0, 80, 160)).toBeCloseTo((160 + 130) / 2, 10);
  });
});

describe("advanceStage", () => {
  it("段階は0→1→2→3→0の順に循環する", () => {
    expect(advanceStage(0)).toBe(1);
    expect(advanceStage(1)).toBe(2);
    expect(advanceStage(2)).toBe(3);
    expect(advanceStage(3)).toBe(0);
  });
});
