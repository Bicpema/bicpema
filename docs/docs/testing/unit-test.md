# ユニットテスト

## 概要

ユニットテストには [Vitest](https://vitest.dev/) を使用します。

## テスト対象

- `vite/_build/` 配下のビルドユーティリティ関数（例: `getHtmlInputsRecursively`）
- その他、シミュレーションから独立したロジック関数

!!! note
p5.js の `setup`/`draw` に依存するシミュレーションのロジックはユニットテストの対象外です。

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
