/**
 * 力ベクトルを水平・垂直成分に分解する（力の分解）。
 * 角度は物理座標系（x軸正方向を0度、反時計回りが正）で表す。
 * 戻り値のy成分は画面座標系（下向きが正）に変換して返す。
 *
 * @param {number} magnitude 力の大きさ
 * @param {number} angleDeg 角度 (度)
 * @returns {{x: number, y: number}} 水平成分・垂直成分（yは画面座標系）
 */
export function decomposeForce(magnitude, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  return {
    x: magnitude * Math.cos(theta),
    y: -magnitude * Math.sin(theta),
  };
}
