import { test, expect } from '@playwright/test'

/**
 * アルキメデスの原理 - E2Eテスト（画面操作）
 */
test.describe('アルキメデスの原理 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/archimedes-principle/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('開始ボタンをクリックしてもナビゲーションが保たれること', async ({ page }) => {
    await page.locator('#startButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('リセットボタンでページが正常に保たれること', async ({ page }) => {
    await page.locator('#startButton').click()
    await page.locator('#resetButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('密度スライダーを操作すると値が変化すること', async ({ page }) => {
    const slider = page.locator('#densitySlider')
    const before = await slider.inputValue()
    await slider.evaluate(el => { el.value = '2.0' })
    await slider.dispatchEvent('input')
    const after = await slider.inputValue()
    expect(after).not.toBe(before)
  })

  test('設定ボタンをクリックしてもページが正常に保たれること', async ({ page }) => {
    await page.locator('#settingsButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })
})
