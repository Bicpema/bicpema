import { test, expect } from '@playwright/test'

/**
 * 鉛直投げ上げ運動 - UIテスト（画面表示）
 *
 * ページを読み込んだときの画面表示が正しいことを検証する。
 * キャンバスの描画状態、ナビ・ボタン等のDOM初期状態を確認する。
 */
test.describe('鉛直投げ上げ運動 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/vertical-throw-up/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('鉛直投げ上げ運動')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('鉛直投げ上げ運動')
  })

  test('キャンバスが正の幅と高さで生成されること', async ({ page }) => {
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      return { w: c?.width, h: c?.height }
    })
    expect(dims.w).toBeGreaterThan(0)
    expect(dims.h).toBeGreaterThan(0)
  })

  test('キャンバスに何かが描画されていること（背景以外のピクセルが存在する）', async ({ page }) => {
    // p5.js が background(0) を呼ぶため、非ゼロピクセルが存在すれば描画済み
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

  test('開始ボタンが初期状態で「開始」と表示されること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toHaveText('開始')
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#toggleModal')).toBeVisible()
  })

  test('設定モーダル内の初速度入力にデフォルト値が表示されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#velocityInput')).toHaveValue('30')
  })
})
