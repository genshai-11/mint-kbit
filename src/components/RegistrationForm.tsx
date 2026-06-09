import { useState } from 'react'
import { supabase, type MembershipTier } from '@/lib/supabase'
import type { Locale } from '@/lib/locale'
import s from './RegistrationForm.module.css'

const TIER_LABELS: Record<MembershipTier, string> = {
  standard:     'Standard Member — $300 / 6 months',
  professional: 'Professional Member — $700 / year',
  strategic:    'Strategic Partner — $1,000 / year',
}

interface Props {
  locale: Locale
  preselectedTier?: MembershipTier
}

type Step = 'form' | 'submitting' | 'success' | 'error'

export default function RegistrationForm({ preselectedTier }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name:       '',
    email:           '',
    phone:           '',
    organization:    '',
    role:            '',
    country:         '',
    membership_tier: preselectedTier ?? 'standard' as MembershipTier,
    message:         '',
  })

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStep('submitting')
    setError('')
    const { error: err } = await supabase.from('registration_requests').insert({
      full_name:       form.full_name.trim(),
      email:           form.email.trim().toLowerCase(),
      phone:           form.phone.trim() || null,
      organization:    form.organization.trim() || null,
      role:            form.role.trim() || null,
      country:         form.country.trim() || null,
      membership_tier: form.membership_tier,
      message:         form.message.trim() || null,
    })
    if (err) {
      setError(err.message)
      setStep('error')
    } else {
      setStep('success')
    }
  }

  if (step === 'success') {
    return (
      <div className={s.success}>
        <div className={s.successIcon}>✓</div>
        <h3>Registration Submitted!</h3>
        <p>
          Thank you, <strong>{form.full_name}</strong>. We received your application for
          <strong> {TIER_LABELS[form.membership_tier]}</strong>.
        </p>
        <p>Our team will review your application and contact you at <strong>{form.email}</strong> with payment instructions within 2–3 business days.</p>
      </div>
    )
  }

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <h3 className={s.formTitle}>Apply for Membership</h3>

      <div className={s.fieldGroup}>
        <label className={s.label}>Membership Tier <span>*</span></label>
        <div className={s.tierGrid}>
          {(Object.keys(TIER_LABELS) as MembershipTier[]).map(tier => (
            <label key={tier} className={`${s.tierOption} ${form.membership_tier === tier ? s.tierSelected : ''}`}>
              <input type="radio" name="tier" value={tier} checked={form.membership_tier === tier}
                onChange={() => set('membership_tier', tier)} />
              <span className={s.tierName}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
              <span className={s.tierPrice}>{TIER_LABELS[tier].split('—')[1]?.trim()}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={s.row}>
        <div className={s.field}>
          <label className={s.label} htmlFor="reg-name">Full Name <span>*</span></label>
          <input id="reg-name" className={s.input} type="text" required
            value={form.full_name} onChange={e => set('full_name', e.target.value)} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="reg-email">Email <span>*</span></label>
          <input id="reg-email" className={s.input} type="email" required
            value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>

      <div className={s.row}>
        <div className={s.field}>
          <label className={s.label} htmlFor="reg-phone">Phone</label>
          <input id="reg-phone" className={s.input} type="tel"
            value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="reg-country">Country</label>
          <input id="reg-country" className={s.input} type="text"
            value={form.country} onChange={e => set('country', e.target.value)} />
        </div>
      </div>

      <div className={s.row}>
        <div className={s.field}>
          <label className={s.label} htmlFor="reg-org">Organization / Clinic</label>
          <input id="reg-org" className={s.input} type="text"
            value={form.organization} onChange={e => set('organization', e.target.value)} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="reg-role">Your Role / Title</label>
          <input id="reg-role" className={s.input} type="text"
            value={form.role} onChange={e => set('role', e.target.value)} />
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="reg-message">Message (optional)</label>
        <textarea id="reg-message" className={s.textarea} rows={3}
          value={form.message} onChange={e => set('message', e.target.value)} />
      </div>

      {step === 'error' && <p className={s.errorMsg}>{error}</p>}

      <button type="submit" className={s.submitBtn} disabled={step === 'submitting'}>
        {step === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>

      <p className={s.note}>
        After submission, our team will verify your information and send you payment instructions within 2–3 business days.
      </p>
    </form>
  )
}
