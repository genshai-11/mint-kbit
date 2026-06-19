import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { isLocale, type Locale } from '@/lib/locale'
import { loadMembershipPlans, submitMembershipApplication, type MembershipPlan } from '@/lib/membership-platform'
import { supabaseConfigured } from '@/lib/supabase'
import { tr } from '@/lib/ui'
import s from './MemberPortal.module.css'

export default function MembershipApply() {
  const location = useLocation()
  const locale: Locale = isLocale(location.pathname.split('/')[1]) ? location.pathname.split('/')[1] as Locale : 'en'
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', city: '', organization: '', specialty: '', reason: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabaseConfigured) return
    loadMembershipPlans().then((loaded) => {
      setPlans(loaded)
      setSelectedPlan(loaded[0]?.id ?? '')
    }).catch((err) => setError(err instanceof Error ? err.message : tr('Unable to load membership plans.', locale)))
  }, [locale])

  const plan = useMemo(() => plans.find((item) => item.id === selectedPlan), [plans, selectedPlan])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!plan) {
      setError(tr('Please select a membership plan.', locale))
      return
    }
    setLoading(true)
    try {
      const app = await submitMembershipApplication({
        applicant_email: form.email,
        applicant_name: form.fullName,
        applicant_phone: form.phone,
        tier_id: plan.tier_id,
        plan_id: plan.id,
        payload: {
          full_name: form.fullName,
          city: form.city,
          organization: form.organization,
          specialty: form.specialty,
          reason: form.reason,
          locale,
          consent_terms: true,
        },
      })
      setMessage(`${tr('Application submitted successfully.', locale)} #${app.id}`)
      setForm({ fullName: '', email: '', phone: '', city: '', organization: '', specialty: '', reason: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : tr('Unable to submit application.', locale))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main className={s.shellWide}>
        <section className={s.headerCard}>
          <div>
            <p className="overline">{tr('Online membership application', locale)}</p>
            <h1>{tr('Apply for KBIT membership', locale)}</h1>
            <p>{tr('Submit your application online. KBIT staff will contact you to confirm payment and create your member account.', locale)}</p>
          </div>
          <Link to={`/${locale}/login`} className={s.secondaryButton}>{tr('Member login', locale)}</Link>
        </section>

        {!supabaseConfigured && <div className={s.notice}>{tr('Online application is not configured yet.', locale)}</div>}
        {error && <div className={s.error}>{error}</div>}
        {message && <div className={s.success}>{message}</div>}

        <form className={s.applyGrid} onSubmit={submit}>
          <section className={s.card}>
            <h2>{tr('Select plan', locale)}</h2>
            <div className={s.planGrid}>
              {plans.map((item) => (
                <label key={item.id} className={`${s.planCard} ${selectedPlan === item.id ? s.selectedPlan : ''}`}>
                  <input type="radio" name="plan" checked={selectedPlan === item.id} onChange={() => setSelectedPlan(item.id)} />
                  <strong>{item.name}</strong>
                  <span>{item.price_amount.toLocaleString()} {item.price_currency}</span>
                  <small>{item.is_lifetime ? tr('Lifetime', locale) : `${item.duration_months} ${tr('months', locale)}`}</small>
                </label>
              ))}
            </div>
          </section>

          <section className={s.card}>
            <h2>{tr('Applicant information', locale)}</h2>
            <div className={s.form}>
              <label><span>{tr('Full name', locale)}</span><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
              <label><span>{tr('Email', locale)}</span><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label><span>{tr('Phone', locale)}</span><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label><span>{tr('City / Country', locale)}</span><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
              <label><span>{tr('Clinic / organization', locale)}</span><input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></label>
              <label><span>{tr('Specialty / role', locale)}</span><input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></label>
              <label className={s.full}><span>{tr('Reason for joining', locale)}</span><textarea required rows={6} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></label>
              <button className={s.primary} disabled={loading || !supabaseConfigured}>{loading ? tr('Submitting...', locale) : tr('Submit application', locale)}</button>
            </div>
          </section>
        </form>
      </main>
      <Footer />
    </>
  )
}
