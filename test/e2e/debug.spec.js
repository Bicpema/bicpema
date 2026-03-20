import { test, expect } from '@playwright/test'

test('check if common.js is transformed', async ({ page }) => {
  // Fetch common.js directly from browser context to see what it returns
  await page.goto('/vite/simulations/vertical-throw-up/')
  
  const commonJsContent = await page.evaluate(async () => {
    try {
      const resp = await fetch('/vite/js/common.js')
      const text = await resp.text()
      return text.substring(0, 300)
    } catch(e) {
      return 'Error: ' + e.message
    }
  })
  
  console.log('common.js (from browser fetch):', commonJsContent)
  
  // Also check the direct URL headers
  const response = await page.request.get('/vite/js/common.js', {
    headers: { 'Accept': 'text/javascript, application/javascript, */*' }
  })
  
  const body = await response.text()
  console.log('\nStatus:', response.status())
  console.log('Headers:', JSON.stringify(response.headers(), null, 2).substring(0, 200))
  console.log('Body first 300:', body.substring(0, 300))
  
  // Check if jquery is in the path or resolved
  const hasJqueryRef = body.includes('/vite/') || body.includes('jquery?v=') || body.includes('node_modules')
  console.log('Is transformed (has vite path)?', hasJqueryRef)
})
