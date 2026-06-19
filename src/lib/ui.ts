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

  // ── Events ──
  'Programs & Education': { vi: 'Chương trình & Đào tạo', ko: '프로그램 및 교육' },
  'Global Workshops & Clinical Summits': {
    vi: 'Hội thảo Toàn cầu & Hội nghị Lâm sàng',
    ko: '글로벌 워크숍 & 임상 서밋',
  },
  "Join Korea's leading clinicians at international events bridging evidence-based aesthetics and hands-on training.": {
    vi: 'Tham gia cùng các bác sĩ hàng đầu Hàn Quốc tại các sự kiện quốc tế kết nối thẩm mỹ dựa trên bằng chứng và đào tạo thực hành.',
    ko: '근거 기반 미용과 실습 교육을 잇는 국제 행사에서 한국 최고의 임상의들과 함께하세요.',
  },
  'All Events': { vi: 'Tất cả sự kiện', ko: '전체 행사' },
  'Past Events': { vi: 'Sự kiện đã qua', ko: '지난 행사' },
  'Featured Event': { vi: 'Sự kiện nổi bật', ko: '주요 행사' },
  'Past Event': { vi: 'Đã diễn ra', ko: '종료된 행사' },
  'View detail': { vi: 'Xem chi tiết', ko: '상세 보기' },
  'Request program info': { vi: 'Yêu cầu thông tin chương trình', ko: '프로그램 정보 요청' },
  'Program Index': { vi: 'Danh mục chương trình', ko: '프로그램 목록' },
  'Explore KBIT clinical programs': {
    vi: 'Khám phá các chương trình lâm sàng KBIT',
    ko: 'KBIT 임상 프로그램 둘러보기',
  },
  'Programs listed': { vi: 'Chương trình được liệt kê', ko: '등록된 프로그램' },
  'Upcoming programs': { vi: 'Chương trình sắp tới', ko: '예정 프로그램' },
  'Past programs': { vi: 'Chương trình đã qua', ko: '지난 프로그램' },
  'Multilingual': { vi: 'Đa ngôn ngữ', ko: '다국어' },
  'No upcoming events found.': { vi: 'Không tìm thấy sự kiện sắp tới.', ko: '예정된 행사가 없습니다.' },
  'No past events found.': { vi: 'Không tìm thấy sự kiện đã qua.', ko: '지난 행사가 없습니다.' },

  // ── News (list) ──
  'News / Stories / Archive': { vi: 'Tin tức / Câu chuyện / Lưu trữ', ko: '뉴스 / 스토리 / 아카이브' },
  'Spotlight index': { vi: 'Mục nổi bật', ko: '주요 기사 색인' },
  'Archive count': { vi: 'Số bài lưu trữ', ko: '아카이브 수' },
  'stories': { vi: 'bài viết', ko: '기사' },
  'more below': { vi: 'thêm bên dưới', ko: '아래 더보기' },
  'Latest archive': { vi: 'Lưu trữ mới nhất', ko: '최신 아카이브' },
  'More articles': { vi: 'Thêm bài viết', ko: '더 많은 기사' },

  // ── News detail ──
  'News not found': { vi: 'Không tìm thấy tin', ko: '뉴스를 찾을 수 없습니다' },
  'We could not find this story.': { vi: 'Chúng tôi không tìm thấy bài viết này.', ko: '해당 기사를 찾을 수 없습니다.' },
  'Loading story…': { vi: 'Đang tải bài viết…', ko: '기사 불러오는 중…' },
  'News story': { vi: 'Bài viết', ko: '뉴스 기사' },
  'KBIT NEWS ARCHIVE': { vi: 'KHO TIN KBIT', ko: 'KBIT 뉴스 아카이브' },
  'Story info': { vi: 'Thông tin bài', ko: '기사 정보' },
  'min': { vi: 'phút', ko: '분' },
  'Selected frames': { vi: 'Hình ảnh chọn lọc', ko: '선별 이미지' },
  'Related stories': { vi: 'Bài liên quan', ko: '관련 기사' },
  'Edition': { vi: 'Chuyên mục', ko: '에디션' },

  // ── Experts ──
  'Key Doctors & Specialists': { vi: 'Bác sĩ & Chuyên gia chủ chốt', ko: '핵심 의료진 및 전문가' },
  'Credentials and clinical scope are reviewed before a profile is published.': {
    vi: 'Bằng cấp và phạm vi lâm sàng được rà soát trước khi hồ sơ được công bố.',
    ko: '프로필 공개 전 자격과 진료 범위를 검토합니다.',
  },
  'Specialties, teaching roles, and regional availability are structured for browsing.': {
    vi: 'Chuyên khoa, vai trò giảng dạy và khu vực hoạt động được sắp xếp để dễ tra cứu.',
    ko: '전문 분야, 강의 역할, 지역별 활동을 보기 쉽게 정리합니다.',
  },
  'Verified doctors can be connected to events, training programs, and member benefits.': {
    vi: 'Bác sĩ đã xác minh có thể kết nối với sự kiện, chương trình đào tạo và quyền lợi hội viên.',
    ko: '인증된 의료진은 행사, 교육 프로그램, 회원 혜택과 연결될 수 있습니다.',
  },
  'Expert directory': { vi: 'Danh bạ chuyên gia', ko: '전문가 디렉터리' },
  'Verified clinical profiles': { vi: 'Hồ sơ lâm sàng đã xác minh', ko: '인증된 임상 프로필' },
  'Verified clinical profiles are being prepared': {
    vi: 'Hồ sơ lâm sàng đã xác minh đang được chuẩn bị',
    ko: '인증된 임상 프로필을 준비하고 있습니다',
  },
  'KBIT is organizing doctor profiles around credentials, specialty focus, training role, and international collaboration readiness. Until every profile is verified, the public page presents the qualification framework rather than placeholder biographies.': {
    vi: 'KBIT đang sắp xếp hồ sơ bác sĩ theo bằng cấp, lĩnh vực chuyên môn, vai trò đào tạo và mức độ sẵn sàng hợp tác quốc tế. Cho đến khi mọi hồ sơ được xác minh, trang công khai trình bày khung tiêu chuẩn thay vì các tiểu sử tạm.',
    ko: 'KBIT는 자격, 전문 분야, 교육 역할, 국제 협력 준비도를 기준으로 의료진 프로필을 정리하고 있습니다. 모든 프로필이 인증될 때까지 공개 페이지는 임시 약력 대신 자격 기준을 제시합니다.',
  },
  'Request expert connection': { vi: 'Yêu cầu kết nối chuyên gia', ko: '전문가 연결 요청' },
  'Collaborate with KBIT': { vi: 'Hợp tác với KBIT', ko: 'KBIT와 협력하기' },
  'Join our expert network': { vi: 'Tham gia mạng lưới chuyên gia', ko: '전문가 네트워크에 참여하세요' },

  // ── Centers ──
  'Content coming soon.': { vi: 'Nội dung sẽ sớm ra mắt.', ko: '콘텐츠가 곧 제공됩니다.' },
  'Center Network': { vi: 'Mạng lưới trung tâm', ko: '센터 네트워크' },
  'What to expect': { vi: 'Điều bạn nhận được', ko: '기대할 수 있는 것' },
  'Korean-standard excellence': { vi: 'Chất lượng chuẩn Hàn Quốc', ko: '한국 표준의 우수성' },
  'Education Center': { vi: 'Trung tâm đào tạo', ko: '교육 센터' },
  'Our centers': { vi: 'Trung tâm của chúng tôi', ko: '우리 센터' },
  'Find a KBIT center': { vi: 'Tìm trung tâm KBIT', ko: 'KBIT 센터 찾기' },
  'Visit or inquire about our centers': {
    vi: 'Ghé thăm hoặc tìm hiểu về các trung tâm của chúng tôi',
    ko: '센터를 방문하거나 문의해 보세요',
  },
  'Reach us directly to get directions, schedule a visit, or learn more about what each KBIT center offers.': {
    vi: 'Liên hệ trực tiếp với chúng tôi để được chỉ đường, đặt lịch ghé thăm hoặc tìm hiểu thêm về những gì mỗi trung tâm KBIT mang lại.',
    ko: '길 안내를 받거나 방문을 예약하고, 각 KBIT 센터가 제공하는 내용을 자세히 알아보려면 직접 문의해 주세요.',
  },
  'Contact us': { vi: 'Liên hệ với chúng tôi', ko: '문의하기' },
}

export function tr(en: string, locale: Locale): string {
  if (locale === 'en') return en
  const entry = UI[en]
  return entry ? entry[locale] || en : en
}
