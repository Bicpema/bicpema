# UIテスト

## 概要

UIテストには [Playwright](https://playwright.dev/) を使用します。  
シミュレーションの表示・操作が正しく動作することを確認します。

## テスト対象

- シミュレーションページが正常に表示されること
- 再生・停止ボタンが機能すること
- 設定パネル（スライダー・トグル等）が正しく動作すること
- キャンバスのリサイズが正常に行われること

テスト設定は [playwright.config.js](../../../playwright.config.js)、テストコードは `e2e/` 配下に配置します。

## 事前準備

Playwright（ブラウザー本体）をインストールします。

```bash
npx playwright install --with-deps chromium
```

## テストの実行

```bash
npm run test:e2e
```

`test:e2e` は実行前に `npm run build` で `static/vite/` を最新化し、[playwright.config.js](../../../playwright.config.js) の `webServer` 設定により `vite preview` を自動起動してテストします。Hugo サーバーの起動は不要です（`scripts/verify-simulation-runtime.js` と同様の方式）。

ブラウザ UI を表示しながら実行する場合:

```bash
npx playwright test --headed
```

特定のシミュレーションのみテストする場合:

```bash
npx playwright test e2e/doppler.spec.js
```

## テストの書き方

シミュレーションのキャンバス要素は p5.js が自動生成する `#defaultCanvas0` というidを持ちます（グラフ描画用の別canvasと区別するため、`canvas` タグではなくこのidで指定します）。

```js title="e2e/doppler.spec.js の例（抜粋）"
import { test, expect } from "@playwright/test";

const CANVAS = "#defaultCanvas0";

test.beforeEach(async ({ page }) => {
    await page.goto("/vite/simulations/doppler/");
    await expect(page.locator("#loadingSpinner")).toBeHidden();
});

test("シミュレーションページが正常に表示される", async ({ page }) => {
    await expect(page.locator(CANVAS)).toBeVisible();
});

test("スタートボタンの操作でシミュレーションが動き出す", async ({ page }) => {
    const canvas = page.locator(CANVAS);

    await page.locator("#startButton").click();
    const before = await canvas.screenshot();
    await page.waitForTimeout(300);
    const after = await canvas.screenshot();

    // ボタン操作前後でキャンバスの描画内容（スクリーンショット）が変化していることを確認する
    expect(before.equals(after)).toBe(false);
});
```

再生/一時停止をボタン1つでトグルするシミュレーション（例: `free-fall` の `#playPauseButton`）では、ボタンの表示テキストの変化（`▶ 開始` → `一時停止` → `再開`）で状態切り替えを検証できます。詳細は [e2e/free-fall.spec.js](../../../e2e/free-fall.spec.js)・[e2e/doppler.spec.js](../../../e2e/doppler.spec.js)・[e2e/spring.spec.js](../../../e2e/spring.spec.js) を参照してください。

## CI での実行

[.github/workflows/e2e-test.yml](../../../.github/workflows/e2e-test.yml) により、`vite/**` 等の変更を含む Pull Request で自動実行されます。
