import type { Locale } from '@/lib/locale'

type LocalizedText = { en: string; vi: string; ko?: string }

type BaseField = {
  key: string
  label: LocalizedText
  required?: boolean
  help?: LocalizedText
}

export type MembershipApplicationField = BaseField & (
  | { type: 'text' | 'email' | 'tel' | 'date' | 'textarea' }
  | { type: 'select' | 'radio' | 'checkbox-group'; maxSelections?: number; options: Array<{ value: string; label: LocalizedText }> }
  | { type: 'consent'; consentText: LocalizedText }
  | { type: 'attachment-note'; accepted: LocalizedText }
)

export type MembershipFormProfile = {
  tierId: 'standard' | 'professional' | 'strategic'
  sourcePdf: string
  title: LocalizedText
  description: LocalizedText
  attachmentNote?: LocalizedText
  sections: Array<{
    id: string
    title: LocalizedText
    fields: MembershipApplicationField[]
  }>
}

export function text(value: LocalizedText, locale: Locale) {
  return value[locale] ?? value.en
}

const yesNo = [
  { value: 'yes', label: { en: 'Yes', vi: 'Có', ko: 'Yes' } },
  { value: 'no', label: { en: 'No', vi: 'Không', ko: 'No' } },
]

const referralSources = [
  { value: 'event_workshop', label: { en: 'Event / Workshop', vi: 'Sự kiện / Workshop', ko: 'Event / Workshop' } },
  { value: 'referral', label: { en: 'Referral', vi: 'Người quen / bác sĩ / đối tác giới thiệu', ko: 'Referral' } },
  { value: 'social', label: { en: 'Social media', vi: 'Mạng xã hội', ko: 'Social media' } },
  { value: 'partner_supplier', label: { en: 'Partner / supplier', vi: 'Đối tác / Nhà cung cấp', ko: 'Partner / supplier' } },
  { value: 'other', label: { en: 'Other', vi: 'Khác', ko: 'Other' } },
]

const standardGoals = [
  { value: 'new_technology', label: { en: 'Update trends and new aesthetic technology', vi: 'Cập nhật xu hướng – học thuật công nghệ mới', ko: 'Update trends and new aesthetic technology' } },
  { value: 'expert_brand_network', label: { en: 'Connect with experts and major brands', vi: 'Kết nối với các chuyên gia và thương hiệu lớn', ko: 'Connect with experts and major brands' } },
  { value: 'business_growth', label: { en: 'Cooperate or grow a business model', vi: 'Hợp tác hoặc phát triển mô hình kinh doanh', ko: 'Cooperate or grow a business model' } },
  { value: 'future_partner', label: { en: 'Become a future strategic partner', vi: 'Mong muốn trở thành đối tác chiến lược trong tương lai', ko: 'Become a future strategic partner' } },
]

const standardInterests = [
  'Acne / PIH / scar treatment|Điều trị mụn – thâm – sẹo',
  'Melasma / hyperpigmentation|Trị nám – tăng sắc tố',
  'Peel / skin recovery|Peel da – Tái tạo phục hồi',
  'Botox / Filler / Skinbotox|Botox – Filler – Skinbotox',
  'RF / HIFU / Plasma / Laser|RF – HIFU – Plasma – Laser',
  'Thread lifting|Căng chỉ nâng cơ',
  'Skinbooster & Mesotherapy|Skinbooster & Mesotherapy',
  'Plastic surgery support|Phẫu thuật thẩm mỹ',
  'Training and technology consulting|Đào tạo chuyên môn & tư vấn công nghệ',
  'Spa / clinic expansion|Mở rộng mô hình spa / clinic',
  'Other|Khác',
].map((item) => {
  const [en, vi] = item.split('|')
  return { value: en.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), label: { en, vi, ko: en } }
})

const professionalInterests = [
  'Skinbooster / Exosome / Mesotherapy|Skinbooster / Exosome / Mesotherapy',
  'Botox / Filler / Skinbotox|Botox / Filler / Skinbotox',
  'Non-invasive rejuvenation and lifting|Trẻ hóa – nâng cơ không xâm lấn',
  'Thread lifting / restructuring|Căng chỉ nội khoa – Nâng cơ – Tái cấu trúc',
  'Laser treatment|Laser điều trị',
  'Hair transplant|Cấy tóc',
  'Melasma / resistant pigmentation|Điều trị nám / tăng sắc tố sâu / melasma kháng trị',
  'Post-procedure skin recovery|Phục hồi da sau tổn thương',
  'Aging skin / deep wrinkles / sagging|Da lão hóa – nhăn sâu – chảy xệ',
  'Dark circles / eye bags|Trị thâm mắt / bọng mỡ mắt',
  'Acne scars / inflamed acne / pores|Điều trị sẹo rỗ, mụn viêm, lỗ chân lông to',
  'Hair loss treatment|Điều trị rụng tóc',
  'Blepharoplasty / rhinoplasty / facelift|Phẫu thuật mắt / mũi / căng da mặt',
  'Liposuction / breast augmentation / body contouring|Hút mỡ – nâng ngực – body contouring',
  'Jaw correction / facial contouring|Chỉnh hàm – tạo hình khuôn mặt',
  'Academic training / mentoring|Đào tạo học thuật – mentoring',
  'Clinic model / operations / technology transfer|Xây dựng mô hình clinic – quản lý vận hành – chuyển giao',
  'Cell technology / regenerative medicine|Nghiên cứu công nghệ tế bào / y học tái tạo',
].map((item) => {
  const [en, vi] = item.split('|')
  return { value: en.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), label: { en, vi, ko: en } }
})

const strategicCooperation = [
  'Specialized workshops / international seminars|Tổ chức workshop chuyên sâu / hội thảo quốc tế',
  'High-tech treatment model franchising|Nhượng quyền mô hình điều trị công nghệ cao',
  'Training / mentoring / team coaching|Đào tạo – mentoring – huấn luyện đội ngũ',
  'Exclusive product / technology transfer|Chuyển giao độc quyền sản phẩm / công nghệ',
  'Personal brand and clinic system design|Thiết kế thương hiệu cá nhân & hệ thống clinic',
  'Connect with Korean doctors / experts / institutes|Kết nối bác sĩ / chuyên gia / viện nghiên cứu Hàn Quốc',
  'Academic marketing and branding|Marketing & xây dựng thương hiệu học thuật',
  'Other|Khác',
].map((item) => {
  const [en, vi] = item.split('|')
  return { value: en.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), label: { en, vi, ko: en } }
})

const profileFields: MembershipApplicationField[] = [
  { key: 'full_name', type: 'text', required: true, label: { en: 'Full name', vi: 'Họ và tên', ko: 'Full name' } },
  { key: 'email', type: 'email', required: true, label: { en: 'Email', vi: 'Email', ko: 'Email' } },
  { key: 'phone', type: 'tel', required: true, label: { en: 'Phone number', vi: 'Số điện thoại', ko: 'Phone number' } },
]

const additionalNotesField: MembershipApplicationField = {
  key: 'reason_for_joining',
  type: 'textarea',
  required: true,
  label: { en: 'Reason for joining', vi: 'Lý do tham gia / ghi chú thêm', ko: 'Reason for joining' },
}

const consentField: MembershipApplicationField = {
  key: 'consent_terms',
  type: 'consent',
  required: true,
  label: { en: 'KBIT terms agreement', vi: 'Cam kết & tuân thủ quy định', ko: 'KBIT terms agreement' },
  consentText: {
    en: 'I confirm the information is accurate, agree to follow KBIT member rules, respect academic material confidentiality, and consent to receive KBIT activity and cooperation updates by email/Zalo.',
    vi: 'Tôi xác nhận thông tin là chính xác, đồng ý tuân thủ quy định hội viên KBIT, bảo mật tài liệu học thuật và đồng ý nhận thông báo hoạt động/cơ hội hợp tác qua Email/Zalo.',
    ko: 'I confirm the information is accurate and agree to KBIT member rules.',
  },
}

export const membershipFormProfiles: MembershipFormProfile[] = [
  {
    tierId: 'standard',
    sourcePdf: 'Form-STANDARD-MEMBER.pdf',
    title: { en: 'Standard Member application', vi: 'Phiếu đăng ký Standard Member', ko: 'Standard Member application' },
    description: { en: 'For skincare specialists, nurses, physician assistants, spa/clinic owners, and beauty professionals joining the KBIT learning network.', vi: 'Dành cho chuyên viên chăm sóc da, điều dưỡng, y sĩ, chủ spa/clinic và nhân sự ngành làm đẹp tham gia mạng lưới học thuật KBIT.', ko: 'For beauty professionals joining KBIT.' },
    sections: [
      { id: 'personal', title: { en: 'Personal information', vi: 'Thông tin cá nhân', ko: 'Personal information' }, fields: [...profileFields, { key: 'birth_date', type: 'date', label: { en: 'Date of birth', vi: 'Sinh ngày', ko: 'Date of birth' } }, { key: 'work_region', type: 'text', required: true, label: { en: 'Main work/living region', vi: 'Khu vực sinh sống / làm việc chính', ko: 'Main work/living region' } }, { key: 'avatar_available', type: 'radio', options: yesNo, label: { en: 'Profile photo available', vi: 'Ảnh đại diện (nếu nộp bản online)', ko: 'Profile photo available' } }] },
      { id: 'term', title: { en: 'Membership term', vi: 'Thời hạn hội viên', ko: 'Membership term' }, fields: [{ key: 'requested_term', type: 'radio', required: true, label: { en: 'Requested term', vi: 'Thời hạn đăng ký', ko: 'Requested term' }, options: [{ value: '6_months', label: { en: '6 months', vi: '6 tháng', ko: '6 months' } }, { value: '1_year', label: { en: '1 year', vi: '1 năm', ko: '1 year' } }] }] },
      { id: 'experience', title: { en: 'Title & experience', vi: 'Chức danh & kinh nghiệm', ko: 'Title & experience' }, fields: [{ key: 'current_title', type: 'select', required: true, label: { en: 'Current title', vi: 'Chức danh hiện tại', ko: 'Current title' }, options: [{ value: 'skincare_specialist', label: { en: 'Skincare specialist', vi: 'Chuyên viên chăm sóc da', ko: 'Skincare specialist' } }, { value: 'nurse', label: { en: 'Nurse', vi: 'Điều dưỡng', ko: 'Nurse' } }, { value: 'physician_assistant', label: { en: 'Physician assistant', vi: 'Y sĩ', ko: 'Physician assistant' } }, { value: 'spa_clinic_owner', label: { en: 'Spa / Clinic owner', vi: 'Chủ Spa/Clinic', ko: 'Spa / Clinic owner' } }, { value: 'other', label: { en: 'Other', vi: 'Khác', ko: 'Other' } }] }, { key: 'current_title_other', type: 'text', label: { en: 'Other title (if applicable)', vi: 'Chức danh khác (nếu có)', ko: 'Other title' } }, { key: 'experience_years', type: 'text', required: true, label: { en: 'Years of beauty/aesthetic experience', vi: 'Số năm kinh nghiệm trong lĩnh vực làm đẹp', ko: 'Years of experience' } }, { key: 'workplace', type: 'text', required: true, label: { en: 'Workplace / organization', vi: 'Nơi công tác / đơn vị chủ quản', ko: 'Workplace / organization' } }] },
      { id: 'goals', title: { en: 'Goals & interests', vi: 'Mục tiêu & lĩnh vực quan tâm', ko: 'Goals & interests' }, fields: [{ key: 'goals', type: 'checkbox-group', required: true, label: { en: 'Goals for joining KBIT', vi: 'Mục tiêu tham gia KBIT', ko: 'Goals for joining KBIT' }, options: standardGoals }, { key: 'interests', type: 'checkbox-group', required: true, label: { en: 'Areas of interest', vi: 'Lĩnh vực quan tâm', ko: 'Areas of interest' }, options: standardInterests }, additionalNotesField] },
      { id: 'referral', title: { en: 'Referral', vi: 'Nguồn biết đến KBIT', ko: 'Referral' }, fields: [{ key: 'referral_source', type: 'select', required: true, label: { en: 'How did you hear about KBIT?', vi: 'Bạn biết đến KBIT qua đâu?', ko: 'How did you hear about KBIT?' }, options: referralSources }, { key: 'referral_code', type: 'text', label: { en: 'Referral code', vi: 'Mã giới thiệu', ko: 'Referral code' }, help: { en: 'Enter a referral code to receive member fee discounts and KBIT benefits if eligible.', vi: 'Nhập mã giới thiệu để được giảm phí thành viên và nhận ưu đãi đặc biệt từ KBIT.', ko: 'Enter referral code if any.' } }, consentField] },
    ],
  },
  {
    tierId: 'professional',
    sourcePdf: 'Form–PROFESSIONAL-MEMBER.pdf',
    title: { en: 'Professional Member application', vi: 'Phiếu đăng ký Professional Member', ko: 'Professional Member application' },
    description: { en: 'For medical/aesthetic professionals joining KBIT as professional members.', vi: 'Dành cho bác sĩ/chuyên gia thẩm mỹ tham gia KBIT với tư cách thành viên chuyên môn.', ko: 'For medical/aesthetic professionals.' },
    attachmentNote: { en: 'Required documents after submission: professional photo, medical university diploma, and medical practice certificate.', vi: 'Hồ sơ bắt buộc sau khi nộp: ảnh cá nhân, bằng tốt nghiệp đại học chuyên ngành y khoa và chứng chỉ hành nghề y tế.', ko: 'Required documents will be requested after submission.' },
    sections: [
      { id: 'personal', title: { en: 'Personal information', vi: 'Thông tin cá nhân', ko: 'Personal information' }, fields: [...profileFields, { key: 'birth_date', type: 'date', label: { en: 'Date of birth', vi: 'Sinh ngày', ko: 'Date of birth' } }, { key: 'specialty', type: 'text', required: true, label: { en: 'Main title / specialty', vi: 'Chức danh / chuyên khoa chính', ko: 'Main specialty' } }, { key: 'workplace', type: 'text', required: true, label: { en: 'Current workplace / clinic', vi: 'Nơi công tác / cơ sở làm việc hiện tại', ko: 'Current workplace' } }] },
      { id: 'goals', title: { en: 'Goals & clinical interests', vi: 'Mục tiêu & lĩnh vực quan tâm', ko: 'Goals & clinical interests' }, fields: [{ key: 'goals', type: 'checkbox-group', required: true, label: { en: 'Goals for joining KBIT', vi: 'Mục tiêu tham gia KBIT', ko: 'Goals for joining KBIT' }, options: [{ value: 'academic_network', label: { en: 'Expert connection and academic community', vi: 'Kết nối chuyên gia và tham gia cộng đồng học thuật', ko: 'Academic community' } }, { value: 'knowledge_growth', label: { en: 'Expand knowledge and expertise', vi: 'Mở rộng kiến thức và chuyên môn', ko: 'Expand expertise' } }, { value: 'personal_brand', label: { en: 'Build personal brand and expert profile', vi: 'Xây dựng thương hiệu cá nhân và hồ sơ chuyên gia', ko: 'Personal brand' } }, { value: 'training_transfer', label: { en: 'Training cooperation / technology transfer', vi: 'Hợp tác đào tạo / chuyển giao công nghệ', ko: 'Training cooperation' } }, { value: 'other', label: { en: 'Other', vi: 'Khác', ko: 'Other' } }] }, { key: 'interests', type: 'checkbox-group', required: true, maxSelections: 5, label: { en: 'Areas of interest (up to 5)', vi: 'Lĩnh vực quan tâm (tối đa 5 mục)', ko: 'Areas of interest' }, options: professionalInterests }, additionalNotesField] },
      { id: 'referral', title: { en: 'Referral & documents', vi: 'Nguồn biết đến & hồ sơ', ko: 'Referral & documents' }, fields: [{ key: 'referral_source', type: 'select', required: true, label: { en: 'How did you hear about KBIT?', vi: 'Bạn biết đến KBIT qua đâu?', ko: 'How did you hear about KBIT?' }, options: referralSources }, { key: 'referral_code', type: 'text', label: { en: 'Referral code', vi: 'Mã giới thiệu', ko: 'Referral code' } }, { key: 'required_documents', type: 'attachment-note', label: { en: 'Required attachments', vi: 'Hồ sơ đính kèm bắt buộc', ko: 'Required attachments' }, accepted: { en: 'KBIT will request your professional photo, medical diploma, and practice certificate after submission.', vi: 'KBIT sẽ yêu cầu ảnh cá nhân, bằng y khoa và chứng chỉ hành nghề sau khi bạn nộp hồ sơ.', ko: 'KBIT will request documents after submission.' } }, consentField] },
    ],
  },
  {
    tierId: 'strategic',
    sourcePdf: 'Form–STRATEGIC-PARTNER.pdf',
    title: { en: 'Strategic Partner application', vi: 'Phiếu đăng ký Strategic Partner', ko: 'Strategic Partner application' },
    description: { en: 'For businesses, clinic systems, distributors, and organizations partnering with KBIT.', vi: 'Dành cho doanh nghiệp, hệ thống clinic, nhà phân phối và tổ chức hợp tác chiến lược với KBIT.', ko: 'For strategic partner organizations.' },
    attachmentNote: { en: 'Optional documents after submission: capability profile, personal photo/logo, operating license, partnership evidence.', vi: 'Hồ sơ có thể bổ sung sau khi nộp: profile năng lực, ảnh/logo, giấy phép hoạt động, minh chứng hợp tác/thành tựu.', ko: 'Optional documents will be requested after submission.' },
    sections: [
      { id: 'business', title: { en: 'Personal / business information', vi: 'Thông tin cá nhân / doanh nghiệp', ko: 'Personal / business information' }, fields: [{ key: 'full_name', type: 'text', required: true, label: { en: 'Full name', vi: 'Họ và tên', ko: 'Full name' } }, { key: 'title', type: 'text', required: true, label: { en: 'Title', vi: 'Chức danh', ko: 'Title' } }, { key: 'brand_name', type: 'text', required: true, label: { en: 'Company / brand name', vi: 'Tên đơn vị / thương hiệu', ko: 'Company / brand name' } }, { key: 'business_field', type: 'text', required: true, label: { en: 'Primary business field', vi: 'Lĩnh vực hoạt động chính', ko: 'Primary business field' } }, { key: 'email', type: 'email', required: true, label: { en: 'Email', vi: 'Email', ko: 'Email' } }, { key: 'phone', type: 'tel', required: true, label: { en: 'Phone number', vi: 'Số điện thoại', ko: 'Phone number' } }, { key: 'chat_contact', type: 'text', label: { en: 'Zalo / Kakaotalk', vi: 'Zalo / Kakaotalk', ko: 'Zalo / Kakaotalk' } }, { key: 'website', type: 'text', label: { en: 'Website / fanpage', vi: 'Website / fanpage', ko: 'Website / fanpage' } }, { key: 'business_address', type: 'textarea', label: { en: 'Business address', vi: 'Địa chỉ đơn vị', ko: 'Business address' } }] },
      { id: 'term', title: { en: 'Membership term', vi: 'Thời hạn hội viên', ko: 'Membership term' }, fields: [{ key: 'requested_term', type: 'radio', required: true, label: { en: 'Requested term', vi: 'Thời hạn đăng ký', ko: 'Requested term' }, options: [{ value: '1_year', label: { en: '1 year', vi: '1 năm', ko: '1 year' } }, { value: 'lifetime', label: { en: 'Lifetime', vi: 'Trọn đời', ko: 'Lifetime' } }] }] },
      { id: 'cooperation', title: { en: 'Goals & cooperation areas', vi: 'Mục tiêu & lĩnh vực hợp tác', ko: 'Goals & cooperation areas' }, fields: [{ key: 'goals', type: 'checkbox-group', required: true, label: { en: 'Goals for joining KBIT', vi: 'Mục tiêu tham gia KBIT', ko: 'Goals for joining KBIT' }, options: [{ value: 'workshop_training', label: { en: 'Host workshops / advanced training', vi: 'Hợp tác tổ chức hội thảo / đào tạo chuyên sâu', ko: 'Workshops / training' } }, { value: 'clinic_distribution', label: { en: 'Clinic model or product distribution', vi: 'Triển khai mô hình clinic hoặc phân phối sản phẩm', ko: 'Clinic / distribution' } }, { value: 'brand_technology', label: { en: 'Develop exclusive brand / technology', vi: 'Cùng phát triển thương hiệu / công nghệ độc quyền', ko: 'Brand / technology' } }, { value: 'academic_ecosystem', label: { en: 'Build academic and training ecosystem', vi: 'Xây dựng hệ sinh thái học thuật & đào tạo chuyên môn', ko: 'Academic ecosystem' } }, { value: 'other', label: { en: 'Other', vi: 'Khác', ko: 'Other' } }] }, { key: 'operating_system', type: 'checkbox-group', label: { en: 'Current system / growth direction', vi: 'Hệ thống đang vận hành / định hướng phát triển', ko: 'Current system' }, options: [{ value: 'active_clinic', label: { en: 'Operating clinic', vi: 'Clinic đang hoạt động', ko: 'Operating clinic' } }, { value: 'training_institute', label: { en: 'Training system / aesthetic institute', vi: 'Hệ thống đào tạo / viện thẩm mỹ', ko: 'Training system' } }, { value: 'new_brand', label: { en: 'Wants to launch a new brand', vi: 'Mong muốn triển khai thương hiệu mới', ko: 'New brand' } }, { value: 'beauty_investment', label: { en: 'Plans to expand investment in beauty industry', vi: 'Kế hoạch mở rộng đầu tư vào ngành làm đẹp', ko: 'Beauty investment' } }, { value: 'distributor', label: { en: 'Cosmetics / equipment / technology distributor', vi: 'Nhà phân phối mỹ phẩm – thiết bị – công nghệ', ko: 'Distributor' } }, { value: 'other', label: { en: 'Other', vi: 'Khác', ko: 'Other' } }] }, { key: 'cooperation_areas', type: 'checkbox-group', required: true, label: { en: 'Areas of cooperation', vi: 'Lĩnh vực quan tâm và hợp tác', ko: 'Areas of cooperation' }, options: strategicCooperation }, additionalNotesField] },
      { id: 'referral', title: { en: 'Referral & documents', vi: 'Nguồn biết đến & hồ sơ', ko: 'Referral & documents' }, fields: [{ key: 'referral_source', type: 'select', required: true, label: { en: 'How did you hear about KBIT?', vi: 'Bạn biết đến KBIT qua đâu?', ko: 'How did you hear about KBIT?' }, options: referralSources.filter((item) => item.value !== 'partner_supplier') }, { key: 'referral_code', type: 'text', label: { en: 'Referral code', vi: 'Mã giới thiệu', ko: 'Referral code' } }, { key: 'optional_documents', type: 'attachment-note', label: { en: 'Optional supporting documents', vi: 'Hồ sơ đính kèm (nếu có)', ko: 'Optional supporting documents' }, accepted: { en: 'KBIT may request your capability profile, avatar/logo, operating license, and partnership evidence after submission.', vi: 'KBIT có thể yêu cầu profile năng lực, ảnh/logo, giấy phép hoạt động và minh chứng hợp tác sau khi bạn nộp hồ sơ.', ko: 'KBIT may request supporting documents after submission.' } }, consentField] },
    ],
  },
]

export function getMembershipFormProfile(tierId: string | undefined) {
  return membershipFormProfiles.find((profile) => profile.tierId === tierId) ?? membershipFormProfiles[0]
}
