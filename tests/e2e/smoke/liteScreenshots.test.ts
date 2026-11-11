import { test } from './fixtures/electron.fixture'

/**
 * Lite edition preview: captures screenshots of the main surfaces so the build
 * can be reviewed without installing it. Never fails on a missing surface.
 */
test('lite edition screenshots', async ({ mainWindow: page }, testInfo) => {
  test.setTimeout(180_000)
  await page.setViewportSize({ width: 1280, height: 800 }).catch(() => {})
  await page.evaluate(() =>
    window.api.preference.setMultiple({
      'app.language': 'zh-CN',
      'app.onboarding.provider_setup.status': 'skipped',
      'app.privacy.data_collection.enabled': false
    })
  )
  await page.reload()
  await page.waitForTimeout(4000)

  const shot = async (name: string) => {
    await page.waitForTimeout(1500)
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`) })
  }

  await page.keyboard.press('Escape').catch(() => {})
  await shot('01-home')

  const sidebar = page.locator('[data-ui~="app.sidebar"]')
  const buttons = sidebar.getByRole('button')
  const count = await buttons.count().catch(() => 0)
  let index = 0
  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i)
    const label = ((await button.getAttribute('aria-label').catch(() => null)) ?? (await button.innerText().catch(() => '')))
      .trim()
      .replace(/[^\p{L}\p{N}_-]+/gu, '_')
      .slice(0, 30)
    try {
      await button.click({ timeout: 3000 })
      index++
      await shot(`02-sidebar-${String(index).padStart(2, '0')}-${label || 'item'}`)
      await page.keyboard.press('Escape').catch(() => {})
    } catch {
      // skip non-clickable entries
    }
  }

  try {
    await sidebar.getByRole('button', { name: '设置' }).first().click({ timeout: 3000 })
    await shot('03-settings')
    const nav = page.locator('[data-ui~="settings.view"]').getByRole('button')
    const navCount = Math.min(await nav.count(), 25)
    for (let i = 0; i < navCount; i++) {
      try {
        await nav.nth(i).click({ timeout: 2000 })
        await shot(`04-settings-${String(i + 1).padStart(2, '0')}`)
      } catch {
        // ignore
      }
    }
  } catch {
    // settings entry not found
  }
})
