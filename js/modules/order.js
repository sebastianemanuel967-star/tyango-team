// ============================================
// Order Page - Registro de pedidos
// ============================================

import AuthService from '../services/auth.js';
import DataStore from '../services/datastore.js';
import { CommissionEngine } from '../services/commission.js';
import { showSuccess, showError } from '../components/toast.js';

let orderProducts = [];
let shippingCharged = false;
let shippingAmount = 15000;

export function renderOrder() {
    const products = DataStore.get('products') || [];
    const config = DataStore.get('config') || { shippingDefault: 15000 };
    shippingAmount = config.shippingDefault;

    return `
        <div class="page">
            <div class="container">
                <div class="page-header">
                    <p class="page-subtitle">Nuevo pedido</p>
                    <h1 class="page-title">Crear Pedido</h1>
                </div>

                <div class="card" style="margin-bottom:var(--space-lg);">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="font-weight:600;margin-bottom:2px;">Cobrar envio al cliente?</div>
                            <div style="font-size:0.8125rem;color:var(--text-muted);">
                                ${shippingCharged ? 'Ganas solo el envio, 0% comision' : 'Ganas comision normal + mentor recibe regalia'}
                            </div>
                        </div>
                        <div class="toggle-switch ${shippingCharged ? 'active' : ''}" id="toggle-shipping"></div>
                    </div>
                    ${shippingCharged ? `
                        <div style="margin-top:var(--space-md);">
                            <label class="input-label">Valor del envio</label>
                            <input type="number" class="input-field" id="shipping-amount" value="${shippingAmount}" min="0" step="1000">
                        </div>
                    ` : ''}
                </div>

                <div style="margin-bottom:var(--space-lg);">
                    <h3 style="font-size:1rem;font-weight:600;margin-bottom:var(--space-md);">Productos</h3>
                    <div id="products-list">
                        ${products.filter(p => p.active).map(p => `
                            <div class="card" style="margin-bottom:var(--space-sm);padding:var(--space-md);" data-product-id="${p.id}">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-sm);">
                                    <div>
                                        <div style="font-weight:600;">${p.name}</div>
                                        <div style="font-size:0.8125rem;color:var(--text-muted);">${p.description}</div>
                                    </div>
                                    <div style="text-align:right;">
                                        <div style="font-weight:700;">$${p.price.toLocaleString('es-CO')}</div>
                                        <div style="font-size:0.6875rem;color:var(--accent-secondary);">${p.commissionRate}% com.</div>
                                    </div>
                                </div>
                                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                                    <button class="btn btn-ghost qty-btn" data-action="minus" data-product="${p.id}" style="padding:8px 12px;">-</button>
                                    <span class="qty-display" data-product="${p.id}" style="font-weight:700;min-width:30px;text-align:center;">0</span>
                                    <button class="btn btn-ghost qty-btn" data-action="plus" data-product="${p.id}" style="padding:8px 12px;">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card" style="margin-bottom:var(--space-xl);">
                    <h3 style="font-size:1rem;font-weight:600;margin-bottom:var(--space-md);">Resumen</h3>
                    <div id="order-summary">
                        <div class="empty-state" style="padding:var(--space-lg) 0;">
                            <div class="empty-state-text">Selecciona productos para ver el resumen</div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary btn-full btn-lg" id="btn-submit-order" disabled>
                    Generar Pedido
                </button>
            </div>
        </div>
    `;
}

export function initOrder() {
    const products = DataStore.get('products') || [];
    const toggle = document.getElementById('toggle-shipping');

    if (toggle) {
        toggle.addEventListener('click', () => {
            shippingCharged = !shippingCharged;
            toggle.classList.toggle('active');
            updateSummary(products);
        });
    }

    const shippingInput = document.getElementById('shipping-amount');
    if (shippingInput) {
        shippingInput.addEventListener('input', (e) => {
            shippingAmount = parseInt(e.target.value) || 0;
            updateSummary(products);
        });
    }

    document.getElementById('products-list').addEventListener('click', (e) => {
        const btn = e.target.closest('.qty-btn');
        if (!btn) return;

        const productId = btn.dataset.product;
        const action = btn.dataset.action;
        const display = document.querySelector(`.qty-display[data-product="${productId}"]`);

        let current = parseInt(display.textContent) || 0;
        if (action === 'plus') current++;
        else if (action === 'minus' && current > 0) current--;

        display.textContent = current;

        const existing = orderProducts.find(p => p.productId === productId);
        if (existing) {
            existing.quantity = current;
            if (current === 0) {
                orderProducts = orderProducts.filter(p => p.productId !== productId);
            }
        } else if (current > 0) {
            const product = products.find(p => p.id === productId);
            orderProducts.push({
                productId: product.id,
                productName: product.name,
                quantity: current,
                unitPrice: product.price,
                commissionRate: product.commissionRate,
                mentorCommissionRate: product.mentorCommissionRate
            });
        }

        updateSummary(products);
    });

    document.getElementById('btn-submit-order').addEventListener('click', submitOrder);
}

function updateSummary(products) {
    const summaryEl = document.getElementById('order-summary');
    const submitBtn = document.getElementById('btn-submit-order');

    if (orderProducts.length === 0) {
        summaryEl.innerHTML = `
            <div class="empty-state" style="padding:var(--space-lg) 0;">
                <div class="empty-state-text">Selecciona productos para ver el resumen</div>
            </div>
        `;
        submitBtn.disabled = true;
        return;
    }

    const user = AuthService.getUserData();
    const result = CommissionEngine.processOrder({
        shippingCharged,
        products: orderProducts,
        shippingAmount,
        advisorId: user.id
    });

    const totalProducts = orderProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = orderProducts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);

    submitBtn.disabled = false;

    summaryEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
            <div style="display:flex;justify-content:space-between;padding:8px 0;">
                <span style="color:var(--text-secondary);">Productos</span>
                <span style="font-weight:600;">${totalProducts} unidades</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;">
                <span style="color:var(--text-secondary);">Valor total</span>
                <span style="font-weight:600;">$${totalValue.toLocaleString('es-CO')}</span>
            </div>
            ${shippingCharged ? `
                <div style="display:flex;justify-content:space-between;padding:8px 0;">
                    <span style="color:var(--text-secondary);">Envio cobrado</span>
                    <span style="font-weight:600;color:var(--success);">$${shippingAmount.toLocaleString('es-CO')}</span>
                </div>
                <div style="padding:8px 0;color:var(--warning);font-size:0.8125rem;">
                    Aplicando Regla del Envio: ganas solo el envio, tu mentor recibe las comisiones
                </div>
            ` : ''}
            <div class="divider" style="margin:var(--space-sm) 0;"></div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;">
                <span style="color:var(--text-secondary);font-weight:600;">Tu ganancia</span>
                <span style="font-weight:700;color:var(--accent-primary);font-size:1.125rem;">
                    $${Math.round(result.advisorTotal).toLocaleString('es-CO')}
                </span>
            </div>
            ${result.mentorTotal > 0 ? `
                <div style="display:flex;justify-content:space-between;padding:8px 0;">
                    <span style="color:var(--text-muted);font-size:0.8125rem;">Para tu mentor</span>
                    <span style="color:var(--text-muted);font-size:0.8125rem;">$${Math.round(result.mentorTotal).toLocaleString('es-CO')}</span>
                </div>
            ` : ''}
        </div>
    `;
}

function submitOrder() {
    const user = AuthService.getUserData();
    const products = DataStore.get('products') || [];

    const result = CommissionEngine.processOrder({
        shippingCharged,
        products: orderProducts,
        shippingAmount,
        advisorId: user.id
    });

    const orderId = `ord_${Date.now()}`;
    const orders = DataStore.get('orders') || [];
    const order = {
        id: orderId,
        advisorId: user.id,
        advisorName: user.name,
        products: orderProducts.map(p => ({
            productId: p.productId,
            productName: p.productName,
            quantity: p.quantity,
            unitPrice: p.unitPrice
        })),
        shippingCharged,
        shippingAmount: shippingCharged ? shippingAmount : 0,
        totalValue: orderProducts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0),
        advisorEarnings: result.advisorTotal,
        mentorEarnings: result.mentorTotal,
        createdAt: new Date().toISOString()
    };
    orders.push(order);
    DataStore.set('orders', orders);

    CommissionEngine.recordTransactions(result.transactions, orderId);

    const totalUnits = orderProducts.reduce((sum, p) => sum + p.quantity, 0);
    const statsUpdate = CommissionEngine.updateAdvisorStats(user.id, totalUnits);

    if (statsUpdate && statsUpdate.rankChanged) {
        AuthService.updateSession({ rank: statsUpdate.rank });
        showSuccess(`Ascendiste a ${CommissionEngine.RANKS[statsUpdate.rank].name}!`);
    }

    const waMessage = generateWhatsAppMessage(order);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

    showSuccess('Pedido registrado correctamente');

    orderProducts = [];
    shippingCharged = false;

    setTimeout(() => {
        window.open(waUrl, '_blank');
        window.location.hash = '#/home';
    }, 800);
}

function generateWhatsAppMessage(order) {
    const lines = [
        `🥭 *TYANGO - Nuevo Pedido*`,
        ``,
        `👤 Asesor: ${order.advisorName}`,
        `📦 Productos:`
    ];

    order.products.forEach(p => {
        lines.push(`   • ${p.productName} x${p.quantity} - $${(p.unitPrice * p.quantity).toLocaleString('es-CO')}`);
    });

    lines.push(``);
    lines.push(`💰 Total: $${order.totalValue.toLocaleString('es-CO')}`);

    if (order.shippingCharged) {
        lines.push(`🚚 Envio: $${order.shippingAmount.toLocaleString('es-CO')} (cobrado)`);
    }

    lines.push(``);
    lines.push(`📅 ${new Date(order.createdAt).toLocaleDateString('es-CO')}`);

    return lines.join('\n');
}

export default { renderOrder, initOrder };
