# ユニットテスト

## 概要

ユニットテストには [Vitest](https://vitest.dev/) を使用します。

## テスト対象

- `vite/_build/` 配下のビルドユーティリティ関数（例: `getHtmlInputsRecursively`）
- シミュレーションのロジック関数のうち、p5インスタンス（`p`）や `state` の直接書き換えに依存しない純粋な関数（例: `calculateVelocity(initial, angle)` のように入力から出力を計算するだけの関数）
- その他、シミュレーションから独立したロジック関数

!!! note
p5.js の `setup`/`draw` 内で直接実行される処理、キャンバス描画、DOM操作、`state` オブジェクトの直接書き換えを伴う処理はユニットテストの対象外です。これらは [UIテスト](./ui-test.md)（Playwright）で検証してください。

## シミュレーションロジックをテスト可能にする

`vite/simulations/<slug>/js/logic.js` 等のロジックをユニットテスト対象にするには、`state` の読み書きや `p.` 呼び出しを関数内で直接行わず、次のように入出力が明確な純粋関数として切り出します。

```js title="logic.js の例"
// テストしやすい: 入力から出力を計算するだけ
export function calculateVelocity(initial, angle) {
    return initial * Math.cos(angle);
}

// テストしにくい: p や state に直接依存する
export function updateVelocity(p, state) {
    state.velocity = state.initial * p.cos(state.angle);
}
```

設計の考え方の詳細は [p5js-simulation-testing スキル](../../../.github/skills/p5js-simulation-testing/SKILL.md) を参照してください。

## テストの実行

```bash
npm test
```

`vitest.config.js` に従い、`test/**/*.{test,spec}.{js,mjs}` のパターンに一致するファイルが実行されます。

## テストファイルの配置

テストファイルは `test/` ディレクトリ以下に配置します。

```
test/
└── _build/
    └── getHtmlInputsRecursively.test.js
```

## テストの書き方

Vitest は Jest 互換の API を提供しています。

```js title="test/_build/getHtmlInputsRecursively.test.js"
import { describe, it, expect } from "vitest";
import { getHtmlInputsRecursively } from "../../vite/_build/getHtmlInputsRecursively.js";

describe("getHtmlInputsRecursively", () => {
    it("指定ディレクトリ以下の index.html を収集する", () => {
        // テストコード
    });
});
```

## CI での実行

現在、ユニットテストは CI（GitHub Actions）での自動実行は設定されていません。  
将来的にはデプロイワークフローにテストステップを追加することを検討してください。
