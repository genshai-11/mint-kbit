import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

function loadEnvFile(path) {
  if (!existsSync(path)) return {}
  const env = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const index = trimmed.indexOf('=')
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')
    env[key] = value
  }
  return env
}

const result = spawnSync('npx playwright test', {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, ...loadEnvFile('.env.e2e.local') },
})
process.exit(result.status ?? 1)
