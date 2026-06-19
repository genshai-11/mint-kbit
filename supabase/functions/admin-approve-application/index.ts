import { handleOptions, json } from '../_shared/cors.ts'
import { requireAdmin } from '../_shared/supabase.ts'

type Body = {
  application_id?: string
  full_name?: string
  temp_password?: string
  send_invite?: boolean
  expires_at?: string | null
  review_notes?: string
}

function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

Deno.serve(async (req) => {
  const options = handleOptions(req)
  if (options) return options
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { admin, user } = await requireAdmin(req)
    const body = await req.json() as Body
    if (!body.application_id) return json({ error: 'application_id is required' }, 400)

    const { data: app, error: appError } = await admin
      .from('membership_applications')
      .select('*, membership_plans(duration_months,is_lifetime)')
      .eq('id', body.application_id)
      .single()
    if (appError) throw appError

    let authUserId: string | null = null
    const { data: userList, error: listError } = await admin.auth.admin.listUsers()
    if (listError) throw listError
    const existing = userList.users.find((u) => u.email?.toLowerCase() === app.applicant_email.toLowerCase())

    if (existing) {
      authUserId = existing.id
    } else if (body.send_invite !== false) {
      const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(app.applicant_email, {
        data: { full_name: body.full_name ?? app.applicant_name ?? '' },
      })
      if (inviteError) throw inviteError
      authUserId = invited.user?.id ?? null
    } else {
      const password = body.temp_password ?? crypto.randomUUID() + 'Aa1!'
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email: app.applicant_email,
        password,
        email_confirm: true,
        user_metadata: { full_name: body.full_name ?? app.applicant_name ?? '' },
      })
      if (createError) throw createError
      authUserId = created.user?.id ?? null
    }

    if (!authUserId) return json({ error: 'Unable to create or locate auth user' }, 500)

    const fullName = body.full_name ?? app.applicant_name ?? app.payload?.full_name ?? ''
    await admin.from('profiles').upsert({
      id: authUserId,
      email: app.applicant_email,
      full_name: fullName,
      phone: app.applicant_phone,
      role: 'member',
    })

    const plan = Array.isArray(app.membership_plans) ? app.membership_plans[0] : app.membership_plans
    const now = new Date()
    const expiresAt = body.expires_at ?? (plan?.is_lifetime ? null : plan?.duration_months ? addMonths(now, plan.duration_months).toISOString() : null)

    await admin.from('members').upsert({
      profile_id: authUserId,
      tier_id: app.tier_id,
      plan_id: app.plan_id,
      status: 'active',
      payment_status: 'paid',
      is_lifetime: Boolean(plan?.is_lifetime),
      joined_at: now.toISOString(),
      expires_at: expiresAt,
    })

    const { data: updated, error: updateError } = await admin
      .from('membership_applications')
      .update({
        status: 'approved_active',
        payment_status: 'paid',
        reviewed_by: user.id,
        reviewed_at: now.toISOString(),
        review_notes: body.review_notes ?? app.review_notes,
      })
      .eq('id', app.id)
      .select('id, status, payment_status, reviewed_at')
      .single()
    if (updateError) throw updateError

    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: 'admin.approve_application',
      target_table: 'membership_applications',
      target_id: app.id,
      meta: { member_id: authUserId, tier_id: app.tier_id, plan_id: app.plan_id },
    })

    return json({ application: updated, member_id: authUserId })
  } catch (error) {
    if (error instanceof Response) return error
    console.error(error)
    return json({ error: 'Unable to approve application' }, 500)
  }
})
