// ============================================
// ADAM Demo - Sarah's Event Hall (Venue Type)
// ============================================

const STORAGE_KEY = 'adam_demo_venue_state';

const defaultState = {
  restaurant: {
    id: "sarahs-events",
    name: "Sarah's Event Hall",
    description: "Private event spaces for any occasion",
    phone: "(555) 333-4444",
  },
  // Venue Spaces - like in VenueTabs
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
  // Venue Questions - booking questions asked by AI
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
// Spaces Tab
// ============================================
function initSpaces() {
  renderSpaces();
}

function renderSpaces() {
  const container = document.getElementById('spaces-list');
  
  let html = '';
  state.spaces.forEach(space => {
    html += `
      <div class="space-card">
        <div class="space-header">
          <h4>${space.name}</h4>
          <label class="availability-toggle small">
            <input type="checkbox" ${space.available ? 'checked' : ''} data-id="${space.id}">
            <span class="slider"></span>
          </label>
        </div>
        <div class="space-details">
          <div class="space-detail">
            <span class="label">Standing Capacity</span>
            <span class="value">${space.capacityStanding}</span>
          </div>
          <div class="space-detail">
            <span class="label">Seated Capacity</span>
            <span class="value">${space.capacitySeated}</span>
          </div>
          <div class="space-detail">
            <span class="label">Hourly Rate</span>
            <span class="value price">€${space.hourlyRate}</span>
          </div>
        </div>
        <div class="space-actions">
          <button class="edit-btn" data-id="${space.id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${space.id}">🗑️</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Toggle availability
  document.querySelectorAll('.space-card input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const space = state.spaces.find(s => s.id === id);
      if (space) {
        space.available = e.target.checked;
        saveState();
        renderSpaces();
      }
    });
  });
}

// ============================================
// Questions Tab
// ============================================
function initQuestions() {
  renderQuestions();
}

function renderQuestions() {
  const container = document.getElementById('questions-list');
  
  let html = '';
  state.questions.forEach((q, idx) => {
    html += `
      <div class="question-row">
        <div class="question-text">${q.questionText}</div>
        <div class="question-meta">
          <span class="category">${q.category}</span>
          <span class="required ${q.required ? 'required-yes' : 'required-no'}">${q.required ? 'Required' : 'Optional'}</span>
        </div>
        <div class="question-actions">
          <button class="edit-btn" data-idx="${idx}">✏️</button>
          <button class="delete-btn" data-idx="${idx}">🗑️</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ============================================
// Policies Tab
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
      }
    });
  });
}

function getPolicyUnit(key) {
  const units = {
    deposit_percentage: "%",
    cancellation_days: "days",
    minimum_hours: "hrs",
    after_midnight_surcharge: "%"
  };
  return units[key] || "";
}

// ============================================
// Add-Ons Tab
// ============================================
function initAddons() {
  renderAddons();
}

function renderAddons() {
  const container = document.getElementById('addons-list');
  
  let html = '';
  state.addons.forEach(addon => {
    html += `
      <div class="addon-card">
        <div class="addon-info">
          <h4>${addon.name}</h4>
          <p class="addon-price">€${addon.price}${addon.description ? ' - ' + addon.description : ''}</p>
        </div>
        <label class="availability-toggle small">
          <input type="checkbox" ${addon.available ? 'checked' : ''} data-id="${addon.id}">
          <span class="slider"></span>
        </label>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Toggle availability
  document.querySelectorAll('.addon-card input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const addon = state.addons.find(a => a.id === id);
      if (addon) {
        addon.available = e.target.checked;
        saveState();
        renderAddons();
      }
    });
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

  // Event listeners
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
// First Message
// ============================================
function initFirstMessage() {
  const textarea = document.getElementById('first-message-text');
  const saveBtn = document.getElementById('save-first-message');
  const feedback = document.getElementById('first-message-feedback');
  
  textarea.value = state.firstMessage;
  
  saveBtn.addEventListener('click', () => {
    state.firstMessage = textarea.value;
    saveState();
    feedback.textContent = '✓ Saved';
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), 2000);
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