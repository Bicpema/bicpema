import { TURNS_MIN, TURNS_MAX } from "./constants.js";

/**
 * シミュレーション全体で共有するグローバル状態オブジェクト。
 */
export const state = {
  img1: null, // 変圧器コア画像
  img2: null, // コイル横線画像
  img3: null, // コイル曲がり部画像
  count1: TURNS_MAX, // 一次コイルの巻き線インデックス（表示巻数 = count1 + 1）
  count2: TURNS_MIN, // 二次コイルの巻き線インデックス（表示巻数 = count2 + 1）
  waveK: 5, // 波数（空間周波数）
  omega: 1, // 角速度（速度設定）
  t: 0, // フレームカウント（時間変数）
  phase: true, // true=同位相 / false=逆位相
  topY1: 0, // 一次コイル最上端のY座標（描画ループ内で更新）
  topY2: 0, // 二次コイル最上端のY座標（描画ループ内で更新）
  minCount: TURNS_MIN, // 巻き線インデックスの最小値
  maxCount: TURNS_MAX, // 巻き線インデックスの最大値
  angle: -20, // コイル曲がり部の傾き角（度）
  isRunning: false // シミュレーション実行中かどうか（再生/一時停止ボタンで切り替え）
};
