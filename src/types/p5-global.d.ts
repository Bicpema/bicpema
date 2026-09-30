import P5 = require("p5");

declare global {
  export import p5 = P5;
}

// @types/p5のdom.d.tsはchanged()/input()をp5.MediaElementにのみ宣言し、checked()はどのクラスにも
// 宣言していないが、実際はp5.Elementの全インスタンス（p.select()の戻り値）で利用可能なメソッドのため、
// ここでp5.Elementの型定義に補完する。
declare module "p5" {
  interface Element {
    /**
     * 要素の値が変更されたときに呼び出すイベントハンドラーを登録する。
     * @param fxn - 呼び出す関数。`false` を渡すと登録を解除する
     * @returns p5インスタンス
     */
    changed(fxn: ((...args: unknown[]) => unknown) | boolean): p5;
    /**
     * 要素への入力があったときに呼び出すイベントハンドラーを登録する。
     * @param fxn - 呼び出す関数。`false` を渡すと登録を解除する
     * @returns p5インスタンス
     */
    input(fxn: ((...args: unknown[]) => unknown) | boolean): p5;
    /**
     * チェックボックスがチェックされているかを取得する。
     * @returns チェックされている場合は `true`
     */
    checked(): boolean;
    /**
     * チェックボックスのチェック状態を設定する。
     * @param value - 設定するチェック状態
     * @returns この要素
     */
    checked(value: boolean): Element;
  }
}

// oxlint-disable-next-line unicorn/require-module-specifiers -- declare globalを含むこのファイルをモジュール化するためのTypeScriptの定番の書き方
export {};
