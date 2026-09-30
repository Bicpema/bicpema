import { test, expect } from "@playwright/test";

// 記事ページ（解説ページ）に埋め込んだシミュレーションと、その下のボタンの動作を確認する
const ARTICLE_PATH = encodeURI("/post/振り子/");
const SIMULATION_PATH = "/vite/simulations/pendulum/";

test.beforeEach(async ({ page }) => {
  await page.goto(ARTICLE_PATH);
  await page.locator("[data-simulation-embed]").scrollIntoViewIfNeeded();
});

test("解説ページにシミュレーションが埋め込まれて動作する", async ({ page }) => {
  const frame = page.frameLocator("[data-simulation-embed] iframe");
  await expect(frame.locator("#loadingSpinner")).toBeHidden({
    timeout: 15_000
  });
  await expect(frame.locator("canvas").first()).toBeVisible();
  // 埋め込み時は戻るボタンを外し、ナビバーのリンクはページ全体で開く
  await expect(frame.locator("#navBackButton")).toHaveCount(0);
  await expect(frame.locator("#navBar a")).toHaveAttribute("target", "_top");
});

test("全画面表示ボタンで全画面表示になり、終了ボタンで元に戻る", async ({
  page
}) => {
  const exitButton = page.locator("[data-simulation-embed-exit]");
  await expect(exitButton).toBeHidden();

  await page.locator("[data-simulation-embed-fullscreen]").click();
  await expect(exitButton).toBeVisible();

  await exitButton.click();
  await expect(exitButton).toBeHidden();
});

test("全画面表示に対応しない端末では画面全体に広げて表示する", async ({
  page
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      get: () => false
    })
  );
  await page.reload();
  const frame = page.locator(".simulation-embed__frame");

  await page.locator("[data-simulation-embed-fullscreen]").click();
  await expect(frame).toHaveClass(/is-pseudo-fullscreen/);

  await page.keyboard.press("Escape");
  await expect(frame).not.toHaveClass(/is-pseudo-fullscreen/);
});

test("別タブで開くボタンでシミュレーションを新しいタブで開く", async ({
  page,
  context
}) => {
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: /別タブで開く/ }).click()
  ]);
  await newPage.waitForLoadState();

  expect(new URL(newPage.url()).pathname).toBe(SIMULATION_PATH);
});
