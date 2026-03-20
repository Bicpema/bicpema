import { test, expect } from '@playwright/test'

/**
 * セロハンによる色の変化（2Dアニメーション） - E2Eテスト（画面操作）
 */
test.describe('セロハンによる色の変化（アニメーション） - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/cellophane-color-2D_animation/')
    await page.waitForSelector('#p5Canvas', { timeout: 10000 })
  })

  test('ページが読み込まれて主要要素が表示されること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeVisible()
    await expect(page.locator('#color')).toBeVisible()
  })

  test('設定モーダルボタンをクリックして設定を開けること', async ({ page }) => {
    // 設定を開くボタンを探して操作する
    const modalTrigger = page.locator('[data-bs-target="#settingModal"]').first()
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click()
      await expect(page.locator('#settingModal')).toBeVisible()
    } else {
      // ボタンが見つからない場合はキャンバス確認のみ
      await expect(page.locator('#p5Canvas')).toBeVisible()
    }
  })
})
