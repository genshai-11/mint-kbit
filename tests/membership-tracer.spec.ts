import { expect, test } from '@playwright/test'

test('visitor can start a membership application from the public membership page', async ({ page }) => {
  await page.goto('/en/membership')

  await expect(page.getByRole('link', { name: /apply online/i })).toBeVisible()
  await page.getByRole('link', { name: /apply online/i }).click()

  await expect(page).toHaveURL(/\/en\/membership\/apply$/)
  await expect(page.getByRole('heading', { name: /apply for kbit membership/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /member login/i })).toBeVisible()

  const form = page.locator('form')
  await expect(form.getByText(/select plan/i)).toBeVisible()
  await expect(form.getByText(/applicant information/i)).toBeVisible()
  await expect(form.getByLabel(/full name/i)).toBeVisible()
  await expect(form.getByLabel(/email/i)).toBeVisible()
  await expect(form.getByLabel(/phone/i)).toBeVisible()
  await expect(form.getByLabel(/reason for joining/i)).toBeVisible()
  await expect(form.getByRole('button', { name: /submit application/i })).toBeVisible()
})
