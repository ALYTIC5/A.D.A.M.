// ============================================
// ADAM Demo - Interactive Client Dashboard
// ============================================

const STORAGE_KEY = 'adam_demo_state';

const defaultState = {
  restaurant: {
    name: "Sarah's Pizza",
    description: "Authentic Italian pizza & pasta",
    phone: "(555) 123-4567",
  },
  menuItems: [
    { id: 1, name: 'Margherita', price: '12.00', category: 'Pizzas', available: true },
    { id: 2, name: 'Pepperoni', price: '14.00', category: 'Pizzas', available: true },
    { id: 3, name: 'BBQ Chicken', price: '15.50', category: 'Pizzas', available: false },
    { id: 4, name: 'Caesar Salad', price: '8.00', category: 'Salads', available: true },
    { id: 5, name: 'Spaghetti Carbonara', price: '13.00', category: 'Pasta', available: true },
    { id: 6, name: 'Lasagna', price: '14.50', category: 'Pasta', available: true },
    { id: 7, name: 'Tiramisu', price: '7.00', category: 'Desserts', available: true },
    { id: 8, name: 'Garlic Bread', price: '5.00', category: 'Sides', available: true },
  ],
  hours: [
    { day: 'Monday', open: '', close: '', closed: true },
    { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '22:00', closed: false },
    { day: 'Friday', open: '11:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '12:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '12:00', close: '21:00', closed: false },
  ],
  firstMessage: "Hi! Welcome to Sarah's Pizza. How can I help you today?",
  calls: [
    { id: 1, date: 'Today', time: '18:32', summary: 'Table for 4, Saturday evening', status: 'handled' },
    { id: 2, date: 'Today', time: '17:15', summary: 'Takeout order - 2 margheritas', status: 'handled' },
    { id: 3, date: 'Yesterday', time: '19:45', summary: 'Question about gluten-free options', status: 'handled' },
    { id: 4, date: 'Yesterday', time: '14:20', summary: 'Complaint about delivery time', status: 'transferred' },
    { id: 5, date: 'Apr 5', time: '20:10', summary: 'Wrong number', status: 'missed' },
    { id: 6, date: 'Apr 5', time: '12:30', summary: 'Reservation for 2, tonight', status: 'handled' },
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
  initDemoTabs();
  initMenu();
  initHours();
  initFirstMessage();
  initCalls();
});

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
// Menu Management
// ============================================
let editingItemId = null;

function initMenu() {
  renderMenu();
  setupMenuListeners();
}

function renderMenu() {
  const container = document.getElementById('menu-items');
  const categories = ['Pizzas', 'Salads', 'Pasta', 'Desserts', 'Sides'];

  let html = '';
  categories.forEach(cat => {
    const items = state.menuItems.filter(item => item.category === cat);
    if (items.length === 0) return;

    html += `<div class="menu-category"><h4>${cat}</h4>`;
    items.forEach(item => {
      html += `
        <div class="menu-item" data-id="${item.id}">
          <div class="menu-item-info">
            <label class="availability-toggle">
              <input type="checkbox" ${item.available ? 'checked' : ''}>
              <span class="slider"></span>
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

  const available = state.menuItems.filter(i => i.available).length;
  const total = state.menuItems.length;
  document.getElementById('menu-count').textContent = `${available}/${total} items available`;
  
  container.innerHTML = html;

  // Availability toggles
  document.querySelectorAll('.availability-toggle input').forEach(toggle => {
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

  // Edit buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('.menu-item').dataset.id);
      openEditForm(id);
    });
  });

  // Delete buttons
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

function setupMenuListeners() {
  document.getElementById('add-item-btn').addEventListener('click', () => {
    document.getElementById('add-item-form').classList.add('show');
    document.getElementById('edit-item-form').classList.remove('show');
  });

  document.getElementById('cancel-add').addEventListener('click', () => {
    document.getElementById('add-item-form').classList.remove('show');
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

    document.getElementById('add-item-form').classList.remove('show');
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-price').value = '';
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-item-form').classList.remove('show');
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

    document.getElementById('edit-item-form').classList.remove('show');
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

  document.getElementById('edit-item-form').classList.add('show');
  document.getElementById('add-item-form').classList.remove('show');
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
      <div class="hours-row">
        <span class="hours-day">${h.day}</span>
        <div class="hours-times">
          <input type="time" class="open-time" value="${h.open}" ${h.closed ? 'disabled' : ''}>
          <span style="color: var(--text-dim)">-</span>
          <input type="time" class="close-time" value="${h.close}" ${h.closed ? 'disabled' : ''}>
          <label class="closed-toggle">
            <input type="checkbox" class="closed-checkbox" ${h.closed ? 'checked' : ''}>
            <span>Closed</span>
          </label>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Event listeners
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
// Calls (Read-only for demo)
// ============================================
function initCalls() {
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