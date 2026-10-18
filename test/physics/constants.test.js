import { describe, it, expect } from "vitest";
import * as c from "../../vite/ts/physics/constants.js";

describe("物理定数", () => {
  it("教材で用いる値と一致する", () => {
    expect(c.GRAVITY_ACCELERATION).toBe(9.8);
    expect(c.SOUND_SPEED_IN_AIR).toBe(340);
    expect(c.WATER_DENSITY_G_PER_CM3).toBe(1.0);
    expect(c.SPECIFIC_HEAT_WATER).toBe(4.2);
    expect(c.SPECIFIC_HEAT_ALUMINUM).toBe(0.901);
    expect(c.SPECIFIC_HEAT_IRON).toBe(0.448);
    expect(c.SPECIFIC_HEAT_COPPER).toBe(0.386);
    expect(c.SPECIFIC_HEAT_SILVER).toBe(0.236);
  });

  it("SI単位の定数が想定の桁である", () => {
    expect(c.SPEED_OF_LIGHT).toBeCloseTo(3.0e8, -7);
    expect(c.VACUUM_PERMEABILITY).toBeCloseTo(1.2566e-6, 10);
    expect(c.GAS_CONSTANT).toBeCloseTo(8.31, 2);
    expect(c.BOLTZMANN_CONSTANT).toBeCloseTo(1.38e-23, 25);
    expect(c.AVOGADRO_CONSTANT).toBeCloseTo(6.02e23, -21);
    expect(c.GAS_CONSTANT).toBeCloseTo(
      c.BOLTZMANN_CONSTANT * c.AVOGADRO_CONSTANT,
      1
    );
  });
});
