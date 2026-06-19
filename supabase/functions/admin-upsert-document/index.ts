import { handleOptions, json } from '../_shared/cors.ts'
import { requireAdmin } from '../_shared/supabase.ts'

type Body = {
  id?: string
  title?: string
  description?: string | null
  category?: string | null
  required_tier_id?: string
  required_plan_id?: string | null
  life_only?: boolean
  storage_path?: string
  tags?: string[]
  published?: boolean
}

Deno.serve(async (req) => {
  const options = handleOptions(req)
  if (options) return options
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { admin, user } = await requireAdmin(req)
    const body = await req.json() as Body
    if (!body.title) return json({ error: 'title is required' }, 400)
    if (!body.required_tier_id) return json({ error: 'required_tier_id is required' }, 400)
    if (!body.storage_path) return json({ error: 'storage_path is required' }, 400)

    const row = {
      id: body.id,
      title: body.title,
      description: body.description ?? null,
      category: body.category ?? null,
      required_tier_id: body.required_tier_id,
      required_plan_id: body.required_plan_id ?? null,
      life_only: Boolean(body.life_only),
      storage_path: body.storage_path,
      tags: body.tags ?? [],
      published: Boolean(body.published),
      published_at: body.published ? new Date().toISOString() : null,
      created_by: user.id,
    }

    const { data, error } = await admin
      .from('documents')
      .upsert(row)
      .select('*, tiers(name), membership_plans(name)')
      .single()
    if (error) throw error

    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: body.id ? 'admin.update_document' : 'admin.create_document',
      target_table: 'documents',
      target_id: data.id,
      meta: { published: data.published, required_tier_id: data.required_tier_id },
    })

    return json({ document: data })
  } catch (error) {
    if (error instanceof Response) return error
    console.error(error)
    return json({ error: 'Unable to upsert document' }, 500)
  }
})
