/**
 * Timetable Generator App - Enhanced for Students
 * Cute Stationery Design, Smart Grid Drag & Drop, Resizable Blocks & Clean Print
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

// History stack for Undo / Redo
let undoStack = [];
let redoStack = [];
const MAX_HISTORY = 40;

// Dragging state tracking
let draggedCardId = null;
let draggedSlotInfo = null; // { cardId, slotId }

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
  '#1d72b8', // Blue (T2)
  '#239546', // Green (T3)
  '#e8a825', // Yellow (T4)
  '#df2528', // Red (T5)
  '#f16323', // Orange (T6)
  '#7842a2', // Purple (T7)
  '#0b9195', // Teal (CN)
  '#db2777', // Pink (Notes)
  '#475569'  // Slate
];

function initApp() {
  loadSavedState();
  buildIconPickerGrid();
  buildQuickActivityBank();
  buildQuickActivitiesTray();
  renderApp();
  setupEventListeners();
  updateUndoRedoButtons();
}

function pushHistory() {
  try {
    undoStack.push(JSON.stringify(state));
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack = [];
    updateUndoRedoButtons();
  } catch (e) {
    console.error("Lỗi lưu lịch sử thao tác:", e);
  }
}

function undo() {
  if (undoStack.length === 0) return;
  redoStack.push(JSON.stringify(state));
  state = JSON.parse(undoStack.pop());
  saveState();
  renderApp();
  updateUndoRedoButtons();
  showToast("Đã hoàn tác (Undo) ↩️");
}

function redo() {
  if (redoStack.length === 0) return;
  undoStack.push(JSON.stringify(state));
  state = JSON.parse(redoStack.pop());
  saveState();
  renderApp();
  updateUndoRedoButtons();
  showToast("Đã làm lại (Redo) ↪️");
}

function updateUndoRedoButtons() {
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  if (btnUndo) btnUndo.disabled = undoStack.length === 0;
  if (btnRedo) btnRedo.disabled = redoStack.length === 0;
}

function loadSavedState() {
  const saved = localStorage.getItem('thoi_gian_bieu_state_v3');
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
  loadPreset('original', false);
}

function saveState() {
  localStorage.setItem('thoi_gian_bieu_state_v3', JSON.stringify(state));
}

function loadPreset(name, recordHistory = true) {
  if (recordHistory) pushHistory();
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
  showToast("Đã tải dữ liệu mẫu chuẩn thành công! 🌟");
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
  updateUndoRedoButtons();
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

// Render dynamic grid with Move & Resize features
function renderGrid() {
  const gridContainer = document.getElementById('timetable-grid');
  gridContainer.className = `grid-container grid-${state.layoutMode}`;
  gridContainer.innerHTML = '';

  state.cards.forEach((card, cardIndex) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'time-card';
    cardEl.dataset.cardId = card.id;

    // Apply color border matching the pill color
    cardEl.style.borderColor = card.color || '#1d72b8';

    // Apply Row & Column Span
    cardEl.style.gridRow = `span ${card.spanRows || 1}`;
    cardEl.style.gridColumn = `span ${card.spanCols || 1}`;

    // Drag & Drop event listeners on Card
    cardEl.addEventListener('dragover', (e) => handleCardDragOver(e, card.id, cardEl));
    cardEl.addEventListener('dragleave', (e) => handleCardDragLeave(e, cardEl));
    cardEl.addEventListener('drop', (e) => handleCardDrop(e, card.id, cardEl));

    // Card Action Menu (Top right on hover, strictly hidden in print/export)
    const actionsEl = document.createElement('div');
    actionsEl.className = 'card-actions no-print';
    actionsEl.innerHTML = `
      <button class="card-action-btn resize-btn" title="Đổi chiều cao: 1 tầng / 2 tầng" onclick="toggleCardRows('${card.id}')">
        ${card.spanRows === 2 ? '↕ 1T' : '↕ 2T'}
      </button>
      <button class="card-action-btn resize-btn" title="Đổi chiều rộng: 1 cột / 2 cột" onclick="toggleCardCols('${card.id}')">
        ${card.spanCols === 2 ? '↔ 1C' : '↔ 2C'}
      </button>
      <button class="card-action-btn" title="Sao chép toàn bộ lịch ngày này" onclick="openDuplicateCardModal('${card.id}')">📋</button>
      <button class="card-action-btn" title="Đổi màu & Tên" onclick="openEditCardModal('${card.id}')">🎨</button>
      <button class="card-action-btn btn-del" title="Xóa khối này" onclick="deleteCard('${card.id}')">🗑️</button>
    `;
    cardEl.appendChild(actionsEl);

    // Header Pill (Draggable to move card)
    const pillEl = document.createElement('div');
    pillEl.className = 'card-header-pill';
    pillEl.style.backgroundColor = card.color || '#1d72b8';
    pillEl.draggable = true;
    pillEl.title = 'Kéo tay nắm hoặc thanh này để đổi vị trí ngày';

    pillEl.addEventListener('dragstart', (e) => handleCardDragStart(e, card.id, cardEl));
    pillEl.addEventListener('dragend', (e) => handleCardDragEnd(e, cardEl));

    pillEl.innerHTML = `
      <span class="card-drag-handle no-print" title="Kéo để di chuyển vị trí">⠿</span>
      <span class="card-title-text" contenteditable="true" spellcheck="false" title="Nhấp đúp để đổi tên trực tiếp"
        onblur="updateCardTitleInline('${card.id}', this.innerText)"
        onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">${card.title}</span>
      <button type="button" class="card-pill-size-badge no-print" onclick="event.stopPropagation(); toggleCardRows('${card.id}')" title="Bấm để đổi 1 tầng / 2 tầng">${card.spanRows === 2 ? '2T' : '1T'}</button>
    `;
    cardEl.appendChild(pillEl);

    // Slot Items Container
    const slotsContainer = document.createElement('div');
    slotsContainer.className = 'card-slots';
    slotsContainer.dataset.cardId = card.id;

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
      slotEl.dataset.cardId = card.id;
      slotEl.draggable = true;

      // Drag slot listeners
      slotEl.addEventListener('dragstart', (e) => handleSlotDragStart(e, card.id, slot.id, slotEl));
      slotEl.addEventListener('dragend', (e) => handleSlotDragEnd(e, slotEl));
      slotEl.addEventListener('dragover', (e) => handleSlotDragOver(e, card.id, slot.id, slotEl));
      slotEl.addEventListener('dragleave', (e) => handleSlotDragLeave(e, slotEl));
      slotEl.addEventListener('drop', (e) => handleSlotDrop(e, card.id, slot.id, slotEl));

      slotEl.innerHTML = `
        <span class="slot-icon-badge" title="Bấm để đổi icon" onclick="event.stopPropagation(); openQuickIconPicker('${card.id}', '${slot.id}')">${slot.icon || '🕒'}</span>
        <div class="slot-details">
          <span class="slot-time" contenteditable="true" spellcheck="false" title="Nhấp để sửa giờ trực tiếp"
            onblur="updateSlotTimeInline('${card.id}', '${slot.id}', this.innerText)"
            onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">${slot.time ? slot.time + ':' : ''}</span>
          <span class="slot-text" contenteditable="true" spellcheck="false" title="Nhấp để sửa nội dung trực tiếp"
            oninput="handleSlotTextInlineInput('${card.id}', '${slot.id}', this.innerText)"
            onblur="updateSlotTextInline('${card.id}', '${slot.id}', this.innerText)"
            onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">${slot.text}</span>
        </div>
        <div class="slot-controls no-print">
          <button class="slot-ctrl-btn" title="Lên trên" onclick="event.stopPropagation(); moveSlot('${card.id}', ${slotIndex}, -1)">▲</button>
          <button class="slot-ctrl-btn" title="Xuống dưới" onclick="event.stopPropagation(); moveSlot('${card.id}', ${slotIndex}, 1)">▼</button>
          <button class="slot-ctrl-btn" title="Sửa & Áp dụng nhiều ngày" onclick="event.stopPropagation(); openEditSlotModal('${card.id}', '${slot.id}')">✏️</button>
          <button class="slot-ctrl-btn btn-del" title="Xóa hoạt động này" onclick="event.stopPropagation(); deleteSlot('${card.id}', '${slot.id}')">✕</button>
        </div>
      `;

      slotsContainer.appendChild(slotEl);
    });

    cardEl.appendChild(slotsContainer);

    // Bottom "+ Thêm hoạt động" button
    const addSlotBtn = document.createElement('button');
    addSlotBtn.type = 'button';
    addSlotBtn.className = 'add-slot-btn no-print';
    addSlotBtn.innerHTML = `<span>+ Thêm hoạt động</span>`;
    addSlotBtn.onclick = () => openAddSlotModal(card.id);
    cardEl.appendChild(addSlotBtn);

    gridContainer.appendChild(cardEl);
  });
}

// -------------------------------------------------------------
// Card Drag & Drop (Move block)
// -------------------------------------------------------------
function handleCardDragStart(e, cardId, cardEl) {
  draggedCardId = cardId;
  e.dataTransfer.setData('application/json-card', cardId);
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => cardEl.classList.add('card-dragging'), 10);
}

function handleCardDragEnd(e, cardEl) {
  draggedCardId = null;
  cardEl.classList.remove('card-dragging');
  document.querySelectorAll('.time-card').forEach(c => c.classList.remove('drag-over'));
}

function handleCardDragOver(e, cardId, cardEl) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';

  // Highlight if dragging a card from a different position
  if (draggedCardId && draggedCardId !== cardId) {
    cardEl.classList.add('drag-over');
  } else if (!draggedCardId) {
    cardEl.classList.add('drag-over');
  }
}

function handleCardDragLeave(e, cardEl) {
  cardEl.classList.remove('drag-over');
}

function handleCardDrop(e, targetCardId, cardEl) {
  e.preventDefault();
  e.stopPropagation();
  cardEl.classList.remove('drag-over');

  // 1. Check if dropped a Quick Activity Chip from the tray
  const quickChipRaw = e.dataTransfer.getData('application/json-quick-activity');
  if (quickChipRaw) {
    try {
      const act = JSON.parse(quickChipRaw);
      const targetCard = state.cards.find(c => c.id === targetCardId);
      if (targetCard) {
        pushHistory();
        targetCard.slots.push({
          id: 's_' + Date.now(),
          time: act.time,
          text: act.text,
          icon: act.icon,
          section: act.section || ''
        });
        saveState();
        renderApp();
        showToast(`Đã thêm "${act.text}" vào ${targetCard.title}! ⚡`);
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // 2. Check if dropped a Slot (moving between cards)
  const slotRaw = e.dataTransfer.getData('application/json-slot');
  if (slotRaw) {
    try {
      const { sourceCardId, slotId } = JSON.parse(slotRaw);
      if (sourceCardId !== targetCardId) {
        pushHistory();
        const sourceCard = state.cards.find(c => c.id === sourceCardId);
        const targetCard = state.cards.find(c => c.id === targetCardId);
        if (sourceCard && targetCard) {
          const idx = sourceCard.slots.findIndex(s => s.id === slotId);
          if (idx !== -1) {
            const [movedSlot] = sourceCard.slots.splice(idx, 1);
            targetCard.slots.push(movedSlot);
            saveState();
            renderApp();
            showToast(`Đã chuyển hoạt động sang ${targetCard.title}! ✨`);
            return;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // 3. Move Card itself
  if (draggedCardId && draggedCardId !== targetCardId) {
    pushHistory();
    const fromIdx = state.cards.findIndex(c => c.id === draggedCardId);
    const toIdx = state.cards.findIndex(c => c.id === targetCardId);
    if (fromIdx !== -1 && toIdx !== -1) {
      const [movedCard] = state.cards.splice(fromIdx, 1);
      state.cards.splice(toIdx, 0, movedCard);
      saveState();
      renderApp();
      showToast(`Đã chuyển vị trí khối ${movedCard.title}! 🔄`);
    }
  }
}

// -------------------------------------------------------------
// Slot Drag & Drop (Reorder or transfer)
// -------------------------------------------------------------
function handleSlotDragStart(e, cardId, slotId, slotEl) {
  e.stopPropagation();
  draggedSlotInfo = { cardId, slotId };
  e.dataTransfer.setData('application/json-slot', JSON.stringify({ sourceCardId: cardId, slotId: slotId }));
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => slotEl.classList.add('slot-dragging'), 10);
}

function handleSlotDragEnd(e, slotEl) {
  draggedSlotInfo = null;
  slotEl.classList.remove('slot-dragging');
  document.querySelectorAll('.slot-item').forEach(s => s.classList.remove('slot-drop-target'));
}

function handleSlotDragOver(e, cardId, slotId, slotEl) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';
  if (draggedSlotInfo && draggedSlotInfo.slotId !== slotId) {
    slotEl.classList.add('slot-drop-target');
  }
}

function handleSlotDragLeave(e, slotEl) {
  slotEl.classList.remove('slot-drop-target');
}

function handleSlotDrop(e, targetCardId, targetSlotId, slotEl) {
  e.preventDefault();
  e.stopPropagation();
  slotEl.classList.remove('slot-drop-target');

  const slotRaw = e.dataTransfer.getData('application/json-slot');
  if (!slotRaw) return;

  try {
    const { sourceCardId, slotId } = JSON.parse(slotRaw);
    const sourceCard = state.cards.find(c => c.id === sourceCardId);
    const targetCard = state.cards.find(c => c.id === targetCardId);
    if (!sourceCard || !targetCard) return;

    const fromIdx = sourceCard.slots.findIndex(s => s.id === slotId);
    const toIdx = targetCard.slots.findIndex(s => s.id === targetSlotId);
    if (fromIdx === -1 || toIdx === -1) return;

    pushHistory();
    const [moved] = sourceCard.slots.splice(fromIdx, 1);
    targetCard.slots.splice(toIdx, 0, moved);
    saveState();
    renderApp();
    showToast(`Đã sắp xếp lại hoạt động! ✨`);
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------------------------------------
// Resize & Move Block Controls
// -------------------------------------------------------------
function toggleCardRows(cardId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  pushHistory();
  card.spanRows = (card.spanRows === 2) ? 1 : 2;
  saveState();
  renderApp();
  showToast(`${card.title}: Đã đổi sang ${card.spanRows === 2 ? '2 Tầng (Cao trọn cột)' : '1 Tầng (Tiêu chuẩn)'} ↕`);
}

function toggleCardCols(cardId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  pushHistory();
  card.spanCols = (card.spanCols === 2) ? 1 : 2;
  saveState();
  renderApp();
  showToast(`${card.title}: Đã đổi sang ${card.spanCols === 2 ? '2 Cột (Rộng)' : '1 Cột (Gọn)'} ↔`);
}

function deleteCard(cardId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  if (confirm(`Bạn có chắc muốn xóa khối "${card.title}" không? (Có thể bấm Hoàn tác để lấy lại)`)) {
    pushHistory();
    state.cards = state.cards.filter(c => c.id !== cardId);
    saveState();
    renderApp();
    showToast(`Đã xóa khối "${card.title}". Bấm "Hoàn tác" để lấy lại! 🗑️`);
  }
}

// -------------------------------------------------------------
// Inline Text Editing Handlers (WYSIWYG)
// -------------------------------------------------------------
function updateCardTitleInline(cardId, newTitle) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const clean = newTitle.trim();
  if (clean && clean !== card.title) {
    pushHistory();
    card.title = clean;
    saveState();
    showToast(`Đã đổi tên thành "${card.title}" ✏️`);
  }
}

function updateSlotTimeInline(cardId, slotId, newTime) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const slot = card.slots.find(s => s.id === slotId);
  if (!slot) return;
  const clean = newTime.trim().replace(/:$/, '');
  if (clean !== slot.time) {
    pushHistory();
    slot.time = clean;
    saveState();
  }
}

function handleSlotTextInlineInput(cardId, slotId, newText) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const slot = card.slots.find(s => s.id === slotId);
  if (!slot) return;

  // Auto icon detection live
  const detected = detectVietnameseIcon(newText);
  if (detected && detected !== slot.icon) {
    slot.icon = detected;
    const badge = document.querySelector(`.slot-item[data-slot-id="${slotId}"] .slot-icon-badge`);
    if (badge) badge.textContent = detected;
  }
}

function updateSlotTextInline(cardId, slotId, newText) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const slot = card.slots.find(s => s.id === slotId);
  if (!slot) return;
  const clean = newText.trim();
  if (clean !== slot.text) {
    pushHistory();
    slot.text = clean;
    const detected = detectVietnameseIcon(clean);
    if (detected) slot.icon = detected;
    saveState();
    renderApp();
  }
}

// -------------------------------------------------------------
// Quick Activities Drag-and-Drop Tray
// -------------------------------------------------------------
function buildQuickActivitiesTray() {
  const container = document.getElementById('quick-tray-chips');
  if (!container) return;
  container.innerHTML = '';

  COMMON_ACTIVITIES_BANK.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'tray-chip';
    chip.draggable = true;
    chip.title = `Kéo thả vào ngày hoặc nhấp để thêm (${item.time})`;
    chip.innerHTML = `<span>${item.icon}</span> <span>${item.text}</span>`;

    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('application/json-quick-activity', JSON.stringify(item));
      e.dataTransfer.effectAllowed = 'copy';
      chip.classList.add('chip-dragging');
    });

    chip.addEventListener('dragend', () => {
      chip.classList.remove('chip-dragging');
    });

    chip.addEventListener('click', () => {
      // Pre-fill and open slot modal
      editingSlotInfo = null;
      document.getElementById('slot-text-input').value = item.text;
      document.getElementById('slot-time-input').value = item.time;
      document.getElementById('slot-section-select').value = item.section || '';
      chooseIcon(item.icon);
      renderMultiDayCheckboxes(state.cards[0]?.id || '');
      openModal('modal-slot');
    });

    container.appendChild(chip);
  });
}

function toggleQuickTray() {
  const tray = document.getElementById('quick-tray');
  const btn = document.getElementById('btn-toggle-tray');
  if (!tray || !btn) return;

  if (tray.classList.contains('collapsed')) {
    tray.classList.remove('collapsed');
    btn.textContent = 'Thu gọn ▲';
  } else {
    tray.classList.add('collapsed');
    btn.textContent = 'Mở khay ▼';
  }
}

// -------------------------------------------------------------
// Reusable Activity Bank inside Modal
// -------------------------------------------------------------
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
    const isSelected = (card.id === targetCardId);
    const label = document.createElement('label');
    label.className = 'day-check-label';
    label.innerHTML = `
      <input type="checkbox" name="apply_days" value="${card.id}" ${isSelected ? 'checked' : ''}>
      <span class="day-check-badge" style="border-left: 3px solid ${card.color || '#0284c7'}">${card.title}</span>
    `;
    container.appendChild(label);
  });
}

function setMultiDaySelection(mode) {
  const checkboxes = document.querySelectorAll('#multiday-checkboxes input[name="apply_days"]');
  checkboxes.forEach(cb => {
    if (mode === 'all') {
      cb.checked = true;
    } else if (mode === 'current') {
      cb.checked = (editingSlotInfo && cb.value === editingSlotInfo.cardId);
    } else if (mode === 'weekdays') {
      const card = state.cards.find(c => c.id === cb.value);
      const isWeekend = card && (card.title.toUpperCase().includes('BẢY') || card.title.toUpperCase().includes('NHẬT'));
      cb.checked = !isWeekend;
    }
  });
}

// -------------------------------------------------------------
// Slot Management (Modal Add / Edit)
// -------------------------------------------------------------
function openAddSlotModal(cardId) {
  editingSlotInfo = { cardId: cardId, slotId: null };
  document.getElementById('modal-slot-title').textContent = 'Thêm Hoạt Động Cho Bé';
  document.getElementById('slot-text-input').value = '';
  document.getElementById('slot-time-input').value = '';
  document.getElementById('slot-section-select').value = '';
  chooseIcon('🕒');
  isIconManuallyChosen = false;

  renderMultiDayCheckboxes(cardId);
  openModal('modal-slot');
  setTimeout(() => document.getElementById('slot-text-input').focus(), 150);
}

function openEditSlotModal(cardId, slotId) {
  editingSlotInfo = { cardId: cardId, slotId: slotId };
  document.getElementById('modal-slot-title').textContent = 'Sửa Hoạt Động';

  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const slot = card.slots.find(s => s.id === slotId);
  if (!slot) return;

  document.getElementById('slot-text-input').value = slot.text || '';
  document.getElementById('slot-time-input').value = slot.time || '';
  document.getElementById('slot-section-select').value = slot.section || '';
  chooseIcon(slot.icon || '🕒');
  isIconManuallyChosen = true;

  renderMultiDayCheckboxes(cardId);
  openModal('modal-slot');
}

function saveSlot() {
  const text = document.getElementById('slot-text-input').value.trim();
  const time = document.getElementById('slot-time-input').value.trim();
  const section = document.getElementById('slot-section-select').value;
  const icon = currentSelectedIcon || '🕒';

  if (!text) {
    alert("Vui lòng nhập nội dung hoạt động!");
    document.getElementById('slot-text-input').focus();
    return;
  }

  pushHistory();

  // Get selected target days
  const checkedBoxes = document.querySelectorAll('#multiday-checkboxes input[name="apply_days"]:checked');
  const targetCardIds = Array.from(checkedBoxes).map(cb => cb.value);

  if (targetCardIds.length === 0 && editingSlotInfo && editingSlotInfo.cardId) {
    targetCardIds.push(editingSlotInfo.cardId);
  }

  if (editingSlotInfo && editingSlotInfo.slotId) {
    // Editing existing slot
    const card = state.cards.find(c => c.id === editingSlotInfo.cardId);
    if (card) {
      const slot = card.slots.find(s => s.id === editingSlotInfo.slotId);
      if (slot) {
        slot.text = text;
        slot.time = time;
        slot.section = section;
        slot.icon = icon;
      }
    }

    // Apply to other selected days
    targetCardIds.forEach(targetId => {
      if (targetId !== editingSlotInfo.cardId) {
        const otherCard = state.cards.find(c => c.id === targetId);
        if (otherCard) {
          otherCard.slots.push({
            id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            time: time,
            text: text,
            icon: icon,
            section: section
          });
        }
      }
    });
  } else {
    // Adding new slot
    targetCardIds.forEach(targetId => {
      const targetCard = state.cards.find(c => c.id === targetId);
      if (targetCard) {
        targetCard.slots.push({
          id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          time: time,
          text: text,
          icon: icon,
          section: section
        });
      }
    });
  }

  saveState();
  renderApp();
  closeModal('modal-slot');
  showToast(`Đã lưu hoạt động cho ${targetCardIds.length} ngày! ✨`);
}

function deleteSlot(cardId, slotId) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  pushHistory();
  card.slots = card.slots.filter(s => s.id !== slotId);
  saveState();
  renderApp();
  showToast("Đã xóa hoạt động! 🗑️");
}

function moveSlot(cardId, index, direction) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= card.slots.length) return;

  pushHistory();
  const temp = card.slots[index];
  card.slots[index] = card.slots[newIndex];
  card.slots[newIndex] = temp;

  saveState();
  renderApp();
}

function setQuickTime(val) {
  document.getElementById('slot-time-input').value = val;
}

function handleSlotTextInput(text) {
  const hintEl = document.getElementById('icon-hint-text');
  if (!isIconManuallyChosen) {
    const detected = detectVietnameseIcon(text);
    if (detected) {
      chooseIcon(detected);
      if (hintEl) hintEl.textContent = `Tự động nhận diện: ${detected}`;
    }
  }
}

// -------------------------------------------------------------
// Card / Block Management (Add / Edit / Duplicate)
// -------------------------------------------------------------
function openAddCardModal() {
  editingCardId = null;
  document.getElementById('card-modal-title').textContent = 'Thêm Khối Mới';
  document.getElementById('card-title-input').value = '';
  document.getElementById('card-color-input').value = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
  renderColorSwatches();
  openModal('modal-card');
  setTimeout(() => document.getElementById('card-title-input').focus(), 150);
}

function openEditCardModal(cardId) {
  editingCardId = cardId;
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;

  document.getElementById('card-modal-title').textContent = `Đổi Tên & Màu: ${card.title}`;
  document.getElementById('card-title-input').value = card.title;
  document.getElementById('card-color-input').value = card.color || '#1d72b8';

  // Set rows radio
  const rowRadios = document.querySelectorAll('input[name="card_rows"]');
  rowRadios.forEach(r => {
    r.checked = (parseInt(r.value) === (card.spanRows || 1));
  });

  renderColorSwatches();
  openModal('modal-card');
}

function setQuickCardTitle(title, color) {
  document.getElementById('card-title-input').value = title;
  if (color) {
    document.getElementById('card-color-input').value = color;
    renderColorSwatches();
  }
}

function saveCard() {
  const title = document.getElementById('card-title-input').value.trim();
  const color = document.getElementById('card-color-input').value;
  const rowRadio = document.querySelector('input[name="card_rows"]:checked');
  const spanRows = rowRadio ? parseInt(rowRadio.value) : 1;

  if (!title) {
    alert("Vui lòng nhập tên khối / ngày!");
    document.getElementById('card-title-input').focus();
    return;
  }

  pushHistory();

  if (editingCardId) {
    const card = state.cards.find(c => c.id === editingCardId);
    if (card) {
      card.title = title;
      card.color = color;
      card.spanRows = spanRows;
    }
  } else {
    state.cards.push({
      id: 'card_' + Date.now(),
      title: title,
      color: color,
      spanRows: spanRows,
      spanCols: 1,
      slots: []
    });
  }

  saveState();
  renderApp();
  closeModal('modal-card');
  showToast("Đã lưu khối thành công! 🎨");
}

function renderColorSwatches() {
  const container = document.getElementById('color-swatches-container');
  if (!container) return;
  container.innerHTML = '';

  const currentColor = document.getElementById('card-color-input').value;

  PRESET_COLORS.forEach(c => {
    const swatch = document.createElement('div');
    swatch.className = `color-swatch ${c === currentColor ? 'active' : ''}`;
    swatch.style.backgroundColor = c;
    swatch.onclick = () => {
      document.getElementById('card-color-input').value = c;
      renderColorSwatches();
    };
    container.appendChild(swatch);
  });
}

// -------------------------------------------------------------
// Duplicate Day Schedule
// -------------------------------------------------------------
let duplicateSourceCardId = null;

function openDuplicateCardModal(cardId) {
  duplicateSourceCardId = cardId;
  const srcCard = state.cards.find(c => c.id === cardId);
  if (!srcCard) return;

  document.getElementById('dup-source-name').textContent = srcCard.title;
  const listContainer = document.getElementById('dup-targets-list');
  listContainer.innerHTML = '';

  state.cards.forEach(card => {
    if (card.id !== cardId) {
      const label = document.createElement('label');
      label.className = 'day-check-label';
      label.innerHTML = `
        <input type="checkbox" name="dup_targets" value="${card.id}">
        <span class="day-check-badge" style="border-left: 3px solid ${card.color || '#0284c7'}">${card.title}</span>
      `;
      listContainer.appendChild(label);
    }
  });

  openModal('modal-duplicate');
}

function executeDuplicateCard() {
  if (!duplicateSourceCardId) return;
  const srcCard = state.cards.find(c => c.id === duplicateSourceCardId);
  if (!srcCard) return;

  const checkedBoxes = document.querySelectorAll('#dup-targets-list input[name="dup_targets"]:checked');
  const targetIds = Array.from(checkedBoxes).map(cb => cb.value);

  if (targetIds.length === 0) {
    alert("Vui lòng chọn ít nhất 1 ngày để sao chép đến!");
    return;
  }

  const modeRadio = document.querySelector('input[name="dup_mode"]:checked');
  const mode = modeRadio ? modeRadio.value : 'append';

  pushHistory();

  targetIds.forEach(tId => {
    const tCard = state.cards.find(c => c.id === tId);
    if (!tCard) return;

    const clonedSlots = srcCard.slots.map(s => ({
      ...s,
      id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    }));

    if (mode === 'replace') {
      tCard.slots = clonedSlots;
    } else {
      tCard.slots = tCard.slots.concat(clonedSlots);
    }
  });

  saveState();
  renderApp();
  closeModal('modal-duplicate');
  showToast(`Đã sao chép lịch sang ${targetIds.length} ngày thành công! 📋`);
}

// -------------------------------------------------------------
// Header Banner Title & Student Name Modal
// -------------------------------------------------------------
function openHeaderEditModal() {
  document.getElementById('header-title-input').value = state.title;
  document.getElementById('header-student-input').value = state.studentName;
  document.getElementById('header-sub-input').value = state.subtitle || '';
  openModal('modal-header-edit');
}

function saveHeaderEdit() {
  pushHistory();
  state.title = document.getElementById('header-title-input').value.trim() || 'THỜI GIAN BIỂU';
  state.studentName = document.getElementById('header-student-input').value.trim() || 'Học Sinh';
  state.subtitle = document.getElementById('header-sub-input').value.trim();

  saveState();
  renderHeader();
  closeModal('modal-header-edit');
  showToast("Đã cập nhật tiêu đề thành công! 🌟");
}

// -------------------------------------------------------------
// Icon Picker Grid
// -------------------------------------------------------------
function buildIconPickerGrid() {
  const container = document.getElementById('icon-picker-box');
  if (!container) return;
  container.innerHTML = '';

  const categories = (window.TimetableIcons && window.TimetableIcons.ICON_CATEGORIES) || [];

  categories.forEach(cat => {
    const catTitle = document.createElement('div');
    catTitle.className = 'icon-category-title';
    catTitle.textContent = cat.name;
    container.appendChild(catTitle);

    const grid = document.createElement('div');
    grid.className = 'icon-category-grid';

    (cat.icons || []).forEach(ic => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `icon-opt-btn ${ic === currentSelectedIcon ? 'active' : ''}`;
      btn.textContent = ic;
      btn.onclick = () => {
        isIconManuallyChosen = true;
        chooseIcon(ic);
      };
      grid.appendChild(btn);
    });

    container.appendChild(grid);
  });
}

function chooseIcon(icon) {
  currentSelectedIcon = icon;
  const display = document.getElementById('current-icon-display');
  if (display) display.textContent = icon;

  document.querySelectorAll('.icon-opt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === icon);
  });
}

function openQuickIconPicker(cardId, slotId) {
  openEditSlotModal(cardId, slotId);
  setTimeout(() => {
    const picker = document.getElementById('icon-picker-box');
    if (picker) picker.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 200);
}

// -------------------------------------------------------------
// Modal Helpers
// -------------------------------------------------------------
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// -------------------------------------------------------------
// Toast Notifications
// -------------------------------------------------------------
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2400);
}

// -------------------------------------------------------------
// Export Clean PDF & Print
// -------------------------------------------------------------
function exportPDF() {
  const sheetElement = document.getElementById('timetable-sheet');
  const wrapper = document.querySelector('.timetable-sheet-wrapper');
  if (!sheetElement || !wrapper) return;

  showToast('Đang chuẩn bị file PDF in chuẩn A4... ⏳');

  wrapper.classList.add('exporting-clean-pdf');
  document.body.classList.add('exporting-clean-pdf');

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
               el.classList.contains('slot-controls') ||
               el.classList.contains('quick-tray');
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

// -------------------------------------------------------------
// Setup Global Event Listeners & Keyboard Shortcuts
// -------------------------------------------------------------
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
      pushHistory();
      state.layoutMode = e.target.value;
      saveState();
      renderGrid();
    });
  }

  const mascotSelect = document.getElementById('select-mascot');
  if (mascotSelect) {
    mascotSelect.addEventListener('change', (e) => {
      pushHistory();
      state.mascotTheme = e.target.value;
      saveState();
      renderHeader();
    });
  }

  const themeSelect = document.getElementById('select-theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      pushHistory();
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
    // Escape closes modals
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    }

    // Ctrl+Z (Undo) and Ctrl+Y / Ctrl+Shift+Z (Redo)
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      if (e.key === 'z' && !e.shiftKey) {
        // Don't intercept if inside an input or textarea
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          undo();
        }
      } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          redo();
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
