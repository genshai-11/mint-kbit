import type { Locale } from './locale'

type Tri = { vi: string; ko: string }

// UI chrome strings (labels, CTAs, section headings) keyed by the English
// source. English is the key and the fallback, so any un-added string simply
// renders in English instead of breaking. Seed/CMS content uses `localize()`
// separately — this map is only for hardcoded interface copy.
const UI: Record<string, Tri> = {
  // ── Nav ──
  'About': { vi: 'Giới thiệu', ko: '소개' },
  'Events': { vi: 'Sự kiện', ko: '행사' },
  'News': { vi: 'Tin tức', ko: '뉴스' },
  'Membership': { vi: 'Hội viên', ko: '회원' },
  'Experts': { vi: 'Chuyên gia', ko: '전문가' },
  'Contact': { vi: 'Liên hệ', ko: '문의' },
  'Join KBIT': { vi: 'Tham gia KBIT', ko: 'KBIT 가입' },

  // ── Footer ──
  'Korean Beauty International Technology': { vi: 'Korean Beauty International Technology', ko: 'Korean Beauty International Technology' },
  'Clinical education, partnerships, and global exchange.': {
    vi: 'Đào tạo lâm sàng, hợp tác và giao lưu toàn cầu.',
    ko: '임상 교육, 파트너십, 글로벌 교류.',
  },
  'Contact KBIT': { vi: 'Liên hệ KBIT', ko: 'KBIT 문의하기' },
  'Offices': { vi: 'Văn phòng', ko: '사무소' },
  'Korean Beauty International Technology Association — advancing clinical excellence across Korea, Vietnam, and beyond.': {
    vi: 'Hiệp hội Công nghệ Thẩm mỹ Quốc tế Hàn Quốc — nâng tầm chất lượng lâm sàng tại Hàn Quốc, Việt Nam và hơn thế nữa.',
    ko: '한국뷰티국제기술협회 — 한국과 베트남을 비롯한 전역에서 임상 우수성을 발전시킵니다.',
  },
  'Explore': { vi: 'Khám phá', ko: '둘러보기' },
  'Association': { vi: 'Hiệp hội', ko: '협회' },
  'Partners': { vi: 'Đối tác', ko: '파트너' },
  'Centers': { vi: 'Trung tâm', ko: '센터' },
  'Office locations →': { vi: 'Địa chỉ văn phòng →', ko: '사무소 위치 →' },

  // ── NotFound ──
  'Page not found': { vi: 'Không tìm thấy trang', ko: '페이지를 찾을 수 없습니다' },
  '← Back to home': { vi: '← Về trang chủ', ko: '← 홈으로 돌아가기' },

  // ── Common CTAs / labels (shared across pages) ──
  'Learn More': { vi: 'Tìm hiểu thêm', ko: '더 알아보기' },
  'Upcoming Events': { vi: 'Sự kiện sắp tới', ko: '예정된 행사' },
  'Read story': { vi: 'Đọc bài', ko: '기사 읽기' },
  'Back to News': { vi: 'Quay lại Tin tức', ko: '뉴스로 돌아가기' },
  'Published': { vi: 'Ngày đăng', ko: '게시일' },
  'Reading time': { vi: 'Thời gian đọc', ko: '읽는 시간' },
  'Featured': { vi: 'Nổi bật', ko: '주요 기사' },
  'views': { vi: 'lượt xem', ko: '조회' },
  'Submit credentials': { vi: 'Gửi hồ sơ', ko: '자격 제출' },

  // ── Home ──
  'KBIT Association': { vi: 'Hiệp hội KBIT', ko: 'KBIT 협회' },
  'Clinical': { vi: 'Lâm sàng', ko: '임상' },
  'Exchange': { vi: 'Giao lưu', ko: '교류' },
  'Korea / Asia': { vi: 'Hàn Quốc / Châu Á', ko: '한국 / 아시아' },
  'Education Centers': { vi: 'Trung tâm đào tạo', ko: '교육 센터' },
  'Expert Doctors': { vi: 'Bác sĩ chuyên gia', ko: '전문 의료진' },
  'Doctors': { vi: 'Bác sĩ', ko: '의료진' },
  'Countries': { vi: 'Quốc gia', ko: '국가' },
  'Members': { vi: 'Hội viên', ko: '회원' },
  'About KBIT': { vi: 'Về KBIT', ko: 'KBIT 소개' },
  'Advancing Korean Beauty & Medical Technology': {
    vi: 'Phát triển công nghệ thẩm mỹ và y tế Hàn Quốc',
    ko: '한국 뷰티·의료 기술의 발전',
  },
  "KBIT connects Korea's foremost clinical experts with medical professionals and institutions across Asia and beyond. Through rigorous training, international events, and curated partnerships, we drive the future of aesthetic medicine.": {
    vi: 'KBIT kết nối các chuyên gia lâm sàng hàng đầu Hàn Quốc với các chuyên gia và tổ chức y tế trên khắp châu Á và hơn thế nữa. Thông qua đào tạo bài bản, các sự kiện quốc tế và mạng lưới đối tác chọn lọc, chúng tôi định hình tương lai của y học thẩm mỹ.',
    ko: 'KBIT는 한국 최고의 임상 전문가들을 아시아 전역과 그 너머의 의료 전문가 및 기관과 연결합니다. 엄격한 교육, 국제 행사, 엄선된 파트너십을 통해 미용의학의 미래를 이끕니다.',
  },
  'Events & Workshops': { vi: 'Sự kiện & Hội thảo', ko: '행사 및 워크숍' },
  'Upcoming Programs': { vi: 'Chương trình sắp tới', ko: '예정된 프로그램' },
  'View all events →': { vi: 'Xem tất cả sự kiện →', ko: '모든 행사 보기 →' },
  'Past': { vi: 'Đã diễn ra', ko: '종료' },
  'Upcoming': { vi: 'Sắp tới', ko: '예정' },
  'Scientific & Industry Partners': { vi: 'Đối tác Khoa học & Ngành', ko: '과학 및 산업 파트너' },
  'Ready to Elevate Your Practice?': {
    vi: 'Sẵn sàng nâng tầm phòng khám của bạn?',
    ko: '진료 수준을 높일 준비가 되셨나요?',
  },
  'Join the Vanguard of Korean Clinical Excellence': {
    vi: 'Gia nhập đội ngũ tiên phong về chất lượng lâm sàng Hàn Quốc',
    ko: '한국 임상 우수성의 선두에 합류하세요',
  },
  "Access world-class training, global networks, and Korea's most advanced aesthetic protocols.": {
    vi: 'Tiếp cận đào tạo đẳng cấp thế giới, mạng lưới toàn cầu và các phác đồ thẩm mỹ tiên tiến nhất của Hàn Quốc.',
    ko: '세계적 수준의 교육, 글로벌 네트워크, 그리고 한국의 가장 진보된 미용 프로토콜을 만나보세요.',
  },
  'Apply for Membership': { vi: 'Đăng ký Hội viên', ko: '회원 신청' },
  'Contact Us': { vi: 'Liên hệ với chúng tôi', ko: '문의하기' },
}

export function tr(en: string, locale: Locale): string {
  if (locale === 'en') return en
  const entry = UI[en]
  return entry ? entry[locale] || en : en
}
