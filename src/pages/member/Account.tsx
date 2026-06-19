import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth/AuthProvider'
import { isLocale, type Locale } from '@/lib/locale'
import { createDocumentSignedUrl } from '@/lib/membership-platform'
import { requireSupabase, supabaseConfigured } from '@/lib/supabase'
import { tr } from '@/lib/ui'
import s from './MemberPortal.module.css'

type MemberRow = {
  status: string
  expires_at: string | null
  is_lifetime: boolean
  tiers?: { name: string } | { name: string }[] | null
  membership_plans?: { name: string; price_amount: number; price_currency: string } | { name: string; price_amount: number; price_currency: string }[] | null
}

type DocumentRow = { id: string; title: string; description: string | null; category: string | null; tags: string[] }

function one<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export default function Account() {
  const location = useLocation()
  const navigate = useNavigate()
  const locale: Locale = isLocale(location.pathname.split('/')[1]) ? location.pathname.split('/')[1] as Locale : 'en'
  const { user, session, loading: authLoading, signOut } = useAuth()
  const [member, setMember] = useState<MemberRow | null>(null)
  const [documents, setDocuments] = useState<DocumentRow[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate(`/${locale}/login`, { replace: true })
      return
    }
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    const supabase = requireSupabase()
    Promise.all([
      supabase.from('members').select('status, expires_at, is_lifetime, tiers(name), membership_plans(name, price_amount, price_currency)').eq('profile_id', user.id).maybeSingle(),
      supabase.from('documents').select('id, title, description, category, tags').eq('published', true).order('published_at', { ascending: false }),
    ]).then(([memberResult, documentsResult]) => {
      if (memberResult.error) throw memberResult.error
      if (documentsResult.error) throw documentsResult.error
      setMember(memberResult.data as MemberRow | null)
      setDocuments((documentsResult.data ?? []) as DocumentRow[])
    }).catch((err) => {
      setError(err instanceof Error ? err.message : tr('Unable to load member account.', locale))
    }).finally(() => setLoading(false))
  }, [authLoading, user, navigate, locale])

  async function download(doc: DocumentRow) {
    if (!session?.access_token) return
    try {
      const signed = await createDocumentSignedUrl(doc.id, session.access_token)
      window.open(signed.url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err instanceof Error ? err.message : tr('Unable to open document.', locale))
    }
  }

  return (
    <>
      <Nav />
      <main className={s.shellWide}>
        <section className={s.headerCard}>
          <div>
            <p className="overline">{tr('Member portal', locale)}</p>
            <h1>{tr('My account', locale)}</h1>
            <p>{user?.email}</p>
          </div>
          <button className={s.secondaryButton} onClick={() => signOut()}>{tr('Sign out', locale)}</button>
        </section>

        {!supabaseConfigured && <div className={s.notice}>{tr('Member portal is not configured yet.', locale)}</div>}
        {loading && <div className={s.card}>{tr('Loading...', locale)}</div>}
        {error && <div className={s.error}>{error}</div>}

        {!loading && !member && (
          <section className={s.card}>
            <h2>{tr('No active membership found', locale)}</h2>
            <p>{tr('If you already applied, KBIT staff will contact you after payment confirmation and account creation.', locale)}</p>
            <Link to={`/${locale}/membership/apply`} className={s.primaryLink}>{tr('Apply for membership', locale)}</Link>
          </section>
        )}

        {member && (
          <section className={s.grid}>
            <article className={s.card}>
              <h2>{tr('Membership status', locale)}</h2>
              <dl className={s.details}>
                <div><dt>{tr('Tier', locale)}</dt><dd>{one(member.tiers)?.name ?? '-'}</dd></div>
                <div><dt>{tr('Plan', locale)}</dt><dd>{one(member.membership_plans)?.name ?? '-'}</dd></div>
                <div><dt>{tr('Status', locale)}</dt><dd>{member.status}</dd></div>
                <div><dt>{tr('Expiry', locale)}</dt><dd>{member.is_lifetime ? tr('Lifetime', locale) : member.expires_at ? new Date(member.expires_at).toLocaleDateString() : '-'}</dd></div>
              </dl>
            </article>
            <article className={s.card}>
              <h2>{tr('Member documents', locale)}</h2>
              {documents.length === 0 ? <p>{tr('No documents are available for your membership yet.', locale)}</p> : (
                <div className={s.documentList}>
                  {documents.map((doc) => (
                    <div key={doc.id} className={s.documentItem}>
                      <div>
                        <strong>{doc.title}</strong>
                        {doc.description && <p>{doc.description}</p>}
                      </div>
                      <button className={s.secondaryButton} onClick={() => download(doc)}>{tr('Download', locale)}</button>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
