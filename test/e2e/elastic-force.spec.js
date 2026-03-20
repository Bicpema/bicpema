import { test, expect } from '@playwright/test'

/**
 * 弾性力シミュレーション - E2Eテスト（画面操作）
 */
test.describe('弾性力 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/elastic-force/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })

  test('ばね定数スライダーを変更すると表示値が更新されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const slider = page.locator('#springConstantInput')
    const display = page.locator('#springConstantDisplay')
    const before = await display.textContent()
    await slider.evaluate(el => { el.value = String(Number(el.value) + 10) })
    await slider.dispatchEvent('input')
    const after = await display.textContent()
    expect(after).not.toBe(before)
  })

  test('リセットボタンをクリックしてもページが正常に保たれること', async ({ page }) => {
    await page.locator('#resetButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })
})
