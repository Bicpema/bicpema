import { test, expect } from "@playwright/test";

const SIMULATION_PATH = "/vite/simulations/pendulum/";
// 記事本文の内容に依存しないよう、記事ページはスタブで代用する
const ARTICLE_PATH = encodeURI("/post/振り子/");
const ARTICLELESS_SIMULATION_PATH = "/vite/simulations/spring/";

test.beforeEach(async ({ page }) => {
  await page.route(`**${ARTICLE_PATH}`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<html><body><a id="openSimulation" href="${SIMULATION_PATH}">開く</a></body></html>`
    })
  );
});

test("解説ページから開いた場合、戻るボタンで履歴を戻って解説ページへ戻る", async ({
  page
}) => {
  await page.goto(ARTICLE_PATH);
  await page.locator("#openSimulation").click();
  await expect(page).toHaveURL(SIMULATION_PATH);
  const historyLength = await page.evaluate(() => history.length);

  await page.locator("#navBackButton").click();

  await expect(page).toHaveURL(ARTICLE_PATH);
  // 新たな履歴を積まずに戻っていること
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
});

test("直接アクセスした場合、戻るボタンで対応する解説ページへ遷移する", async ({
  page
}) => {
  await page.goto(SIMULATION_PATH);
  const backButton = page.locator("#navBackButton");
  await expect(backButton).toHaveAttribute("aria-label", "解説ページへ戻る");

  await backButton.click();

  await expect(page).toHaveURL(ARTICLE_PATH);
});

test("対応する解説ページがない場合、戻るボタンはトップページへ遷移する", async ({
  page
}) => {
  await page.goto(ARTICLELESS_SIMULATION_PATH);
  const backButton = page.locator("#navBackButton");

  await expect(backButton).toHaveAttribute("href", "/");
  await expect(backButton).toHaveAttribute("aria-label", "トップページへ戻る");
});

test("スマートフォン幅でも戻るボタンとタイトルが重ならない", async ({
  page
}) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto(SIMULATION_PATH);

  const [backBox, titleBox, navBox] = await Promise.all(
    ["#navBackButton", "#navBar span", "#navBar"].map(async (selector) => {
      const box = await page.locator(selector).boundingBox();
      if (!box) throw new Error(`${selector}が表示されていません`);
      return box;
    })
  );

  expect(backBox.x + backBox.width).toBeLessThanOrEqual(titleBox.x);
  expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(
    navBox.x + navBox.width
  );
});
