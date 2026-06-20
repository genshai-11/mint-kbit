import { defineConfig } from '@playwright/test'

const publicBaseURL = process.env.E2E_PUBLIC_BASE_URL ?? 'http://127.0.0.1:4173'
const adminBaseURL = process.env.E2E_ADMIN_BASE_URL ?? 'http://127.0.0.1:4174'

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  use: {
    baseURL: publicBaseURL,
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
  webServer: [
    {
      command: 'npm run preview -- --host 127.0.0.1 --port 4173',
      url: `${publicBaseURL}/en/membership`,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'npm run admin:preview',
      url: `${adminBaseURL}/login`,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
})
