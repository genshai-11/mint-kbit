import { handleOptions, json } from '../_shared/cors.ts'
import { sendApplicationConfirmationEmail } from '../_shared/email.ts'
import { adminClient } from '../_shared/supabase.ts'

type ApplicationBody = {
  applicant_email?: string
  applicant_name?: string
  applicant_phone?: string
  tier_id?: string
  plan_id?: string
  payload?: Record<string, unknown>
}

Deno.serve(async (req) => {
  const options = handleOptions(req)
  if (options) return options
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, req)

  try {
    const body = await req.json() as ApplicationBody
    const email = String(body.applicant_email ?? '').trim().toLowerCase()
    const tierId = String(body.tier_id ?? '').trim()
    const planId = body.plan_id ? String(body.plan_id).trim() : null

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Valid email is required' }, 400, req)
    if (!tierId) return json({ error: 'tier_id is required' }, 400, req)

    const admin = adminClient()
    const { data: tier } = await admin.from('tiers').select('id').eq('id', tierId).maybeSingle()
    if (!tier) return json({ error: 'Unknown tier' }, 400, req)

    if (planId) {
      const { data: plan } = await admin
        .from('membership_plans')
        .select('id, tier_id, active')
        .eq('id', planId)
        .eq('tier_id', tierId)
        .eq('active', true)
        .maybeSingle()
      if (!plan) return json({ error: 'Unknown or inactive plan' }, 400, req)
    }

    const recentWindow = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { count: recentCount, error: recentError } = await admin
      .from('membership_applications')
      .select('id', { count: 'exact', head: true })
      .eq('applicant_email', email)
      .gte('submitted_at', recentWindow)
    if (recentError) throw recentError
    if ((recentCount ?? 0) >= 3) return json({ error: 'Too many recent applications. Please wait and try again.' }, 429, req)

    const payload = {
      ...(body.payload ?? {}),
      source: 'kbit_public_membership_application',
      submitted_user_agent: req.headers.get('user-agent') ?? null,
    }

    const { data, error } = await admin
      .from('membership_applications')
      .insert({
        applicant_email: email,
        applicant_name: body.applicant_name ? String(body.applicant_name).trim() : null,
        applicant_phone: body.applicant_phone ? String(body.applicant_phone).trim() : null,
        tier_id: tierId,
        plan_id: planId,
        payload,
        status: 'submitted',
        payment_status: 'unpaid',
      })
      .select('id, status, submitted_at, tier_id, plan_id, applicant_name, applicant_email')
      .single()

    if (error) throw error

    const emailStatus = await sendApplicationConfirmationEmail({
      to: data.applicant_email,
      applicantName: data.applicant_name,
      applicationId: data.id,
      tierId: data.tier_id,
      planId: data.plan_id,
      locale: typeof payload.locale === 'string' ? payload.locale : null,
    })

    return json({ application: { ...data, email_status: emailStatus } }, 200, req)
  } catch (error) {
    console.error(error)
    return json({ error: 'Unable to submit application' }, 500, req)
  }
})
