/**
 * Timetable Presets
 * Exactly matching the original user image layout & alternate presets
 */

const PRESET_ORIGINAL = {
  title: "THỜI GIAN BIỂU",
  studentName: "Trịnh Xuân Khang",
  subtitle: "",
  mascotTheme: "boys",
  layoutMode: "photo", // 'photo' (5 Cột linh hoạt, T2 & Ghi Chú cao, các ngày ở giữa 2 tầng)
  themePalette: "rainbow",
  cards: [
    // --- CỘT 1: THỨ HAI (Cao toàn bộ cột, 2 tầng) ---
    {
      id: "card-mon",
      title: "THỨ HAI",
      color: "#1d72b8",
      spanRows: 2,
      spanCols: 1,
      slots: [
        { id: "m1", time: "Sáng (07h30 - 11h50)", text: "Học chính tại trường", icon: "🕒" },
        { id: "m2", time: "13h30 - 14h30", text: "Ngủ trưa", icon: "🛏️", section: "Chiều:" },
        { id: "m3", time: "14h30 - 15h30", text: "Làm bài tập về nhà", icon: "📝" },
        { id: "m4", time: "15h30 - 16h30", text: "Tập gym / thể thao", icon: "🏋️" },
        { id: "m5", time: "16h30 - 16h45", text: "Tắm rửa, chuẩn bị nhanh", icon: "🚿" },
        { id: "m6", time: "16h45", text: "Di chuyển đi học", icon: "🚌" },
        { id: "m7", time: "17h00 - 19h00", text: "Học thêm tiếng Anh (Cô Hương)", icon: "🇬🇧", section: "Tối:" },
        { id: "m8", time: "19h00 - 20h00", text: "Về nhà, ăn tối", icon: "🍽️" },
        { id: "m9", time: "20h00 - 21h30", text: "Soạn sách vở, quần áo, hoàn thành BTVN", icon: "🎒" },
        { id: "m10", time: "21h30 - 22h00", text: "Đọc sách/truyện và đi ngủ", icon: "📖" }
      ]
    },

    // --- CỘT 2 - TRÊN: THỨ BA (1 tầng) ---
    {
      id: "card-tue",
      title: "THỨ BA",
      color: "#239546",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "t1", time: "Sáng (07h30 - 11h50)", text: "Học chính tại trường", icon: "🕒" },
        { id: "t2", time: "13h30 - 14h30", text: "Ngủ trưa", icon: "🛏️", section: "Chiều:" },
        { id: "t3", time: "14h30 - 15h30", text: "Làm bài tập về nhà", icon: "📝" },
        { id: "t4", time: "15h30 - 16h30", text: "Tập gym / thể thao", icon: "🏋️" },
        { id: "t5", time: "16h30 - 18h30", text: "Tắm rửa, nghỉ ngơi thoải mái", icon: "🛋️" }
      ]
    },

    // --- CỘT 3 - TRÊN: THỨ TƯ (1 tầng) ---
    {
      id: "card-wed",
      title: "THỨ TƯ",
      color: "#e8a825",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "w1", time: "Sáng (07h30 - 11h50)", text: "Học chính tại trường", icon: "🕒" },
        { id: "w2", time: "13h30 - 14h30", text: "Ngủ trưa", icon: "🛏️", section: "Chiều:" },
        { id: "w3", time: "14h30 - 15h30", text: "Làm bài tập về nhà", icon: "📝" },
        { id: "w4", time: "15h30 - 16h30", text: "Tập gym / chuẩn bị", icon: "🏋️" },
        { id: "w5", time: "17h00", text: "Di chuyển đi học", icon: "🚌" }
      ]
    },

    // --- CỘT 4 - TRÊN: THỨ NĂM (1 tầng) ---
    {
      id: "card-thu",
      title: "THỨ NĂM",
      color: "#df2528",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "th1", time: "Sáng (07h30 - 11h50)", text: "Học chính tại trường", icon: "🕒" },
        { id: "th2", time: "13h30 - 14h30", text: "Ngủ trưa", icon: "🛏️", section: "Chiều:" },
        { id: "th3", time: "14h30 - 15h30", text: "Làm bài tập", icon: "📝" },
        { id: "th4", time: "15h30 - 16h30", text: "Tập gym / thể thao", icon: "🏋️" },
        { id: "th5", time: "16h30 - 16h45", text: "Tắm rửa, chuẩn bị nhanh", icon: "🚿" },
        { id: "th6", time: "16h45", text: "Di chuyển đi học", icon: "🚌" }
      ]
    },

    // --- CỘT 5: GHI CHÚ & MỤC TIÊU (Cao toàn bộ cột, 2 tầng) ---
    {
      id: "card-notes",
      title: "GHI CHÚ & MỤC TIÊU",
      color: "#ea580c",
      spanRows: 2,
      spanCols: 1,
      slots: [
        { id: "n1", time: "Mục tiêu tuần", text: "Hoàn thành bài tập trước 21h00", icon: "🎯" },
        { id: "n2", time: "Lời dặn bố mẹ", text: "Uống đủ nước, tập thể dục đều đặn", icon: "💧", section: "Lưu ý:" },
        { id: "n3", time: "Tối Chủ Nhật", text: "Chuẩn bị đồng phục & sách vở cho tuần mới", icon: "🎒" },
        { id: "n4", time: "21h30 trở đi", text: "Nghỉ ngơi, ngủ đủ giấc", icon: "😴" }
      ]
    },

    // --- CỘT 2 - DƯỚI: THỨ SÁU (1 tầng) ---
    {
      id: "card-fri",
      title: "THỨ SÁU",
      color: "#f16323",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "fb1", time: "Sáng (07h30 - 11h50)", text: "Học chính tại trường", icon: "🕒" },
        { id: "fb2", time: "13h30 - 14h30", text: "Ngủ trưa", icon: "🛏️", section: "Chiều:" },
        { id: "fb3", time: "19h30 - 20h30", text: "Về nhà, ăn tối", icon: "🍽️", section: "Tối:" },
        { id: "fb4", time: "20h30 - 21h30", text: "Kiểm tra lại BTVN, soạn sách vở", icon: "🎒" },
        { id: "fb5", time: "21h30 trở đi", text: "Nghỉ ngơi và đi ngủ", icon: "😴" }
      ]
    },

    // --- CỘT 3 - DƯỚI: THỨ BẢY (1 tầng) ---
    {
      id: "card-sat",
      title: "THỨ BẢY",
      color: "#7842a2",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "s1", time: "Sáng (07h30 - 11h50)", text: "Học chính tại trường", icon: "🕒" },
        { id: "s2", time: "13h15 - 15h00", text: "Đến trường học", icon: "🚌", section: "Chiều:" },
        { id: "s3", time: "15h00 - 17h00", text: "Đến trường học Toán - Tiếng Anh", icon: "📐" },
        { id: "s4", time: "17h00 - 18h00", text: "Tắm rửa, nghỉ ngơi", icon: "🎵" }
      ]
    },

    // --- CỘT 4 - DƯỚI: CHỦ NHẬT (1 tầng) ---
    {
      id: "card-sun",
      title: "CHỦ NHẬT",
      color: "#0b9195",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "sn1", time: "Sáng (07h30 - 11h50)", text: "Học thêm Toán Trường Anh", icon: "📐" },
        { id: "sn2", time: "18h00 - 20h00", text: "Học thêm", icon: "📚" },
        { id: "sn3", time: "20h00 - 21h00", text: "Nghỉ ngơi mẹ Từng Lâm", icon: "🛋️" },
        { id: "sn4", time: "20h00 trở đi", text: "Về nhà, ăn tối nghỉ ngơi", icon: "🍽️" }
      ]
    }
  ]
};

const PRESET_STANDARD_7DAYS = {
  title: "THỜI GIAN BIỂU HỌC TẬP & SINH HOẠT",
  studentName: "Trịnh Xuân Khang",
  subtitle: "Kế hoạch tuần từ Thứ Hai đến Chủ Nhật",
  mascotTheme: "boys",
  layoutMode: "7cols",
  themePalette: "rainbow",
  cards: [
    {
      id: "col-std-mon",
      title: "THỨ HAI",
      color: "#2563eb",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "sm1", time: "07h30 - 11h30", text: "Học chính tại trường", icon: "🏫" },
        { id: "sm2", time: "11h30 - 13h30", text: "Ăn trưa & Ngủ trưa", icon: "🛏️" },
        { id: "sm3", time: "14h00 - 16h30", text: "Làm bài tập về nhà", icon: "📝" },
        { id: "sm4", time: "16h30 - 17h30", text: "Tập thể thao, đạp xe", icon: "🚴" },
        { id: "sm5", time: "18h30 - 19h30", text: "Ăn tối cùng gia đình", icon: "🍽️" },
        { id: "sm6", time: "19h30 - 21h00", text: "Ôn bài & Tiếng Anh", icon: "🇬🇧" },
        { id: "sm7", time: "21h30", text: "Vệ sinh & Đi ngủ", icon: "😴" }
      ]
    },
    {
      id: "col-std-tue",
      title: "THỨ BA",
      color: "#16a34a",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "st1", time: "07h30 - 11h30", text: "Học chính tại trường", icon: "🏫" },
        { id: "st2", time: "11h30 - 13h30", text: "Ăn trưa & Ngủ trưa", icon: "🛏️" },
        { id: "st3", time: "14h00 - 16h30", text: "Làm bài tập Toán", icon: "📐" },
        { id: "st4", time: "16h30 - 17h30", text: "Đá bóng cùng bạn bè", icon: "⚽" },
        { id: "st5", time: "18h30 - 19h30", text: "Ăn tối & Tắm rửa", icon: "🚿" },
        { id: "st6", time: "19h30 - 21h00", text: "Đọc sách / Ôn bài", icon: "📖" },
        { id: "st7", time: "21h30", text: "Đi ngủ đúng giờ", icon: "😴" }
      ]
    },
    {
      id: "col-std-wed",
      title: "THỨ TƯ",
      color: "#f59e0b",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "sw1", time: "07h30 - 11h30", text: "Học chính tại trường", icon: "🏫" },
        { id: "sw2", time: "11h30 - 13h30", text: "Ăn trưa & Ngủ trưa", icon: "🛏️" },
        { id: "sw3", time: "14h00 - 16h30", text: "Học thêm tiếng Anh", icon: "🇬🇧" },
        { id: "sw4", time: "16h30 - 17h30", text: "Tập gym / Vận động", icon: "🏋️" },
        { id: "sw5", time: "18h30 - 19h30", text: "Ăn tối & Phụ mẹ", icon: "🍽️" },
        { id: "sw6", time: "19h30 - 21h00", text: "Soạn sách vở ngày mai", icon: "🎒" },
        { id: "sw7", time: "21h30", text: "Đi ngủ", icon: "😴" }
      ]
    },
    {
      id: "col-std-thu",
      title: "THỨ NĂM",
      color: "#dc2626",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "sth1", time: "07h30 - 11h30", text: "Học chính tại trường", icon: "🏫" },
        { id: "sth2", time: "11h30 - 13h30", text: "Ăn trưa & Ngủ trưa", icon: "🛏️" },
        { id: "sth3", time: "14h00 - 16h30", text: "Làm bài tập về nhà", icon: "📝" },
        { id: "sth4", time: "16h30 - 17h30", text: "Chơi cầu lông", icon: "🏸" },
        { id: "sth5", time: "18h30 - 19h30", text: "Ăn tối cùng gia đình", icon: "🍽️" },
        { id: "sth6", time: "19h30 - 21h00", text: "Học bài mới", icon: "📚" },
        { id: "sth7", time: "21h30", text: "Đi ngủ", icon: "😴" }
      ]
    },
    {
      id: "col-std-fri",
      title: "THỨ SÁU",
      color: "#ea580c",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "sf1", time: "07h30 - 11h30", text: "Học chính tại trường", icon: "🏫" },
        { id: "sf2", time: "11h30 - 13h30", text: "Ăn trưa & Ngủ trưa", icon: "🛏️" },
        { id: "sf3", time: "14h00 - 16h30", text: "Làm bài tập cuối tuần", icon: "📝" },
        { id: "sf4", time: "16h30 - 18h00", text: "Tập bơi / Thể thao", icon: "🏊" },
        { id: "sf5", time: "18h30 - 19h30", text: "Ăn tối cuối tuần", icon: "🍲" },
        { id: "sf6", time: "19h30 - 21h30", text: "Xem phim / Giải trí", icon: "📺" },
        { id: "sf7", time: "22h00", text: "Đi ngủ", icon: "😴" }
      ]
    },
    {
      id: "col-std-sat",
      title: "THỨ BẢY",
      color: "#7c3aed",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "ssa1", time: "08h00 - 10h00", text: "Học vẽ / Nghệ thuật", icon: "🎨" },
        { id: "ssa2", time: "10h00 - 11h30", text: "Đọc sách truyện", icon: "📖" },
        { id: "ssa3", time: "11h30 - 14h00", text: "Ăn trưa & Nghỉ ngơi", icon: "🍱" },
        { id: "ssa4", time: "15h00 - 17h00", text: "Học đàn Piano", icon: "🎹" },
        { id: "ssa5", time: "17h30 - 19h00", text: "Đi chơi dã ngoại", icon: "🎪" },
        { id: "ssa6", time: "19h30 - 21h00", text: "Chơi cờ / Game gia đình", icon: "🎮" },
        { id: "ssa7", time: "22h00", text: "Đi ngủ", icon: "😴" }
      ]
    },
    {
      id: "col-std-sun",
      title: "CHỦ NHẬT",
      color: "#0d9488",
      spanRows: 1,
      spanCols: 1,
      slots: [
        { id: "ssu1", time: "08h00 - 10h00", text: "Học thêm Toán nâng cao", icon: "📐" },
        { id: "ssu2", time: "10h00 - 11h30", text: "Dọn dẹp góc học tập", icon: "🧹" },
        { id: "ssu3", time: "11h30 - 14h00", text: "Ăn trưa & Nghỉ ngơi", icon: "🍱" },
        { id: "ssu4", time: "15h00 - 17h00", text: "Đi công viên, thể thao", icon: "🚴" },
        { id: "ssu5", time: "18h00 - 19h30", text: "Ăn tối cùng cả nhà", icon: "🍽️" },
        { id: "ssu6", time: "19h30 - 20h45", text: "Soạn sách vở cho tuần mới", icon: "🎒" },
        { id: "ssu7", time: "21h15", text: "Đi ngủ sớm đón tuần mới", icon: "😴" }
      ]
    }
  ]
};

const PRESET_SCHOOL_5DAYS = {
  title: "THỜI GIAN BIỂU HỌC TẬP TRONG TUẦN",
  studentName: "Trịnh Xuân Khang",
  subtitle: "Lịch học bán trú & Tự học tại nhà (Thứ 2 - Thứ 6)",
  mascotTheme: "boys",
  layoutMode: "5cols",
  themePalette: "rainbow",
  cards: PRESET_STANDARD_7DAYS.cards.slice(0, 5)
};

window.TimetablePresets = {
  PRESET_ORIGINAL,
  PRESET_STANDARD_7DAYS,
  PRESET_SCHOOL_5DAYS
};
