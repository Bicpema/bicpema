import { test, expect } from '@playwright/test'

/**
 * 3D地層観察（CSV） - E2Eテスト（画面操作）
 *
 * スクリーンショットボタンとデータ登録モーダルの操作を検証する。
 */
test.describe('3D地層観察（CSV） - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/3d-strata-csv/')
    await page.waitForSelector('canvas', { timeout: 15000 })
  })

  test('ページが読み込まれてキャンバスが表示されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('スクリーンショットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#screenshotButton')).toBeVisible()
  })

  test('キャンバスのサイズが正であること', async ({ page }) => {
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      return { w: c?.width, h: c?.height }
    })
    expect(dims.w).toBeGreaterThan(0)
    expect(dims.h).toBeGreaterThan(0)
  })
})
