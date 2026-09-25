// state.js はシミュレーションの共有可変状態を管理するファイルです。

/** 地層の種類一覧 */
export const STRATA_KINDS = [
  "砂岩層",
  "泥岩層",
  "れき岩層",
  "石灰岩層",
  "凝灰岩層・火山灰層",
  "ローム層",
  "その他の層"
];

/** 地層の種類ごとの表示色 [r, g, b]（「その他の層」は黒） */
export const STRATA_COLORS = {
  砂岩層: [215, 205, 166],
  泥岩層: [156, 154, 143],
  れき岩層: [252, 180, 172],
  石灰岩層: [120, 170, 170],
  "凝灰岩層・火山灰層": [200, 200, 200],
  ローム層: [112, 58, 21],
  その他の層: [0, 0, 0]
};

/**
 * 地点1つ分のデータ。
 * name/data.x/data.y/editは生成直後は空文字、DOM生成後はp5.Elementが入るため
 * anyとしている。layerは[浅い方の深さ, 深い方の深さ, 岩層の種類]の配列。
 */
interface PlaceDataEntry {
  name: any;
  data: { x: any; y: any };
  edit: any;
  layer: any;
}

export const state: {
  /** 日本語フォント（非同期読み込み、失敗時はnullのまま） */
  jaFont: any;
  /**
   * 地点データの連想配列。
   * {
   *   地点N: {
   *     name: 地点名入力欄(p5.Element),
   *     data: { x: x方向入力欄(p5.Element), y: y方向入力欄(p5.Element) },
   *     edit: データ編集リンク(p5.Element),
   *     layer: [[浅い方の深さ, 深い方の深さ, 岩層の種類], ...],
   *   },
   *   ...
   * }
   */
  dataInputArr: Record<string, PlaceDataEntry>;
  /** 地層平面の回転演出用の累積角度 */
  rotateTime: number;
  /**
   * x方向・y方向・深さの表示範囲。
   * 「手動」設定時は直前の値を引き継ぐ仕様のため、draw()のたびに
   * 作り直さずモジュール共有状態として保持する。
   */
  xMin: number | undefined;
  xMax: number | undefined;
  yMin: number | undefined;
  yMax: number | undefined;
  zMin: number | undefined;
  zMax: number | undefined;
  // DOM要素の参照（p5.Elementインスタンス）
  buttonParent: any;
  placeAddButton: any;
  placeRemoveButton: any;
  strataAddButton: any;
  strataRemoveButton: any;
  setRadioButton: any;
  unitSelect: any;
  strataFileInput: any;
} = {
  /** 日本語フォント（非同期読み込み、失敗時はnullのまま） */
  jaFont: null,

  /**
   * 地点データの連想配列。
   * {
   *   地点N: {
   *     name: 地点名入力欄(p5.Element),
   *     data: { x: x方向入力欄(p5.Element), y: y方向入力欄(p5.Element) },
   *     edit: データ編集リンク(p5.Element),
   *     layer: [[浅い方の深さ, 深い方の深さ, 岩層の種類], ...],
   *   },
   *   ...
   * }
   */
  dataInputArr: {},

  /** 地層平面の回転演出用の累積角度 */
  rotateTime: 0,

  /**
   * x方向・y方向・深さの表示範囲。
   * 「手動」設定時は直前の値を引き継ぐ仕様のため、draw()のたびに
   * 作り直さずモジュール共有状態として保持する。
   */
  xMin: undefined,
  xMax: undefined,
  yMin: undefined,
  yMax: undefined,
  zMin: undefined,
  zMax: undefined,

  // DOM要素の参照
  buttonParent: null,
  placeAddButton: null,
  placeRemoveButton: null,
  strataAddButton: null,
  strataRemoveButton: null,
  setRadioButton: null,
  unitSelect: null,
  strataFileInput: null
};
