# UIテスト

## 概要

UIテストには [Playwright](https://playwright.dev/) を使用します。  
シミュレーションの表示・操作が正しく動作することを確認します。

## テスト対象

- シミュレーションページが正常に表示されること
- 再生・停止ボタンが機能すること
- 設定パネル（スライダー・トグル等）が正しく動作すること
- キャンバスのリサイズが正常に行われること

## 事前準備

Playwright をインストールします。

```bash
npx playwright install
```

## テストの実行

```bash
npx playwright test
```

ブラウザ UI を表示しながら実行する場合:

```bash
npx playwright test --headed
```

特定のシミュレーションのみテストする場合:

```bash
npx playwright test --grep "doppler"
```

## テストの書き方

```js title="tests/doppler.spec.js の例"
import { test, expect } from "@playwright/test";

test("ドップラー効果シミュレーションが表示される", async ({ page }) => {
  await page.goto("http://localhost:1313/vite/simulations/doppler/");

  // キャンバスが表示されていること
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
});

test("再生・停止ボタンが動作する", async ({ page }) => {
  await page.goto("http://localhost:1313/vite/simulations/doppler/");

  // 停止ボタンをクリック
  await page.locator("#playPauseButton").click();
  // ボタンの状態が変わること
  await expect(page.locator("#playPauseButton")).toHaveAttribute("aria-label", "再生");
});
```

## CI での実行

現在、UIテストは CI（GitHub Actions）での自動実行は設定されていません。  
将来的にはデプロイ前のステップとして組み込むことを検討してください。

!!! note
    ローカルでテストを実行する際は、Hugo サーバーと Vite ビルドが起動していることを確認してください。
