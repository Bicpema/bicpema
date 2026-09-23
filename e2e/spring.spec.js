import { test, expect } from "@playwright/test";

const PATH = "/vite/simulations/spring/";
// p5.jsが生成するメインキャンバスのid（グラフ用のChart.jsキャンバスと区別するため使用する）
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
  const modal = page.locator("#settingModal");
  await expect(modal).toBeHidden();

  await page.locator(".settings-modal-open").click();
  await expect(modal).toBeVisible();

  await page.locator(".modal-close").first().click();
  await expect(modal).toBeHidden();
});

test("ばね定数の変更とリセット操作でシミュレーションの表示が変わる", async ({
  page
}) => {
  const canvas = page.locator(CANVAS);
  const before = await canvas.screenshot();

  await page.locator(".settings-modal-open").click();
  await page.locator("#konstantButton1").fill("10");
  await page.locator(".modal-close").first().click();
  await page.locator("#resetButton").click();

  const after = await canvas.screenshot();
  expect(before.equals(after)).toBe(false);
});

test("キャンバスのリサイズが正常に行われる", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  const canvas = page.locator(CANVAS);
  const before = await canvas.boundingBox();

  await page.setViewportSize({ width: 500, height: 900 });
  await expect(async () => {
    const after = await canvas.boundingBox();
    expect(after?.height).not.toBeCloseTo(before?.height ?? 0, 0);
  }).toPass();
});
