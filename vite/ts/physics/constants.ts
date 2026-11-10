/**
 * 物理定数の共通定義。
 * 特に断りのない限りSI単位。教材上の都合でSI以外を使うものは名前と JSDoc に単位を明記する。
 */

/** 重力加速度 (m/s²) */
export const GRAVITY_ACCELERATION = 9.8;
/** 空気中（約15℃）の音速 (m/s)。教材では340 m/sを用いる */
export const SOUND_SPEED_IN_AIR = 340;
/** 真空中の光速 (m/s) */
export const SPEED_OF_LIGHT = 2.998e8;
/** 真空の透磁率 (N/A²) */
export const VACUUM_PERMEABILITY = 4 * Math.PI * 1e-7;
/** 気体定数 (J/(mol·K)) */
export const GAS_CONSTANT = 8.31;
/** ボルツマン定数 (J/K) */
export const BOLTZMANN_CONSTANT = 1.38e-23;
/** アボガドロ定数 (1/mol) */
export const AVOGADRO_CONSTANT = 6.02e23;

/** 水の密度 (g/cm³)。単位がg/cm³である点に注意（SIのkg/m³ではない） */
export const WATER_DENSITY_G_PER_CM3 = 1.0;

/** 水の比熱 (J/(g·K)) */
export const SPECIFIC_HEAT_WATER = 4.2;
/** アルミニウムの比熱 (J/(g·K)) */
export const SPECIFIC_HEAT_ALUMINUM = 0.901;
/** 鉄の比熱 (J/(g·K)) */
export const SPECIFIC_HEAT_IRON = 0.448;
/** 銅の比熱 (J/(g·K)) */
export const SPECIFIC_HEAT_COPPER = 0.386;
/** 銀の比熱 (J/(g·K)) */
export const SPECIFIC_HEAT_SILVER = 0.236;
