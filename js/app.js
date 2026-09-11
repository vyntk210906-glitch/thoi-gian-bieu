/**
 * Timetable Generator App - Enhanced for Students
 * Cute Design, Exact Photo Layout, Reusable Activities & Clean Export
 */

// Application State
let state = {
  title: "THỜI GIAN BIỂU",
  studentName: "Trịnh Xuân Khang",
  subtitle: "",
  mascotTheme: "boys",
  layoutMode: "photo", // 'photo', '7cols', '5cols', 'free'
  fontTheme: "nunito",
  themePalette: "rainbow",
  cards: []
};

// Common reusable activities bank for students
const COMMON_ACTIVITIES_BANK = [
  { time: "Sáng (07h30 - 11h50)", text: "Học chính tại trường", icon: "🏫", section: "Sáng:" },
  { time: "11h50 - 13h30", text: "Ăn trưa & Nghỉ ngơi", icon: "🍱", section: "Trưa:" },
  { time: "13h30 - 14h30", text: "Ngủ trưa", icon: "🛏️", section: "Chiều:" },
  { time: "14h30 - 15h30", text: "Làm bài tập về nhà", icon: "📝", section: "Chiều:" },
  { time: "15h30 - 16h30", text: "Tập gym / thể thao", icon: "🏋️", section: "Chiều:" },
  { time: "16h30 - 16h45", text: "Tắm rửa, chuẩn bị nhanh", icon: "🚿", section: "Chiều:" },
  { time: "16h45", text: "Di chuyển đi học", icon: "🚌", section: "Chiều:" },
  { time: "17h00 - 19h00", text: "Học thêm tiếng Anh", icon: "🇬🇧", section: "Tối:" },
  { time: "19h00 - 20h00", text: "Về nhà, ăn tối", icon: "🍽️", section: "Tối:" },
  { time: "20h00 - 21h30", text: "Soạn sách vở, quần áo, hoàn thành BTVN", icon: "🎒", section: "Tối:" },
  { time: "21h30 - 22h00", text: "Đọc sách/truyện và đi ngủ", icon: "📖", section: "Tối:" },
  { time: "21h30 trở đi", text: "Nghỉ ngơi và đi ngủ", icon: "😴", section: "Tối:" }
];

let editingSlotInfo = null; // { cardId, slotId }
let editingCardId = null;
let currentSelectedIcon = '🕒';
let isIconManuallyChosen = false;

const PRESET_COLORS = [
  '#2563eb', // Blue (T2)
  '#16a34a', // Green (T3)
  '#f59e0b', // Yellow/Amber (T4)
  '#dc2626', // Red (T5)
  '#ea580c', // Orange (T6)
  '#7c3aed', // Purple (T7)
  '#0d9488', // Teal (CN)
  '#db2777', // Pink
  '#475569'  // Slate
];

function initApp() {
  loadSavedState();
  buildIconPickerGrid();
  buildQuickActivityBank();
  renderApp();
  setupEventListeners();
}

function loadSavedState() {
  const saved = localStorage.getItem('thoi_gian_bieu_state_v2');
  if (saved) {
    try {
      state = JSON.parse(saved);
      if (!state.layoutMode || state.layoutMode === '2rows') state.layoutMode = 'photo';
      if (!state.themePalette) state.themePalette = 'rainbow';
      return;
    } catch (e) {
      console.warn("Lỗi đọc dữ liệu đã lưu, dùng mẫu mặc định:", e);
    }
  }
  loadPreset('original');
}

function saveState() {
  localStorage.setItem('thoi_gian_bieu_state_v2', JSON.stringify(state));
}

function loadPreset(name) {
  if (name === 'original') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_ORIGINAL));
  } else if (name === '7days') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_STANDARD_7DAYS));
  } else if (name === '5days') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_SCHOOL_5DAYS));
  }
  if (!state.themePalette) state.themePalette = 'rainbow';
  saveState();
  renderApp();
  showToast("Đã tải dữ liệu mẫu chuẩn ảnh thành công! 🌟");
}

function renderApp() {
  const studentNameInput = document.getElementById('input-student-name');
  if (studentNameInput) studentNameInput.value = state.studentName;

  const layoutSelect = document.getElementById('select-layout');
  if (layoutSelect) layoutSelect.value = state.layoutMode;

  const mascotSelect = document.getElementById('select-mascot');
  if (mascotSelect) mascotSelect.value = state.mascotTheme;

  const themeSelect = document.getElementById('select-theme');
  if (themeSelect) themeSelect.value = state.themePalette || 'rainbow';

  const sheet = document.getElementById('timetable-sheet');
  if (sheet) {
    sheet.className = `timetable-sheet theme-${state.themePalette || 'rainbow'}`;
  }

  renderHeader();
  renderGrid();
}

function renderHeader() {
  const mascotLeft = document.getElementById('mascot-left');
  const mascotRight = document.getElementById('mascot-right');
  const bannerTitle = document.getElementById('banner-title-text');
  const bannerSubtitle = document.getElementById('banner-subtitle-text');

  bannerTitle.innerHTML = `<span class="title-prefix">${state.title}</span> <span class="title-sep">-</span> <span class="student-name-highlight">${state.studentName}</span>`;
  if (bannerSubtitle) {
    if (state.subtitle && state.subtitle.trim() !== '') {
      bannerSubtitle.textContent = state.subtitle;
      bannerSubtitle.style.display = 'block';
    } else {
      bannerSubtitle.style.display = 'none';
    }
  }

  if (state.mascotTheme === 'boys') {
    mascotLeft.innerHTML = `<img class="mascot-img" src="assets/boy_left_auth.png" alt="Bé trai" />`;
    mascotRight.innerHTML = `<img class="mascot-img" src="assets/boy_right_auth.png" alt="Bé trai" />`;
    mascotLeft.style.display = 'flex';
    mascotRight.style.display = 'flex';
  } else if (state.mascotTheme === 'girls') {
    mascotLeft.innerHTML = `<img class="mascot-img" src="assets/girl-left.svg" alt="Bé gái" />`;
    mascotRight.innerHTML = `<img class="mascot-img" src="assets/girl-right.svg" alt="Bé gái" />`;
    mascotLeft.style.display = 'flex';
    mascotRight.style.display = 'flex';
  } else if (state.mascotTheme === 'mixed') {
    mascotLeft.innerHTML = `<img class="mascot-img" src="assets/boy_left_auth.png" alt="Bé trai" />`;
    mascotRight.innerHTML = `<img class="mascot-img" src="assets/girl-right.svg" alt="Bé gái" />`;
    mascotLeft.style.display = 'flex';
    mascotRight.style.display = 'flex';
  } else {
    mascotLeft.style.display = 'none';
    mascotRight.style.display = 'none';
  }
}

function renderGrid() {
  const gridContainer = document.getElementById('timetable-grid');
  gridContainer.className = `grid-container grid-${state.layoutMode}`;
  gridContainer.innerHTML = '';

  state.cards.forEach((card, cardIndex) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'time-card';
    cardEl.dataset.cardId = card.id;

    // Apply color border matching the pill color (exact match to photo!)
    cardEl.style.borderColor = card.color || '#cbd5e1';

    // Apply exact grid placement if photo layout mode
    if (state.layoutMode === 'photo') {
      if (card.gridCol) cardEl.style.gridColumn = card.gridCol;
      if (card.gridSpan) cardEl.style.gridRow = `1 / span ${card.gridSpan}`;
      else if (card.gridRow) cardEl.style.gridRow = card.gridRow;
    } else {
      cardEl.style.gridColumn = '';
      cardEl.style.gridRow = '';
    }

    // Card Action buttons (hidden in export/print)
    const actionsEl = document.createElement('div');
    actionsEl.className = 'card-actions no-print';
    actionsEl.innerHTML = `
      <button class="card-action-btn" title="Sao chép toàn bộ lịch ngày này" onclick="openDuplicateCardModal('${card.id}')">📋</button>
      <button class="card-action-btn" title="Đổi màu & Tên" onclick="openEditCardModal('${card.id}')">🎨</button>
      <button class="card-action-btn" title="Xóa cột này" onclick="deleteCard('${card.id}')">🗑️</button>
    `;
    cardEl.appendChild(actionsEl);

    // Header Pill
    const pillEl = document.createElement('div');
    pillEl.className = 'card-header-pill';
    pillEl.style.backgroundColor = card.color || '#2563eb';
    pillEl.title = 'Bấm để đổi tên & màu';
    pillEl.innerHTML = `<span>${card.title}</span>`;
    pillEl.onclick = () => openEditCardModal(card.id);
    cardEl.appendChild(pillEl);

    // Slot Items
    const slotsContainer = document.createElement('div');
    slotsContainer.className = 'card-slots';

    card.slots.forEach((slot, slotIndex) => {
      // Optional Section Label (e.g. Chiều:, Tối:)
      if (slot.section) {
        const sectionLabel = document.createElement('div');
        sectionLabel.className = 'section-divider-label';
        sectionLabel.textContent = slot.section;
        slotsContainer.appendChild(sectionLabel);
      }

      const slotEl = document.createElement('div');
      slotEl.className = 'slot-item';
      slotEl.dataset.slotId = slot.id;

      slotEl.innerHTML = `
        <span class="slot-icon-badge" title="Bấm để đổi icon" onclick="event.stopPropagation(); openQuickIconPicker('${card.id}', '${slot.id}')">${slot.icon || '🕒'}</span>
        <div class="slot-details" onclick="openEditSlotModal('${card.id}', '${slot.id}')">
          ${slot.time ? `<span class="slot-time">${slot.time}:</span>` : ''}
          <span class="slot-text">${slot.text}</span>
        </div>
        <div class="slot-controls no-print">
          <button class="slot-ctrl-btn" title="Lên trên" onclick="event.stopPropagation(); moveSlot('${card.id}', ${slotIndex}, -1)">▲</button>
          <button class="slot-ctrl-btn" title="Xuống dưới" onclick="event.stopPropagation(); moveSlot('${card.id}', ${slotIndex}, 1)">▼</button>
          <button class="slot-ctrl-btn" title="Sửa & Áp dụng nhiều ngày" onclick="event.stopPropagation(); openEditSlotModal('${card.id}', '${slot.id}')">✏️</button>
          <button class="slot-ctrl-btn btn-del" title="Xóa" onclick="event.stopPropagation(); deleteSlot('${card.id}', '${slot.id}')">✕</button>
        </div>
      `;

      slotsContainer.appendChild(slotEl);
    });

    cardEl.appendChild(slotsContainer);

    // Bottom "+ Thêm hoạt động" button (strictly hidden in print/export!)
    const addSlotBtn = document.createElement('button');
    addSlotBtn.className = 'add-slot-btn no-print';
    addSlotBtn.innerHTML = `<span>+ Thêm hoạt động</span>`;
    addSlotBtn.onclick = () => openAddSlotModal(card.id);
    cardEl.appendChild(addSlotBtn);

    gridContainer.appendChild(cardEl);
  });
}

// Reusable Activity Bank
function buildQuickActivityBank() {
  const container = document.getElementById('quick-bank-chips');
  if (!container) return;
  container.innerHTML = '';

  COMMON_ACTIVITIES_BANK.forEach(item => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'bank-chip';
    chip.innerHTML = `<span>${item.icon}</span> <span>${item.text}</span>`;
    chip.title = `${item.time} - ${item.text}`;
    chip.onclick = () => applyQuickActivity(item);
    container.appendChild(chip);
  });
}

function applyQuickActivity(item) {
  document.getElementById('slot-time-input').value = item.time;
  document.getElementById('slot-text-input').value = item.text;
  document.getElementById('slot-section-select').value = item.section || '';
  chooseIcon(item.icon);
  showToast(`Đã áp dụng mẫu: ${item.text}`);
}

function renderMultiDayCheckboxes(targetCardId) {
  const container = document.getElementById('multiday-checkboxes');
  if (!container) return;
  container.innerHTML = '';

  state.cards.forEach(card => {
    const label = document.createElement('label');
    label.className = 'day-check-label';
    const isChecked = card.id === targetCardId;
    label.innerHTML = `
      <input type="checkbox" name="apply_days" value="${card.id}" ${isChecked ? 'checked' : ''}>
      <span class="day-check-badge" style="border-left: 4px solid ${card.color || '#2563eb'};">${card.title}</span>
    `;
    container.appendChild(label);
  });
}

function setMultiDaySelection(mode) {
  const checkboxes = document.querySelectorAll('input[name="apply_days"]');
  if (mode === 'all') {
    checkboxes.forEach(cb => cb.checked = true);
  } else if (mode === 'current') {
    checkboxes.forEach(cb => cb.checked = (cb.value === editingSlotInfo?.cardId));
  } else if (mode === 'weekdays') {
    checkboxes.forEach(cb => {
      const card = state.cards.find(c => c.id === cb.value);
      if (!card) return;
      const title = card.title.toLowerCase();
      const isWeekday = title.includes('hai') || title.includes('ba') || title.includes('tư') || title.includes('năm') || title.includes('sáu') || title.includes('2') || title.includes('3') || title.includes('4') || title.includes('5') || title.includes('6');
      cb.checked = isWeekday;
    });
  }
}

// Slot Management
function openAddSlotModal(cardId) {
  editingSlotInfo = { cardId, slotId: null };
  isIconManuallyChosen = false;
  currentSelectedIcon = '🕒';

  document.getElementById('modal-slot-title').textContent = 'Thêm Hoạt Động Cho Bé';
  document.getElementById('slot-time-input').value = '';
  document.getElementById('slot-text-input').value = '';
  document.getElementById('slot-section-select').value = '';
  document.getElementById('current-icon-display').textContent = currentSelectedIcon;
  document.getElementById('icon-hint-text').textContent = 'Tự động chọn icon cute theo từ khóa khi nhập';

  renderMultiDayCheckboxes(cardId);
  openModal('modal-slot');
  setTimeout(() => document.getElementById('slot-text-input').focus(), 100);
}

function openEditSlotModal(cardId, slotId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const slot = card.slots.find(s => s.id === slotId);
  if (!slot) return;

  editingSlotInfo = { cardId, slotId };
  isIconManuallyChosen = true;
  currentSelectedIcon = slot.icon || '🕒';

  document.getElementById('modal-slot-title').textContent = 'Sửa Hoạt Động & Nhân Bản Lịch';
  document.getElementById('slot-time-input').value = slot.time || '';
  document.getElementById('slot-text-input').value = slot.text || '';
  document.getElementById('slot-section-select').value = slot.section || '';
  document.getElementById('current-icon-display').textContent = currentSelectedIcon;
  document.getElementById('icon-hint-text').textContent = 'Icon hiện tại (bấm icon hoặc chọn bên dưới để đổi)';

  renderMultiDayCheckboxes(cardId);
  openModal('modal-slot');
}

function saveSlot() {
  if (!editingSlotInfo) return;
  const { cardId, slotId } = editingSlotInfo;

  const time = document.getElementById('slot-time-input').value.trim();
  const text = document.getElementById('slot-text-input').value.trim();
  const section = document.getElementById('slot-section-select').value;
  const icon = currentSelectedIcon || '🕒';

  if (!text) {
    alert('Vui lòng nhập nội dung hoạt động!');
    return;
  }

  const selectedDayIds = Array.from(document.querySelectorAll('input[name="apply_days"]:checked')).map(cb => cb.value);
  if (selectedDayIds.length === 0) {
    selectedDayIds.push(cardId);
  }

  if (slotId && selectedDayIds.length === 1 && selectedDayIds[0] === cardId) {
    const card = state.cards.find(c => c.id === cardId);
    if (card) {
      const slot = card.slots.find(s => s.id === slotId);
      if (slot) {
        slot.time = time;
        slot.text = text;
        slot.section = section;
        slot.icon = icon;
      }
    }
    showToast('Đã cập nhật hoạt động!');
  } else {
    selectedDayIds.forEach(targetId => {
      const card = state.cards.find(c => c.id === targetId);
      if (!card) return;

      if (slotId && targetId === cardId) {
        const slot = card.slots.find(s => s.id === slotId);
        if (slot) {
          slot.time = time;
          slot.text = text;
          slot.section = section;
          slot.icon = icon;
        }
      } else {
        const newSlot = {
          id: 's_' + Date.now() + Math.random().toString(36).substr(2, 4),
          time,
          text,
          section,
          icon
        };
        card.slots.push(newSlot);
      }
    });

    if (selectedDayIds.length > 1) {
      showToast(`Đã nhân bản hoạt động sang ${selectedDayIds.length} ngày! 🎉`);
    } else {
      showToast('Đã thêm hoạt động mới!');
    }
  }

  saveState();
  renderGrid();
  closeModal('modal-slot');
}

function deleteSlot(cardId, slotId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  card.slots = card.slots.filter(s => s.id !== slotId);
  saveState();
  renderGrid();
  showToast('Đã xóa hoạt động!');
}

function moveSlot(cardId, index, direction) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= card.slots.length) return;

  const temp = card.slots[index];
  card.slots[index] = card.slots[newIndex];
  card.slots[newIndex] = temp;

  saveState();
  renderGrid();
}

function setQuickTime(val) {
  document.getElementById('slot-time-input').value = val;
}

// Card Duplication
let duplicatingSourceCardId = null;

function openDuplicateCardModal(cardId) {
  duplicatingSourceCardId = cardId;
  const srcCard = state.cards.find(c => c.id === cardId);
  if (!srcCard) return;

  document.getElementById('dup-source-name').textContent = srcCard.title;
  const container = document.getElementById('dup-targets-list');
  container.innerHTML = '';

  state.cards.forEach(card => {
    if (card.id === cardId) return;
    const label = document.createElement('label');
    label.className = 'day-check-label';
    label.innerHTML = `
      <input type="checkbox" name="dup_target" value="${card.id}">
      <span class="day-check-badge" style="border-left: 4px solid ${card.color || '#2563eb'};">${card.title} (${card.slots.length} lịch)</span>
    `;
    container.appendChild(label);
  });

  openModal('modal-duplicate');
}

function executeDuplicateCard() {
  if (!duplicatingSourceCardId) return;
  const srcCard = state.cards.find(c => c.id === duplicatingSourceCardId);
  if (!srcCard) return;

  const targets = Array.from(document.querySelectorAll('input[name="dup_target"]:checked')).map(cb => cb.value);
  if (targets.length === 0) {
    alert('Vui lòng chọn ít nhất một ngày để sao chép!');
    return;
  }

  const mode = document.querySelector('input[name="dup_mode"]:checked')?.value || 'append';

  targets.forEach(targetId => {
    const targetCard = state.cards.find(c => c.id === targetId);
    if (!targetCard) return;

    const clonedSlots = srcCard.slots.map(s => ({
      ...s,
      id: 's_' + Date.now() + Math.random().toString(36).substr(2, 4)
    }));

    if (mode === 'replace') {
      targetCard.slots = clonedSlots;
    } else {
      targetCard.slots.push(...clonedSlots);
    }
  });

  saveState();
  renderGrid();
  closeModal('modal-duplicate');
  showToast(`Đã sao chép lịch sang ${targets.length} ngày thành công! 📋`);
}

// Card Management
function openAddCardModal() {
  document.getElementById('card-modal-title').textContent = 'Thêm Cột / Ngày Mới';
  document.getElementById('card-title-input').value = 'THỨ ' + (state.cards.length + 1);
  editingCardId = null;
  selectCardColor(PRESET_COLORS[state.cards.length % PRESET_COLORS.length]);
  openModal('modal-card');
}

function openEditCardModal(cardId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;

  document.getElementById('card-modal-title').textContent = 'Sửa Cột / Ngày';
  document.getElementById('card-title-input').value = card.title;
  editingCardId = cardId;
  selectCardColor(card.color || '#2563eb');
  openModal('modal-card');
}

function selectCardColor(hex) {
  document.getElementById('card-color-input').value = hex;
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.color === hex);
  });
}

function saveCard() {
  const title = document.getElementById('card-title-input').value.trim();
  const color = document.getElementById('card-color-input').value;

  if (!title) {
    alert('Vui lòng nhập tiêu đề cột!');
    return;
  }

  if (editingCardId) {
    const card = state.cards.find(c => c.id === editingCardId);
    if (card) {
      card.title = title;
      card.color = color;
    }
    showToast('Đã cập nhật thông tin cột!');
  } else {
    const newCard = {
      id: 'col_' + Date.now(),
      title,
      color,
      slots: []
    };
    state.cards.push(newCard);
    showToast('Đã thêm cột mới!');
  }

  saveState();
  renderGrid();
  closeModal('modal-card');
}

function deleteCard(cardId) {
  if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ cột này không?')) return;
  state.cards = state.cards.filter(c => c.id !== cardId);
  saveState();
  renderGrid();
  showToast('Đã xóa cột!');
}

function openHeaderEditModal() {
  document.getElementById('header-title-input').value = state.title;
  document.getElementById('header-student-input').value = state.studentName;
  document.getElementById('header-sub-input').value = state.subtitle || '';
  openModal('modal-header-edit');
}

function saveHeaderEdit() {
  state.title = document.getElementById('header-title-input').value.trim() || 'THỜI GIAN BIỂU';
  state.studentName = document.getElementById('header-student-input').value.trim() || 'Học Sinh';
  state.subtitle = document.getElementById('header-sub-input').value.trim();

  saveState();
  renderHeader();
  closeModal('modal-header-edit');
  showToast('Đã cập nhật tiêu đề!');
}

function openQuickIconPicker(cardId, slotId) {
  openEditSlotModal(cardId, slotId);
  document.getElementById('icon-picker-box').scrollIntoView({ behavior: 'smooth' });
}

function handleSlotTextInput(text) {
  if (isIconManuallyChosen) return;

  const matched = window.TimetableIcons.matchIconForText(text);
  if (matched) {
    currentSelectedIcon = matched;
    const badge = document.getElementById('current-icon-display');
    badge.textContent = matched;
    badge.style.transform = 'scale(1.25)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
    document.getElementById('icon-hint-text').textContent = `Đã tự động chọn icon "${matched}" theo từ khóa`;
  }
}

function chooseIcon(iconChar) {
  currentSelectedIcon = iconChar;
  isIconManuallyChosen = true;
  document.getElementById('current-icon-display').textContent = iconChar;
  document.getElementById('icon-hint-text').textContent = `Đã chọn: ${iconChar}`;

  document.querySelectorAll('.icon-opt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === iconChar);
  });
}

function buildIconPickerGrid() {
  const container = document.getElementById('icon-picker-box');
  if (!container) return;
  container.innerHTML = '';

  window.TimetableIcons.ICON_CATEGORIES.forEach(cat => {
    const title = document.createElement('div');
    title.className = 'icon-category-title';
    title.textContent = cat.name;
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'icon-category-grid';

    cat.icons.forEach(ic => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'icon-opt-btn';
      btn.textContent = ic;
      btn.onclick = () => chooseIcon(ic);
      grid.appendChild(btn);
    });

    container.appendChild(grid);
  });

  const colorContainer = document.getElementById('color-swatches-container');
  if (colorContainer) {
    colorContainer.innerHTML = '';
    PRESET_COLORS.forEach(hex => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = hex;
      swatch.dataset.color = hex;
      swatch.onclick = () => selectCardColor(hex);
      colorContainer.appendChild(swatch);
    });
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==========================================
// EXPORT TO PDF & PRINT (STRICT CLEAN OUTPUT)
// ==========================================

function exportPDF() {
  const sheetElement = document.getElementById('timetable-sheet');
  const wrapper = document.querySelector('.timetable-sheet-wrapper');
  if (!sheetElement || !wrapper) return;

  // Add clean class to hide all functional buttons during export
  wrapper.classList.add('exporting-clean-pdf');
  document.body.classList.add('exporting-clean-pdf');

  showToast('Đang tạo file PDF tinh gọn (chỉ hiển thị nội dung)...');

  const cleanName = (state.studentName || 'HocSinh').replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');
  const filename = `Thoi_Gian_Bieu_${cleanName}.pdf`;

  const opt = {
    margin: [4, 4, 4, 4],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0,
      ignoreElements: (el) => {
        return el.classList.contains('no-print') ||
               el.classList.contains('add-slot-btn') ||
               el.classList.contains('card-actions') ||
               el.classList.contains('slot-controls');
      }
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape'
    }
  };

  html2pdf().set(opt).from(sheetElement).save().then(() => {
    wrapper.classList.remove('exporting-clean-pdf');
    document.body.classList.remove('exporting-clean-pdf');
    showToast('Tải file PDF thành công! 🎉');
  }).catch(err => {
    wrapper.classList.remove('exporting-clean-pdf');
    document.body.classList.remove('exporting-clean-pdf');
    console.error("Lỗi xuất PDF:", err);
    alert('Không thể tạo PDF tự động. Bạn có thể sử dụng nút "In Thời Gian Biểu" rồi chọn "Lưu dưới dạng PDF"!');
  });
}

function printTimetable() {
  window.print();
}

function setupEventListeners() {
  const studentNameInput = document.getElementById('input-student-name');
  if (studentNameInput) {
    studentNameInput.addEventListener('input', (e) => {
      state.studentName = e.target.value.trim() || 'Học Sinh';
      saveState();
      renderHeader();
    });
  }

  const layoutSelect = document.getElementById('select-layout');
  if (layoutSelect) {
    layoutSelect.addEventListener('change', (e) => {
      state.layoutMode = e.target.value;
      saveState();
      renderGrid();
    });
  }

  const mascotSelect = document.getElementById('select-mascot');
  if (mascotSelect) {
    mascotSelect.addEventListener('change', (e) => {
      state.mascotTheme = e.target.value;
      saveState();
      renderHeader();
    });
  }

  const themeSelect = document.getElementById('select-theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      state.themePalette = e.target.value;
      saveState();
      renderApp();
    });
  }

  const slotTextInput = document.getElementById('slot-text-input');
  if (slotTextInput) {
    slotTextInput.addEventListener('input', (e) => {
      handleSlotTextInput(e.target.value);
    });
  }

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
