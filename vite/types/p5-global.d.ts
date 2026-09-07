import P5 = require("p5");

declare global {
  export import p5 = P5;
}

// @types/p5のdom.d.tsはchanged()/input()をp5.MediaElementにのみ宣言しているが、
// 実際はp5.Elementの全インスタンス（p.select()の戻り値）で利用可能なメソッドのため、
// ここでp5.Elementの型定義に補完する。
declare module "p5" {
  interface Element {
    changed(fxn: ((...args: unknown[]) => unknown) | boolean): p5;
    input(fxn: ((...args: unknown[]) => unknown) | boolean): p5;
  }
}

export {};
