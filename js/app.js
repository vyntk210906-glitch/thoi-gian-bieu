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
  buildTimePickerDropdowns();
  buildQuickTimeChips('all');
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

const MAX_CARDS = 7;
const STORAGE_KEY_PROFILES = 'thoi_gian_bieu_profiles_v1';
const STORAGE_KEY_STATE = 'thoi_gian_bieu_state_v4';

let profilesState = {
  activeProfileId: 'profile-1',
  profiles: []
};

function loadSavedState() {
  const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
  if (savedProfiles) {
    try {
      const parsed = JSON.parse(savedProfiles);
      if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
        profilesState = parsed;
        const active = profilesState.profiles.find(p => p.id === profilesState.activeProfileId) || profilesState.profiles[0];
        profilesState.activeProfileId = active.id;
        state = JSON.parse(JSON.stringify(active));
        state.id = active.id;
        if (!state.layoutMode || state.layoutMode === '2rows') state.layoutMode = 'photo';
        if (!state.themePalette) state.themePalette = 'rainbow';
        return;
      }
    } catch (e) {
      console.warn("Lỗi đọc dữ liệu hồ sơ các bé:", e);
    }
  }

  // Backward compatibility: migrate from single profile state
  const savedSingle = localStorage.getItem(STORAGE_KEY_STATE);
  if (savedSingle) {
    try {
      state = JSON.parse(savedSingle);
      if (state.cards && state.cards.length > MAX_CARDS) {
        state.cards = state.cards.slice(0, MAX_CARDS);
      }
      if (!state.layoutMode || state.layoutMode === '2rows') state.layoutMode = 'photo';
      if (!state.themePalette) state.themePalette = 'rainbow';

      const defaultId = 'profile-1';
      state.id = defaultId;
      profilesState = {
        activeProfileId: defaultId,
        profiles: [{
          ...JSON.parse(JSON.stringify(state)),
          id: defaultId
        }]
      };
      saveProfilesState();
      return;
    } catch (e) {
      console.warn("Lỗi đọc dữ liệu đơn:", e);
    }
  }

  // Initial setup from PRESET_ORIGINAL
  state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_ORIGINAL));
  const defaultId = 'profile-1';
  state.id = defaultId;
  profilesState = {
    activeProfileId: defaultId,
    profiles: [{
      ...JSON.parse(JSON.stringify(state)),
      id: defaultId
    }]
  };
  saveProfilesState();
}

function saveProfilesState() {
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profilesState));
  localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
}

function saveState() {
  if (state.cards && state.cards.length > MAX_CARDS) {
    state.cards = state.cards.slice(0, MAX_CARDS);
  }
  const activeId = profilesState.activeProfileId || state.id || 'profile-1';
  state.id = activeId;
  const idx = profilesState.profiles.findIndex(p => p.id === activeId);
  if (idx >= 0) {
    profilesState.profiles[idx] = JSON.parse(JSON.stringify(state));
  } else {
    profilesState.profiles.push(JSON.parse(JSON.stringify(state)));
  }
  saveProfilesState();
}

function loadPreset(name, recordHistory = true) {
  if (recordHistory) pushHistory();
  if (name === 'original') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_ORIGINAL));
  } else if (name === '7days') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_STANDARD_7DAYS));
  } else if (name === 'notes') {
    state = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_6DAYS_NOTES));
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

  const btnAddCard = document.getElementById('btn-add-card');
  if (btnAddCard) {
    btnAddCard.innerHTML = `<span>➕</span> Thêm Khối (${state.cards.length}/${MAX_CARDS})`;
    if (state.cards.length >= MAX_CARDS) {
      btnAddCard.title = `Đã đạt tối đa ${MAX_CARDS} khối (T2 - CN). Bấm xóa bớt 1 khối nếu muốn thêm khối mới.`;
    } else {
      btnAddCard.title = `Thêm một khối ngày hoặc ghi chú mới (Hiện có ${state.cards.length}/${MAX_CARDS} khối)`;
    }
  }

  const sheet = document.getElementById('timetable-sheet');
  if (sheet) {
    sheet.className = `timetable-sheet theme-${state.themePalette || 'rainbow'}`;
  }

  renderProfileSelector();
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

// Dynamic Grid Placement Solver
// Ensures any 2-tier (spanRows: 2) cards span rows 1-2 without creating an implicit 3rd row,
// and symmetrically pairs 1-tier cards across available columns.
function computeCardLayout(cards, layoutMode) {
  if (layoutMode === '7cols' || layoutMode === '5cols') {
    return {
      totalCols: cards.length,
      colWidths: cards.map(() => '1fr').join(' '),
      rows: '1fr',
      placements: new Map(cards.map((c, i) => [c.id, {
        col: i + 1,
        row: 1,
        spanRows: 1,
        spanCols: 1
      }]))
    };
  }

  const tallItems = [];
  const normalItems = [];
  cards.forEach((card, index) => {
    if (card.spanRows === 2) {
      tallItems.push({ card, origIndex: index });
    } else {
      normalItems.push({ card, origIndex: index });
    }
  });

  const numTall = tallItems.length;
  const numNormal = normalItems.length;

  // If all cards are tall (2T)
  if (numNormal === 0) {
    return {
      totalCols: numTall,
      colWidths: tallItems.map(() => '1fr').join(' '),
      rows: '1fr',
      placements: new Map(tallItems.map((item, i) => [item.card.id, {
        col: i + 1,
        row: 1,
        spanRows: 2,
        spanCols: 1
      }]))
    };
  }

  const numNormalCols = Math.ceil(numNormal / 2);
  const totalCols = Math.max(1, numTall + numNormalCols);
  const colSlots = new Array(totalCols).fill(null);

  // Place tall cards into columns based on their relative index in cards array
  tallItems.forEach(item => {
    const ratio = cards.length > 1 ? item.origIndex / (cards.length - 1) : 0;
    let idealCol = Math.round(ratio * (totalCols - 1));
    let assignedCol = idealCol;
    if (colSlots[assignedCol] !== null) {
      let dist = 1;
      let found = false;
      while (!found) {
        if (idealCol - dist >= 0 && colSlots[idealCol - dist] === null) {
          assignedCol = idealCol - dist;
          found = true;
        } else if (idealCol + dist < totalCols && colSlots[idealCol + dist] === null) {
          assignedCol = idealCol + dist;
          found = true;
        }
        dist++;
      }
    }
    colSlots[assignedCol] = item;
  });

  // Empty columns are for normal (1T) cards
  const emptyCols = [];
  colSlots.forEach((slot, colIdx) => {
    if (slot === null) emptyCols.push(colIdx);
  });

  const half = emptyCols.length;
  const topNormal = normalItems.slice(0, half);
  const bottomNormal = normalItems.slice(half);

  const placements = new Map();
  colSlots.forEach((slot, colIdx) => {
    if (slot) {
      placements.set(slot.card.id, {
        col: colIdx + 1,
        row: 1,
        spanRows: 2,
        spanCols: 1
      });
    }
  });

  topNormal.forEach((item, idx) => {
    placements.set(item.card.id, {
      col: emptyCols[idx] + 1,
      row: 1,
      spanRows: 1,
      spanCols: 1
    });
  });

  bottomNormal.forEach((item, idx) => {
    placements.set(item.card.id, {
      col: emptyCols[idx] + 1,
      row: 2,
      spanRows: 1,
      spanCols: 1
    });
  });

  // Dynamic column widths: tall columns get slightly more width for spaciousness
  const colWidths = colSlots.map(slot => {
    if (slot) {
      return numTall >= 2 ? '1.1fr' : '1.15fr';
    }
    return '1fr';
  }).join(' ');

  return { totalCols, colWidths, rows: 'minmax(0, 1fr) minmax(0, 1fr)', placements };
}

// Render dynamic grid with Move & Resize features
function renderGrid() {
  const gridContainer = document.getElementById('timetable-grid');
  let effectiveLayout = state.layoutMode;
  if (state.layoutMode === 'photo' && state.cards.some(c => c.id.includes('notes') || c.title.toLowerCase().includes('ghi chú'))) {
    effectiveLayout = 'photo5';
  }
  gridContainer.className = `grid-container grid-${effectiveLayout}`;
  gridContainer.innerHTML = '';

  const layout = computeCardLayout(state.cards, state.layoutMode);
  gridContainer.style.gridTemplateColumns = layout.colWidths;
  gridContainer.style.gridTemplateRows = layout.rows;
  gridContainer.style.gridAutoFlow = 'row';

  const isSingleRowLayout = effectiveLayout === '7cols' || effectiveLayout === '5cols';

  state.cards.forEach((card, cardIndex) => {
    const is2T = (card.spanRows || 1) === 2;
    const isFullHeight = is2T || isSingleRowLayout;
    
    // Count both slots and section divider labels
    const slotsList = card.slots || [];
    const sectionCount = slotsList.filter(s => s.section && s.section.trim() !== '').length;
    const totalItems = slotsList.length + sectionCount;
    
    let densityClass = 'density-normal';
    let slotLayoutMode = 'layout-vertical';

    if (isFullHeight) {
      if (totalItems <= 6) {
        densityClass = 'density-spacious';
        slotLayoutMode = 'layout-vertical';
      } else if (totalItems <= 9) {
        densityClass = 'density-normal';
        slotLayoutMode = 'layout-vertical';
      } else if (totalItems <= 13) {
        densityClass = 'density-moderate';
        slotLayoutMode = 'layout-vertical';
      } else {
        densityClass = 'density-compact';
        slotLayoutMode = 'layout-horizontal';
      }
    } else {
      if (totalItems <= 4) {
        densityClass = 'density-spacious';
        slotLayoutMode = 'layout-vertical';
      } else if (totalItems <= 5) {
        densityClass = 'density-normal';
        slotLayoutMode = 'layout-vertical';
      } else if (totalItems <= 7) {
        densityClass = 'density-moderate';
        slotLayoutMode = 'layout-vertical';
      } else if (totalItems <= 9) {
        densityClass = 'density-compact';
        slotLayoutMode = 'layout-horizontal';
      } else if (totalItems <= 11) {
        densityClass = 'density-dense';
        slotLayoutMode = 'layout-horizontal';
      } else {
        densityClass = 'density-ultra';
        slotLayoutMode = 'layout-horizontal';
      }
    }

    const cardEl = document.createElement('div');
    cardEl.className = `time-card card-span-${card.spanRows || 1} ${densityClass} has-${slotLayoutMode}`.trim();
    cardEl.dataset.cardId = card.id;
    cardEl.dataset.layoutMode = slotLayoutMode;

    // Apply color border matching the pill color
    cardEl.style.borderColor = card.color || '#1d72b8';

    // Apply deterministic Row & Column Span
    const placement = layout.placements.get(card.id);
    if (placement) {
      cardEl.style.gridColumn = `${placement.col} / span ${placement.spanCols}`;
      cardEl.style.gridRow = `${placement.row} / span ${placement.spanRows}`;
    } else {
      cardEl.style.gridRow = `span ${card.spanRows || 1}`;
      cardEl.style.gridColumn = `span ${card.spanCols || 1}`;
    }

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

    // Slot Items Container with adaptive vertical space filling
    const slotsContainer = document.createElement('div');
    const fillClass = totalItems <= 2 ? 'justify-fill-few' : 'justify-fill';
    slotsContainer.className = `card-slots ${fillClass}`;
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
      slotEl.className = `slot-item ${slotLayoutMode}`;
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

  // Guarantee zero scrollbars & zero clipping across all cards
  autoFitCardSlots();
}

// Dynamic Copy-Fitting: Micro-adjust typography scale to guarantee zero overflow / scrollbars
function autoFitCardSlots(targetCardId = null) {
  const cards = targetCardId
    ? [document.querySelector(`.time-card[data-card-id="${targetCardId}"]`)].filter(Boolean)
    : document.querySelectorAll('.time-card');

  cards.forEach(card => {
    const slots = card.querySelector('.card-slots');
    if (!slots) return;

    slots.style.removeProperty('--auto-scale');

    // Phase 1: If card is in layout-vertical and overflows, fallback to layout-horizontal
    if (slots.scrollHeight > slots.clientHeight + 0.5) {
      const vertItems = slots.querySelectorAll('.slot-item.layout-vertical');
      if (vertItems.length > 0) {
        vertItems.forEach(item => {
          item.classList.remove('layout-vertical');
          item.classList.add('layout-horizontal');
        });
        card.classList.remove('has-layout-vertical');
        card.classList.add('has-layout-horizontal');
        card.dataset.layoutMode = 'layout-horizontal';
      }
    }

    // Phase 2: If still overflowing, scale down micro-adjustments smoothly
    let scale = 1.0;
    let iterations = 0;
    while (slots.scrollHeight > slots.clientHeight + 0.5 && iterations < 15 && scale > 0.55) {
      scale -= 0.03;
      slots.style.setProperty('--auto-scale', scale.toFixed(2));
      iterations++;
    }
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
    showToast(`Đã xóa khối "${card.title}" (${state.cards.length}/${MAX_CARDS} khối). Bấm "Hoàn tác" để lấy lại! ↩️`);
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
  autoFitCardSlots(cardId);
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
      syncDropdownsFromTime(item.time);
      buildQuickTimeChips('all');
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
  syncDropdownsFromTime(item.time);
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
  document.getElementById('slot-time-input').value = '07h30 - 11h50';
  document.getElementById('slot-section-select').value = 'Sáng:';
  setSingleTimePickerMode(false);
  syncDropdownsFromTime('07h30 - 11h50');
  buildQuickTimeChips('all');
  chooseIcon('🏫');
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
  const slotTime = slot.time || '';
  document.getElementById('slot-time-input').value = slotTime;
  setSingleTimePickerMode(!slotTime.includes('-'));
  syncDropdownsFromTime(slotTime);
  buildQuickTimeChips('all');

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

// -------------------------------------------------------------
// Smart Time Picker & Quick Period Chips
// -------------------------------------------------------------
const TIME_DROPDOWN_OPTIONS = [
  '06h00', '06h15', '06h30', '06h45',
  '07h00', '07h15', '07h30', '07h45',
  '08h00', '08h15', '08h30', '08h45',
  '09h00', '09h15', '09h30', '09h45',
  '10h00', '10h15', '10h30', '10h45',
  '11h00', '11h15', '11h30', '11h45', '11h50',
  '12h00', '12h15', '12h30', '12h45',
  '13h00', '13h15', '13h30', '13h45',
  '14h00', '14h15', '14h30', '14h45',
  '15h00', '15h15', '15h30', '15h45',
  '16h00', '16h15', '16h30', '16h45',
  '17h00', '17h15', '17h30', '17h45',
  '18h00', '18h15', '18h30', '18h45',
  '19h00', '19h15', '19h30', '19h45',
  '20h00', '20h15', '20h30', '20h45',
  '21h00', '21h15', '21h30', '21h45',
  '22h00', '22h15', '22h30', '23h00'
];

const SMART_TIME_CHIPS = [
  // Sáng
  { time: '07h30 - 11h50', label: '07h30 - 11h50 (Chính khóa)', period: 'sang', section: 'Sáng:' },
  { time: '07h00 - 07h30', label: '07h00 - 07h30 (Ăn sáng)', period: 'sang', section: 'Sáng:' },
  { time: '08h00 - 10h00', label: '08h00 - 10h00 (Học sáng)', period: 'sang', section: 'Sáng:' },
  { time: '07h30 - 09h00', label: '07h30 - 09h00 (Tiết 1-2)', period: 'sang', section: 'Sáng:' },
  // Trưa
  { time: '11h50 - 13h30', label: '11h50 - 13h30 (Ăn trưa & Nghỉ)', period: 'trua', section: 'Trưa:' },
  { time: '12h00 - 13h00', label: '12h00 - 13h00 (Ăn trưa)', period: 'trua', section: 'Trưa:' },
  { time: '13h00 - 14h00', label: '13h00 - 14h00 (Nghỉ trưa)', period: 'trua', section: 'Trưa:' },
  { time: '13h30 - 14h30', label: '13h30 - 14h30 (Ngủ trưa)', period: 'trua', section: 'Chiều:' },
  // Chiều
  { time: '14h00 - 16h30', label: '14h00 - 16h30 (Học chiều)', period: 'chieu', section: 'Chiều:' },
  { time: '14h30 - 15h30', label: '14h30 - 15h30 (Làm BTVN)', period: 'chieu', section: 'Chiều:' },
  { time: '15h30 - 16h30', label: '15h30 - 16h30 (Tập gym / Thể thao)', period: 'chieu', section: 'Chiều:' },
  { time: '16h30 - 16h45', label: '16h30 - 16h45 (Tắm rửa nhanh)', period: 'chieu', section: 'Chiều:' },
  { time: '16h45', label: '16h45 (Di chuyển / Xe bus)', period: 'chieu', section: 'Chiều:', isSingle: true },
  { time: '17h00 - 19h00', label: '17h00 - 19h00 (Học thêm Anh)', period: 'chieu', section: 'Chiều:' },
  // Tối
  { time: '19h00 - 20h00', label: '19h00 - 20h00 (Về nhà, ăn tối)', period: 'toi', section: 'Tối:' },
  { time: '19h30 - 21h00', label: '19h30 - 21h00 (Tự học tối)', period: 'toi', section: 'Tối:' },
  { time: '20h00 - 21h30', label: '20h00 - 21h30 (Soạn sách, BTVN)', period: 'toi', section: 'Tối:' },
  { time: '21h30 - 22h00', label: '21h30 - 22h00 (Đọc sách/truyện)', period: 'toi', section: 'Tối:' },
  { time: '21h30 trở đi', label: '21h30 trở đi (Nghỉ & Ngủ)', period: 'toi', section: 'Tối:', isSingle: true },
  { time: '22h00', label: '22h00 (Đi ngủ)', period: 'toi', section: 'Tối:', isSingle: true }
];

let isSingleTimeMode = false;

function buildTimePickerDropdowns() {
  const startSelect = document.getElementById('time-picker-start');
  const endSelect = document.getElementById('time-picker-end');
  if (!startSelect || !endSelect) return;

  startSelect.innerHTML = '';
  endSelect.innerHTML = '';

  TIME_DROPDOWN_OPTIONS.forEach(opt => {
    const sOpt = document.createElement('option');
    sOpt.value = opt;
    sOpt.textContent = opt;
    startSelect.appendChild(sOpt);

    const eOpt = document.createElement('option');
    eOpt.value = opt;
    eOpt.textContent = opt;
    endSelect.appendChild(eOpt);
  });
}

function buildQuickTimeChips(period = 'all') {
  const container = document.getElementById('quick-time-chips');
  if (!container) return;
  container.innerHTML = '';

  const filtered = (period === 'all')
    ? SMART_TIME_CHIPS
    : SMART_TIME_CHIPS.filter(c => c.period === period);

  filtered.forEach(chip => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-chip-btn';
    btn.textContent = chip.label || chip.time;
    btn.title = `Chọn khung giờ: ${chip.time}`;
    btn.onclick = () => {
      setQuickTime(chip.time, chip.section, chip.isSingle);
    };
    container.appendChild(btn);
  });
}

function filterTimeChips(period, tabBtn) {
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  if (tabBtn) tabBtn.classList.add('active');
  buildQuickTimeChips(period);
}

function setSingleTimePickerMode(isSingle) {
  isSingleTimeMode = !!isSingle;
  const endWrapper = document.getElementById('time-end-wrapper');
  const arrow = document.getElementById('time-range-arrow');
  const toggleBtn = document.getElementById('btn-toggle-single-time');

  if (isSingleTimeMode) {
    if (endWrapper) endWrapper.style.display = 'none';
    if (arrow) arrow.style.display = 'none';
    if (toggleBtn) {
      toggleBtn.textContent = '⏱️ Khoảng giờ';
      toggleBtn.classList.add('active');
    }
  } else {
    if (endWrapper) endWrapper.style.display = 'flex';
    if (arrow) arrow.style.display = 'inline-block';
    if (toggleBtn) {
      toggleBtn.textContent = '⏱️ 1 mốc giờ';
      toggleBtn.classList.remove('active');
    }
  }
}

function toggleSingleTimePicker() {
  setSingleTimePickerMode(!isSingleTimeMode);
  handleTimeDropdownChange();
}

function syncDropdownsFromTime(val) {
  if (!val) return;
  const startSelect = document.getElementById('time-picker-start');
  const endSelect = document.getElementById('time-picker-end');
  if (!startSelect || !endSelect) return;

  const parts = val.split('-').map(s => s.trim());
  if (parts.length >= 2) {
    setSingleTimePickerMode(false);
    ensureDropdownOption(startSelect, parts[0]);
    startSelect.value = parts[0];

    ensureDropdownOption(endSelect, parts[1]);
    endSelect.value = parts[1];
  } else if (parts.length === 1 && parts[0]) {
    setSingleTimePickerMode(true);
    ensureDropdownOption(startSelect, parts[0]);
    startSelect.value = parts[0];
  }
}

function ensureDropdownOption(selectEl, value) {
  if (!value) return;
  const exists = Array.from(selectEl.options).some(o => o.value === value);
  if (!exists) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value;
    selectEl.appendChild(opt);
  }
}

function handleTimeDropdownChange() {
  const startSelect = document.getElementById('time-picker-start');
  const endSelect = document.getElementById('time-picker-end');
  const input = document.getElementById('slot-time-input');
  if (!startSelect || !endSelect || !input) return;

  if (isSingleTimeMode) {
    input.value = startSelect.value;
  } else {
    input.value = `${startSelect.value} - ${endSelect.value}`;
  }

  autoSuggestSection(input.value);
}

function handleManualTimeInput() {
  const input = document.getElementById('slot-time-input');
  if (!input) return;
  const val = input.value.trim();
  syncDropdownsFromTime(val);
  autoSuggestSection(val);
}

function setQuickTime(val, section, isSingle = false) {
  const input = document.getElementById('slot-time-input');
  if (input) input.value = val;

  setSingleTimePickerMode(isSingle || !val.includes('-'));
  syncDropdownsFromTime(val);

  const sectionSelect = document.getElementById('slot-section-select');
  if (sectionSelect && section && !sectionSelect.value) {
    sectionSelect.value = section;
  }
}

function autoSuggestSection(timeStr) {
  const sectionSelect = document.getElementById('slot-section-select');
  if (!sectionSelect || sectionSelect.value) return;

  const clean = timeStr.toLowerCase();
  if (clean.includes('06h') || clean.includes('07h') || clean.includes('08h') || clean.includes('09h') || clean.includes('10h')) {
    sectionSelect.value = 'Sáng:';
  } else if (clean.includes('11h') || clean.includes('12h') || clean.includes('13h')) {
    sectionSelect.value = 'Trưa:';
  } else if (clean.includes('14h') || clean.includes('15h') || clean.includes('16h') || clean.includes('17h')) {
    sectionSelect.value = 'Chiều:';
  } else if (clean.includes('18h') || clean.includes('19h') || clean.includes('20h') || clean.includes('21h') || clean.includes('22h')) {
    sectionSelect.value = 'Tối:';
  }
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
  if (state.cards.length >= MAX_CARDS) {
    showToast(`⚠️ Bảng đã đạt tối đa ${MAX_CARDS} khối! Bạn hãy xóa bớt 1 khối trước khi thêm mới. ✨`, 3500);
    return;
  }
  editingCardId = null;
  document.getElementById('card-modal-title').textContent = `Thêm Khối Mới (${state.cards.length}/${MAX_CARDS})`;
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

  if (!editingCardId && state.cards.length >= MAX_CARDS) {
    showToast(`⚠️ Bảng đã đạt tối đa ${MAX_CARDS} khối! Bạn hãy xóa bớt 1 khối trước khi thêm mới. ✨`, 3500);
    closeModal('modal-card');
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
    // If it's a note or goal block, pre-populate helpful slots
    const isNotes = title.toLowerCase().includes('ghi chú') || title.toLowerCase().includes('mục tiêu') || title.toLowerCase().includes('lời dặn');
    const defaultSlots = isNotes ? [
      { id: 'n_' + Date.now() + '_1', time: 'Mục tiêu tuần', text: 'Hoàn thành bài tập trước 21h00', icon: '🎯', section: '' },
      { id: 'n_' + Date.now() + '_2', time: 'Lời dặn bố mẹ', text: 'Uống đủ nước, tập thể dục đều đặn', icon: '💧', section: 'Lưu ý:' }
    ] : [];

    state.cards.push({
      id: 'card_' + Date.now(),
      title: title,
      color: color,
      spanRows: spanRows,
      spanCols: 1,
      slots: defaultSlots
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
  renderProfileSelector();
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

  // Ensure perfect fit before rendering to canvas
  autoFitCardSlots();

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
// Multi-Profile Management (Các Bé)
// -------------------------------------------------------------
function renderProfileSelector() {
  const select = document.getElementById('select-profile');
  if (!select) return;

  select.innerHTML = '';
  profilesState.profiles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    let emoji = '👶';
    if (p.mascotTheme === 'boys') emoji = '👦';
    else if (p.mascotTheme === 'girls') emoji = '👧';
    else if (p.mascotTheme === 'mixed') emoji = '👫';
    opt.textContent = `${emoji} ${p.studentName || 'Bé'}`;
    if (p.id === profilesState.activeProfileId) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  const delBtn = document.getElementById('btn-del-profile');
  if (delBtn) {
    delBtn.style.display = (profilesState.profiles.length > 1) ? 'inline-flex' : 'none';
  }
}

function switchProfile(newId) {
  if (!newId || newId === profilesState.activeProfileId) return;

  // Save current active state before switching
  const currentIdx = profilesState.profiles.findIndex(p => p.id === profilesState.activeProfileId);
  if (currentIdx >= 0) {
    state.id = profilesState.activeProfileId;
    profilesState.profiles[currentIdx] = JSON.parse(JSON.stringify(state));
  }

  const target = profilesState.profiles.find(p => p.id === newId);
  if (!target) return;

  profilesState.activeProfileId = target.id;
  state = JSON.parse(JSON.stringify(target));
  state.id = target.id;
  if (!state.layoutMode || state.layoutMode === '2rows') state.layoutMode = 'photo';
  if (!state.themePalette) state.themePalette = 'rainbow';

  saveProfilesState();
  undoStack = [];
  redoStack = [];
  renderApp();
  showToast(`Đã chuyển sang thời gian biểu của ${state.studentName}! 👶`);
}

function openAddProfileModal() {
  document.getElementById('profile-name-input').value = '';
  document.getElementById('profile-mascot-select').value = 'girls';
  document.getElementById('profile-theme-select').value = 'candy';
  document.getElementById('profile-layout-select').value = state.layoutMode || 'photo';
  document.getElementById('profile-source-select').value = 'clone_current';

  openModal('modal-profile');
  setTimeout(() => document.getElementById('profile-name-input').focus(), 150);
}

function saveProfileModal() {
  const name = document.getElementById('profile-name-input').value.trim();
  if (!name) {
    alert('Vui lòng nhập tên của bé!');
    document.getElementById('profile-name-input').focus();
    return;
  }

  const mascot = document.getElementById('profile-mascot-select').value;
  const theme = document.getElementById('profile-theme-select').value;
  const layout = document.getElementById('profile-layout-select').value;
  const source = document.getElementById('profile-source-select').value;

  let initialCards = [];
  if (source === 'clone_current') {
    initialCards = JSON.parse(JSON.stringify(state.cards));
  } else if (source === 'original') {
    initialCards = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_ORIGINAL.cards));
  } else if (source === 'notes') {
    initialCards = JSON.parse(JSON.stringify(window.TimetablePresets.PRESET_6DAYS_NOTES.cards));
  }

  // Save current active state before switching
  const currentIdx = profilesState.profiles.findIndex(p => p.id === profilesState.activeProfileId);
  if (currentIdx >= 0) {
    state.id = profilesState.activeProfileId;
    profilesState.profiles[currentIdx] = JSON.parse(JSON.stringify(state));
  }

  const newProfile = {
    id: 'profile_' + Date.now(),
    studentName: name,
    mascotTheme: mascot,
    themePalette: theme,
    layoutMode: layout,
    title: 'THỜI GIAN BIỂU',
    subtitle: '',
    cards: initialCards
  };

  profilesState.profiles.push(newProfile);
  profilesState.activeProfileId = newProfile.id;
  state = JSON.parse(JSON.stringify(newProfile));

  saveProfilesState();
  undoStack = [];
  redoStack = [];
  renderApp();
  closeModal('modal-profile');
  showToast(`Chào mừng bé ${name}! Đã tạo hồ sơ thành công 👶✨`);
}

function openCloneProfileModal() {
  const srcNameEl = document.getElementById('clone-source-name');
  if (srcNameEl) srcNameEl.textContent = state.studentName || 'Bé hiện tại';

  const selectTarget = document.getElementById('clone-target-profile-select');
  const existingRadio = document.querySelector('input[name="clone-mode"][value="existing"]');
  const newRadio = document.querySelector('input[name="clone-mode"][value="new"]');

  if (selectTarget) {
    selectTarget.innerHTML = '';
    const otherProfiles = profilesState.profiles.filter(p => p.id !== profilesState.activeProfileId);
    otherProfiles.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      let emoji = (p.mascotTheme === 'boys') ? '👦' : (p.mascotTheme === 'girls' ? '👧' : '👫');
      opt.textContent = `${emoji} ${p.studentName}`;
      selectTarget.appendChild(opt);
    });

    if (otherProfiles.length === 0) {
      if (existingRadio) existingRadio.disabled = true;
      if (newRadio) newRadio.checked = true;
    } else {
      if (existingRadio) existingRadio.disabled = false;
    }
  }

  const nameInput = document.getElementById('clone-new-name');
  if (nameInput) nameInput.value = '';

  toggleCloneModeUI();
  openModal('modal-clone-profile');
  if (newRadio && newRadio.checked && nameInput) {
    setTimeout(() => nameInput.focus(), 150);
  }
}

function toggleCloneModeUI() {
  const modeRadio = document.querySelector('input[name="clone-mode"]:checked');
  const mode = modeRadio ? modeRadio.value : 'new';
  const newFields = document.getElementById('clone-new-child-fields');
  const existFields = document.getElementById('clone-existing-child-fields');

  if (newFields) newFields.style.display = (mode === 'new') ? 'flex' : 'none';
  if (existFields) existFields.style.display = (mode === 'existing') ? 'block' : 'none';
}

function executeCloneProfile() {
  const modeRadio = document.querySelector('input[name="clone-mode"]:checked');
  const mode = modeRadio ? modeRadio.value : 'new';

  if (mode === 'new') {
    const name = document.getElementById('clone-new-name').value.trim();
    if (!name) {
      alert('Vui lòng nhập tên cho bé mới!');
      document.getElementById('clone-new-name').focus();
      return;
    }
    const mascot = document.getElementById('clone-new-mascot').value || 'girls';
    const theme = document.getElementById('clone-new-theme').value || 'candy';

    const newProfile = {
      id: 'profile_' + Date.now(),
      studentName: name,
      mascotTheme: mascot,
      themePalette: theme,
      layoutMode: state.layoutMode || 'photo',
      title: state.title || 'THỜI GIAN BIỂU',
      subtitle: state.subtitle || '',
      cards: JSON.parse(JSON.stringify(state.cards))
    };

    // Save current active state
    const currentIdx = profilesState.profiles.findIndex(p => p.id === profilesState.activeProfileId);
    if (currentIdx >= 0) {
      state.id = profilesState.activeProfileId;
      profilesState.profiles[currentIdx] = JSON.parse(JSON.stringify(state));
    }

    profilesState.profiles.push(newProfile);
    profilesState.activeProfileId = newProfile.id;
    state = JSON.parse(JSON.stringify(newProfile));

    saveProfilesState();
    undoStack = [];
    redoStack = [];
    renderApp();
    closeModal('modal-clone-profile');
    showToast(`Đã nhân bản lịch sang bé ${name} thành công! 📋🎉`);
  } else {
    const targetSelect = document.getElementById('clone-target-profile-select');
    const targetId = targetSelect ? targetSelect.value : null;
    if (!targetId) {
      alert('Không tìm thấy bé để sao chép đến!');
      return;
    }

    const targetProf = profilesState.profiles.find(p => p.id === targetId);
    if (!targetProf) return;

    if (!confirm(`Bạn có chắc chắn muốn ghi đè toàn bộ lịch của bé "${targetProf.studentName}" bằng lịch của bé "${state.studentName}" không?`)) {
      return;
    }

    targetProf.cards = JSON.parse(JSON.stringify(state.cards));
    saveProfilesState();
    closeModal('modal-clone-profile');
    showToast(`Đã chép lịch sang bé ${targetProf.studentName}! 📋`);
  }
}

function deleteCurrentProfile() {
  if (profilesState.profiles.length <= 1) {
    alert('Không thể xóa khi chỉ còn 1 hồ sơ bé! Bạn có thể đổi tên bé trực tiếp trên thanh công cụ.');
    return;
  }

  if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn hồ sơ của bé "${state.studentName}" không?`)) {
    return;
  }

  const deletedName = state.studentName;
  profilesState.profiles = profilesState.profiles.filter(p => p.id !== profilesState.activeProfileId);
  const nextProfile = profilesState.profiles[0];
  profilesState.activeProfileId = nextProfile.id;
  state = JSON.parse(JSON.stringify(nextProfile));
  state.id = nextProfile.id;

  saveProfilesState();
  undoStack = [];
  redoStack = [];
  renderApp();
  showToast(`Đã xóa hồ sơ bé ${deletedName}! Hiện đang hiển thị ${state.studentName} 🗑️`);
}

function backupProfilesJSON() {
  // Sync state into profilesState first
  const currentIdx = profilesState.profiles.findIndex(p => p.id === profilesState.activeProfileId);
  if (currentIdx >= 0) {
    profilesState.profiles[currentIdx] = JSON.parse(JSON.stringify(state));
  }

  const backupData = {
    appName: 'ThoiGianBieu_Students',
    schemaVersion: 'v1',
    exportedAt: new Date().toISOString(),
    profilesState: profilesState
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `Thoi_Gian_Bieu_Sao_Luu_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Đã tải về file sao lưu .json thành công! 💾');
}

function triggerRestoreJSON() {
  const fileInput = document.getElementById('file-import-json');
  if (fileInput) fileInput.click();
}

function handleRestoreJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.profilesState && Array.isArray(data.profilesState.profiles) && data.profilesState.profiles.length > 0) {
        profilesState = data.profilesState;
        const active = profilesState.profiles.find(p => p.id === profilesState.activeProfileId) || profilesState.profiles[0];
        profilesState.activeProfileId = active.id;
        state = JSON.parse(JSON.stringify(active));
      } else if (data && Array.isArray(data.profiles) && data.profiles.length > 0) {
        profilesState = {
          activeProfileId: data.profiles[0].id,
          profiles: data.profiles
        };
        state = JSON.parse(JSON.stringify(data.profiles[0]));
      } else if (data && Array.isArray(data.cards)) {
        // Single profile format
        const id = 'profile_' + Date.now();
        profilesState = {
          activeProfileId: id,
          profiles: [{
            id: id,
            ...data
          }]
        };
        state = JSON.parse(JSON.stringify(profilesState.profiles[0]));
      } else {
        throw new Error('Định dạng file không hợp lệ');
      }

      if (!state.layoutMode || state.layoutMode === '2rows') state.layoutMode = 'photo';
      if (!state.themePalette) state.themePalette = 'rainbow';

      saveProfilesState();
      undoStack = [];
      redoStack = [];
      renderApp();
      showToast(`Khôi phục dữ liệu thành công! Tìm thấy ${profilesState.profiles.length} bé 📂✨`);
    } catch (err) {
      console.error(err);
      alert('File JSON không đúng cấu trúc thời gian biểu hoặc bị lỗi! Vui lòng chọn đúng file sao lưu.');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
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
      renderProfileSelector();
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
      renderProfileSelector();
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

  window.addEventListener('resize', () => autoFitCardSlots());
  window.addEventListener('beforeprint', () => autoFitCardSlots());
}

document.addEventListener('DOMContentLoaded', initApp);
