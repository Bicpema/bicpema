import { test, expect } from "@playwright/test";

const PATH = "/vite/simulations/free-fall/";
// p5.jsが生成するメインキャンバスのid（グラフ表示用の#graphCanvasと区別するため使用する）
const CANVAS = "#defaultCanvas0";

test.beforeEach(async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator("#loadingSpinner")).toBeHidden();
});

test("シミュレーションページが正常に表示される", async ({ page }) => {
  await expect(page.locator(CANVAS)).toBeVisible();
});

test("開始/一時停止ボタンの操作で表示テキストが切り替わる", async ({
  page
}) => {
  const playPauseButton = page.locator("#playPauseButton");
  await expect(playPauseButton).toHaveText("▶ 開始");

  await playPauseButton.click();
  await expect(playPauseButton).toHaveText("一時停止");

  await playPauseButton.click();
  await expect(playPauseButton).toHaveText("再開");
});

test("設定パネルの開閉ができる", async ({ page }) => {
  const modal = page.locator("#settingsModal");
  await expect(modal).toBeHidden();

  await page.locator("#toggleModal").click();
  await expect(modal).toBeVisible();

  await page.locator("#closeModal").click();
  await expect(modal).toBeHidden();
});

test("高さ設定の変更でボールの表示位置が変わる", async ({ page }) => {
  const canvas = page.locator(CANVAS);

  await page.locator("#toggleModal").click();
  const before = await canvas.screenshot();

  await page.locator("#heightInput").fill("100");
  await page.locator("#closeModal").click();
  const after = await canvas.screenshot();

  expect(before.equals(after)).toBe(false);
});

test("範囲外の高さを入力すると最大値に補正される", async ({ page }) => {
  await page.locator("#toggleModal").click();
  const heightInput = page.locator("#heightInput");

  await heightInput.fill("999");
  await expect(heightInput).toHaveValue("100");
});

test("キャンバスのリサイズが正常に行われる", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  const canvas = page.locator(CANVAS);
  const before = await canvas.boundingBox();

  await page.setViewportSize({ width: 500, height: 500 });
  await expect(async () => {
    const after = await canvas.boundingBox();
    expect(after?.width).not.toBeCloseTo(before?.width ?? 0, 0);
  }).toPass();
});
