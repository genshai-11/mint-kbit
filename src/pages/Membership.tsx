import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, ClipboardText, DownloadSimple, Heart, SealCheck, TrendUp, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import { localize, pages } from '@/lib/data'
import { useMembershipProgram } from '@/lib/content/membership'
import { isLocale, type Locale } from '@/lib/locale'
import { tr } from '@/lib/ui'
import s from './Membership.module.css'

const TYPE_ICONS = [Heart, UsersThree, TrendUp]

export default function Membership() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const page = pages.membership as {
    title: { en: string; vi?: string; ko?: string }
    intro: { en: string; vi?: string; ko?: string }
    pillars: Array<{
      icon: string
      title: { en: string; vi?: string; ko?: string }
      desc: { en: string; vi?: string; ko?: string }
    }>
  }

  const content = useMembershipProgram(locale)
  const types = content.membershipInfo?.types ?? []
  const benefits = content.benefits?.groups ?? []
  const requirements = content.requirements
  const feeTiers = content.fees?.tiers ?? []
  const forms = content.registrationForms?.forms ?? []

  return (
    <>
      <Nav />

      <PageHero
        watermark={tr('MEMBER', locale)}
        overline={tr('Professional Excellence Program', locale)}
        title={localize(page.title, locale)}
        desc={localize(page.intro, locale)}
        image="membership/banner1-abd0c28e.jpg"
        imageAlt="KBIT membership and professional training program"
      />

      <main className={s.pageShell}>
        <section className={s.indexBand} aria-label={tr('Membership sections', locale)}>
          <div className={`container ${s.indexGrid}`}>
            {['Structure', 'Benefits', 'Requirements', 'Fee', 'Forms'].map((item, index) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`${s.indexItem} reveal-soft`} style={{ animationDelay: `${index * 70}ms` }}>
                <span>0{index + 1}</span>
                <strong>{tr(item, locale)}</strong>
              </a>
            ))}
          </div>
        </section>

        <section id="structure" className={`${s.structureSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">{content.membershipInfo?.tab}</span>
                <h2 className="headline-display">{content.membershipInfo?.title}</h2>
              </div>
            </div>
            <div className={s.typeGrid}>
              {types.map((type: any, index: number) => {
                const Icon = TYPE_ICONS[index % TYPE_ICONS.length]
                return (
                  <article key={type.id} className={`${s.typeCard} motion-surface reveal`} style={{ animationDelay: `${index * 120}ms` }}>
                    <Icon size={30} weight="bold" className={s.cardIcon} aria-hidden="true" />
                    <span>{type.subtitle}</span>
                    <h3>{type.title}</h3>
                    <p>{type.description}</p>
                    <ul>
                      {type.highlights.map((item: string) => <li key={item}>{item}</li>)}
                    </ul>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="benefits" className={`${s.benefitsSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">{tr('Benefits', locale)}</span>
                <h2 className="headline-display">{content.benefits?.title}</h2>
              </div>
            </div>
            <div className={s.benefitStack}>
              {benefits.map((group: any, index: number) => (
                <article key={group.id} className={`${s.benefitCard} reveal-clip`} style={{ animationDelay: `${index * 120}ms` }}>
                  <div className={s.benefitHead}>
                    <SealCheck size={26} weight="bold" aria-hidden="true" />
                    <h3>{group.title}</h3>
                  </div>
                  <ul>
                    {group.items.map((item: string) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="requirements" className={`${s.requirementsSection} section`}>
          <div className="container">
            <div className={s.requirementsGrid}>
              <article className={`${s.requirementsMain} motion-surface reveal-soft`}>
                <div className="section-divider" />
                <span className="overline">{requirements?.tab}</span>
                <h2>{requirements?.general?.title}</h2>
                <p>{requirements?.general?.intro}</p>
                <div className={s.requirementList}>
                  {requirements?.general?.items?.map((item: any, index: number) => (
                    <div key={item.title} className={s.requirementItem}>
                      <span>{index + 1}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <ul>{item.points.map((point: string) => <li key={point}>{point}</li>)}</ul>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <aside className={s.stepsRail}>
                <div className={`${s.stepsCard} motion-surface reveal-clip`}>
                  <ClipboardText size={34} weight="bold" aria-hidden="true" />
                  <h3>{tr('How to register', locale)}</h3>
                  <ol>
                    {requirements?.steps?.map((step: string, index: number) => <li key={step}><span>{index + 1}</span>{step}</li>)}
                  </ol>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="fee" className={`${s.feeSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">{content.fees?.tab}</span>
                <h2 className="headline-display">{content.fees?.title}</h2>
              </div>
            </div>
            <div className={s.feeGrid}>
              {feeTiers.map((tier: any, index: number) => (
                <article key={tier.id} className={`${s.feeCard} motion-surface reveal`} style={{ animationDelay: `${index * 120}ms` }}>
                  <h3>{tier.name}</h3>
                  <p>{tier.audience}</p>
                  <div className={s.packageList}>
                    {tier.packages.map((pkg: any) => (
                      <div key={pkg.duration}>
                        <span>{pkg.duration}</span>
                        <strong>{pkg.price}</strong>
                      </div>
                    ))}
                  </div>
                  {tier.lifeBenefits && (
                    <ul className={s.lifeList}>
                      {tier.lifeBenefits.slice(0, 4).map((item: string) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </article>
              ))}
            </div>
            <div className={`${s.limitPolicy} reveal-soft`}>
              <strong>{content.fees?.limitPolicy?.title}</strong>
              <span>{content.fees?.limitPolicy?.releases?.join(' / ')}</span>
              <p>{content.fees?.limitPolicy?.note}</p>
            </div>
          </div>
        </section>

        <section id="forms" className={`${s.formsSection} section`}>
          <div className="container">
            <div className={s.formsFrame}>
              <div>
                <div className="section-divider" />
                <span className="overline">{content.registrationForms?.tab}</span>
                <h2>{content.registrationForms?.title}</h2>
                <p>{content.registrationForms?.description}</p>
              </div>
              <div className={s.formGrid}>
                {forms.map((form: any, index: number) => (
                  <a key={form.id} href={form.filePath} download className={`${s.formDownload} motion-surface reveal`} style={{ animationDelay: `${index * 120}ms` }}>
                    <DownloadSimple size={26} weight="bold" aria-hidden="true" />
                    <span>{form.title}</span>
                  </a>
                ))}
              </div>
              <div className={s.ctaActions}>
                <Link to={`/${locale}/membership/apply`} className={s.ctaPrimary}>
                  {tr('Apply online', locale)} <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </Link>
                <Link to={`/${locale}/login`} className={s.ctaSecondary}>
                  {tr('Member login', locale)}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
