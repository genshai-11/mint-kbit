import { useLocation } from 'react-router-dom'
import { Buildings, ChatCenteredText, Clock, EnvelopeSimple, MapPinLine, PaperPlaneTilt, Phone, SealCheck, Sparkle } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import PageHero from '@/components/PageHero'
import { localize, pages } from '@/lib/data'
import { useSiteSettings } from '@/lib/content/site'
import { isLocale, type Locale } from '@/lib/locale'
import { tr } from '@/lib/ui'
import s from './Contact.module.css'

function getImgKey(path: string): string {
  return path.replace(/^(\.\/)?data\/assets\//, '')
}

function getIcon(name: string) {
  switch (name) {
    case 'clock': return Clock
    case 'building': return Buildings
    case 'message-circle': return ChatCenteredText
    default: return SealCheck
  }
}

export default function Contact() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  const settings = useSiteSettings()

  const contactPage = pages.contact as {
    title: { en: string; vi?: string; ko?: string }
    intro: { en: string; vi?: string; ko?: string }
    heroImage: string
    highlights: Array<{ icon: string; title: { en: string; vi?: string; ko?: string }; desc: { en: string; vi?: string; ko?: string } }>
    subjects: string[]
  }

  const heroImage = contactPage.heroImage.includes('[GAP]')
    ? 'placeholders/placeholder-contact-hero-a641dfdb.png'
    : getImgKey(contactPage.heroImage)

  const officeCards = (settings.offices as Array<any>).map((office: any) => ({
    label: localize(office.label, locale),
    address: localize(office.address, locale),
    hours: localize(office.hours, locale),
    contactPerson: office.contactPerson ? localize(office.contactPerson, locale) : '',
    phone: office.phone,
    email: tr(office.email, locale),
  }))

  const responseSteps = [
    tr('Inquiry received by the KBIT coordination team.', locale),
    tr('Membership, event, or partnership request is routed to the right office.', locale),
    tr('A coordinator follows up with the next action or required documents.', locale),
  ]

  return (
    <>
      <Nav />

      <PageHero
        watermark={tr('CONTACT', locale)}
        overline={tr('Support / Offices / Inquiry', locale)}
        title={localize(contactPage.title, locale)}
        desc={localize(contactPage.intro, locale)}
        image="news/news-le-van-thinh-hospital-korea-beauty-technology-association-kbit-sign-mou-for-beauty-te-7aed75b9.jpg"
        imageAlt="KBIT representatives during a medical aesthetic partnership signing"
      />

      <main>
        <section className={`${s.intro} section`}>
          <div className="container">
            <div className={s.introGrid}>
              <article className={`${s.highlightsCard} motion-surface reveal-soft`}>
                <div className="section-divider" />
                <span className="overline">{tr('Quick support channels', locale)}</span>
                <h2>{tr('Reach the right team', locale)}</h2>
                <div className={s.highlightsGrid}>
                  {contactPage.highlights.map((item, index) => {
                    const Icon = getIcon(item.icon)
                    return (
                      <div className={`${s.highlightItem} motion-surface`} key={index} style={{ animationDelay: `${index * 120}ms` }}>
                        <Icon size={26} weight="bold" className={s.highlightIcon} aria-hidden="true" />
                        <div>
                          <h3>{localize(item.title, locale)}</h3>
                          <p>{localize(item.desc, locale)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </article>

              <aside className={`${s.heroCard} motion-surface reveal-clip`}>
                <div className={s.heroImageWrap}>
                  <Img
                    src={heroImage}
                    alt={localize(contactPage.title, locale)}
                    className={s.heroImage}
                    loading="eager"
                    width={960}
                    height={720}
                  />
                </div>
                <div className={s.heroCardBody}>
                  <div className={s.heroCardTag}>{tr('Contact KBIT', locale)}</div>
                  <h2>{tr('We are always ready to listen and support you.', locale)}</h2>
                  <p>{tr('Use the contact form, email, or the office details below to reach the team most relevant to your need.', locale)}</p>
                  <div className={s.heroActions}>
                    <a href="#contact-form" className={s.primaryLink}>
                      {tr('Send inquiry', locale)} <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
                    </a>
                    <a href={`tel:${settings.contact.phoneVn}`} className={s.secondaryLink}>
                      {tr('Call Vietnam office', locale)} <Phone size={16} weight="bold" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="contact-form" className={`${s.formSection} section`}>
          <div className="container">
            <div className={s.formGrid}>
              <article className={`${s.formCard} motion-surface reveal-soft`} style={{ animationDelay: '60ms' }}>
                <div className="section-divider" />
                <span className="overline">{tr('Inquiry form', locale)}</span>
                <h2>{tr('Send a message', locale)}</h2>
                <form className={s.form}>
                  <div className={s.fieldGrid}>
                    <label className={s.field}>
                      <span>{tr('Name', locale)}</span>
                      <input type="text" placeholder={tr('Your full name', locale)} />
                    </label>
                    <label className={s.field}>
                      <span>{tr('Email', locale)}</span>
                      <input type="email" placeholder="name@clinic.com" />
                    </label>
                  </div>

                  <div className={s.fieldGrid}>
                    <label className={s.field}>
                      <span>{tr('Phone', locale)}</span>
                      <input type="tel" placeholder={tr('Phone number', locale)} />
                    </label>
                    <label className={s.field}>
                      <span>{tr('Subject', locale)}</span>
                      <select defaultValue="">
                        <option value="" disabled>{tr('Select a subject', locale)}</option>
                        {contactPage.subjects.map(subject => <option key={subject} value={subject}>{tr(subject, locale)}</option>)}
                      </select>
                    </label>
                  </div>

                  <label className={s.field}>
                    <span>{tr('Message', locale)}</span>
                    <textarea rows={7} placeholder={tr('Tell us what you need help with...', locale)} />
                  </label>

                  <div className={s.formActions}>
                    <button type="button" className={s.primaryLink}>
                      {tr('Submit inquiry', locale)} <PaperPlaneTilt size={16} weight="bold" aria-hidden="true" />
                    </button>
                    <span className={s.formNote}>{tr('This UI is ready for backend wiring.', locale)}</span>
                  </div>
                </form>
              </article>

              <aside className={s.sideRail}>
                <article className={`${s.responseCard} motion-surface reveal-clip`}>
                  <Sparkle size={28} weight="bold" className={s.responseIcon} aria-hidden="true" />
                  <div className={s.cardTag}>{tr('Response flow', locale)}</div>
                  <h3>{tr('What happens after you send it', locale)}</h3>
                  <ol>
                    {responseSteps.map((step, index) => (
                      <li key={step}><span>{index + 1}</span>{step}</li>
                    ))}
                  </ol>
                </article>

                <article className={`${s.contactCard} motion-surface`}>
                  <div className={s.cardTag}>{tr('Direct contact', locale)}</div>
                  <div className={s.contactRows}>
                    <div>
                      <span>{tr('Vietnam', locale)}</span>
                      <a href={`tel:${settings.contact.phoneVn}`}>{settings.contact.phoneVn}</a>
                    </div>
                    <div>
                      <span>{tr('Korea', locale)}</span>
                      <a href={`tel:${settings.contact.phoneKr}`}>{settings.contact.phoneKr}</a>
                    </div>
                    <div>
                      <span>{tr('Email', locale)}</span>
                      <strong>{tr(settings.contact.email, locale)}</strong>
                    </div>
                  </div>
                </article>

                <article className={`${s.contactCard} motion-surface`}>
                  <div className={s.cardTag}>{tr('Working hours', locale)}</div>
                  <div className={s.hoursList}>
                    <div><Clock size={16} weight="bold" aria-hidden="true" /> {tr('Monday - Sunday: 08:00 - 20:00', locale)}</div>
                    <div><MapPinLine size={16} weight="bold" aria-hidden="true" /> {tr('Korea + Vietnam office coverage', locale)}</div>
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>

        <section className={s.officesSection}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">{tr('Office locations', locale)}</span>
                <h2 className="headline-display">{tr('Reach us in person', locale)}</h2>
              </div>
            </div>

            <div className={s.officeGrid}>
              {officeCards.map((office, index) => (
                <article key={office.label} className={`${s.officeCard} motion-surface reveal`} style={{ animationDelay: `${index * 120}ms` }}>
                  <div className={s.officeCardHead}>
                    <div>
                      <div className={s.officeLabel}>{office.label}</div>
                      <h3>{office.address}</h3>
                    </div>
                    <Buildings size={28} weight="bold" className={s.officeIcon} aria-hidden="true" />
                  </div>
                  <div className={s.officeInfo}>
                    <div>
                      <span>{tr('Hours', locale)}</span>
                      <strong>{office.hours}</strong>
                    </div>
                    <div>
                      <span>{tr('Phone', locale)}</span>
                      <strong>{office.phone}</strong>
                    </div>
                    <div>
                      <span>{tr('Email', locale)}</span>
                      <strong>{office.email}</strong>
                    </div>
                    {office.contactPerson && (
                      <div>
                        <span>{tr('Contact person', locale)}</span>
                        <strong>{office.contactPerson}</strong>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
