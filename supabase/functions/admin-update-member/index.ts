import { handleOptions, json } from '../_shared/cors.ts'
import { requireAdmin } from '../_shared/supabase.ts'

type Body = {
  profile_id?: string
  tier_id?: string
  plan_id?: string | null
  status?: 'pending' | 'active' | 'suspended' | 'expired'
  payment_status?: 'unpaid' | 'pending_confirmation' | 'paid' | 'waived' | 'refunded'
  expires_at?: string | null
  is_lifetime?: boolean
}

Deno.serve(async (req) => {
  const options = handleOptions(req)
  if (options) return options
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { admin, user } = await requireAdmin(req)
    const body = await req.json() as Body
    if (!body.profile_id) return json({ error: 'profile_id is required' }, 400)

    const patch: Record<string, unknown> = {}
    for (const key of ['tier_id', 'plan_id', 'status', 'payment_status', 'expires_at', 'is_lifetime'] as const) {
      if (key in body) patch[key] = body[key]
    }
    if (!Object.keys(patch).length) return json({ error: 'No member fields to update' }, 400)

    const { data, error } = await admin
      .from('members')
      .update(patch)
      .eq('profile_id', body.profile_id)
      .select('*, profiles(email, full_name), tiers(name), membership_plans(name, price_amount, price_currency)')
      .single()
    if (error) throw error

    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: 'admin.update_member',
      target_table: 'members',
      target_id: body.profile_id,
      meta: patch,
    })

    return json({ member: data })
  } catch (error) {
    if (error instanceof Response) return error
    console.error(error)
    return json({ error: 'Unable to update member' }, 500)
  }
})
