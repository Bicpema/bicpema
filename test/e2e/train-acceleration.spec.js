import { test, expect } from "@playwright/test";

const PATH = "/vite/simulations/train-acceleration/";
// p5.jsが生成するメインキャンバスのid（グラフ表示用の#graphCanvasと区別するため使用する）
const CANVAS = "#defaultCanvas0";

test.beforeEach(async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator("#loadingSpinner")).toBeHidden();
});

test("シミュレーションページが正常に表示される", async ({ page }) => {
  await expect(page.locator(CANVAS)).toBeVisible();
  await expect(page.locator("#graphCanvas")).toBeVisible();
});

test("ページがスクロールできない", async ({ page }) => {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("開始/一時停止/再開ボタンの表示が切り替わる", async ({ page }) => {
  const button = page.locator("#playPauseButton");
  await expect(button).toHaveText("▶ 開始");

  await button.click();
  await expect(button).toHaveText("⏸ 一時停止");

  await button.click();
  await expect(button).toHaveText("▶ 再開");
});

test("再生すると電車の表示が変化し、リセットで元に戻る", async ({ page }) => {
  const canvas = page.locator(CANVAS);
  // フォントを外部URLから非同期に読み込むため、完了を待ってから初期表示を撮る
  // （待たないと初期表示がフォールバックフォント、リセット後が読込済みフォントになり一致しない）
  await page.waitForLoadState("networkidle");
  await page.locator("#resetButton").click();
  await page.waitForTimeout(500);
  const initial = await canvas.screenshot();

  await page.locator("#playPauseButton").click();
  await page.waitForTimeout(1000);
  const playing = await canvas.screenshot();
  expect(initial.equals(playing)).toBe(false);

  await page.locator("#resetButton").click();
  await expect(page.locator("#playPauseButton")).toHaveText("▶ 開始");
  await expect(async () => {
    expect((await canvas.screenshot()).equals(initial)).toBe(true);
  }).toPass();
});

test("設定パネルの開閉ができる", async ({ page }) => {
  const modal = page.locator("#settingsModal");
  await expect(modal).toBeHidden();

  await page.locator("#toggleModal").click();
  await expect(modal).toBeVisible();

  await page.locator("#settingsModal .modal-close").click();
  await expect(modal).toBeHidden();
});

test("加速度スライダーの値が設定パネルに表示される", async ({ page }) => {
  await page.locator("#toggleModal").click();
  await page.locator("#accelerationInput").fill("-3");

  await expect(page.locator("#accelerationValue")).toHaveText("-3.0");
});
