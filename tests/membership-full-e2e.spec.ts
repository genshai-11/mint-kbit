import { expect, test } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD
const memberPassword = process.env.E2E_MEMBER_PASSWORD
const adminBaseURL = process.env.E2E_ADMIN_BASE_URL ?? 'http://127.0.0.1:4174'

const hasCredentials = Boolean(adminEmail && adminPassword && memberPassword)

test.describe('membership admin-to-member workflow', () => {
  test.skip(!hasCredentials, 'Set E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, and E2E_MEMBER_PASSWORD to run the full membership workflow.')

  test('application can be submitted, approved by admin, and opened by the activated member', async ({ page, browser }) => {
    const unique = Date.now()
    const memberEmail = `kbit-e2e-member+${unique}@example.com`
    const memberName = `KBIT E2E Member ${unique}`

    await page.goto('/en/membership/apply')
    await expect(page.getByRole('heading', { name: /apply for kbit membership/i })).toBeVisible()
    await expect(page.locator('input[name="plan"]').first()).toBeChecked({ timeout: 15000 })

    await page.getByLabel(/full name/i).fill(memberName)
    await page.getByLabel(/email/i).fill(memberEmail)
    await page.getByLabel(/phone/i).fill('+84900000000')
    await page.getByLabel(/city/i).fill('Ho Chi Minh City, Vietnam')
    await page.getByLabel(/clinic|organization/i).fill('KBIT E2E Clinic')
    await page.getByLabel(/specialty|role/i).fill('E2E tester')
    await page.getByLabel(/reason for joining/i).fill('Validate the full KBIT membership workflow from public application to active member portal.')
    await page.getByRole('button', { name: /submit application/i }).click()
    await expect(page.getByText(/application submitted successfully/i)).toBeVisible({ timeout: 15000 })

    const adminPage = await browser.newPage()
    await adminPage.goto(`${adminBaseURL}/login`)
    await adminPage.getByPlaceholder(/admin@example\.com/i).fill(adminEmail!)
    await adminPage.getByPlaceholder(/password/i).fill(adminPassword!)
    await adminPage.getByRole('button', { name: /sign in/i }).click()
    await expect(adminPage.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 15000 })

    await adminPage.getByRole('link', { name: /applications/i }).click()
    const row = adminPage.getByRole('row').filter({ hasText: memberEmail })
    await expect(row).toBeVisible({ timeout: 15000 })
    await row.getByLabel(/send invite email/i).uncheck()
    await row.getByPlaceholder(/temporary password/i).fill(memberPassword!)
    await row.getByRole('button', { name: /approve \+ account/i }).click()
    await expect(row.getByText(/approved_active/i)).toBeVisible({ timeout: 15000 })
    await adminPage.close()

    await page.goto('/en/login')
    await page.getByLabel(/email/i).fill(memberEmail)
    await page.getByLabel(/password/i).fill(memberPassword!)
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/en\/account/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /my account/i })).toBeVisible()
    await expect(page.getByText(memberEmail)).toBeVisible()
    await expect(page.getByText(/membership status/i)).toBeVisible()
    await expect(page.getByText(/active/i)).toBeVisible()
  })
})
