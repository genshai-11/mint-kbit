import { functionUrl, requireSupabase } from '@/lib/supabase'

export type MembershipPlan = {
  id: string
  tier_id: string
  name: string
  duration_months: number | null
  price_amount: number
  price_currency: string
  is_lifetime: boolean
  sort_order: number
}

export type MembershipApplicationInput = {
  applicant_email: string
  applicant_name: string
  applicant_phone?: string
  tier_id: string
  plan_id?: string
  payload: Record<string, unknown>
}

export async function loadMembershipPlans(): Promise<MembershipPlan[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('membership_plans')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function submitMembershipApplication(input: MembershipApplicationInput) {
  const response = await fetch(functionUrl('submit-membership-application'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const json = await response.json()
  if (!response.ok) throw new Error(json.error ?? 'Unable to submit application')
  return json.application
}

export async function createDocumentSignedUrl(documentId: string, accessToken: string) {
  const response = await fetch(functionUrl('create-document-signed-url'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ document_id: documentId }),
  })
  const json = await response.json()
  if (!response.ok) throw new Error(json.error ?? 'Unable to create document link')
  return json as { url: string; title: string; expires_in: number }
}
