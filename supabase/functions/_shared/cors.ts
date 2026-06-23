function allowedOrigins() {
  return (Deno.env.get('KBIT_ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function corsHeadersFor(req?: Request) {
  const configured = allowedOrigins()
  const requestOrigin = req?.headers.get('origin') ?? ''
  const allowOrigin = configured.length === 0
    ? '*'
    : configured.includes(requestOrigin)
      ? requestOrigin
      : configured[0]

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Vary': 'Origin',
  }
}

export const corsHeaders = corsHeadersFor()

export function json(data: unknown, status = 200, req?: Request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeadersFor(req), 'Content-Type': 'application/json' },
  })
}

export function handleOptions(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeadersFor(req) })
  return null
}
