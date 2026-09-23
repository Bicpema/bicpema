// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/**
 * WEBGLで毎フレーム900本(RAYS_PER_COLOR × RGB3色)のRayを描画するため、
 * 60fpsでは負荷が高くなりやすく30fpsに抑えている。
 */
export const FPS = 30;

/** 入射光の表示色（CSS背景色文字列、setup()と枚数変更時で共通利用） */
export const INCIDENT_LIGHT_CSS_COLOR = "rgb(144,181,130)";

/** 描画する光線の本数（RGB各色ごと） */
export const RAYS_PER_COLOR = 300;
/** 光線のZ座標の初期分布の起点 */
export const RAY_Z_START = 150;
/** 光線のZ座標の初期分布の範囲（RAY_Z_STARTに加算する幅の合計） */
export const RAY_Z_RANGE = 300;
/** 光線が往復するZ座標の上限・下限の絶対値（これを超えると反対側へリセットする） */
export const RAY_Z_LIMIT = 150;

/** 偏光板のZ座標の絶対値（開始側は+、終了側は-） */
export const POLARIZER_Z = 100;
/** 偏光板のサイズ（一辺の長さ） */
export const POLARIZER_SIZE = 125;

/** 赤色光の1フレーム当たりの回転角速度（度）。緑・青色光の角速度算出の基準値 */
export const ANGULAR_VELOCITY_R = (2 * 180) / 25;

/** 波長600 nm(赤)のセロハン1枚あたりの光路差 (nm) */
export const OPD_PER_SHEET_R = 212.596704;
/** 波長550 nm(緑)のセロハン1枚あたりの光路差 (nm) */
export const OPD_PER_SHEET_G = 213.5303046;
/** 波長450 nm(青)のセロハン1枚あたりの光路差 (nm) */
export const OPD_PER_SHEET_B = 215.5841246;

/** 赤色光の波長 (nm) */
export const WAVELENGTH_R = 600;
/** 緑色光の波長 (nm) */
export const WAVELENGTH_G = 550;
/** 青色光の波長 (nm) */
export const WAVELENGTH_B = 450;

/**
 * 色ごとの1フレーム当たりの回転角速度（度）を求める。
 * 光速一定のもとでは角速度（振動数相当）は波長に反比例するため、
 * 画面上に描画される波の空間的な波長がWAVELENGTH_R/G/Bの比と一致するよう、
 * 赤色光の角速度(ANGULAR_VELOCITY_R)を基準に波長比から算出する。
 * @param {number} wavelength 対象の光の波長 (nm)
 * @returns {number} その光の1フレーム当たりの回転角速度（度）
 */
export function computeAngularVelocity(wavelength) {
  return (ANGULAR_VELOCITY_R * WAVELENGTH_R) / wavelength;
}

/** 波を表現する際の振幅（sin波によるオフセット距離） */
export const WAVE_AMPLITUDE = 25;
/** 波を球で表現する際の球の半径 */
export const WAVE_POINT_RADIUS = 1.5;

/** 光の強さが強い（表示ON）ときの不透明度 */
export const FULL_OPACITY = 255;
/** 光の強さが弱い（表示OFFに近い）ときの不透明度 */
export const DIM_OPACITY = 50;
/** 波を線で表現する際の、表示OFFに近いときの線の太さ */
export const DIM_STROKE_WEIGHT = 0.1;

/**
 * 赤色光の表示色
 * @type {readonly [number, number, number]}
 */
export const RED_COLOR = [255, 0, 0];
/**
 * 緑色光の表示色
 * @type {readonly [number, number, number]}
 */
export const GREEN_COLOR = [0, 255, 0];
/**
 * 青色光の表示色
 * @type {readonly [number, number, number]}
 */
export const BLUE_COLOR = [0, 0, 255];

// ボタンの色をJS側で動的に切り替えるため、Bootstrapのbtn-*相当の
// スタイルをTailwindユーティリティクラスの文字列として定義しておく。
// addClass/removeClassは常にこの定数を使うことで、確実に対応する
// クラスの追加・削除ができるようにする。
export const BTN_PRIMARY =
  "rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-500";
export const BTN_DANGER =
  "rounded bg-red-600 px-3 py-2 text-white hover:bg-red-500";
export const BTN_SECONDARY =
  "rounded bg-neutral-600 px-3 py-2 text-white hover:bg-neutral-500";
export const BTN_SUCCESS =
  "rounded bg-green-600 px-3 py-2 text-white hover:bg-green-500";

/**
 * ボタンの見た目（色）を切り替える。
 * DOMTokenList.add/removeは空白混じりのトークンを渡すと例外を投げるため、
 * BTN_*定数（スペース区切りの複数クラス文字列）をそのままp5.Elementの
 * addClass/removeClassへ渡すことはできない。個々のクラス名に分割してから
 * classListを操作することで、レイアウト用に付与している他のクラス
 * （flex-1等）を保持したまま安全に入れ替える。
 * @param {*} element p.select()で取得したp5.Element
 * @param {string} fromClassNames 取り除くBTN_*定数
 * @param {string} toClassNames 付け加えるBTN_*定数
 */
export function swapButtonClass(element, fromClassNames, toClassNames) {
  element.elt.classList.remove(...fromClassNames.split(" "));
  element.elt.classList.add(...toClassNames.split(" "));
}
