import { createClient } from 'jsr:@supabase/supabase-js@2'

export function adminClient() {
  const url = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceRoleKey) throw new Error('Missing Supabase service configuration')
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function userClient(req: Request) {
  const url = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!url || !anonKey) throw new Error('Missing Supabase anon configuration')
  return createClient(url, anonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function requireUser(req: Request) {
  const client = userClient(req)
  const { data, error } = await client.auth.getUser()
  if (error || !data.user) throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  return { client, user: data.user }
}

export async function requireAdmin(req: Request) {
  const { user } = await requireUser(req)
  const admin = adminClient()
  const { data, error } = await admin
    .from('profiles')
    .select('id, role, email')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error
  if (data?.role !== 'admin') {
    throw new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403 })
  }

  return { admin, user, profile: data }
}

export function safeStoragePath(input: string) {
  return input.replace(/^\/+/, '').replace(/\.\./g, '').replace(/[^a-zA-Z0-9/_.,=+@ -]/g, '-')
}
