type ApplicationEmailInput = {
  to: string
  applicantName?: string | null
  applicationId: string
  tierId: string
  planId?: string | null
  locale?: string | null
}

type EmailResult = 'sent' | 'not_configured' | 'failed'

function env(name: string) {
  return Deno.env.get(name)?.trim() || ''
}

function paymentInstructions(locale?: string | null) {
  if (locale === 'vi') {
    return env('KBIT_PAYMENT_INSTRUCTIONS_VI') || 'KBIT sẽ xác nhận hồ sơ và gửi thông tin thanh toán qua email hoặc Zalo.'
  }
  return env('KBIT_PAYMENT_INSTRUCTIONS_EN') || 'KBIT will confirm your application and send final payment details by email or Zalo.'
}

function buildConfirmationEmail(input: ApplicationEmailInput) {
  const isVi = input.locale === 'vi'
  const subject = isVi
    ? `KBIT đã nhận hồ sơ hội viên #${input.applicationId}`
    : `KBIT membership application received #${input.applicationId}`
  const greeting = input.applicantName ? (isVi ? `Xin chào ${input.applicantName},` : `Hello ${input.applicantName},`) : (isVi ? 'Xin chào,' : 'Hello,')
  const intro = isVi
    ? 'KBIT đã nhận hồ sơ đăng ký hội viên online của bạn.'
    : 'KBIT has received your online membership application.'
  const next = isVi
    ? 'Đội ngũ KBIT sẽ kiểm tra hồ sơ, xác nhận hạng hội viên/gói đăng ký và liên hệ để hoàn tất thanh toán.'
    : 'The KBIT team will review your application, confirm your membership tier/plan, and contact you to complete payment.'
  const instructions = paymentInstructions(input.locale)
  const contact = isVi
    ? 'Nếu cần hỗ trợ, vui lòng phản hồi email này hoặc liên hệ đội ngũ KBIT qua Zalo/số điện thoại hỗ trợ.'
    : 'For support, reply to this email or contact the KBIT team by Zalo/phone support.'

  const text = [
    greeting,
    '',
    intro,
    '',
    `Application ID: ${input.applicationId}`,
    `Tier: ${input.tierId}`,
    input.planId ? `Plan: ${input.planId}` : '',
    '',
    next,
    '',
    instructions,
    '',
    contact,
    '',
    'KBIT Membership Team',
  ].filter(Boolean).join('\n')

  const html = text
    .split('\n')
    .map((line) => line ? `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : '<br />')
    .join('')

  return { subject, text, html }
}

export async function sendApplicationConfirmationEmail(input: ApplicationEmailInput): Promise<EmailResult> {
  const provider = env('KBIT_EMAIL_PROVIDER')
  const from = env('KBIT_EMAIL_FROM')
  const replyTo = env('KBIT_EMAIL_REPLY_TO') || from

  if (!provider || !from) return 'not_configured'

  if (provider !== 'resend') {
    console.warn(`Unsupported KBIT_EMAIL_PROVIDER: ${provider}`)
    return 'not_configured'
  }

  const apiKey = env('RESEND_API_KEY')
  if (!apiKey) return 'not_configured'

  const email = buildConfirmationEmail(input)
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: input.to,
        reply_to: replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
    })

    if (!response.ok) {
      console.error('KBIT confirmation email failed', await response.text())
      return 'failed'
    }
    return 'sent'
  } catch (error) {
    console.error('KBIT confirmation email error', error)
    return 'failed'
  }
}
