import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockFontBuffer = readFileSync(join(__dirname, 'fixtures/mock-font.ttf'))
const mockImageBuffer = readFileSync(join(__dirname, 'fixtures/mock-image.png'))

/**
 * Firebase Storage リソース（フォント・画像）をモックして
 * p5.js が正常にプリロードを完了できるようにする。
 *
 * loadFont() のネットワーク障害があると p5 の preload カウンターが
 * デクリメントされず setup() が呼ばれないため、このルートインターセプト
 * でローカルの代替ファイルを返す。
 *
 * @param {import('@playwright/test').Page} page
 */
export async function mockFirebaseAssets(page) {
  await page.route('**/firebasestorage.googleapis.com/**', async (route) => {
    const url = route.request().url()
    if (url.includes('.ttf') || url.includes('.otf') || url.includes('.woff')) {
      await route.fulfill({
        status: 200,
        contentType: 'font/ttf',
        body: mockFontBuffer,
      })
    } else if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif')) {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: mockImageBuffer,
      })
    } else {
      await route.continue()
    }
  })
}
