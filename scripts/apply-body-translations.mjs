// Pass 2: long-form / body VI+KO for pages, plus the one event location string.
// Event image captions are brand event names (proper nouns) — they are mirrored
// to vi/ko as-is rather than "translated". Same safe fill rule: only touch
// empty / [NEEDS_TRANSLATION] / mirror-of-English placeholders.
import { readFileSync, writeFileSync } from 'node:fs'

const T = {
  // pages — body copy, CTAs, pillar/highlight descriptions
  'Access discounts, training, resources, and networking opportunities.': {
    vi: 'Tiếp cận ưu đãi, đào tạo, tài nguyên và cơ hội kết nối.',
    ko: '할인, 교육, 자료 및 네트워킹 기회를 누리세요.',
  },
  'Connect with leading experts, clinics, and suppliers in the industry.': {
    vi: 'Kết nối với các chuyên gia, phòng khám và nhà cung cấp hàng đầu trong ngành.',
    ko: '업계 최고의 전문가, 클리닉, 공급업체와 연결하세요.',
  },
  'Contribute to and benefit from the advancement of aesthetic medicine in Vietnam.': {
    vi: 'Đóng góp và hưởng lợi từ sự phát triển của y học thẩm mỹ tại Việt Nam.',
    ko: '베트남 미용의학의 발전에 기여하고 그 혜택을 누리세요.',
  },
  'Ready to Elevate Your Expertise?': {
    vi: 'Sẵn sàng nâng tầm chuyên môn của bạn?',
    ko: '전문성을 한 단계 높일 준비가 되셨나요?',
  },
  'Register for our upcoming events and workshops to gain invaluable insights, hands-on experience, and network with industry leaders. Secure your spot today!': {
    vi: 'Đăng ký các sự kiện và hội thảo sắp tới để thu nhận kiến thức giá trị, trải nghiệm thực hành và kết nối với những người dẫn đầu ngành. Giữ chỗ ngay hôm nay!',
    ko: '다가오는 행사와 워크숍에 등록하여 값진 통찰과 실습 경험을 얻고 업계 리더들과 교류하세요. 지금 자리를 확보하세요!',
  },
  'Seats are limited. Early registration is recommended.': {
    vi: 'Số lượng chỗ có hạn. Khuyến khích đăng ký sớm.',
    ko: '좌석이 한정되어 있습니다. 조기 등록을 권장합니다.',
  },
  'Experts': { vi: 'Chuyên gia', ko: '전문가' },
  'Experienced team of specialists and doctors': {
    vi: 'Đội ngũ bác sĩ và chuyên gia giàu kinh nghiệm',
    ko: '경험이 풍부한 전문의 및 의료진',
  },
  'International Certification': { vi: 'Chứng nhận quốc tế', ko: '국제 인증' },
  'Meeting standards and recognized globally': {
    vi: 'Đạt chuẩn và được công nhận trên toàn cầu',
    ko: '국제 표준을 충족하고 전 세계적으로 인정받음',
  },
  'Global Collaboration': { vi: 'Hợp tác toàn cầu', ko: '글로벌 협력' },
  'Extensive partner network across Asia': {
    vi: 'Mạng lưới đối tác rộng khắp châu Á',
    ko: '아시아 전역에 걸친 광범위한 파트너 네트워크',
  },
  'Participate in teaching intensive training programs and international workshops.': {
    vi: 'Tham gia giảng dạy các chương trình đào tạo chuyên sâu và hội thảo quốc tế.',
    ko: '집중 교육 프로그램과 국제 워크숍의 강의에 참여하세요.',
  },
  'Connect with leading experts and expand international collaboration opportunities.': {
    vi: 'Kết nối với các chuyên gia hàng đầu và mở rộng cơ hội hợp tác quốc tế.',
    ko: '선도적인 전문가들과 연결하고 국제 협력 기회를 확대하세요.',
  },
  'Receive certification from KBIT and enhance personal brand value.': {
    vi: 'Nhận chứng nhận từ KBIT và nâng cao giá trị thương hiệu cá nhân.',
    ko: 'KBIT의 인증을 받고 개인 브랜드 가치를 높이세요.',
  },
  'Access new technologies and participate in pioneering research projects.': {
    vi: 'Tiếp cận công nghệ mới và tham gia các dự án nghiên cứu tiên phong.',
    ko: '새로운 기술을 접하고 선도적인 연구 프로젝트에 참여하세요.',
  },
  'Get free advice from our experts': {
    vi: 'Nhận tư vấn miễn phí từ các chuyên gia của chúng tôi',
    ko: '전문가에게 무료 상담을 받으세요',
  },
  'Monday - Sunday: 08:00 - 20:00': {
    vi: 'Thứ Hai - Chủ Nhật: 08:00 - 20:00',
    ko: '월요일 - 일요일: 08:00 - 20:00',
  },
  'Present in major cities nationwide': {
    vi: 'Hiện diện tại các thành phố lớn trên cả nước',
    ko: '전국 주요 도시에 위치',
  },
  'Vice President': { vi: 'Phó Chủ tịch', ko: '부회장' },
  'Equipment and technology meeting international standards': {
    vi: 'Trang thiết bị và công nghệ đạt chuẩn quốc tế',
    ko: '국제 표준에 부합하는 장비 및 기술',
  },
  'Doctors and specialists thoroughly trained in Korea': {
    vi: 'Bác sĩ và chuyên gia được đào tạo bài bản tại Hàn Quốc',
    ko: '한국에서 철저히 교육받은 의료진 및 전문가',
  },
  'Strict adherence to international medical standards': {
    vi: 'Tuân thủ nghiêm ngặt các tiêu chuẩn y tế quốc tế',
    ko: '국제 의료 표준의 엄격한 준수',
  },

  // events — the one genuine prose location string
  'REX Hotel Saigon + Le Van Thinh Hospital': {
    vi: 'Khách sạn REX Sài Gòn + Bệnh viện Lê Văn Thịnh',
    ko: '렉스 호텔 사이공 + 레반틴 병원',
  },
}

const needsFill = (val, en) =>
  typeof val !== 'string' || val.trim() === '' || val.startsWith('[') || val === en

function makeWalker({ mirrorKeys = [] }) {
  let filled = 0
  let mirrored = 0
  const matched = new Set()
  const walk = (node, parentKey = '') => {
    if (Array.isArray(node)) return node.forEach((v) => walk(v, parentKey))
    if (node && typeof node === 'object') {
      if (typeof node.en === 'string' && node.en.trim()) {
        const entry = T[node.en.trim()]
        if (entry) {
          matched.add(node.en.trim())
          for (const loc of ['vi', 'ko']) {
            if (entry[loc] && needsFill(node[loc], node.en)) { node[loc] = entry[loc]; filled++ }
          }
        } else if (mirrorKeys.includes(parentKey)) {
          // Brand proper-noun captions: keep identical across locales.
          for (const loc of ['vi', 'ko']) {
            if (needsFill(node[loc], node.en)) { node[loc] = node.en; mirrored++ }
          }
        }
      }
      for (const k of Object.keys(node)) {
        if (k.startsWith('_')) continue // skip notes / _sample templates
        walk(node[k], k)
      }
    }
  }
  return { walk, stats: () => ({ filled, mirrored, matched }) }
}

// pages: dictionary only (never blanket-mirror page body)
{
  const data = JSON.parse(readFileSync('data/seed/pages.json', 'utf8'))
  const w = makeWalker({ mirrorKeys: [] })
  w.walk(data)
  writeFileSync('data/seed/pages.json', JSON.stringify(data, null, 2) + '\n')
  const { filled, matched } = w.stats()
  console.log(`pages.json: filled ${filled} (matched ${matched.size} keys)`)
}

// events: dictionary for the real location; mirror only brand-name captions.
// `_sample` template prose is skipped (keys starting with "_").
{
  const data = JSON.parse(readFileSync('data/seed/events.json', 'utf8'))
  const w = makeWalker({ mirrorKeys: ['caption'] })
  w.walk(data)
  writeFileSync('data/seed/events.json', JSON.stringify(data, null, 2) + '\n')
  const { filled, mirrored } = w.stats()
  console.log(`events.json: filled ${filled} (dict) + mirrored ${mirrored} brand captions`)
}
