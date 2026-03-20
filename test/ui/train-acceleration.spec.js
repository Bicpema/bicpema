import { test, expect } from '@playwright/test'

/**
 * 電車の加速と減速 - UIテスト（画面表示）
 */
test.describe('電車の加速と減速 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/train-acceleration/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('電車の加速と減速')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('電車')
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

  test('開始ボタンに初期テキストが表示されること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })

  test('加速度入力フィールドのデフォルト値が表示されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#accelerationInput')
    await expect(input).toBeVisible()
    const val = await input.inputValue()
    expect(Number(val)).toBeGreaterThan(0)
  })
})
