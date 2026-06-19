import { handleOptions, json } from '../_shared/cors.ts'
import { requireAdmin, safeStoragePath } from '../_shared/supabase.ts'

Deno.serve(async (req) => {
  const options = handleOptions(req)
  if (options) return options
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { admin, user } = await requireAdmin(req)
    const body = await req.json() as { filename?: string; category?: string }
    if (!body.filename) return json({ error: 'filename is required' }, 400)

    const date = new Date().toISOString().slice(0, 10)
    const category = safeStoragePath(body.category ?? 'general')
    const filename = safeStoragePath(body.filename)
    const path = `${category}/${date}/${crypto.randomUUID()}-${filename}`

    const { data, error } = await admin.storage.from('member-documents').createSignedUploadUrl(path)
    if (error) throw error

    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: 'admin.create_document_upload_url',
      target_table: 'storage.objects',
      target_id: path,
      meta: { bucket: 'member-documents' },
    })

    return json({ path, token: data.token, signed_url: data.signedUrl })
  } catch (error) {
    if (error instanceof Response) return error
    console.error(error)
    return json({ error: 'Unable to create upload URL' }, 500)
  }
})
