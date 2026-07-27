// ============================================
// Admin Page - Panel de administracion
// ============================================

import AuthService from '../services/auth.js';
import DataStore from '../services/datastore.js';
import { CommissionEngine, RANKS } from '../services/commission.js';
import { showSuccess, showError } from '../components/toast.js';

export function renderAdmin() {
    if (!AuthService.isAdmin()) {
        return `<div class="page"><div class="container"><div class="empty-state"><div class="empty-state-icon">🚫</div><div class="empty-state-title">Acceso denegado</div></div></div></div>`;
    }

    const users = DataStore.get('users') || [];
    const products = DataStore.get('products') || [];
    const orders = DataStore.get('orders') || [];
    const config = DataStore.get('config') || {};

    const totalSales = orders.reduce((sum, o) => sum + o.totalValue, 0);
    const totalProducts = orders.reduce((sum, o) => sum + o.products.reduce((ps, p) => ps + p.quantity, 0), 0);

    return `
        <div class="page">
            <div class="container">
                <div class="page-header">
                    <p class="page-subtitle">Panel de control</p>
                    <h1 class="page-title">Administracion</h1>
                </div>

                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-sm);margin-bottom:var(--space-lg);">
                    <div class="card" style="text-align:center;">
                        <div style="font-size:0.6875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Ventas Totales</div>
                        <div style="font-size:1.25rem;font-weight:700;color:var(--accent-primary);margin-top:4px;">$${totalSales.toLocaleString('es-CO')}</div>
                    </div>
                    <div class="card" style="text-align:center;">
                        <div style="font-size:0.6875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Productos Vendidos</div>
                        <div style="font-size:1.25rem;font-weight:700;margin-top:4px;">${totalProducts}</div>
                    </div>
                    <div class="card" style="text-align:center;">
                        <div style="font-size:0.6875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Asesores</div>
                        <div style="font-size:1.25rem;font-weight:700;margin-top:4px;">${users.filter(u => u.role === 'asesor').length}</div>
                    </div>
                    <div class="card" style="text-align:center;">
                        <div style="font-size:0.6875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Pedidos</div>
                        <div style="font-size:1.25rem;font-weight:700;margin-top:4px;">${orders.length}</div>
                    </div>
                </div>

                <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-lg);overflow-x:auto;padding-bottom:4px;">
                    <button class="btn btn-secondary admin-tab active" data-tab="users">Usuarios</button>
                    <button class="btn btn-secondary admin-tab" data-tab="products">Productos</button>
                    <button class="btn btn-secondary admin-tab" data-tab="orders">Pedidos</button>
                    <button class="btn btn-secondary admin-tab" data-tab="config">Config</button>
                </div>

                <div id="tab-users" class="admin-tab-content">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr><th>Nombre</th><th>Rol</th><th>Rango</th><th>PIN</th><th>Productos</th></tr>
                            </thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td style="font-weight:600;">${u.name}</td>
                                        <td><span class="badge ${u.role === 'admin' ? 'badge-founder' : 'badge-bronze'}">${u.role}</span></td>
                                        <td><span class="badge ${RANKS[u.rank]?.badge || 'badge-bronze'}">${RANKS[u.rank]?.name || u.rank}</span></td>
                                        <td style="font-family:monospace;">${u.pin}</td>
                                        <td>${u.totalProducts}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="tab-products" class="admin-tab-content hidden">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr><th>Producto</th><th>Precio</th><th>Com. Asesor</th><th>Com. Mentor</th></tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr>
                                        <td style="font-weight:600;">${p.name}</td>
                                        <td>$${p.price.toLocaleString('es-CO')}</td>
                                        <td>${p.commissionRate}%</td>
                                        <td>${p.mentorCommissionRate}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="tab-orders" class="admin-tab-content hidden">
                    ${orders.length === 0 ? '<div class="empty-state">Sin pedidos registrados</div>' : `
                        <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
                            ${[...orders].reverse().map(o => `
                                <div class="card" style="padding:var(--space-md);">
                                    <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-sm);">
                                        <span style="font-weight:600;">${o.advisorName}</span>
                                        <span style="font-size:0.75rem;color:var(--text-muted);">${new Date(o.createdAt).toLocaleDateString('es-CO')}</span>
                                    </div>
                                    <div style="font-size:0.8125rem;color:var(--text-secondary);margin-bottom:var(--space-sm);">
                                        ${o.products.map(p => `${p.productName} x${p.quantity}`).join(', ')}
                                    </div>
                                    <div style="display:flex;justify-content:space-between;font-size:0.875rem;">
                                        <span>Total: <strong>$${o.totalValue.toLocaleString('es-CO')}</strong></span>
                                        <span style="color:var(--success);">Asesor: $${Math.round(o.advisorEarnings).toLocaleString('es-CO')}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <div id="tab-config" class="admin-tab-content hidden">
                    <div class="card">
                        <div class="input-group">
                            <label class="input-label">Meta Mensual Global</label>
                            <input type="number" class="input-field" id="config-goal" value="${config.monthlyGoal || 500}">
                        </div>
                        <div class="input-group">
                            <label class="input-label">Envio por defecto</label>
                            <input type="number" class="input-field" id="config-shipping" value="${config.shippingDefault || 15000}">
                        </div>
                        <button class="btn btn-primary btn-full" id="btn-save-config">Guardar Configuracion</button>
                    </div>

                    <div class="card" style="margin-top:var(--space-lg);">
                        <h3 style="font-size:1rem;font-weight:600;margin-bottom:var(--space-md);">Zona Peligrosa</h3>
                        <button class="btn btn-danger btn-full" id="btn-reset-data" style="margin-bottom:var(--space-sm);">
                            Reiniciar Datos (Demo)
                        </button>
                        <div style="font-size:0.75rem;color:var(--text-muted);">
                            Esto eliminara todos los pedidos, transacciones y wallets. Los usuarios y productos se mantienen.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initAdmin() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
        });
    });

    const saveBtn = document.getElementById('btn-save-config');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const config = DataStore.get('config') || {};
            config.monthlyGoal = parseInt(document.getElementById('config-goal').value) || 500;
            config.shippingDefault = parseInt(document.getElementById('config-shipping').value) || 15000;
            DataStore.set('config', config);
            showSuccess('Configuracion guardada');
        });
    }

    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Estas seguro? Se eliminaran todos los pedidos y transacciones.')) {
                DataStore.set('orders', []);
                DataStore.set('wallets', {});
                DataStore.set('transactions', []);

                const users = DataStore.get('users') || [];
                users.forEach(u => {
                    u.totalProducts = u.id === 'u1' ? 850 : u.id === 'u2' ? 78 : u.id === 'u3' ? 23 : u.id === 'u4' ? 15 : 31;
                    u.monthProducts = 0;
                    u.rank = CommissionEngine.calculateRank(u.totalProducts);
                });
                DataStore.set('users', users);

                showSuccess('Datos reiniciados');
                window.location.reload();
            }
        });
    }
}

export default { renderAdmin, initAdmin };
