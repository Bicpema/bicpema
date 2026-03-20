import { test, expect } from '@playwright/test'

/**
 * 鉛直投げ上げ運動 - E2Eテスト
 *
 * p5.js描画の完全な検証は困難なため、
 * UIの存在・操作可能性・基本的な状態変化を検証する。
 */
test.describe('鉛直投げ上げ運動', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/vertical-throw-up/')
    // p5.js がキャンバスを生成するまで待機
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('鉛直投げ上げ運動')
  })

  test('p5.jsキャンバスが生成されること', async ({ page }) => {
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
  })

  test('ナビゲーションバーが表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('開始ボタンが存在すること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await expect(btn).toBeVisible()
    await expect(btn).toHaveText('開始')
  })

  test('リセットボタンが存在すること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定ボタンをクリックするとモーダルが表示されること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await expect(modal).toBeHidden()
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
  })

  test('モーダルの閉じるボタンでモーダルが非表示になること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#settingsModal')).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('開始ボタンをクリックすると一時停止ボタンに変わること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toHaveText('一時停止')
  })

  test('初速度入力フィールドが存在すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#velocityInput')
    await expect(input).toBeVisible()
    await expect(input).toHaveValue('30')
  })
})
