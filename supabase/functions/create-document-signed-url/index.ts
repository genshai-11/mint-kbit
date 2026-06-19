import { handleOptions, json } from '../_shared/cors.ts'
import { adminClient, requireUser } from '../_shared/supabase.ts'

Deno.serve(async (req) => {
  const options = handleOptions(req)
  if (options) return options
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { user } = await requireUser(req)
    const body = await req.json() as { document_id?: string }
    if (!body.document_id) return json({ error: 'document_id is required' }, 400)

    const admin = adminClient()
    const { data: doc, error: docError } = await admin
      .from('documents')
      .select('id, title, storage_path, published, required_tier_id, required_plan_id, life_only, tiers!documents_required_tier_id_fkey(rank)')
      .eq('id', body.document_id)
      .single()
    if (docError) throw docError
    if (!doc.published) return json({ error: 'Document is not published' }, 403)

    const { data: member, error: memberError } = await admin
      .from('members')
      .select('profile_id, tier_id, plan_id, status, expires_at, is_lifetime, tiers(rank)')
      .eq('profile_id', user.id)
      .maybeSingle()
    if (memberError) throw memberError
    if (!member || member.status !== 'active') return json({ error: 'Active membership required' }, 403)

    const expired = !member.is_lifetime && member.expires_at && new Date(member.expires_at) <= new Date()
    if (expired) return json({ error: 'Membership expired' }, 403)

    const memberRank = Array.isArray(member.tiers) ? member.tiers[0]?.rank : member.tiers?.rank
    const requiredRank = Array.isArray(doc.tiers) ? doc.tiers[0]?.rank : doc.tiers?.rank
    if ((memberRank ?? 0) < (requiredRank ?? 999)) return json({ error: 'Higher membership tier required' }, 403)
    if (doc.required_plan_id && doc.required_plan_id !== member.plan_id) return json({ error: 'Different membership plan required' }, 403)
    if (doc.life_only && !member.is_lifetime) return json({ error: 'Life membership required' }, 403)

    const { data: signed, error: signError } = await admin.storage
      .from('member-documents')
      .createSignedUrl(doc.storage_path, 60)
    if (signError) throw signError

    await admin.from('document_downloads').insert({ document_id: doc.id, member_id: user.id })

    return json({ url: signed.signedUrl, expires_in: 60, title: doc.title })
  } catch (error) {
    if (error instanceof Response) return error
    console.error(error)
    return json({ error: 'Unable to create signed URL' }, 500)
  }
})
