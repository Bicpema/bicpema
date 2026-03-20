import { test, expect } from '@playwright/test'

/**
 * 3D地層観察（CSV） - UIテスト（画面表示）
 */
test.describe('3D地層観察（CSV） - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/3d-strata-csv/')
    await page.waitForSelector('canvas', { timeout: 15000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('3D地層観察')
  })

  test('ナビゲーションバーが表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('キャンバスが正の幅と高さで生成されること', async ({ page }) => {
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      return { w: c?.width, h: c?.height }
    })
    expect(dims.w).toBeGreaterThan(0)
    expect(dims.h).toBeGreaterThan(0)
  })

  test('p5Canvas 要素が存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeVisible()
  })

  test('データ登録モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#dataRegisterModal')).toBeHidden()
  })
})
