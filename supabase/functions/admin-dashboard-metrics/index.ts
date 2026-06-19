import { handleOptions, json } from '../_shared/cors.ts'
import { requireAdmin } from '../_shared/supabase.ts'

async function count(admin: any, table: string, filters?: (query: any) => any) {
  let query = admin.from(table).select('*', { count: 'exact', head: true })
  if (filters) query = filters(query)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

Deno.serve(async (req) => {
  const options = handleOptions(req)
  if (options) return options
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  try {
    const { admin } = await requireAdmin(req)
    const [applications, pendingApplications, activeMembers, documents, publishedDocuments] = await Promise.all([
      count(admin, 'membership_applications'),
      count(admin, 'membership_applications', (q) => q.eq('status', 'submitted')),
      count(admin, 'members', (q) => q.eq('status', 'active')),
      count(admin, 'documents'),
      count(admin, 'documents', (q) => q.eq('published', true)),
    ])

    return json({ applications, pendingApplications, activeMembers, documents, publishedDocuments })
  } catch (error) {
    if (error instanceof Response) return error
    console.error(error)
    return json({ error: 'Unable to load metrics' }, 500)
  }
})
