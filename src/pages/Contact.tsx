import { useLocation } from 'react-router-dom'
import { Buildings, ChatCenteredText, Clock, EnvelopeSimple, MapPinLine, PaperPlaneTilt, Phone, SealCheck, Sparkle } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import PageHero from '@/components/PageHero'
import { localize, pages } from '@/lib/data'
import { useSiteSettings } from '@/lib/content/site'
import { isLocale, type Locale } from '@/lib/locale'
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
    email: office.email,
  }))

  const responseSteps = [
    'Inquiry received by the KBIT coordination team.',
    'Membership, event, or partnership request is routed to the right office.',
    'A coordinator follows up with the next action or required documents.',
  ]

  return (
    <>
      <Nav />

      <PageHero
        watermark="CONTACT"
        overline="Support / Offices / Inquiry"
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
                <span className="overline">Quick support channels</span>
                <h2>Reach the right team</h2>
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
                  <div className={s.heroCardTag}>Contact KBIT</div>
                  <h2>We are always ready to listen and support you.</h2>
                  <p>
                    Use the contact form, email, or the office details below to reach the team most relevant to your need.
                  </p>
                  <div className={s.heroActions}>
                    <a href="#contact-form" className={s.primaryLink}>
                      Send inquiry <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
                    </a>
                    <a href={`tel:${settings.contact.phoneVn}`} className={s.secondaryLink}>
                      Call Vietnam office <Phone size={16} weight="bold" aria-hidden="true" />
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
                <span className="overline">Inquiry form</span>
                <h2>Send a message</h2>
                <form className={s.form}>
                  <div className={s.fieldGrid}>
                    <label className={s.field}>
                      <span>Name</span>
                      <input type="text" placeholder="Your full name" />
                    </label>
                    <label className={s.field}>
                      <span>Email</span>
                      <input type="email" placeholder="name@clinic.com" />
                    </label>
                  </div>

                  <div className={s.fieldGrid}>
                    <label className={s.field}>
                      <span>Phone</span>
                      <input type="tel" placeholder="Phone number" />
                    </label>
                    <label className={s.field}>
                      <span>Subject</span>
                      <select defaultValue="">
                        <option value="" disabled>Select a subject</option>
                        {contactPage.subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                      </select>
                    </label>
                  </div>

                  <label className={s.field}>
                    <span>Message</span>
                    <textarea rows={7} placeholder="Tell us what you need help with..." />
                  </label>

                  <div className={s.formActions}>
                    <button type="button" className={s.primaryLink}>
                      Submit inquiry <PaperPlaneTilt size={16} weight="bold" aria-hidden="true" />
                    </button>
                    <span className={s.formNote}>This UI is ready for backend wiring.</span>
                  </div>
                </form>
              </article>

              <aside className={s.sideRail}>
                <article className={`${s.responseCard} motion-surface reveal-clip`}>
                  <Sparkle size={28} weight="bold" className={s.responseIcon} aria-hidden="true" />
                  <div className={s.cardTag}>Response flow</div>
                  <h3>What happens after you send it</h3>
                  <ol>
                    {responseSteps.map((step, index) => (
                      <li key={step}><span>{index + 1}</span>{step}</li>
                    ))}
                  </ol>
                </article>

                <article className={`${s.contactCard} motion-surface`}>
                  <div className={s.cardTag}>Direct contact</div>
                  <div className={s.contactRows}>
                    <div>
                      <span>Vietnam</span>
                      <a href={`tel:${settings.contact.phoneVn}`}>{settings.contact.phoneVn}</a>
                    </div>
                    <div>
                      <span>Korea</span>
                      <a href={`tel:${settings.contact.phoneKr}`}>{settings.contact.phoneKr}</a>
                    </div>
                    <div>
                      <span>Email</span>
                      <strong>{settings.contact.email}</strong>
                    </div>
                  </div>
                </article>

                <article className={`${s.contactCard} motion-surface`}>
                  <div className={s.cardTag}>Working hours</div>
                  <div className={s.hoursList}>
                    <div><Clock size={16} weight="bold" aria-hidden="true" /> Monday - Sunday: 08:00 - 20:00</div>
                    <div><MapPinLine size={16} weight="bold" aria-hidden="true" /> Korea + Vietnam office coverage</div>
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
                <span className="overline">Office locations</span>
                <h2 className="headline-display">Reach us in person</h2>
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
                      <span>Hours</span>
                      <strong>{office.hours}</strong>
                    </div>
                    <div>
                      <span>Phone</span>
                      <strong>{office.phone}</strong>
                    </div>
                    <div>
                      <span>Email</span>
                      <strong>{office.email}</strong>
                    </div>
                    {office.contactPerson && (
                      <div>
                        <span>Contact person</span>
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
