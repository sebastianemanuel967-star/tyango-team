import { auth } from '../../core/auth.js';
import { store } from '../../core/store.js';
import { router } from '../../router.js';
import { showNavbar, updateNavbar } from '../../components/navbar/navbar.js';
import { toastSuccess, toastError } from '../../components/toast/toast.js';
import { getRankById, RANKS, ROLES } from '../../core/constants.js';

let activeTab = 'dashboard';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Usuarios', icon: '👥' },
  { id: 'products', label: 'Productos', icon: '📦' },
  { id: 'orders', label: 'Pedidos', icon: '📋' },
  { id: 'wallets', label: 'Wallets', icon: '💰' },
  { id: 'config', label: 'Config', icon: '⚙️' },
];

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showModal(title, contentHTML, onSave) {
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.innerHTML = `
    <div class="admin-modal">
      <div class="admin-modal-header">
        <span class="admin-modal-title">${title}</span>
        <button class="admin-modal-close" id="modal-close">✕</button>
      </div>
      ${contentHTML}
      ${onSave ? '<button class="btn btn-full mt-lg" id="modal-save">Guardar</button>' : ''}
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Close handlers
  overlay.querySelector('#modal-close')?.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  
  if (onSave) {
    overlay.querySelector('#modal-save')?.addEventListener('click', () => {
      onSave(overlay);
      overlay.remove();
    });
  }
  
  return overlay;
}

// --- Tab Renderers ---

function renderDashboard() {
  const users = store.getUsers();
  const orders = store.getOrders();
  const ordersThisMonth = store.getOrdersThisMonth();
  const settings = store.getSettings();
  
  const totalProducts = users.reduce((sum, u) => sum + (u.totalProducts || 0), 0);
  const monthProducts = users.reduce((sum, u) => sum + (u.monthProducts || 0), 0);
  
  let totalEarnings = 0;
  users.forEach(u => {
    const w = store.getWallet(u.id);
    totalEarnings += w.entries.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  });
  
  return `
    <div class="admin-overview">
      <div class="admin-overview-card">
        <span class="admin-overview-value">${users.length}</span>
        <span class="admin-overview-label">Usuarios</span>
      </div>
      <div class="admin-overview-card">
        <span class="admin-overview-value">${orders.length}</span>
        <span class="admin-overview-label">Pedidos</span>
      </div>
      <div class="admin-overview-card">
        <span class="admin-overview-value">${totalProducts}</span>
        <span class="admin-overview-label">Productos Total</span>
      </div>
      <div class="admin-overview-card">
        <span class="admin-overview-value">${monthProducts}</span>
        <span class="admin-overview-label">Productos Mes</span>
      </div>
      <div class="admin-overview-card">
        <span class="admin-overview-value">${ordersThisMonth.length}</span>
        <span class="admin-overview-label">Pedidos Mes</span>
      </div>
      <div class="admin-overview-card">
        <span class="admin-overview-value">${fmt(totalEarnings)}</span>
        <span class="admin-overview-label">Ganancias Total</span>
      </div>
    </div>
  `;
}

function renderUsers(container) {
  const users = store.getUsers();
  
  let html = '<div class="admin-list">';
  users.forEach(u => {
    const rank = getRankById(u.rank);
    html += `
      <div class="admin-list-item">
        <div class="admin-list-item-left">
          <span class="admin-list-item-name">${u.name || ''}</span>
          <span class="admin-list-item-sub">${rank.name} · ${u.role === 'admin' ? 'Admin' : 'Asesor'} · PIN: ${u.pin || '????'}</span>
        </div>
        <div class="admin-list-item-right">
          <button class="btn btn-sm btn-secondary edit-user-btn" data-uid="${u.id}">Editar</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  // Bind edit buttons after render
  setTimeout(() => {
    container.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = store.getUserById(btn.dataset.uid);
        if (!user) return;
        
        const rankOptions = Object.values(RANKS).map(r => 
          `<option value="${r.id}" ${user.rank === r.id ? 'selected' : ''}>${r.name}</option>`
        ).join('');
        
        showModal(`Editar: ${user.name}`, `
          <div class="input-group">
            <label class="input-label">Nombre</label>
            <input class="input" id="edit-name" value="${user.name || ''}">
          </div>
          <div class="input-group">
            <label class="input-label">PIN</label>
            <input class="input" id="edit-pin" value="${user.pin || ''}" maxlength="4">
          </div>
          <div class="input-group">
            <label class="input-label">Rol</label>
            <select class="input" id="edit-role">
              <option value="asesor" ${user.role === 'asesor' ? 'selected' : ''}>Asesor</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Rango</label>
            <select class="input" id="edit-rank">${rankOptions}</select>
          </div>
        `, (overlay) => {
          const name = overlay.querySelector('#edit-name')?.value?.trim();
          const pin = overlay.querySelector('#edit-pin')?.value?.trim();
          const role = overlay.querySelector('#edit-role')?.value;
          const rank = overlay.querySelector('#edit-rank')?.value;
          
          if (!name || !pin) { toastError('Nombre y PIN son requeridos'); return; }
          
          store.updateUser(user.id, { name, pin, role, rank });
          toastSuccess(`${name} actualizado`);
          renderAdminContent(container);
        });
      });
    });
  }, 0);
  
  return html;
}

function renderProducts(container) {
  const products = store.getProducts();
  
  let html = '<div class="admin-list">';
  products.forEach(p => {
    html += `
      <div class="admin-list-item">
        <div class="admin-list-item-left">
          <span class="admin-list-item-name">${p.name || ''}</span>
          <span class="admin-list-item-sub">${fmt(p.price)} · Asesor: ${fmt(p.commissions?.asesor || 0)} · Mentor: ${fmt(p.commissions?.mentor || 0)}</span>
        </div>
        <div class="admin-list-item-right">
          <button class="btn btn-sm btn-secondary edit-product-btn" data-pid="${p.id}">Editar</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  setTimeout(() => {
    container.querySelectorAll('.edit-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = store.getProductById(btn.dataset.pid);
        if (!product) return;
        
        showModal(`Editar: ${product.name}`, `
          <div class="input-group">
            <label class="input-label">Nombre</label>
            <input class="input" id="edit-pname" value="${product.name || ''}">
          </div>
          <div class="input-group">
            <label class="input-label">Precio ($)</label>
            <input class="input" type="number" id="edit-pprice" value="${product.price || 0}" step="0.50" min="0">
          </div>
          <div class="input-group">
            <label class="input-label">Comisión Asesor ($)</label>
            <input class="input" type="number" id="edit-pcomm-asesor" value="${product.commissions?.asesor || 0}" step="0.05" min="0">
          </div>
          <div class="input-group">
            <label class="input-label">Comisión Mentor ($)</label>
            <input class="input" type="number" id="edit-pcomm-mentor" value="${product.commissions?.mentor || 0}" step="0.05" min="0">
          </div>
        `, (overlay) => {
          const name = overlay.querySelector('#edit-pname')?.value?.trim();
          const price = Number(overlay.querySelector('#edit-pprice')?.value || 0);
          const asesor = Number(overlay.querySelector('#edit-pcomm-asesor')?.value || 0);
          const mentor = Number(overlay.querySelector('#edit-pcomm-mentor')?.value || 0);
          
          if (!name) { toastError('Nombre es requerido'); return; }
          
          store.updateProduct(product.id, { name, price, commissions: { asesor, mentor } });
          toastSuccess(`${name} actualizado`);
          renderAdminContent(container);
        });
      });
    });
  }, 0);
  
  return html;
}

function renderOrders() {
  const orders = store.getOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (orders.length === 0) {
    return `<div class="empty-state"><div class="empty-state-icon">📋</div><p class="empty-state-text">No hay pedidos</p></div>`;
  }
  
  let html = '<div class="admin-list">';
  orders.forEach(o => {
    const user = store.getUserById(o.userId);
    const items = (o.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
    html += `
      <div class="admin-order-item">
        <div class="admin-order-header">
          <span class="admin-order-client">${o.client || 'Sin nombre'}</span>
          <span class="admin-order-total">${fmt(o.total)}</span>
        </div>
        <div class="admin-order-meta">
          <span>📍 ${o.address || 'N/A'}</span>
          <span>👤 ${user?.name || 'N/A'}</span>
        </div>
        <div class="admin-order-meta">
          <span>📦 ${items} productos</span>
          <span>💳 ${o.paymentMethod || 'N/A'}</span>
          <span>🚚 ${o.shippingCharged ? 'Sí' : 'No'}</span>
        </div>
        <div class="admin-order-meta">
          <span>📅 ${formatDate(o.createdAt)}</span>
        </div>
      </div>
    `;
  });
  html += '</div>';
  return html;
}

function renderWallets(container) {
  const users = store.getUsers();
  
  let html = '<div class="admin-list">';
  users.forEach(u => {
    const wallet = store.getWallet(u.id);
    html += `
      <div class="admin-wallet-item" data-uid="${u.id}">
        <div class="admin-list-item-left">
          <span class="admin-list-item-name">${u.name || ''}</span>
          <span class="admin-list-item-sub">${wallet.entries.length} movimientos</span>
        </div>
        <div class="admin-list-item-right">
          <span class="admin-wallet-balance">${fmt(wallet.balance)}</span>
          <button class="btn btn-sm btn-success credit-btn" data-uid="${u.id}">+$</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  setTimeout(() => {
    container.querySelectorAll('.credit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const user = store.getUserById(btn.dataset.uid);
        if (!user) return;
        
        showModal(`Acreditar a ${user.name}`, `
          <div class="input-group">
            <label class="input-label">Monto ($)</label>
            <input class="input" type="number" id="credit-amount" placeholder="0.00" step="0.50" min="0">
          </div>
          <div class="input-group">
            <label class="input-label">Descripción</label>
            <input class="input" id="credit-desc" placeholder="Ej: Bono liderazgo">
          </div>
        `, (overlay) => {
          const amount = Number(overlay.querySelector('#credit-amount')?.value || 0);
          const desc = overlay.querySelector('#credit-desc')?.value?.trim() || 'Acreditación admin';
          
          if (amount <= 0) { toastError('El monto debe ser mayor a 0'); return; }
          
          store.creditMoney(user.id, amount, desc);
          toastSuccess(`${fmt(amount)} acreditado a ${user.name}`);
          renderAdminContent(container);
        });
      });
    });
  }, 0);
  
  return html;
}

function renderConfig(container) {
  const settings = store.getSettings();
  
  return `
    <div class="card" style="display:flex; flex-direction:column; gap:16px;">
      <span class="admin-section-title">Configuración General</span>
      <div class="input-group">
        <label class="input-label">Meta mensual (productos)</label>
        <input class="input" type="number" id="config-goal" value="${settings.monthlyGoal || 100}" min="1">
      </div>
      <div class="input-group">
        <label class="input-label">Bono liderazgo ($)</label>
        <input class="input" type="number" id="config-bonus" value="${settings.leadershipBonus || 50}" step="1" min="0">
      </div>
      <button class="btn btn-full" id="config-save">Guardar Configuración</button>
    </div>
  `;
}

function renderAdminContent(container) {
  const panelEl = container.querySelector('#admin-panel-content');
  if (!panelEl) return;
  
  switch (activeTab) {
    case 'dashboard': panelEl.innerHTML = renderDashboard(); break;
    case 'users': panelEl.innerHTML = renderUsers(container); break;
    case 'products': panelEl.innerHTML = renderProducts(container); break;
    case 'orders': panelEl.innerHTML = renderOrders(); break;
    case 'wallets': panelEl.innerHTML = renderWallets(container); break;
    case 'config': 
      panelEl.innerHTML = renderConfig(container);
      // Bind config save
      setTimeout(() => {
        container.querySelector('#config-save')?.addEventListener('click', () => {
          const goal = Number(container.querySelector('#config-goal')?.value || 100);
          const bonus = Number(container.querySelector('#config-bonus')?.value || 50);
          store.updateSettings({ monthlyGoal: goal, leadershipBonus: bonus });
          toastSuccess('Configuración guardada');
        });
      }, 0);
      break;
  }
}

export function renderAdmin(container) {
  if (!auth.isLoggedIn() || !auth.isAdmin()) {
    router.navigate('home');
    return;
  }
  
  showNavbar();
  updateNavbar();
  
  container.innerHTML = `
    <div class="admin-page">
      <div class="admin-header">
        <h1 class="admin-title">Panel Admin</h1>
        <p class="admin-subtitle">Gestión completa del sistema</p>
      </div>
      
      <div class="admin-tabs">
        ${TABS.map(tab => `
          <button class="admin-tab ${activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
            ${tab.icon} ${tab.label}
          </button>
        `).join('')}
      </div>
      
      <div class="admin-panel" id="admin-panel-content"></div>
    </div>
  `;
  
  // Tab switching
  container.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      container.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderAdminContent(container);
    });
  });
  
  // Render initial tab
  renderAdminContent(container);
}
