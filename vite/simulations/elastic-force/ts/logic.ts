// logic.ts はシミュレーションの描画ロジック専用のファイルです。

import p5 from "p5";
import {
  state,
  V_W,
  WALL_X,
  WALL_W,
  WALL_TOP,
  WALL_BOTTOM,
  GRAPH_LEFT,
  GRAPH_RIGHT,
  GRAPH_TOP,
  GRAPH_BOTTOM,
  GRAPH_X_RANGE
} from "./state.js";
import { HOOKE_LINE_COLOR } from "./constants.js";
import { CoordinateSystem } from "../../../ts/components/coordinate-system.js";
import { drawPlotArea } from "../../../ts/components/plot-area.js";

/**
 * 壁（地面画像を90°回転）を描画する
 * @param p - p5 インスタンス。
 */
function drawWall(p: p5) {
  if (!state.wallImg) return;

  const wallH = WALL_BOTTOM - WALL_TOP;
  const wallW = WALL_W;
  const cx = WALL_X + wallW / 2;
  const cy = WALL_TOP + wallH / 2;

  p.push();
  p.imageMode(p.CENTER);
  p.translate(cx, cy);
  // 地面画像（横向き）を -90° 回転して縦向きの壁にする
  p.rotate(p.HALF_PI);
  // 回転後: 元画像の幅→壁の高さ方向, 元画像の高さ→壁の幅方向
  p.image(state.wallImg, 0, 0, wallH, wallW);
  p.pop();
}

/**
 * 左右の区切り線を描画する
 * @param p - p5 インスタンス。
 */
function drawDivider(p: p5) {
  p.stroke(200);
  p.strokeWeight(1.5);
  p.drawingContext.setLineDash([6, 6]);
  p.line(510, GRAPH_TOP - 30, 510, GRAPH_BOTTOM + 30);
  p.drawingContext.setLineDash([]);
}

/**
 * フック則グラフを描画する
 * @param p - p5 インスタンス。
 */
function drawGraph(p: p5) {
  const spring = state.springs[0];
  if (!spring) return;

  const k = spring.k;
  const gw = GRAPH_RIGHT - GRAPH_LEFT;
  const gh = GRAPH_BOTTOM - GRAPH_TOP;
  const cx = GRAPH_LEFT + gw / 2; // グラフ中心 x（x=0 位置）
  const cy = GRAPH_TOP + gh / 2; // グラフ中心 y（F=0 位置）

  // 固定レンジ: x軸 ±50cm, y軸 ±50N
  const X_RANGE = GRAPH_X_RANGE; // cm
  const Y_RANGE = 50; // N
  const X_STEP = 10; // cm刻み
  const Y_STEP = 10; // N刻み

  const pxPerCm = gw / 2 / X_RANGE;
  const pxPerN = gh / 2 / Y_RANGE;
  const cs = new CoordinateSystem({
    originX: cx,
    originY: cy,
    scaleX: pxPerCm,
    scaleY: pxPerN
  });

  // F = kx のライン（y軸範囲でクリップ）
  // y = ±Y_RANGE になる x 座標: x = ±Y_RANGE/k * 100 cm
  const maxXforY = k > 0 ? (Y_RANGE / k) * 100 : X_RANGE;
  const clipX1cm = Math.max(-X_RANGE, -maxXforY);
  const clipX2cm = Math.min(X_RANGE, maxXforY);

  // 背景・グリッド・F = kx のライン・軸線・目盛り・軸タイトルを共通コンポーネントで描画
  drawPlotArea(p, cs, {
    bounds: {
      left: GRAPH_LEFT,
      top: GRAPH_TOP,
      right: GRAPH_RIGHT,
      bottom: GRAPH_BOTTOM
    },
    gridStepX: X_STEP,
    gridStepY: Y_STEP,
    gridColor: p.color(220),
    series: [
      {
        points: [clipX1cm, clipX2cm].map((xc) => ({
          x: xc,
          y: p.constrain(k * (xc / 100), -Y_RANGE, Y_RANGE)
        })),
        color: p.color(...HOOKE_LINE_COLOR),
        weight: 2.5
      }
    ],
    axisLine: {},
    ticks: { stepX: X_STEP, stepY: Y_STEP },
    labels: {
      xTitle: "バネの伸び x (cm)",
      yTitle: "弾性力 F (N)"
    }
  });

  // タイトル
  p.push();
  p.fill(40);
  p.noStroke();
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(16);
  p.text("フックの法則  F = kx", cx, GRAPH_TOP - 28);
  p.pop();

  // F = kx の式（グラフ内）
  p.fill(...HOOKE_LINE_COLOR);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(13);
  p.text(`k = ${k} N/m`, GRAPH_LEFT + 8, GRAPH_TOP + 8);

  // --- 現在の点 ---
  const dispCm = spring.displacement * 100; // cm
  const fN = spring.k * spring.displacement; // F = kx (符号付き)
  const dotX = cx + dispCm * pxPerCm;
  const dotY = cy - fN * pxPerN;

  // 点が枠内に収まるかチェック
  if (
    dotX >= GRAPH_LEFT &&
    dotX <= GRAPH_RIGHT &&
    dotY >= GRAPH_TOP &&
    dotY <= GRAPH_BOTTOM
  ) {
    p.fill(220, 40, 40);
    p.noStroke();
    p.ellipse(dotX, dotY, 14, 14);

    // 座標ラベル
    p.fill(160, 20, 20);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(13);
    const labelX = dotX + 10 > GRAPH_RIGHT - 70 ? dotX - 80 : dotX + 10;
    const labelY = dotY - 8 < GRAPH_TOP + 20 ? dotY + 22 : dotY - 8;
    p.text(`(${dispCm.toFixed(1)}, ${fN.toFixed(2)})`, labelX, labelY);
  }
}

/**
 * シミュレーション全体を描画する。
 * @param p - p5 インスタンス。
 */
export function drawSimulation(p: p5) {
  p.background(255);
  p.scale(p.width / V_W);

  const vmx = (p.mouseX / p.width) * V_W;
  const vmy = (p.mouseY / p.width) * V_W;

  for (const spring of state.springs) {
    if (spring.isDragging) {
      spring.drag(p, vmx);
    }
  }

  drawWall(p);

  for (const spring of state.springs) {
    spring.display(p);
  }

  drawDivider(p);
  drawGraph(p);

  const anyInteracting =
    state.springs.some((s) => s.isOverHandle(vmx, vmy)) ||
    state.springs.some((s) => s.isDragging);
  p.cursor(anyInteracting ? "grab" : "default");
}
