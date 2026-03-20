import { test, expect } from '@playwright/test'

/**
 * 力学台車が定規にする仕事 - UIテスト（画面表示）
 */
test.describe('力学台車が定規にする仕事 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/cart-work-ruler/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('力学台車が定規にする仕事')
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

  test('開始ボタンが初期状態で「▶ 開始」と表示されること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })

  test('質量・速度・力の入力フィールドにデフォルト値が存在すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#massInput')).toBeVisible()
    await expect(page.locator('#velocityInput')).toBeVisible()
    await expect(page.locator('#forceInput')).toBeVisible()
  })
})
