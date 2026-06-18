// One-off: fill VI/KO for high-visibility UI strings (settings + pages).
// Keyed by the exact English source. Only fills a locale when it is empty or
// still a [NEEDS_TRANSLATION] / mirror-of-English placeholder, so existing good
// translations are never clobbered. Body/long-form content is intentionally
// out of scope and left untouched.
import { readFileSync, writeFileSync } from 'node:fs'

const T = {
  // ── settings: siteMeta / org ──
  'KBIT - Korean Beauty International Technology Association': {
    vi: 'KBIT - Hiệp hội Công nghệ Thẩm mỹ Quốc tế Hàn Quốc',
    ko: 'KBIT - 한국뷰티국제기술협회',
  },
  'KBIT keeps updating the latest rejuvenation technology of Korea to our Members all over the world. We have 16 education centers in Korea and overseas with 20 Key Doctors who are experts in the field of Aesthetics and Plastic Surgery.': {
    vi: 'KBIT liên tục cập nhật công nghệ trẻ hóa mới nhất của Hàn Quốc đến các hội viên trên toàn thế giới. Chúng tôi có 16 trung tâm đào tạo tại Hàn Quốc và nước ngoài cùng 20 bác sĩ chủ chốt là chuyên gia trong lĩnh vực Thẩm mỹ và Phẫu thuật Tạo hình.',
    ko: 'KBIT는 한국의 최신 재생·안티에이징 기술을 전 세계 회원들에게 지속적으로 전달합니다. 한국과 해외에 16개의 교육 센터를 운영하고 있으며, 미용 및 성형외과 분야의 전문가인 20명의 핵심 의료진이 함께합니다.',
  },
  '© 2026 Korean Beauty International Technology (KBIT). All rights reserved.': {
    vi: '© 2026 Korean Beauty International Technology (KBIT). Bảo lưu mọi quyền.',
    ko: '© 2026 Korean Beauty International Technology (KBIT). 모든 권리 보유.',
  },

  // ── settings: offices (KO only; VI already present) ──
  '12, Teheran-ro 70-gil, Gangnam-gu, Seoul, Republic of Korea': {
    ko: '대한민국 서울특별시 강남구 테헤란로70길 12',
  },
  'Mon-Fri 9:00 AM - 6:00 PM (KST)': { ko: '월–금 오전 9:00 – 오후 6:00 (KST)' },
  '17 Tran Quy Kien, Binh Trung Ward, Ho Chi Minh City': {
    ko: '베트남 호치민시 빈쯩동 쩐꾸이끼엔 17',
  },
  'Mon-Fri: 8:00 AM - 5:00 PM': { ko: '월–금 오전 8:00 – 오후 5:00' },
  'Ms. Mint - Foreign Affair Manager': { ko: '민(Mint) – 대외협력 매니저' },

  // ── settings: home hero ──
  'With the best Korea doctors and experts': {
    vi: 'Cùng các bác sĩ và chuyên gia hàng đầu Hàn Quốc',
    ko: '한국 최고의 의료진과 전문가와 함께',
  },
  'Welcome to KBIT': { vi: 'Chào mừng đến với KBIT', ko: 'KBIT에 오신 것을 환영합니다' },
  'KBIT, Korea Beauty International Technology Association': {
    vi: 'KBIT, Hiệp hội Công nghệ Thẩm mỹ Quốc tế Hàn Quốc',
    ko: 'KBIT, 한국뷰티국제기술협회',
  },
  'Beauty Meets Innovation': { vi: 'Vẻ đẹp gặp gỡ đổi mới', ko: '뷰티, 혁신을 만나다' },
  'The latest rejuvenation technology of Korea': {
    vi: 'Công nghệ trẻ hóa mới nhất của Hàn Quốc',
    ko: '한국의 최신 재생·안티에이징 기술',
  },

  // ── pages: titles / intros / pillar & highlight labels ──
  'KBIT Official Membership Program': {
    vi: 'Chương trình Hội viên Chính thức KBIT',
    ko: 'KBIT 공식 회원 프로그램',
  },
  "Join KBIT to enhance expertise, access exclusive benefits, and contribute to the growth of Vietnam's aesthetic medical industry.": {
    vi: 'Gia nhập KBIT để nâng cao chuyên môn, tiếp cận các quyền lợi độc quyền và góp phần phát triển ngành y học thẩm mỹ Việt Nam.',
    ko: 'KBIT에 가입하여 전문성을 높이고, 독점 혜택을 누리며, 베트남 미용의료 산업의 성장에 기여하세요.',
  },
  'Exclusive Benefits': { vi: 'Quyền lợi độc quyền', ko: '독점 혜택' },
  'Professional Network': { vi: 'Mạng lưới chuyên môn', ko: '전문가 네트워크' },
  'Industry Growth': { vi: 'Phát triển ngành', ko: '산업 성장' },
  'Upcoming Events & Workshops': { vi: 'Sự kiện & Hội thảo sắp tới', ko: '예정된 행사 및 워크숍' },
  'Explore our curated list of events designed to enhance your skills and knowledge.': {
    vi: 'Khám phá danh sách sự kiện được tuyển chọn nhằm nâng cao kỹ năng và kiến thức của bạn.',
    ko: '여러분의 역량과 지식을 높이기 위해 선별한 행사 목록을 만나보세요.',
  },
  'News & Updates': { vi: 'Tin tức & Cập nhật', ko: '뉴스 및 소식' },
  'Stay informed with our latest articles, announcements, and insights.': {
    vi: 'Cập nhật những bài viết, thông báo và góc nhìn mới nhất từ chúng tôi.',
    ko: '최신 기사와 공지, 인사이트로 항상 새로운 소식을 받아보세요.',
  },
  'Our Key Doctors': { vi: 'Đội ngũ Bác sĩ Chủ chốt', ko: '핵심 의료진' },
  'Connect with a network of leading aesthetic experts and doctors from Korea.': {
    vi: 'Kết nối với mạng lưới các chuyên gia và bác sĩ thẩm mỹ hàng đầu đến từ Hàn Quốc.',
    ko: '한국의 선도적인 미용 전문가 및 의료진 네트워크와 연결하세요.',
  },
  'Training Opportunities': { vi: 'Cơ hội đào tạo', ko: '교육 기회' },
  'Global Network': { vi: 'Mạng lưới toàn cầu', ko: '글로벌 네트워크' },
  'Prestigious Certification': { vi: 'Chứng nhận uy tín', ko: '공신력 있는 인증' },
  'Professional Development': { vi: 'Phát triển chuyên môn', ko: '전문성 개발' },
  'Contact KBIT': { vi: 'Liên hệ KBIT', ko: 'KBIT 문의하기' },
  'We are always ready to listen and support you.': {
    vi: 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.',
    ko: '저희는 언제나 여러분의 의견을 경청하고 지원할 준비가 되어 있습니다.',
  },
  'Online Consultation': { vi: 'Tư vấn trực tuyến', ko: '온라인 상담' },
  'Working Hours': { vi: 'Giờ làm việc', ko: '운영 시간' },
  'Center System': { vi: 'Hệ thống trung tâm', ko: '센터 시스템' },
  'About KBIT': { vi: 'Về KBIT', ko: 'KBIT 소개' },
  'Our Center System': { vi: 'Hệ thống Trung tâm', ko: '센터 시스템 안내' },
  'A nationwide network of Korean-standard aesthetic centers': {
    vi: 'Mạng lưới trung tâm thẩm mỹ chuẩn Hàn Quốc trên toàn quốc.',
    ko: '전국에 걸친 한국 표준 미용 센터 네트워크',
  },
  'Modern Facilities': { vi: 'Cơ sở vật chất hiện đại', ko: '현대적 시설' },
  'Professional Team': { vi: 'Đội ngũ chuyên nghiệp', ko: '전문 인력' },
  'Safety Commitment': { vi: 'Cam kết an toàn', ko: '안전 약속' },
}

const needsFill = (val, en) =>
  typeof val !== 'string' || val.trim() === '' || val.startsWith('[') || val === en

let filled = 0
let matchedKeys = new Set()

function walk(node) {
  if (Array.isArray(node)) {
    node.forEach(walk)
    return
  }
  if (node && typeof node === 'object') {
    if (typeof node.en === 'string') {
      const entry = T[node.en.trim()]
      if (entry) {
        matchedKeys.add(node.en.trim())
        for (const loc of ['vi', 'ko']) {
          if (entry[loc] && needsFill(node[loc], node.en)) {
            node[loc] = entry[loc]
            filled++
          }
        }
      }
      // still recurse — nested i18n objects can live under an i18n object's siblings
    }
    for (const k of Object.keys(node)) walk(node[k])
  }
}

for (const file of ['data/seed/settings.json', 'data/seed/pages.json']) {
  const data = JSON.parse(readFileSync(file, 'utf8'))
  walk(data)
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  console.log('updated', file)
}

console.log(`\nFilled ${filled} locale fields across ${matchedKeys.size}/${Object.keys(T).length} dictionary keys.`)
const unmatched = Object.keys(T).filter((k) => !matchedKeys.has(k))
if (unmatched.length) {
  console.log('\n⚠️  dictionary keys never matched (check exact EN text):')
  unmatched.forEach((k) => console.log('   -', JSON.stringify(k.slice(0, 70))))
}
