import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { isLocale, type Locale } from '@/lib/locale'
import { loadMembershipPlans, submitMembershipApplication, type MembershipPlan } from '@/lib/membership-platform'
import { getMembershipFormProfile, text, type MembershipApplicationField } from '@/lib/membership-application-form-schema'
import { supabaseConfigured } from '@/lib/supabase'
import { tr } from '@/lib/ui'
import s from './MemberPortal.module.css'

type AnswerValue = string | string[]
type AnswerMap = Record<string, AnswerValue>

function scalar(answers: AnswerMap, key: string) {
  const value = answers[key]
  return typeof value === 'string' ? value : ''
}

function list(answers: AnswerMap, key: string) {
  const value = answers[key]
  return Array.isArray(value) ? value : []
}

function requiredFields(profileFields: MembershipApplicationField[]) {
  return profileFields.filter((field) => field.required && field.type !== 'attachment-note')
}

function serializeAnswers(answers: AnswerMap, fields: MembershipApplicationField[]) {
  const fieldKeys = new Set(fields.map((field) => field.key))
  const consents = Object.fromEntries(
    fields
      .filter((field) => field.type === 'consent')
      .map((field) => [field.key, scalar(answers, field.key) === 'accepted']),
  )

  return {
    fields: Object.fromEntries(Object.entries(answers).filter(([key]) => fieldKeys.has(key))),
    consents,
  }
}

export default function MembershipApply() {
  const location = useLocation()
  const locale: Locale = isLocale(location.pathname.split('/')[1]) ? location.pathname.split('/')[1] as Locale : 'en'
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState('')
  const [answers, setAnswers] = useState<AnswerMap>({})
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
  const profile = useMemo(() => getMembershipFormProfile(plan?.tier_id), [plan?.tier_id])
  const allFields = useMemo(() => profile.sections.flatMap((section) => section.fields), [profile])

  function setAnswer(key: string, value: AnswerValue) {
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  function toggleValue(key: string, value: string, maxSelections?: number) {
    setAnswers((current) => {
      const currentList = list(current, key)
      const isSelected = currentList.includes(value)
      if (!isSelected && maxSelections && currentList.length >= maxSelections) return current
      const next = isSelected
        ? currentList.filter((item) => item !== value)
        : [...currentList, value]
      return { ...current, [key]: next }
    })
  }

  function validate() {
    const missing = requiredFields(allFields).filter((field) => {
      const value = answers[field.key]
      return Array.isArray(value) ? value.length === 0 : !value
    })
    if (missing.length) {
      setError(`${tr('Please complete required fields:', locale)} ${missing.map((field) => text(field.label, locale)).join(', ')}`)
      return false
    }
    const overLimit = allFields.find((field) => field.type === 'checkbox-group' && field.maxSelections && list(answers, field.key).length > field.maxSelections)
    if (overLimit && overLimit.type === 'checkbox-group' && overLimit.maxSelections) {
      setError(`${text(overLimit.label, locale)}: ${locale === 'vi' ? 'chỉ chọn tối đa' : 'select up to'} ${overLimit.maxSelections}.`)
      return false
    }
    return true
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!plan) {
      setError(tr('Please select a membership plan.', locale))
      return
    }
    if (!validate()) return
    setLoading(true)
    try {
      const serialized = serializeAnswers(answers, allFields)
      const app = await submitMembershipApplication({
        applicant_email: scalar(answers, 'email'),
        applicant_name: scalar(answers, 'full_name'),
        applicant_phone: scalar(answers, 'phone'),
        tier_id: plan.tier_id,
        plan_id: plan.id,
        payload: {
          form_profile: profile.tierId,
          source_pdf_reference: profile.sourcePdf,
          selected_plan_id: plan.id,
          selected_plan_name: plan.name,
          selected_tier_id: plan.tier_id,
          locale,
          ...serialized,
          attachment_follow_up_required: Boolean(profile.attachmentNote),
        },
      })
      const emailStatus = app.email_status ? ` ${tr('Email status:', locale)} ${app.email_status}.` : ''
      setMessage(`${tr('Application submitted successfully.', locale)} #${app.id}.${emailStatus}`)
      setAnswers({})
    } catch (err) {
      setError(err instanceof Error ? err.message : tr('Unable to submit application.', locale))
    } finally {
      setLoading(false)
    }
  }

  function renderField(field: MembershipApplicationField) {
    const label = text(field.label, locale)
    const required = Boolean(field.required)
    const help = field.help ? text(field.help, locale) : ''

    if (field.type === 'attachment-note') {
      return (
        <div key={field.key} className={s.attachmentNote}>
          <strong>{label}</strong>
          <p>{text(field.accepted, locale)}</p>
        </div>
      )
    }

    if (field.type === 'consent') {
      return (
        <label key={field.key} className={s.consentField}>
          <input
            type="checkbox"
            required={required}
            checked={scalar(answers, field.key) === 'accepted'}
            onChange={(event) => setAnswer(field.key, event.target.checked ? 'accepted' : '')}
          />
          <span>{text(field.consentText, locale)}</span>
        </label>
      )
    }

    if (field.type === 'textarea') {
      return (
        <label key={field.key} className={s.full}>
          <span>{label}{required ? ' *' : ''}</span>
          <textarea required={required} rows={4} value={scalar(answers, field.key)} onChange={(event) => setAnswer(field.key, event.target.value)} />
          {help && <small>{help}</small>}
        </label>
      )
    }

    if (field.type === 'select') {
      return (
        <label key={field.key}>
          <span>{label}{required ? ' *' : ''}</span>
          <select required={required} value={scalar(answers, field.key)} onChange={(event) => setAnswer(field.key, event.target.value)}>
            <option value="">{tr('Select an option', locale)}</option>
            {field.options.map((option) => <option key={option.value} value={option.value}>{text(option.label, locale)}</option>)}
          </select>
          {help && <small>{help}</small>}
        </label>
      )
    }

    if (field.type === 'radio') {
      return (
        <fieldset key={field.key} className={s.choiceGroup}>
          <legend>{label}{required ? ' *' : ''}</legend>
          {field.options.map((option) => (
            <label key={option.value}>
              <input type="radio" name={field.key} required={required} checked={scalar(answers, field.key) === option.value} onChange={() => setAnswer(field.key, option.value)} />
              <span>{text(option.label, locale)}</span>
            </label>
          ))}
          {help && <small>{help}</small>}
        </fieldset>
      )
    }

    if (field.type === 'checkbox-group') {
      const selectedValues = list(answers, field.key)
      const maxReached = Boolean(field.maxSelections && selectedValues.length >= field.maxSelections)
      const maxHelp = field.maxSelections
        ? locale === 'vi'
          ? `Chọn tối đa ${field.maxSelections} mục.`
          : `Select up to ${field.maxSelections} items.`
        : ''
      return (
        <fieldset key={field.key} className={`${s.choiceGroup} ${s.full}`}>
          <legend>{label}{required ? ' *' : ''}</legend>
          {maxHelp && <small className={s.fieldHint}>{maxHelp}</small>}
          <div className={s.checkboxGrid}>
            {field.options.map((option) => {
              const selected = selectedValues.includes(option.value)
              return (
                <label key={option.value} className={!selected && maxReached ? s.disabledChoice : undefined}>
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={!selected && maxReached}
                    onChange={() => toggleValue(field.key, option.value, field.maxSelections)}
                  />
                  <span>{text(option.label, locale)}</span>
                </label>
              )
            })}
          </div>
          {help && <small>{help}</small>}
        </fieldset>
      )
    }

    return (
      <label key={field.key}>
        <span>{label}{required ? ' *' : ''}</span>
        <input type={field.type} required={required} value={scalar(answers, field.key)} onChange={(event) => setAnswer(field.key, event.target.value)} />
        {help && <small>{help}</small>}
      </label>
    )
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
          <aside className={s.formSidebar}>
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
              <h2>{text(profile.title, locale)}</h2>
              <p>{text(profile.description, locale)}</p>
              <small>{tr('Mapped from:', locale)} {profile.sourcePdf}</small>
              {profile.attachmentNote && <div className={s.noticeInline}>{text(profile.attachmentNote, locale)}</div>}
            </section>
          </aside>

          <section className={s.card}>
            <h2>{tr('Applicant information', locale)}</h2>
            <div className={s.formSections}>
              {profile.sections.map((section) => (
                <section key={section.id} className={s.formSection}>
                  <h3>{text(section.title, locale)}</h3>
                  <div className={s.form}>{section.fields.map(renderField)}</div>
                </section>
              ))}
            </div>
            <button className={s.primary} disabled={loading || !supabaseConfigured || !plan}>
              {loading ? tr('Submitting...', locale) : tr('Submit application', locale)}
            </button>
          </section>
        </form>
      </main>
      <Footer />
    </>
  )
}
