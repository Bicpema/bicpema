import { test, expect } from '@playwright/test'

/**
 * 弾性力シミュレーション - UIテスト（画面表示）
 */
test.describe('弾性力 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/elastic-force/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('弾性力')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('弾性力')
  })

  test('キャンバスが正の幅と高さで生成されること', async ({ page }) => {
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      return { w: c?.width, h: c?.height }
    })
    expect(dims.w).toBeGreaterThan(0)
    expect(dims.h).toBeGreaterThan(0)
  })

  test('キャンバスに何かが描画されていること', async ({ page }) => {
    const hasNonEmpty = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      if (!c) return false
      const ctx = c.getContext('2d')
      if (!ctx) return false
      const { data } = ctx.getImageData(0, 0, c.width, c.height)
      return data.some(v => v !== 0)
    })
    expect(hasNonEmpty).toBe(true)
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('設定ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#toggleModal')).toBeVisible()
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定モーダル内にばね定数スライダーが表示されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#springConstantInput')).toBeVisible()
  })
})
