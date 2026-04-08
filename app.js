// ============================================
// ADAM Demo - Sarah's Event Hall (Venue Type)
// Full Interactive - Local Storage Only
// ============================================

const STORAGE_KEY = 'adam_demo_venue_state';

const defaultState = {
  restaurant: {
    id: "sarahs-events",
    name: "Sarah's Event Hall",
    description: "Private event spaces for any occasion",
    phone: "(555) 333-4444",
  },
  // Venue Spaces
  spaces: [
    { 
      id: "space-1", 
      name: "Main Hall", 
      capacityStanding: 60, 
      capacitySeated: 40, 
      hourlyRate: 250,
      description: "",
      amenities: "",
      available: true 
    },
    { 
      id: "space-2", 
      name: "Garden Room", 
      capacityStanding: 25, 
      capacitySeated: 20, 
      hourlyRate: 120,
      description: "",
      amenities: "",
      available: true 
    },
  ],
  // Venue Questions
  questions: [
    { id: "q1", questionText: "How many guests are you expecting?", required: true, category: "guest_info" },
    { id: "q2", questionText: "What kind of event is this?", required: true, category: "guest_info" },
    { id: "q3", questionText: "Can I take your name for the booking?", required: true, category: "guest_info" },
    { id: "q4", questionText: "Will you need catering?", required: false, category: "catering" },
    { id: "q5", questionText: "Any special requirements?", required: false, category: "requirements" },
  ],
  // Venue Policies
  policies: [
    { key: "deposit_percentage", value: "50", label: "Deposit Required" },
    { key: "cancellation_days", value: "7", label: "Cancellation Notice" },
    { key: "minimum_hours", value: "2", label: "Minimum Hours" },
  ],
  // Venue Add-Ons
  addons: [
    { id: "addon-1", name: "Catering Package", price: 18, description: "Per person", available: true },
    { id: "addon-2", name: "DJ Setup", price: 175, description: "", available: true },
  ],
  // Opening Hours
  hours: [
    { day: 'Monday', open: '09:00', close: '23:00', closed: false },
    { day: 'Tuesday', open: '09:00', close: '23:00', closed: false },
    { day: 'Wednesday', open: '09:00', close: '23:00', closed: false },
    { day: 'Thursday', open: '09:00', close: '23:00', closed: false },
    { day: 'Friday', open: '09:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '09:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '', close: '', closed: true },
  ],
  // First Message
  firstMessage: "Hello, thanks for calling Sarah's Event Hall! Are you looking to book a space?",
  // Calls
  calls: [
    { id: 1, date: 'Today', time: '14:32', summary: 'Wedding inquiry - 60 guests, June 2026', status: 'handled' },
    { id: 2, date: 'Today', time: '11:15', summary: 'Corporate event quote request for 40 people', status: 'handled' },
    { id: 3, date: 'Yesterday', time: '16:45', summary: 'Question about parking facilities', status: 'handled' },
    { id: 4, date: 'Yesterday', time: '10:30', summary: 'Callback requested - missed call', status: 'missed' },
    { id: 5, date: 'Apr 5', time: '09:20', summary: 'Customer escalated to manager - pricing dispute', status: 'transferred' },
    { id: 6, date: 'Apr 4', time: '15:10', summary: 'Birthday party booking confirmed - 20 guests', status: 'handled' },
  ],
  // Reservations
  reservations: [
    { id: 1, customerName: "John Smith", date: "2026-04-15", startTime: "14:00", endTime: "18:00", status: "confirmed", space: "Main Hall", guestCount: 40, customerEmail: "john@email.com", customerPhone: "(555) 111-2222", notes: "Corporate meeting" },
    { id: 2, customerName: "Emily Johnson", date: "2026-04-20", startTime: "12:00", endTime: "23:00", status: "pending", space: "Main Hall", guestCount: 60, customerEmail: "emily@email.com", customerPhone: "(555) 333-4444", notes: "Wedding reception" },
    { id: 3, customerName: "Michael Brown", date: "2026-04-10", startTime: "10:00", endTime: "14:00", status: "confirmed", space: "Garden Room", guestCount: 15, customerEmail: "mike@email.com", customerPhone: "(555) 555-6666", notes: "" },
  ],
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function showFeedback(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
  }
}

// ============================================
// Demo Tab Switching
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  updateRestaurantName();
  initDemoTabs();
  initSpaces();
  initQuestions();
  initPolicies();
  initAddons();
  initHours();
  initFirstMessage();
  initCalls();
  initReservations();
});

function updateRestaurantName() {
  document.getElementById('restaurant-name').textContent = state.restaurant.name;
  document.getElementById('restaurant-phone').textContent = state.restaurant.phone;
}

function initDemoTabs() {
  const tabs = document.querySelectorAll('.demo-tab');
  const contents = document.querySelectorAll('.demo-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.demo;
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('demo-' + target).classList.add('active');
    });
  });
}

// ============================================
// Spaces Tab - FULL CRUD
// ============================================
let editingSpaceId = null;

function initSpaces() {
  renderSpaces();
  setupSpaceListeners();
}

function renderSpaces() {
  const container = document.getElementById('spaces-list');
  
  let html = '';
  state.spaces.forEach(space => {
    html += `
      <div class="space-card" data-id="${space.id}">
        <div class="space-header">
          <h4>${space.name}</h4>
          <label class="availability-toggle small">
            <input type="checkbox" ${space.available ? 'checked' : ''} data-id="${space.id}" data-action="toggle">
            <span class="slider"></span>
          </label>
        </div>
        <div class="space-details">
          <div class="space-detail">
            <span class="label">Standing</span>
            <span class="value">${space.capacityStanding}</span>
          </div>
          <div class="space-detail">
            <span class="label">Seated</span>
            <span class="value">${space.capacitySeated}</span>
          </div>
          <div class="space-detail">
            <span class="label">Rate/hr</span>
            <span class="value price">€${space.hourlyRate}</span>
          </div>
        </div>
        <div class="space-actions">
          <button class="edit-btn" data-action="edit" data-id="${space.id}">✏️ Edit</button>
          <button class="delete-btn" data-action="delete" data-id="${space.id}">🗑️</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  if (state.spaces.length === 0) {
    container.innerHTML = '<p class="empty-state">No spaces yet. Add one below!</p>';
  }
}

function setupSpaceListeners() {
  // Add button
  document.getElementById('add-space-btn')?.addEventListener('click', () => {
    document.getElementById('space-form').classList.add('show');
    document.getElementById('edit-space-form').classList.remove('show');
    clearSpaceForm();
  });
  
  // Cancel add
  document.getElementById('cancel-add-space')?.addEventListener('click', () => {
    document.getElementById('space-form').classList.remove('show');
    clearSpaceForm();
  });
  
  // Confirm add
  document.getElementById('confirm-add-space')?.addEventListener('click', () => {
    const name = document.getElementById('new-space-name').value.trim();
    const standing = parseInt(document.getElementById('new-space-standing').value) || 0;
    const seated = parseInt(document.getElementById('new-space-seated').value) || 0;
    const rate = parseFloat(document.getElementById('new-space-rate').value) || 0;
    
    if (!name) return;
    
    state.spaces.push({
      id: generateId(),
      name,
      capacityStanding: standing,
      capacitySeated: seated,
      hourlyRate: rate,
      description: "",
      amenities: "",
      available: true
    });
    saveState();
    renderSpaces();
    document.getElementById('space-form').classList.remove('show');
    clearSpaceForm();
    showFeedback('space-feedback', '✓ Added');
  });
  
  // Cancel edit
  document.getElementById('cancel-edit-space')?.addEventListener('click', () => {
    document.getElementById('edit-space-form').classList.remove('show');
    editingSpaceId = null;
  });
  
  // Confirm edit
  document.getElementById('confirm-edit-space')?.addEventListener('click', () => {
    if (!editingSpaceId) return;
    
    const name = document.getElementById('edit-space-name').value.trim();
    const standing = parseInt(document.getElementById('edit-space-standing').value) || 0;
    const seated = parseInt(document.getElementById('edit-space-seated').value) || 0;
    const rate = parseFloat(document.getElementById('edit-space-rate').value) || 0;
    
    if (!name) return;
    
    const space = state.spaces.find(s => s.id === editingSpaceId);
    if (space) {
      space.name = name;
      space.capacityStanding = standing;
      space.capacitySeated = seated;
      space.hourlyRate = rate;
      saveState();
      renderSpaces();
    }
    
    document.getElementById('edit-space-form').classList.remove('show');
    editingSpaceId = null;
    showFeedback('space-feedback', '✓ Saved');
  });
  
  // Delegated events for cards
  document.getElementById('spaces-list')?.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    
    if (action === 'toggle') {
      const space = state.spaces.find(s => s.id === id);
      if (space) {
        space.available = e.target.checked;
        saveState();
        renderSpaces();
      }
    }
    
    if (action === 'edit') {
      const space = state.spaces.find(s => s.id === id);
      if (space) {
        editingSpaceId = id;
        document.getElementById('edit-space-name').value = space.name;
        document.getElementById('edit-space-standing').value = space.capacityStanding;
        document.getElementById('edit-space-seated').value = space.capacitySeated;
        document.getElementById('edit-space-rate').value = space.hourlyRate;
        document.getElementById('edit-space-form').classList.add('show');
        document.getElementById('space-form').classList.remove('show');
      }
    }
    
    if (action === 'delete') {
      if (confirm('Delete this space?')) {
        state.spaces = state.spaces.filter(s => s.id !== id);
        saveState();
        renderSpaces();
        showFeedback('space-feedback', '✓ Deleted');
      }
    }
  });
}

function clearSpaceForm() {
  document.getElementById('new-space-name').value = '';
  document.getElementById('new-space-standing').value = '';
  document.getElementById('new-space-seated').value = '';
  document.getElementById('new-space-rate').value = '';
}

// ============================================
// Questions Tab - FULL CRUD
// ============================================
let editingQuestionIdx = null;

function initQuestions() {
  renderQuestions();
  setupQuestionListeners();
}

function renderQuestions() {
  const container = document.getElementById('questions-list');
  
  let html = '';
  state.questions.forEach((q, idx) => {
    html += `
      <div class="question-row" data-idx="${idx}">
        <div class="question-text">${q.questionText}</div>
        <div class="question-meta">
          <span class="category">${q.category}</span>
          <label class="required-toggle">
            <input type="checkbox" ${q.required ? 'checked' : ''} data-idx="${idx}" data-action="toggle-required">
            <span class="toggle-label">${q.required ? 'Required' : 'Optional'}</span>
          </label>
        </div>
        <div class="question-actions">
          <button class="edit-btn" data-action="edit" data-idx="${idx}">✏️</button>
          <button class="delete-btn" data-action="delete" data-idx="${idx}">🗑️</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function setupQuestionListeners() {
  // Add button
  document.getElementById('add-question-btn')?.addEventListener('click', () => {
    document.getElementById('question-form').classList.add('show');
    document.getElementById('edit-question-form').classList.remove('show');
  });
  
  // Cancel add
  document.getElementById('cancel-add-question')?.addEventListener('click', () => {
    document.getElementById('question-form').classList.remove('show');
    document.getElementById('new-question-text').value = '';
  });
  
  // Confirm add
  document.getElementById('confirm-add-question')?.addEventListener('click', () => {
    const text = document.getElementById('new-question-text').value.trim();
    const required = document.getElementById('new-question-required').checked;
    const category = document.getElementById('new-question-category').value;
    
    if (!text) return;
    
    state.questions.push({
      id: generateId(),
      questionText: text,
      required,
      category
    });
    saveState();
    renderQuestions();
    document.getElementById('question-form').classList.remove('show');
    document.getElementById('new-question-text').value = '';
    showFeedback('question-feedback', '✓ Added');
  });
  
  // Cancel edit
  document.getElementById('cancel-edit-question')?.addEventListener('click', () => {
    document.getElementById('edit-question-form').classList.remove('show');
    editingQuestionIdx = null;
  });
  
  // Confirm edit
  document.getElementById('confirm-edit-question')?.addEventListener('click', () => {
    if (editingQuestionIdx === null) return;
    
    const text = document.getElementById('edit-question-text').value.trim();
    const required = document.getElementById('edit-question-required').checked;
    const category = document.getElementById('edit-question-category').value;
    
    if (!text) return;
    
    state.questions[editingQuestionIdx].questionText = text;
    state.questions[editingQuestionIdx].required = required;
    state.questions[editingQuestionIdx].category = category;
    saveState();
    renderQuestions();
    document.getElementById('edit-question-form').classList.remove('show');
    editingQuestionIdx = null;
    showFeedback('question-feedback', '✓ Saved');
  });
  
  // Delegated events
  document.getElementById('questions-list')?.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const idx = parseInt(e.target.dataset.idx);
    
    if (action === 'toggle-required') {
      state.questions[idx].required = e.target.checked;
      saveState();
      renderQuestions();
    }
    
    if (action === 'edit') {
      editingQuestionIdx = idx;
      const q = state.questions[idx];
      document.getElementById('edit-question-text').value = q.questionText;
      document.getElementById('edit-question-required').checked = q.required;
      document.getElementById('edit-question-category').value = q.category;
      document.getElementById('edit-question-form').classList.add('show');
      document.getElementById('question-form').classList.remove('show');
    }
    
    if (action === 'delete') {
      if (confirm('Delete this question?')) {
        state.questions.splice(idx, 1);
        saveState();
        renderQuestions();
        showFeedback('question-feedback', '✓ Deleted');
      }
    }
  });
}

// ============================================
// Policies Tab - FULL CRUD
// ============================================
function initPolicies() {
  renderPolicies();
}

function renderPolicies() {
  const container = document.getElementById('policies-list');
  
  let html = '';
  state.policies.forEach(policy => {
    html += `
      <div class="policy-row">
        <span class="policy-label">${policy.label}</span>
        <input type="text" class="policy-input" value="${policy.value}" data-key="${policy.key}">
        <span class="policy-unit">${getPolicyUnit(policy.key)}</span>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Save on change
  document.querySelectorAll('.policy-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const key = e.target.dataset.key;
      const policy = state.policies.find(p => p.key === key);
      if (policy) {
        policy.value = e.target.value;
        saveState();
        showFeedback('policy-feedback', '✓ Saved');
      }
    });
  });
}

function getPolicyUnit(key) {
  const units = { deposit_percentage: "%", cancellation_days: "days", minimum_hours: "hrs", after_midnight_surcharge: "%" };
  return units[key] || "";
}

// ============================================
// Add-Ons Tab - FULL CRUD
// ============================================
function initAddons() {
  renderAddons();
  setupAddonListeners();
}

function renderAddons() {
  const container = document.getElementById('addons-list');
  
  let html = '';
  state.addons.forEach(addon => {
    html += `
      <div class="addon-card" data-id="${addon.id}">
        <div class="addon-info">
          <h4>${addon.name}</h4>
          <p class="addon-price">€${addon.price}${addon.description ? ' - ' + addon.description : ''}</p>
        </div>
        <div class="addon-actions">
          <label class="availability-toggle small">
            <input type="checkbox" ${addon.available ? 'checked' : ''} data-id="${addon.id}" data-action="toggle">
            <span class="slider"></span>
          </label>
          <button class="edit-btn" data-action="edit" data-id="${addon.id}">✏️</button>
          <button class="delete-btn" data-action="delete" data-id="${addon.id}">🗑️</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  if (state.addons.length === 0) {
    container.innerHTML = '<p class="empty-state">No add-ons yet.</p>';
  }
}

function setupAddonListeners() {
  document.getElementById('add-addon-btn')?.addEventListener('click', () => {
    document.getElementById('addon-form').classList.add('show');
    document.getElementById('edit-addon-form').classList.remove('show');
  });
  
  document.getElementById('cancel-add-addon')?.addEventListener('click', () => {
    document.getElementById('addon-form').classList.remove('show');
    document.getElementById('new-addon-name').value = '';
    document.getElementById('new-addon-price').value = '';
    document.getElementById('new-addon-desc').value = '';
  });
  
  document.getElementById('confirm-add-addon')?.addEventListener('click', () => {
    const name = document.getElementById('new-addon-name').value.trim();
    const price = parseFloat(document.getElementById('new-addon-price').value) || 0;
    const desc = document.getElementById('new-addon-desc').value.trim();
    
    if (!name) return;
    
    state.addons.push({ id: generateId(), name, price, description: desc, available: true });
    saveState();
    renderAddons();
    document.getElementById('addon-form').classList.remove('show');
    document.getElementById('new-addon-name').value = '';
    document.getElementById('new-addon-price').value = '';
    document.getElementById('new-addon-desc').value = '';
    showFeedback('addon-feedback', '✓ Added');
  });
  
  document.getElementById('cancel-edit-addon')?.addEventListener('click', () => {
    document.getElementById('edit-addon-form').classList.remove('show');
  });
  
  document.getElementById('confirm-edit-addon')?.addEventListener('click', () => {
    const id = document.getElementById('edit-addon-id').value;
    const name = document.getElementById('edit-addon-name').value.trim();
    const price = parseFloat(document.getElementById('edit-addon-price').value) || 0;
    const desc = document.getElementById('edit-addon-desc').value.trim();
    
    const addon = state.addons.find(a => a.id === id);
    if (addon && name) {
      addon.name = name;
      addon.price = price;
      addon.description = desc;
      saveState();
      renderAddons();
      document.getElementById('edit-addon-form').classList.remove('show');
      showFeedback('addon-feedback', '✓ Saved');
    }
  });
  
  document.getElementById('addons-list')?.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    
    if (action === 'toggle') {
      const addon = state.addons.find(a => a.id === id);
      if (addon) {
        addon.available = e.target.checked;
        saveState();
        renderAddons();
      }
    }
    
    if (action === 'edit') {
      const addon = state.addons.find(a => a.id === id);
      if (addon) {
        document.getElementById('edit-addon-id').value = addon.id;
        document.getElementById('edit-addon-name').value = addon.name;
        document.getElementById('edit-addon-price').value = addon.price;
        document.getElementById('edit-addon-desc').value = addon.description;
        document.getElementById('edit-addon-form').classList.add('show');
        document.getElementById('addon-form').classList.remove('show');
      }
    }
    
    if (action === 'delete') {
      if (confirm('Delete this add-on?')) {
        state.addons = state.addons.filter(a => a.id !== id);
        saveState();
        renderAddons();
        showFeedback('addon-feedback', '✓ Deleted');
      }
    }
  });
}

// ============================================
// Hours Tab
// ============================================
function initHours() {
  renderHours();
}

function renderHours() {
  const container = document.getElementById('hours-grid');

  let html = '';
  state.hours.forEach((h, idx) => {
    html += `
      <div class="hours-row">
        <span class="hours-day">${h.day}</span>
        <div class="hours-times">
          <input type="time" class="open-time" value="${h.open}" ${h.closed ? 'disabled' : ''} data-idx="${idx}">
          <span style="color: var(--text-dim)">-</span>
          <input type="time" class="close-time" value="${h.close}" ${h.closed ? 'disabled' : ''} data-idx="${idx}">
          <label class="closed-toggle">
            <input type="checkbox" class="closed-checkbox" ${h.closed ? 'checked' : ''} data-idx="${idx}">
            <span>Closed</span>
          </label>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  document.querySelectorAll('.open-time').forEach((input) => {
    input.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      state.hours[idx].open = e.target.value;
      saveState();
    });
  });

  document.querySelectorAll('.close-time').forEach((input) => {
    input.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      state.hours[idx].close = e.target.value;
      saveState();
    });
  });

  document.querySelectorAll('.closed-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      state.hours[idx].closed = e.target.checked;
      saveState();
      renderHours();
    });
  });
}

// ============================================
// First Message Tab
// ============================================
function initFirstMessage() {
  const textarea = document.getElementById('first-message-text');
  const saveBtn = document.getElementById('save-first-message');
  
  textarea.value = state.firstMessage;
  
  saveBtn.addEventListener('click', () => {
    state.firstMessage = textarea.value;
    saveState();
    showFeedback('first-message-feedback', '✓ Saved');
  });
}

// ============================================
// Calls Tab (Read-only)
// ============================================
function initCalls() {
  renderCalls();
}

function renderCalls() {
  const container = document.getElementById('calls-list');
  
  let html = '';
  state.calls.forEach(call => {
    html += `
      <div class="call-row">
        <div class="call-info">
          <span class="call-time">${call.date}, ${call.time}</span>
          <span class="call-summary">${call.summary}</span>
        </div>
        <span class="call-status ${call.status}">${call.status.charAt(0).toUpperCase() + call.status.slice(1)}</span>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ============================================
// Reservations Tab (Read-only)
// ============================================
function initReservations() {
  renderReservations();
}

function renderReservations() {
  const container = document.getElementById('reservations-list');
  
  let html = '';
  state.reservations.forEach(res => {
    const statusClass = res.status === 'confirmed' ? 'confirmed' : 'pending';
    html += `
      <div class="reservation-card">
        <div class="reservation-header">
          <span class="customer-name">${res.customerName}</span>
          <span class="reservation-status ${statusClass}">${res.status}</span>
        </div>
        <div class="reservation-details">
          <div class="detail-row">
            <span class="label">Date</span>
            <span class="value">${res.date}</span>
          </div>
          <div class="detail-row">
            <span class="label">Time</span>
            <span class="value">${res.startTime} - ${res.endTime}</span>
          </div>
          <div class="detail-row">
            <span class="label">Space</span>
            <span class="value">${res.space}</span>
          </div>
          <div class="detail-row">
            <span class="label">Guests</span>
            <span class="value">${res.guestCount}</span>
          </div>
          ${res.notes ? `<div class="detail-row"><span class="label">Notes</span><span class="value">${res.notes}</span></div>` : ''}
        </div>
      </div>
    `;
  });
  
  if (state.reservations.length === 0) {
    html = '<p class="empty-state">No reservations yet</p>';
  }
  
  container.innerHTML = html;
}