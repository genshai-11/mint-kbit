import { functionUrl, requireSupabase } from './supabase'

export async function getAccessToken() {
  const { data } = await requireSupabase().auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Not authenticated')
  return token
}

export async function callFunction<T>(name: string, body?: unknown, method = 'POST'): Promise<T> {
  const token = await getAccessToken()
  const response = await fetch(functionUrl(name), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await response.json()
  if (!response.ok) throw new Error(json.error ?? `Function ${name} failed`)
  return json as T
}

export async function uploadPrivateDocument(file: File, category: string) {
  const upload = await callFunction<{ path: string; token: string; signed_url: string }>('admin-create-document-upload-url', {
    filename: file.name,
    category,
  })
  const { error } = await requireSupabase().storage.from('member-documents').uploadToSignedUrl(upload.path, upload.token, file)
  if (error) throw error
  return upload.path
}
