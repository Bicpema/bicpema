import type p5 from "p5";

/** WEBGLテキストの水平方向の揃え */
export type WebglTextAlign = "left" | "center" | "right";

/** WEBGLテキストの垂直方向の基準 */
export type WebglTextBaseline = "alphabetic" | "middle" | "top";

/** drawWebglText のオプション */
export interface WebglTextOptions {
  /** 文字サイズ（px） */
  size: number;
  /** 文字色（`p.fill()` に渡す引数。例: `[0]`、`[240, 205, 50]`） */
  color?: number[];
  /** 水平方向の揃え（既定: center） */
  align?: WebglTextAlign;
  /** 垂直方向の基準（既定: alphabetic） */
  baseline?: WebglTextBaseline;
  /**
   * 毎フレーム文字列が変わる表示（数値など）に指定する識別子。
   * 同じ識別子のテクスチャを再利用し、文字列が変わったときだけ再描画する。
   */
  slot?: string;
}

/** キャッシュするテクスチャ数の上限（超過時は全て破棄する） */
const MAX_CACHE_SIZE = 200;

/** テクスチャ解像度の倍率（拡大時もぼやけにくくする） */
const TEXTURE_SCALE = 2;

interface CachedText {
  graphics: p5.Graphics;
  /** 現在描画している文字列 */
  text: string;
  /** テクスチャの表示サイズ（px） */
  width: number;
  height: number;
  /** 上端からベースラインまでの距離（px） */
  ascent: number;
}

const cache = new Map<string, CachedText>();

/** 文字列の寸法を測るための共用グラフィックス（最初の利用時に生成する） */
let probe: p5.Graphics | null = null;

/**
 * 文字列を2Dのp5.Graphicsに描画してテクスチャ情報を更新する。
 * @param p - p5インスタンス
 * @param entry - 更新するキャッシュ（nullなら新規作成）
 * @param text - 描画する文字列
 * @param size - 文字サイズ（px）
 * @param color - 文字色
 */
function renderText(
  p: p5,
  entry: CachedText | null,
  text: string,
  size: number,
  color: number[]
): CachedText {
  probe ??= p.createGraphics(1, 1);
  probe.textSize(size);
  const width = Math.ceil(probe.textWidth(text)) + 4;
  const ascent = Math.ceil(probe.textAscent()) + 2;
  const height = ascent + Math.ceil(probe.textDescent()) + 2;

  let graphics = entry?.graphics;
  if (!graphics) {
    graphics = p.createGraphics(width, height);
    graphics.pixelDensity(TEXTURE_SCALE);
  } else if (graphics.width !== width || graphics.height !== height) {
    graphics.resizeCanvas(width, height);
  }
  graphics.clear();
  graphics.noStroke();
  graphics.fill(...(color as [number]));
  graphics.textSize(size);
  graphics.textAlign(p.LEFT, p.BASELINE);
  graphics.text(text, 2, ascent);
  return { graphics, text, width, height, ascent };
}

/**
 * 文字列に対応するテクスチャをキャッシュから取得する（なければ生成する）。
 * @param p - p5インスタンス
 * @param text - 描画する文字列
 * @param options - 文字サイズ・色・スロット
 */
function getTextTexture(
  p: p5,
  text: string,
  options: { size: number; color: number[]; slot?: string }
): CachedText {
  const { size, color, slot } = options;
  const base = `${size}|${color.join(",")}`;
  // スロット指定時は同じスロットのテクスチャを使い回し、文字列が変わったときだけ再描画する
  const key = slot === undefined ? `${base}|t:${text}` : `${base}|s:${slot}`;
  const hit = cache.get(key);
  if (hit && hit.text === text) return hit;

  if (!hit && cache.size >= MAX_CACHE_SIZE) {
    cache.forEach((c) => c.graphics.remove());
    cache.clear();
  }
  const entry = renderText(p, hit ?? null, text, size, color);
  cache.set(key, entry);
  return entry;
}

/**
 * WEBGLキャンバスにテキストを描画する。
 *
 * p5.js（1.x）のWEBGLでは、`loadFont()` で読み込んだフォントがないと `text()` が
 * 描画されない。外部フォントに依存せずブラウザ・OSのデフォルトフォントで描画するため、
 * 2Dグラフィックスに文字を描いてテクスチャとして貼り付ける。
 * 描画位置は現在の座標変換のXY平面上で、`p.text(str, x, y, z)` と同様に指定する。
 * @param p - p5インスタンス
 * @param text - 描画する文字列
 * @param x - x座標
 * @param y - y座標
 * @param z - z座標
 * @param options - 文字サイズ・色・揃え
 */
export function drawWebglText(
  p: p5,
  text: string,
  x: number,
  y: number,
  z: number,
  options: WebglTextOptions
): void {
  const {
    size,
    color = [0],
    align = "center",
    baseline = "alphabetic",
    slot
  } = options;
  const tex = getTextTexture(p, text, { size, color, slot });

  let offsetX = 0;
  if (align === "left") offsetX = tex.width / 2;
  else if (align === "right") offsetX = -tex.width / 2;
  let offsetY = 0;
  if (baseline === "alphabetic") offsetY = tex.height / 2 - tex.ascent;
  else if (baseline === "top") offsetY = tex.height / 2;

  const gl = p.drawingContext as WebGLRenderingContext;
  p.push();
  p.noLights();
  p.noStroke();
  p.translate(x + offsetX, y + offsetY, z);
  p.texture(tex.graphics);
  // 透明部分が奥行きバッファに書き込まれ、後続の描画を隠さないようにする
  gl.depthMask(false);
  p.plane(tex.width, tex.height);
  gl.depthMask(true);
  p.pop();
}
