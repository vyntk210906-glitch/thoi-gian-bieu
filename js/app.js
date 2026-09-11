/**
 * Timetable Generator App
 */

// Application State
let state = {
  title: "THỜI GIAN BIỂU",
  studentName: "Trịnh Xuân Khang",
  subtitle: "Kế hoạch sinh hoạt và học tập",
  mascotTheme: "boys", // 'boys', 'girls', 'mixed', 'none'
  layoutMode: "2rows", // '2rows', '7cols', '5cols', 'free'
  fontTheme: "nunito",
  cards: []
};

// Currently editing pointers
let editingSlotInfo = null; // { cardId, slotId }
let editingCardId = null;
let currentSelectedIcon = '🕒';
let isIconManuallyChosen = false;

// Predefined color palette
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

// Initialize application
function initApp() {
  loadSavedState();
  buildIconPickerGrid();
  renderApp();
  setupEventListeners();
}

// Load state from localStorage or load default preset
function loadSavedState() {
  const saved = localStorage.getItem('thoi_gian_bieu_state');
  if (saved) {
    try {
      state = JSON.parse(saved);
      return;
    } catch (e) {
      console.warn("Lỗi đọc dữ liệu đã lưu, dùng mẫu mặc định:", e);
    }
  }
  // Load original photo preset by default
  loadPreset('original');
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('thoi_gian_bieu_state', JSON.stringify(state));
}

// Load a specific preset
function loadPreset(name) {
  if (name === 'original') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_ORIGINAL));
  } else if (name === '7days') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_STANDARD_7DAYS));
  } else if (name === '5days') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_SCHOOL_5DAYS));
  }
  saveState();
  renderApp();
  showToast("Đã tải dữ liệu mẫu thành công!");
}

// Render the entire sheet and UI
function renderApp() {
  // Sync form inputs in toolbar
  const studentNameInput = document.getElementById('input-student-name');
  if (studentNameInput) studentNameInput.value = state.studentName;

  const layoutSelect = document.getElementById('select-layout');
  if (layoutSelect) layoutSelect.value = state.layoutMode;

  const mascotSelect = document.getElementById('select-mascot');
  if (mascotSelect) mascotSelect.value = state.mascotTheme;

  // Render header
  renderHeader();

  // Render timetable grid
  renderGrid();
}

// Render Header Banner and Mascots
function renderHeader() {
  const mascotLeft = document.getElementById('mascot-left');
  const mascotRight = document.getElementById('mascot-right');
  const bannerTitle = document.getElementById('banner-title-text');
  const bannerSubtitle = document.getElementById('banner-subtitle-text');

  // Set titles
  bannerTitle.innerHTML = `${state.title} - <span class="student-name-highlight">${state.studentName}</span>`;
  bannerSubtitle.textContent = state.subtitle || '';

  // Mascot graphics
  if (state.mascotTheme === 'boys') {
    mascotLeft.innerHTML = `<img class="mascot-img" src="assets/boy-left.svg" alt="Boy Student" />`;
    mascotRight.innerHTML = `<img class="mascot-img" src="assets/boy-right.svg" alt="Boy Reading" />`;
    mascotLeft.style.display = 'flex';
    mascotRight.style.display = 'flex';
  } else if (state.mascotTheme === 'girls') {
    mascotLeft.innerHTML = `<img class="mascot-img" src="assets/girl-left.svg" alt="Girl Student" />`;
    mascotRight.innerHTML = `<img class="mascot-img" src="assets/girl-right.svg" alt="Girl Reading" />`;
    mascotLeft.style.display = 'flex';
    mascotRight.style.display = 'flex';
  } else if (state.mascotTheme === 'mixed') {
    mascotLeft.innerHTML = `<img class="mascot-img" src="assets/boy-left.svg" alt="Boy Student" />`;
    mascotRight.innerHTML = `<img class="mascot-img" src="assets/girl-right.svg" alt="Girl Reading" />`;
    mascotLeft.style.display = 'flex';
    mascotRight.style.display = 'flex';
  } else {
    mascotLeft.style.display = 'none';
    mascotRight.style.display = 'none';
  }
}

// Render Timetable Grid Cards
function renderGrid() {
  const gridContainer = document.getElementById('timetable-grid');
  gridContainer.className = `grid-container grid-${state.layoutMode}`;
  gridContainer.innerHTML = '';

  state.cards.forEach((card, cardIndex) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'time-card';
    cardEl.dataset.cardId = card.id;

    // Card Action buttons (delete, edit color)
    const actionsEl = document.createElement('div');
    actionsEl.className = 'card-actions no-print';
    actionsEl.innerHTML = `
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
        <span class="slot-icon" title="Bấm để đổi icon" onclick="event.stopPropagation(); openQuickIconPicker('${card.id}', '${slot.id}')">${slot.icon || '🕒'}</span>
        <div class="slot-details" onclick="openEditSlotModal('${card.id}', '${slot.id}')">
          <span class="slot-time">${slot.time ? slot.time + ':' : ''}</span>
          <span class="slot-text">${slot.text}</span>
        </div>
        <div class="slot-controls no-print">
          <button class="slot-ctrl-btn" title="Lên trên" onclick="event.stopPropagation(); moveSlot('${card.id}', ${slotIndex}, -1)">▲</button>
          <button class="slot-ctrl-btn" title="Xuống dưới" onclick="event.stopPropagation(); moveSlot('${card.id}', ${slotIndex}, 1)">▼</button>
          <button class="slot-ctrl-btn" title="Sửa" onclick="event.stopPropagation(); openEditSlotModal('${card.id}', '${slot.id}')">✏️</button>
          <button class="slot-ctrl-btn btn-del" title="Xóa" onclick="event.stopPropagation(); deleteSlot('${card.id}', '${slot.id}')">✕</button>
        </div>
      `;

      slotsContainer.appendChild(slotEl);
    });

    cardEl.appendChild(slotsContainer);

    // Bottom "+ Thêm hoạt động" button
    const addSlotBtn = document.createElement('button');
    addSlotBtn.className = 'add-slot-btn no-print';
    addSlotBtn.innerHTML = `<span>+ Thêm hoạt động</span>`;
    addSlotBtn.onclick = () => openAddSlotModal(card.id);
    cardEl.appendChild(addSlotBtn);

    gridContainer.appendChild(cardEl);
  });
}

// ==========================================
// SLOT & CARD CRUD OPERATIONS
// ==========================================

function openAddSlotModal(cardId) {
  editingSlotInfo = { cardId, slotId: null };
  isIconManuallyChosen = false;
  currentSelectedIcon = '🕒';

  document.getElementById('modal-slot-title').textContent = 'Thêm Hoạt Động Mới';
  document.getElementById('slot-time-input').value = '';
  document.getElementById('slot-text-input').value = '';
  document.getElementById('slot-section-select').value = '';
  document.getElementById('current-icon-display').textContent = currentSelectedIcon;
  document.getElementById('icon-hint-text').textContent = 'Tự động chọn theo từ khóa khi nhập nội dung';

  openModal('modal-slot');
  setTimeout(() => document.getElementById('slot-text-input').focus(), 100);
}

function openEditSlotModal(cardId, slotId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const slot = card.slots.find(s => s.id === slotId);
  if (!slot) return;

  editingSlotInfo = { cardId, slotId };
  isIconManuallyChosen = true; // Preserve user's icon
  currentSelectedIcon = slot.icon || '🕒';

  document.getElementById('modal-slot-title').textContent = 'Sửa Hoạt Động';
  document.getElementById('slot-time-input').value = slot.time || '';
  document.getElementById('slot-text-input').value = slot.text || '';
  document.getElementById('slot-section-select').value = slot.section || '';
  document.getElementById('current-icon-display').textContent = currentSelectedIcon;
  document.getElementById('icon-hint-text').textContent = 'Icon hiện tại (bấm icon hoặc chọn bên dưới để đổi)';

  openModal('modal-slot');
}

function saveSlot() {
  if (!editingSlotInfo) return;
  const { cardId, slotId } = editingSlotInfo;
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;

  const time = document.getElementById('slot-time-input').value.trim();
  const text = document.getElementById('slot-text-input').value.trim();
  const section = document.getElementById('slot-section-select').value;
  const icon = currentSelectedIcon || '🕒';

  if (!text) {
    alert('Vui lòng nhập nội dung hoạt động!');
    return;
  }

  if (slotId) {
    // Edit existing
    const slot = card.slots.find(s => s.id === slotId);
    if (slot) {
      slot.time = time;
      slot.text = text;
      slot.section = section;
      slot.icon = icon;
    }
    showToast('Đã cập nhật hoạt động!');
  } else {
    // Add new
    const newSlot = {
      id: 's_' + Date.now() + Math.random().toString(36).substr(2, 4),
      time,
      text,
      section,
      icon
    };
    card.slots.push(newSlot);
    showToast('Đã thêm hoạt động mới!');
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

// Quick fill time chips in modal
function setQuickTime(val) {
  document.getElementById('slot-time-input').value = val;
}

// Card Management (Add / Edit / Delete Card)
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

// Edit Header Title & Student Name Modal
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

// Quick Icon Picker Popover
function openQuickIconPicker(cardId, slotId) {
  openEditSlotModal(cardId, slotId);
  // Focus into icon picker
  document.getElementById('icon-picker-box').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// SMART ICON AUTO-SELECTION & PICKER
// ==========================================

function handleSlotTextInput(text) {
  if (isIconManuallyChosen) return; // User already chose one manually

  const matched = window.TimetableIcons.matchIconForText(text);
  if (matched) {
    currentSelectedIcon = matched;
    const badge = document.getElementById('current-icon-display');
    badge.textContent = matched;
    badge.style.transform = 'scale(1.25)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
    document.getElementById('icon-hint-text').textContent = `Đã tự động chọn icon "${matched}" theo nội dung`;
  }
}

function chooseIcon(iconChar) {
  currentSelectedIcon = iconChar;
  isIconManuallyChosen = true;
  document.getElementById('current-icon-display').textContent = iconChar;
  document.getElementById('icon-hint-text').textContent = `Đã chọn thủ công: ${iconChar}`;

  // Update active state in grid
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

  // Build color swatches
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

// ==========================================
// MODAL CONTROLS & HELPERS
// ==========================================

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
// EXPORT TO PDF & PRINT
// ==========================================

function exportPDF() {
  const sheetElement = document.getElementById('timetable-sheet');
  if (!sheetElement) return;

  showToast('Đang tạo file PDF chất lượng cao, xin chờ giây lát...');

  const cleanName = (state.studentName || 'HocSinh').replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');
  const filename = `Thoi_Gian_Bieu_${cleanName}.pdf`;

  const opt = {
    margin: [4, 4, 4, 4],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 3, // High-res 300DPI
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape'
    }
  };

  html2pdf().set(opt).from(sheetElement).save().then(() => {
    showToast('Tải file PDF thành công! 🎉');
  }).catch(err => {
    console.error("Lỗi xuất PDF:", err);
    alert('Không thể tạo PDF tự động. Bạn có thể sử dụng nút "In Thời Gian Biểu" rồi chọn "Lưu dưới dạng PDF"!');
  });
}

function printTimetable() {
  window.print();
}

// ==========================================
// EVENT LISTENERS & SHORTCUTS
// ==========================================

function setupEventListeners() {
  // Live student name change from toolbar
  const studentNameInput = document.getElementById('input-student-name');
  if (studentNameInput) {
    studentNameInput.addEventListener('input', (e) => {
      state.studentName = e.target.value.trim() || 'Học Sinh';
      saveState();
      renderHeader();
    });
  }

  // Layout mode switcher
  const layoutSelect = document.getElementById('select-layout');
  if (layoutSelect) {
    layoutSelect.addEventListener('change', (e) => {
      state.layoutMode = e.target.value;
      saveState();
      renderGrid();
    });
  }

  // Mascot switcher
  const mascotSelect = document.getElementById('select-mascot');
  if (mascotSelect) {
    mascotSelect.addEventListener('change', (e) => {
      state.mascotTheme = e.target.value;
      saveState();
      renderHeader();
    });
  }

  // Text input for activity auto icon trigger
  const slotTextInput = document.getElementById('slot-text-input');
  if (slotTextInput) {
    slotTextInput.addEventListener('input', (e) => {
      handleSlotTextInput(e.target.value);
    });
  }

  // Close modal when clicking outside
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // ESC key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    }
  });
}

// Auto init on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
