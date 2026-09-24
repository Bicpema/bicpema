import P5 = require("p5");

declare global {
  export import p5 = P5;
}

// @types/p5のdom.d.tsはchanged()/input()をp5.MediaElementにのみ宣言し、checked()はどのクラスにも
// 宣言していないが、実際はp5.Elementの全インスタンス（p.select()の戻り値）で利用可能なメソッドのため、
// ここでp5.Elementの型定義に補完する。
declare module "p5" {
  interface Element {
    changed(fxn: ((...args: unknown[]) => unknown) | boolean): p5;
    input(fxn: ((...args: unknown[]) => unknown) | boolean): p5;
    checked(): boolean;
    checked(value: boolean): Element;
  }
}

// oxlint-disable-next-line unicorn/require-module-specifiers -- declare globalを含むこのファイルをモジュール化するためのTypeScriptの定番の書き方
export {};
