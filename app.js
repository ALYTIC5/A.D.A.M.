// ============================================
// ADAM Demo - Client Dashboard
// ============================================

// State Management
const STORAGE_KEY = 'adam_demo_state';

const defaultState = {
  menuItems: [
    { id: 1, name: 'Bruschetta Classica', price: '8.50', category: 'Starters', available: true },
    { id: 2, name: 'Caprese Salad', price: '12.00', category: 'Starters', available: true },
    { id: 3, name: 'Truffle Risotto', price: '24.00', category: 'Mains', available: true },
    { id: 4, name: 'Grilled Branzino', price: '28.00', category: 'Mains', available: false },
    { id: 5, name: 'Pasta Carbonara', price: '18.00', category: 'Mains', available: true },
    { id: 6, name: 'Tiramisu', price: '9.00', category: 'Desserts', available: true },
    { id: 7, name: 'Panna Cotta', price: '8.00', category: 'Desserts', available: false },
    { id: 8, name: 'House Wine (Glass)', price: '7.00', category: 'Drinks', available: true },
  ],
  hours: [
    { day: 'Monday', open: '', close: '', closed: true },
    { day: 'Tuesday', open: '11:30', close: '22:00', closed: false },
    { day: 'Wednesday', open: '11:30', close: '22:00', closed: false },
    { day: 'Thursday', open: '11:30', close: '22:00', closed: false },
    { day: 'Friday', open: '11:30', close: '23:00', closed: false },
    { day: 'Saturday', open: '12:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '12:00', close: '21:00', closed: false },
  ],
  agent: {
    active: true,
    greeting: 'Thank you for calling La Dolce Vita, how can I help you today?',
    instructions: 'Always mention our daily special is the truffle pasta. Ask if they want to make a reservation.',
    voice: 'sofia',
  },
  calls: [
    { id: 1, date: '2026-04-07', time: '18:32', duration: '3:45', summary: 'Asked about reservations for 4 on Saturday', status: 'handled' },
    { id: 2, date: '2026-04-07', time: '19:15', duration: '2:12', summary: 'Wanted to know if we cater for events', status: 'transferred' },
    { id: 3, date: '2026-04-06', time: '12:45', duration: '1:30', summary: 'Asked about opening hours', status: 'handled' },
    { id: 4, date: '2026-04-06', time: '20:00', duration: '0:45', summary: 'Wrong number', status: 'missed' },
    { id: 5, date: '2026-04-05', time: '18:22', duration: '4:10', summary: 'Made reservation for 2 tonight', status: 'handled' },
    { id: 6, date: '2026-04-05', time: '19:48', duration: '2:55', summary: 'Asked about vegetarian options', status: 'handled' },
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
// Main Navigation
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMainNav();
  initTabs();
  initMenu();
  initHours();
  initAgent();
  initCalls();
});

function initMainNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navButtons = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('.nav-section');

  function switchNav(target) {
    navLinks.forEach(l => l.classList.remove('active'));
    navButtons.forEach(b => b.classList.remove('active'));
    
    const link = document.querySelector(`.nav-link[data-nav="${target}"]`);
    const btn = document.querySelector(`[data-nav="${target}"]`);
    if (link) link.classList.add('active');
    if (btn) btn.classList.add('active');

    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => switchNav(link.dataset.nav));
  });

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => switchNav(btn.dataset.nav));
  });
}

// ============================================
// Tab Navigation (Dashboard)
// ============================================
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
}

// ============================================
// Menu Management
// ============================================
let editingItemId = null;

function initMenu() {
  renderMenu();
  setupMenuEventListeners();
}

function renderMenu() {
  const container = document.getElementById('menu-items');
  const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

  let html = '';
  categories.forEach(cat => {
    const items = state.menuItems.filter(item => item.category === cat);
    if (items.length === 0) return;

    html += `<div class="menu-category"><h4>${cat}</h4>`;
    items.forEach(item => {
      html += `
        <div class="menu-item" data-id="${item.id}">
          <div class="menu-item-info">
            <label class="toggle-switch">
              <input type="checkbox" class="availability-toggle" ${item.available ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
            <span class="availability-dot ${item.available ? 'available' : ''}"></span>
            <span class="menu-item-name">${item.name}</span>
            <span class="menu-item-price">€${item.price}</span>
          </div>
          <div class="menu-item-actions">
            <button class="edit-btn" title="Edit">✏️</button>
            <button class="delete-btn" title="Delete">🗑️</button>
          </div>
        </div>
      `;
    });
    html += '</div>';
  });

  container.innerHTML = html;

  const available = state.menuItems.filter(i => i.available).length;
  const total = state.menuItems.length;
  document.getElementById('menu-count').textContent = `${available}/${total} items available`;

  document.querySelectorAll('.availability-toggle').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const id = parseInt(e.target.closest('.menu-item').dataset.id);
      const item = state.menuItems.find(i => i.id === id);
      if (item) {
        item.available = e.target.checked;
        saveState();
        renderMenu();
      }
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('.menu-item').dataset.id);
      openEditForm(id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('.menu-item').dataset.id);
      if (confirm('Delete this item?')) {
        state.menuItems = state.menuItems.filter(i => i.id !== id);
        saveState();
        renderMenu();
      }
    });
  });
}

function setupMenuEventListeners() {
  document.getElementById('add-item-btn').addEventListener('click', () => {
    document.getElementById('add-item-form').style.display = 'flex';
    document.getElementById('edit-item-form').style.display = 'none';
  });

  document.getElementById('cancel-add').addEventListener('click', () => {
    document.getElementById('add-item-form').style.display = 'none';
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-price').value = '';
  });

  document.getElementById('confirm-add').addEventListener('click', () => {
    const name = document.getElementById('new-item-name').value.trim();
    const price = document.getElementById('new-item-price').value.trim();
    const category = document.getElementById('new-item-category').value;

    if (!name || !price) return;

    const newId = Math.max(...state.menuItems.map(i => i.id), 0) + 1;
    state.menuItems.push({ id: newId, name, price, category, available: true });
    saveState();
    renderMenu();

    document.getElementById('add-item-form').style.display = 'none';
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-price').value = '';
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-item-form').style.display = 'none';
    editingItemId = null;
  });

  document.getElementById('confirm-edit').addEventListener('click', () => {
    if (!editingItemId) return;

    const name = document.getElementById('edit-item-name').value.trim();
    const price = document.getElementById('edit-item-price').value.trim();
    const category = document.getElementById('edit-item-category').value;

    const item = state.menuItems.find(i => i.id === editingItemId);
    if (item && name && price) {
      item.name = name;
      item.price = price;
      item.category = category;
      saveState();
      renderMenu();
    }

    document.getElementById('edit-item-form').style.display = 'none';
    editingItemId = null;
  });
}

function openEditForm(id) {
  const item = state.menuItems.find(i => i.id === id);
  if (!item) return;

  editingItemId = id;
  document.getElementById('edit-item-name').value = item.name;
  document.getElementById('edit-item-price').value = item.price;
  document.getElementById('edit-item-category').value = item.category;

  document.getElementById('edit-item-form').style.display = 'flex';
  document.getElementById('add-item-form').style.display = 'none';
}

// ============================================
// Hours Management
// ============================================
function initHours() {
  renderHours();
}

function renderHours() {
  const container = document.getElementById('hours-grid');

  let html = '';
  state.hours.forEach((h, idx) => {
    html += `
      <div class="hour-row day-label">${h.day}</div>
      <div class="hour-row">
        <input type="time" class="open-time" value="${h.open}" ${h.closed ? 'disabled' : ''}>
        <span style="color: var(--text-muted)">to</span>
        <input type="time" class="close-time" value="${h.close}" ${h.closed ? 'disabled' : ''}>
        <label class="closed-toggle">
          <input type="checkbox" class="closed-checkbox" ${h.closed ? 'checked' : ''}>
          <span>Closed</span>
        </label>
      </div>
    `;
  });

  container.innerHTML = html;

  document.querySelectorAll('.open-time').forEach((input, idx) => {
    input.addEventListener('change', (e) => {
      state.hours[idx].open = e.target.value;
      saveState();
    });
  });

  document.querySelectorAll('.close-time').forEach((input, idx) => {
    input.addEventListener('change', (e) => {
      state.hours[idx].close = e.target.value;
      saveState();
    });
  });

  document.querySelectorAll('.closed-checkbox').forEach((checkbox, idx) => {
    checkbox.addEventListener('change', (e) => {
      state.hours[idx].closed = e.target.checked;
      saveState();
      renderHours();
    });
  });
}

// ============================================
// AI Agent Settings
// ============================================
function initAgent() {
  const statusToggle = document.getElementById('agent-status-toggle');
  const greetingText = document.getElementById('greeting-text');
  const specialInstructions = document.getElementById('special-instructions');
  const voiceSelect = document.getElementById('voice-select');

  statusToggle.checked = state.agent.active;
  greetingText.value = state.agent.greeting;
  specialInstructions.value = state.agent.instructions;
  voiceSelect.value = state.agent.voice;
  updateStatusDisplay();

  statusToggle.addEventListener('change', (e) => {
    state.agent.active = e.target.checked;
    updateStatusDisplay();
    saveState();
  });

  greetingText.addEventListener('input', (e) => {
    state.agent.greeting = e.target.value;
    saveState();
  });

  specialInstructions.addEventListener('input', (e) => {
    state.agent.instructions = e.target.value;
    saveState();
  });

  voiceSelect.addEventListener('change', (e) => {
    state.agent.voice = e.target.value;
    saveState();
  });
}

function updateStatusDisplay() {
  const statusToggle = document.getElementById('agent-status-toggle');
  const statusText = document.getElementById('status-text');

  if (statusToggle.checked) {
    statusText.textContent = 'Active';
    statusText.className = 'status-text active';
  } else {
    statusText.textContent = 'Inactive';
    statusText.className = 'status-text inactive';
  }
}

// ============================================
// Call Log
// ============================================
function initCalls() {
  renderCalls();
  document.getElementById('call-filter').addEventListener('change', renderCalls);
}

function renderCalls() {
  const filter = document.getElementById('call-filter').value;
  const tbody = document.getElementById('call-table-body');

  let filtered = state.calls;
  if (filter !== 'all') {
    filtered = state.calls.filter(c => c.status === filter);
  }

  let html = '';
  filtered.forEach(call => {
    html += `
      <tr>
        <td>${call.date}</td>
        <td>${call.time}</td>
        <td>${call.duration}</td>
        <td>${call.summary}</td>
        <td><span class="status-badge ${call.status}">${capitalize(call.status)}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
