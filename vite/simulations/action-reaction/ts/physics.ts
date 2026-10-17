// physics.ts は力の計算を描画から分離した純関数群です（p5.js・DOMに依存しません）。

/** 積める本の最大冊数 */
export const MAX_BOOKS = 5;
/** 本1冊の質量の既定値[kg] */
export const DEFAULT_MASS = 1.0;
/** 重力加速度の既定値[m/s^2] */
export const DEFAULT_GRAVITY = 9.8;

/**
 * 力の種類。
 * - gravity: 重力（本にはたらく。つり合いの2力の一方）
 * - normal: 下の面からの垂直抗力（本にはたらく。つり合いの2力の一方）
 * - reaction: 作用反作用の相手側の力（本が地球を引く力、本が下の面を押す力）
 */
export type ForceKind = "gravity" | "normal" | "reaction";

/** 力を受ける物体の種類 */
export type ReceiverType = "book" | "earth" | "desk";

/** 作用反作用ペアの種類 */
export type PairType = "gravity-earth" | "normal-push";

/** 1つの力を表すデータ（大きさ・向き・受け手） */
export interface Force {
  /** 力の識別子（`gravity-1`・`normal-2`・`earth-1`・`push-3` の形式） */
  id: string;
  kind: ForceKind;
  /**
   * 作用点の基準となる本の番号（机側が1）。
   * gravity・earth は本そのもの、normal・push は「その本の下の接触面」を指す。
   */
  bookIndex: number;
  /** 力を受ける物体 */
  receiver: ReceiverType;
  /** receiver が "book" のとき、受け手の本の番号（それ以外は null） */
  receiverBook: number | null;
  /** 力の向き（鉛直方向のみ） */
  direction: "up" | "down";
  /** 力の大きさ[N]（0以上） */
  magnitude: number;
  /** 作用反作用のペアとなる力の id */
  pairId: string;
  /** ペアの種類 */
  pairType: PairType;
}

/**
 * 冊数を 0〜MAX_BOOKS の整数へ丸める。
 * @param count - 冊数の候補
 * @returns 丸めた冊数（NaN は 0 とする）
 */
export function clampBookCount(count: number): number {
  if (!Number.isFinite(count)) return 0;
  return Math.min(MAX_BOOKS, Math.max(0, Math.trunc(count)));
}

/**
 * 冊数・質量・重力加速度から、すべての力の大きさ・向き・受け手を求める。
 * 本 k（机側が1）について、下の面からの垂直抗力は (n-k+1)mg、
 * 上の本が押す力（= 本 k+1 が本 k を押す力）は (n-k)mg になる。
 * 「上の本が押す力」は本 k+1 の垂直抗力の反作用 push-(k+1) と同一の力のため、重複して返さない。
 * @param bookCount - 本の冊数
 * @param mass - 本1冊の質量[kg]
 * @param gravity - 重力加速度[m/s^2]
 * @returns 力の配列（本1→n の順に gravity, normal, earth, push）
 */
export function computeForces(
  bookCount: number,
  mass: number,
  gravity: number
): Force[] {
  const n = clampBookCount(bookCount);
  const weight = Math.max(0, mass * gravity);
  const forces: Force[] = [];
  for (let k = 1; k <= n; k++) {
    const supported = (n - k + 1) * weight;
    forces.push(
      {
        id: `gravity-${k}`,
        kind: "gravity",
        bookIndex: k,
        receiver: "book",
        receiverBook: k,
        direction: "down",
        magnitude: weight,
        pairId: `earth-${k}`,
        pairType: "gravity-earth"
      },
      {
        id: `normal-${k}`,
        kind: "normal",
        bookIndex: k,
        receiver: "book",
        receiverBook: k,
        direction: "up",
        magnitude: supported,
        pairId: `push-${k}`,
        pairType: "normal-push"
      },
      {
        id: `earth-${k}`,
        kind: "reaction",
        bookIndex: k,
        receiver: "earth",
        receiverBook: null,
        direction: "up",
        magnitude: weight,
        pairId: `gravity-${k}`,
        pairType: "gravity-earth"
      },
      {
        id: `push-${k}`,
        kind: "reaction",
        bookIndex: k,
        receiver: k === 1 ? "desk" : "book",
        receiverBook: k === 1 ? null : k - 1,
        direction: "down",
        magnitude: supported,
        pairId: `normal-${k}`,
        pairType: "normal-push"
      }
    );
  }
  return forces;
}

/**
 * 指定した本にはたらく鉛直方向の合力（上向きを正）を求める。
 * 受け手がその本である力（重力・垂直抗力・上の本が押す力）だけを足し合わせる。
 * @param forces - computeForces の戻り値
 * @param bookIndex - 本の番号（机側が1）
 * @returns 合力[N]。つり合っていれば 0
 */
export function netForceOnBook(forces: Force[], bookIndex: number): number {
  let net = 0;
  for (const f of forces) {
    if (f.receiver === "book" && f.receiverBook === bookIndex) {
      net += f.direction === "up" ? f.magnitude : -f.magnitude;
    }
  }
  return net;
}

/**
 * 矢印の長さを決める縮尺[px/N]を求める。次の3つの上限のうち最小のものを返す。
 * - 基準の縮尺 baseScale
 * - 最大の力（n冊分の重さ）の矢印が maxLength に収まる縮尺
 * - 本1冊の重力の矢印が maxWeightLength に収まる縮尺（本の高さからはみ出さないため）
 * @param bookCount - 本の冊数
 * @param weight - 本1冊の重さ mg[N]
 * @param baseScale - 基準の縮尺[px/N]
 * @param maxLength - 最大の力の矢印の長さの上限[px]
 * @param maxWeightLength - 重力の矢印の長さの上限[px]
 * @returns 縮尺[px/N]（常に有限の正の値）
 */
export function computeArrowScale(
  bookCount: number,
  weight: number,
  baseScale: number,
  maxLength: number,
  maxWeightLength: number
): number {
  if (!(weight > 0)) return baseScale;
  const n = Math.max(1, clampBookCount(bookCount));
  return Math.min(
    baseScale,
    maxLength / (n * weight),
    maxWeightLength / weight
  );
}

/**
 * 力の大きさを N 単位の文字列にする。
 * @param magnitude - 力の大きさ[N]
 * @returns 小数第1位までの文字列（例: `9.8 N`）
 */
export function formatNewton(magnitude: number): string {
  const safe = Number.isFinite(magnitude) ? magnitude : 0;
  return `${safe.toFixed(1)} N`;
}

/**
 * 力の名前を受け手つきで返す。
 * @param force - 力
 * @returns 例: `重力（本にはたらく）`、`本が机を押す力（机にはたらく）`
 */
export function forceName(force: Force): string {
  switch (force.kind) {
    case "gravity":
      return "重力（本にはたらく）";
    case "normal":
      return force.bookIndex === 1
        ? "机からの垂直抗力（本にはたらく）"
        : "下の本からの垂直抗力（本にはたらく）";
    default:
      if (force.pairType === "gravity-earth") {
        return "本が地球を引く力（地球にはたらく）";
      }
      return force.receiver === "desk"
        ? "本が机を押す力（机にはたらく）"
        : "本が下の本を押す力（下の本にはたらく）";
  }
}
