/**
 * Intelligent Vietnamese Keyword to Icon Matcher & Icon Database
 */

function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const RAW_RULES = [
  // Ngủ & Nghỉ ngơi
  { keywords: ['ngu trua', 'ngu', 'di ngu', 'giac ngu', 'chop mat'], icon: '🛏️' },
  { keywords: ['thuc day', 'bao thuc', 'day som', 'day'], icon: '⏰' },
  { keywords: ['nghi ngoi thoai mai', 'nghi ngoi va di ngu', 'nghi ngoi, di ngu', 'nghi ngoi', 'thu gian', 'thoai mai', 'ranh'], icon: '🛋️' },

  // Ăn uống
  { keywords: ['an sang', 'diem tam'], icon: '🥪' },
  { keywords: ['an trua', 'com trua'], icon: '🍱' },
  { keywords: ['ve nha an toi', 've nha, an toi', 'an toi', 'com toi', 'bua toi'], icon: '🍽️' },
  { keywords: ['an', 'com', 'uong sua', 'nau an', 'an xe', 'bua phu'], icon: '🍲' },

  // Tắm rửa & Vệ sinh
  { keywords: ['tam rua', 'tam', 'goi dau', 'tam mat'], icon: '🚿' },
  { keywords: ['chuan bi nhanh', 'danh rang', 'rua mat', 've sinh'], icon: '🧼' },

  // Thể thao & Vận động
  { keywords: ['gym', 'tap gym', 'the hinh'], icon: '🏋️' },
  { keywords: ['the thao', 'the duc', 'chay bo', 'chay'], icon: '🏃' },
  { keywords: ['bong da', 'da bong', 'da banh'], icon: '⚽' },
  { keywords: ['boi', 'boi loi', 'di boi'], icon: '🏊' },
  { keywords: ['cau long'], icon: '🏸' },
  { keywords: ['bong ro'], icon: '🏀' },
  { keywords: ['xe dap', 'dap xe'], icon: '🚴' },
  { keywords: ['vo', 'taekwondo', 'karate', 'judo'], icon: '🥋' },

  // Di chuyển & Đi lại
  { keywords: ['di chuyen di hoc', 'di chuyen', 'di hoc', 'den truong', 'xe buyt', 'bus', 'xe dua don'], icon: '🚌' },
  { keywords: ['ve nha', 'don ve', 'bo don', 'me don'], icon: '🚗' },
  { keywords: ['di bo'], icon: '🚶' },

  // Học tập & Bài vở
  { keywords: ['tieng anh', 'english', 'co huong', 'ngoai ngu'], icon: '🇬🇧' },
  { keywords: ['toan', 'toan hoc', 'hinh hoc', 'dai so', 'truong anh'], icon: '📐' },
  { keywords: ['van', 'ngu van', 'tieng viet', 'viet van'], icon: '✍️' },
  { keywords: ['vat ly', 'hoa hoc', 'sinh hoc'], icon: '🔬' },
  { keywords: ['tin hoc', 'may tinh', 'lap trinh', 'code'], icon: '💻' },
  { keywords: ['lich su', 'dia ly'], icon: '🌍' },
  { keywords: ['lam bai tap ve nha', 'kiem tra lai btvn', 'hoan thanh btvn', 'lam bai tap', 'btvn', 'lam bai', 'bai tap ve nha'], icon: '📝' },
  { keywords: ['hoc chinh tai truong', 'hoc chinh', 'truong hoc', 'lop hoc'], icon: '🏫' },
  { keywords: ['hoc them', 'lop hoc them', 'hoc phu dao', 'hoc'], icon: '📚' },
  { keywords: ['on thi', 'kiem tra', 'thi cu'], icon: '📋' },
  { keywords: ['chuan bi quan ao cho thu', 'chuan bi quan ao', 'quan ao cho thu', 'quan ao', 'dong phuc'], icon: '👕' },
  { keywords: ['soan sach vo', 'chuan bi sach vo', 'sach vo', 'cap sach'], icon: '🎒' },
  { keywords: ['doc sach truyen', 'doc sach / truyen', 'doc sach', 'doc truyen', 'truyen tranh', 'doc'], icon: '📖' },

  // Nghệ thuật & Âm nhạc & Giải trí
  { keywords: ['piano', 'guitar', 'organ', 'hoc dan', 'danh dan', 'dan'], icon: '🎹' },
  { keywords: ['hat', 'nhac', 'am nhac', 'thanh nhac'], icon: '🎵' },
  { keywords: ['ve', 'my thuat', 'to mau', 'hoi hoa'], icon: '🎨' },
  { keywords: ['xem tv', 'ti vi', 'xem phim', 'hoat hinh'], icon: '📺' },
  { keywords: ['game', 'choi game', 'tro choi'], icon: '🎮' },
  { keywords: ['choi', 'vui choi', 'cong vien'], icon: '🎪' },

  // Mốc thời gian
  { keywords: ['sang'], icon: '☀️' },
  { keywords: ['chieu'], icon: '🌤️' },
  { keywords: ['toi', 'dem'], icon: '🌙' }
];

// Flatten and sort by keyword length descending (longer specific keywords match first)
const SORTED_RULES = [];
for (const rule of RAW_RULES) {
  for (const kw of rule.keywords) {
    const cleanKw = normalizeText(kw);
    SORTED_RULES.push({ keyword: cleanKw, icon: rule.icon, len: cleanKw.length });
  }
}
SORTED_RULES.sort((a, b) => b.len - a.len);

function matchIconForText(text) {
  if (!text) return '🕒';
  const normText = ' ' + normalizeText(text) + ' ';
  for (const item of SORTED_RULES) {
    if (normText.includes(' ' + item.keyword + ' ')) {
      return item.icon;
    }
  }
  return '🕒';
}

const ICON_CATEGORIES = [
  {
    name: 'Học tập',
    icons: ['📚', '📖', '📝', '✏️', '🏫', '🎒', '📐', '✍️', '🔬', '💻', '🇬🇧', '🌍', '📋', '🎓', '🥇']
  },
  {
    name: 'Sinh hoạt & Ăn ngủ',
    icons: ['🛏️', '😴', '⏰', '🍽️', '🍱', '🥪', '🍲', '🍚', '🍎', '🥛', '🚿', '🧼', '🪥', '👕', '👔', '🧹']
  },
  {
    name: 'Thể thao & Vận động',
    icons: ['🏋️', '🏃', '⚽', '🏀', '🏊', '🏸', '🚴', '🥋', '👟', '🏆', '🎯', '🤸']
  },
  {
    name: 'Di chuyển',
    icons: ['🚌', '🚗', '🛵', '🚲', '🚶', '🚂', '✈️', '🏠']
  },
  {
    name: 'Giải trí & Nghệ thuật',
    icons: ['🎨', '🎵', '🎹', '🎸', '🎮', '📺', '🎧', '💃', '🎪', '🧸', '🍿', '🏖️']
  },
  {
    name: 'Thời gian & Cảm xúc',
    icons: ['☀️', '🌤️', '🌙', '⭐', '✨', '🕒', '⏳', '❤️', '🌟', '💡', '🔔', '🎉']
  }
];

window.TimetableIcons = {
  matchIconForText,
  normalizeText,
  ICON_CATEGORIES
};
