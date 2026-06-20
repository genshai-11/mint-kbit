import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Session, User } from '@supabase/supabase-js'
import { callFunction, uploadPrivateDocument } from './lib/api'
import { requireSupabase, supabase, supabaseConfigured } from './lib/supabase'

type Profile = { id: string; role: string; email: string | null; full_name: string | null }
type Application = { id: string; applicant_email: string; applicant_name: string | null; applicant_phone: string | null; tier_id: string; plan_id: string | null; status: string; payment_status: string; submitted_at: string; payload: Record<string, unknown> }
type Member = { profile_id: string; tier_id: string; plan_id: string | null; status: string; payment_status: string; expires_at: string | null; profiles?: { email: string | null; full_name: string | null } | null; tiers?: { name: string } | null; membership_plans?: { name: string } | null }
type Plan = { id: string; name: string; tier_id: string; price_amount: number; price_currency: string }
type DocumentRow = { id: string; title: string; category: string | null; required_tier_id: string; storage_path: string; published: boolean }

function one<T>(value: T | T[] | null | undefined): T | null { return Array.isArray(value) ? value[0] ?? null : value ?? null }

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) { setProfile(null); setLoading(false); return }
    let active = true
    ;(async () => {
      try {
        const { data, error } = await requireSupabase().from('profiles').select('id, role, email, full_name').eq('id', session.user.id).maybeSingle()
        if (error) throw error
        if (active) setProfile(data as Profile | null)
      } catch {
        if (active) setProfile(null)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [session])

  if (loading) return <Shell><div className="card">Loading admin...</div></Shell>
  if (!supabaseConfigured) return <Shell><div className="card error">Supabase env is not configured.</div></Shell>

  return (
    <Routes>
      <Route path="/login" element={session?.user && profile?.role === 'admin' ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={session?.user && profile?.role === 'admin' ? <AdminLayout user={session.user} profile={profile} /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

function Shell({ children }: { children: React.ReactNode }) { return <main className="shell">{children}</main> }

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [magic, setMagic] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setMessage('')
    try {
      if (magic) {
        const { error } = await requireSupabase().auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/` } })
        if (error) throw error
        setMessage('Check your email for the admin login link.')
      } else {
        const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password })
        if (error) throw error
        if (!data.session) throw new Error('Sign in did not return a session. Please try again.')
        navigate('/', { replace: true })
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in') }
  }

  return <Shell><section className="card login"><h1>KBIT Admin</h1><p>Admin access only.</p><form onSubmit={submit} className="form"><input type="email" required placeholder="admin@example.com" value={email} onChange={e=>setEmail(e.target.value)} />{!magic && <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />}<label className="check"><input type="checkbox" checked={magic} onChange={e=>setMagic(e.target.checked)} /> Send magic link</label>{error && <div className="error">{error}</div>}{message && <div className="success">{message}</div>}<button>Sign in</button></form></section></Shell>
}

function AdminLayout({ user, profile }: { user: User; profile: Profile }) {
  const location = useLocation()
  async function signOut() { await requireSupabase().auth.signOut(); window.location.href = '/login' }
  const nav = [['/', 'Dashboard'], ['/applications', 'Applications'], ['/members', 'Members'], ['/documents', 'Documents'], ['/plans', 'Plans']]
  return <div className="admin"><aside><h2>KBIT Admin</h2><p>{profile.email ?? user.email}</p><nav>{nav.map(([href,label]) => <Link className={location.pathname === href ? 'active' : ''} to={href} key={href}>{label}</Link>)}</nav><button className="ghost" onClick={signOut}>Sign out</button></aside><main><Routes><Route index element={<Dashboard />} /><Route path="applications" element={<Applications />} /><Route path="members" element={<Members />} /><Route path="documents" element={<Documents />} /><Route path="plans" element={<Plans />} /></Routes></main></div>
}

function Dashboard() {
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { callFunction<Record<string, number>>('admin-dashboard-metrics', undefined, 'GET').then(setMetrics).catch(e => setError(e.message)) }, [])
  return <Page title="Dashboard">{error && <div className="error">{error}</div>}<div className="metricGrid">{Object.entries(metrics ?? {}).map(([k,v]) => <div className="metric" key={k}><span>{k}</span><strong>{v}</strong></div>)}</div></Page>
}

function Applications() {
  const [items, setItems] = useState<Application[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [approvalOptions, setApprovalOptions] = useState<Record<string, { sendInvite: boolean; tempPassword: string }>>({})
  const [error, setError] = useState('')
  const load = async () => {
    const client = requireSupabase()
    const [apps, planRows] = await Promise.all([
      client.from('membership_applications').select('*').order('submitted_at', { ascending: false }),
      client.from('membership_plans').select('id,name,tier_id,price_amount,price_currency').order('sort_order'),
    ])
    if (apps.error) throw apps.error
    if (planRows.error) throw planRows.error
    setItems((apps.data ?? []) as Application[]); setPlans((planRows.data ?? []) as Plan[])
  }
  useEffect(() => { load().catch(e => setError(e.message)) }, [])
  async function approve(app: Application) {
    const options = approvalOptions[app.id] ?? { sendInvite: true, tempPassword: '' }
    try {
      await callFunction('admin-approve-application', {
        application_id: app.id,
        send_invite: options.sendInvite,
        temp_password: options.sendInvite ? undefined : options.tempPassword || undefined,
      })
      await load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Approve failed') }
  }
  function updateApproval(appId: string, next: Partial<{ sendInvite: boolean; tempPassword: string }>) {
    setApprovalOptions((current) => {
      const existing = current[appId] ?? { sendInvite: true, tempPassword: '' }
      return { ...current, [appId]: { ...existing, ...next } }
    })
  }
  return <Page title="Applications">{error && <div className="error">{error}</div>}<table><thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Account setup</th><th></th></tr></thead><tbody>{items.map(app => { const options = approvalOptions[app.id] ?? { sendInvite: true, tempPassword: '' }; return <tr key={app.id}><td>{app.applicant_name}</td><td>{app.applicant_email}</td><td>{plans.find(p=>p.id===app.plan_id)?.name ?? app.plan_id}</td><td>{app.status}</td><td><label className="inlineCheck"><input type="checkbox" checked={options.sendInvite} onChange={e=>updateApproval(app.id, { sendInvite: e.target.checked })} /> Send invite email</label>{!options.sendInvite && <input type="password" placeholder="Temporary password" value={options.tempPassword} onChange={e=>updateApproval(app.id, { tempPassword: e.target.value })} />}</td><td><button onClick={() => approve(app)} disabled={app.status === 'approved_active' || (!options.sendInvite && !options.tempPassword)}>Approve + account</button></td></tr> })}</tbody></table></Page>
}

function Members() {
  const [items, setItems] = useState<Member[]>([])
  const [error, setError] = useState('')
  const load = async () => {
    const { data, error } = await requireSupabase().from('members').select('*, profiles(email, full_name), tiers(name), membership_plans(name)').order('created_at', { ascending: false })
    if (error) throw error
    setItems((data ?? []) as Member[])
  }
  useEffect(() => { load().catch(e => setError(e.message)) }, [])
  async function setStatus(profile_id: string, status: string) {
    try { await callFunction('admin-update-member', { profile_id, status }); await load() } catch(e) { setError(e instanceof Error ? e.message : 'Update failed') }
  }
  return <Page title="Members">{error && <div className="error">{error}</div>}<table><thead><tr><th>Name</th><th>Email</th><th>Tier</th><th>Plan</th><th>Status</th><th></th></tr></thead><tbody>{items.map(m => <tr key={m.profile_id}><td>{one(m.profiles)?.full_name}</td><td>{one(m.profiles)?.email}</td><td>{one(m.tiers)?.name}</td><td>{one(m.membership_plans)?.name}</td><td>{m.status}</td><td><button onClick={()=>setStatus(m.profile_id, m.status === 'active' ? 'suspended' : 'active')}>{m.status === 'active' ? 'Suspend' : 'Activate'}</button></td></tr>)}</tbody></table></Page>
}

function Documents() {
  const [items, setItems] = useState<DocumentRow[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({ title: '', category: 'sop', required_tier_id: 'standard', description: '' })
  const [error, setError] = useState('')
  const load = async () => {
    const { data, error } = await requireSupabase().from('documents').select('id,title,category,required_tier_id,storage_path,published').order('created_at', { ascending: false })
    if (error) throw error
    setItems((data ?? []) as DocumentRow[])
  }
  useEffect(() => { load().catch(e => setError(e.message)) }, [])
  async function submit(e: FormEvent) {
    e.preventDefault(); setError('')
    try {
      if (!file) throw new Error('Choose a file')
      const storage_path = await uploadPrivateDocument(file, form.category)
      await callFunction('admin-upsert-document', { ...form, storage_path, published: true, tags: [] })
      setFile(null); setForm({ title: '', category: 'sop', required_tier_id: 'standard', description: '' }); await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') }
  }
  return <Page title="Documents">{error && <div className="error">{error}</div>}<form className="panel form" onSubmit={submit}><input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /><select value={form.required_tier_id} onChange={e=>setForm({...form,required_tier_id:e.target.value})}><option value="standard">Standard</option><option value="professional">Professional</option><option value="strategic">Strategic</option></select><input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} /><input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} required /><button>Upload + publish</button></form><table><thead><tr><th>Title</th><th>Category</th><th>Tier</th><th>Published</th></tr></thead><tbody>{items.map(d=><tr key={d.id}><td>{d.title}</td><td>{d.category}</td><td>{d.required_tier_id}</td><td>{String(d.published)}</td></tr>)}</tbody></table></Page>
}

function Plans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data, error } = await requireSupabase().from('membership_plans').select('id,name,tier_id,price_amount,price_currency').order('tier_id')
        if (error) throw error
        if (active) setPlans((data ?? []) as Plan[])
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Unable to load plans')
      }
    })()
    return () => { active = false }
  }, [])
  return <Page title="Plans / dynamic pricing">{error && <div className="error">{error}</div>}<p>Prices are stored in Supabase and can be extended with edit controls after first preview validation.</p><table><thead><tr><th>ID</th><th>Name</th><th>Tier</th><th>Price</th></tr></thead><tbody>{plans.map(p=><tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.tier_id}</td><td>{p.price_amount} {p.price_currency}</td></tr>)}</tbody></table></Page>
}

function Page({ title, children }: { title: string; children: React.ReactNode }) { return <section><header className="pageHead"><h1>{title}</h1></header>{children}</section> }
