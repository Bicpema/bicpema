import { test, expect } from "@playwright/test";

const PATH = "/vite/simulations/doppler/";
// p5.jsが生成するメインキャンバスのid
const CANVAS = "#defaultCanvas0";

test.beforeEach(async ({ page }) => {
  await page.goto(PATH);
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

  expect(before.equals(after)).toBe(false);

  await page.locator("#stopButton").click();
});

test("設定パネルの開閉ができる", async ({ page }) => {
  const modal = page.locator("#settingsModal");
  await expect(modal).toBeHidden();

  await page.locator("#settingsButton").click();
  await expect(modal).toBeVisible();

  await page.locator("#closeModal").click();
  await expect(modal).toBeHidden();
});

test("範囲外の音源の速度を入力すると最大値に補正される", async ({ page }) => {
  await page.locator("#settingsButton").click();
  const speedInput = page.locator("#speedInput");

  await speedInput.fill("5000");
  await expect(speedInput).toHaveValue("1000");
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
