import { auth } from '../../core/auth.js';
import { store } from '../../core/store.js';
import { router } from '../../router.js';
import { showNavbar, updateNavbar } from '../../components/navbar/navbar.js';
import { toastSuccess, toastError } from '../../components/toast/toast.js';
import { PAYMENT_METHODS } from '../../core/constants.js';

let quantities = {}; // productId -> qty
let shippingCharged = false;

function getSelectedItems() {
  return Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, qty]) => ({ productId, qty }));
}

function calculateTotal(products) {
  const items = getSelectedItems();
  let total = 0;
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) total += product.price * item.qty;
  });
  return total;
}

function getTotalQty() {
  return Object.values(quantities).reduce((sum, q) => sum + q, 0);
}

function updateSummary(container, products) {
  const items = getSelectedItems();
  const summaryEl = container.querySelector('#order-summary-items');
  const totalEl = container.querySelector('#order-total');
  const qtyEl = container.querySelector('#order-total-qty');
  const submitBtn = container.querySelector('#btn-submit-order');
  
  if (!summaryEl) return;
  
  let summaryHTML = '';
  let total = 0;
  
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      const subtotal = product.price * item.qty;
      total += subtotal;
      summaryHTML += `
        <div class="order-summary-row">
          <span class="order-summary-label">${product.name} x${item.qty}</span>
          <span class="order-summary-value">$${subtotal.toFixed(2)}</span>
        </div>
      `;
    }
  });
  
  const shippingAmount = shippingCharged ? Number(container.querySelector('#shipping-amount')?.value || 0) : 0;
  if (shippingCharged && shippingAmount > 0) {
    total += shippingAmount;
    summaryHTML += `
      <div class="order-summary-row">
        <span class="order-summary-label">Envío</span>
        <span class="order-summary-value">$${shippingAmount.toFixed(2)}</span>
      </div>
    `;
  }
  
  summaryEl.innerHTML = summaryHTML || '<p class="text-muted text-sm">Selecciona productos</p>';
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (qtyEl) qtyEl.textContent = getTotalQty();
  
  // Enable/disable submit
  if (submitBtn) {
    submitBtn.disabled = items.length === 0;
  }
}

function generateWhatsAppMessage(order, products, user) {
  const items = order.items || [];
  let msg = `🧾 *PEDIDO TYANGO*\n\n`;
  msg += `👤 Asesor: ${user.name || 'N/A'}\n`;
  msg += `📋 Cliente: ${order.client || 'N/A'}\n`;
  msg += `📍 Dirección: ${order.address || 'N/A'}\n\n`;
  msg += `*Productos:*\n`;
  
  let subtotal = 0;
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      const lineTotal = product.price * item.qty;
      subtotal += lineTotal;
      msg += `  • ${product.name} x${item.qty} — $${lineTotal.toFixed(2)}\n`;
    }
  });
  
  msg += `\n💰 Subtotal: $${subtotal.toFixed(2)}\n`;
  msg += `💳 Pago: ${order.paymentMethod || 'N/A'}\n`;
  
  if (order.shippingCharged && Number(order.shippingAmount || 0) > 0) {
    msg += `🚚 Envío: $${Number(order.shippingAmount).toFixed(2)}\n`;
    msg += `📊 Total: $${(subtotal + Number(order.shippingAmount)).toFixed(2)}\n`;
  } else {
    msg += `🚚 Envío: No\n`;
    msg += `📊 Total: $${subtotal.toFixed(2)}\n`;
  }
  
  if (order.observations) {
    msg += `\n📝 Observaciones: ${order.observations}\n`;
  }
  
  msg += `\n✅ Pedido registrado`;
  
  return msg;
}

export function renderOrder(container) {
  if (!auth.isLoggedIn()) {
    router.navigate('login');
    return;
  }
  
  const user = auth.getCurrentUser();
  const products = store.getProducts();
  
  // Reset state
  quantities = {};
  products.forEach(p => { quantities[p.id] = 0; });
  shippingCharged = false;
  
  showNavbar();
  updateNavbar();
  
  container.innerHTML = `
    <div class="order-page">
      <!-- Header -->
      <div class="order-header">
        <button class="order-back-btn" id="btn-back">←</button>
        <h1 class="order-title">Crear Pedido</h1>
      </div>
      
      <!-- Client Info -->
      <div class="order-section">
        <span class="order-section-title">Información del cliente</span>
        <div class="input-group">
          <label class="input-label">Cliente</label>
          <input type="text" class="input" id="order-client" placeholder="Nombre del cliente" autocomplete="off">
        </div>
        <div class="input-group">
          <label class="input-label">Dirección</label>
          <input type="text" class="input" id="order-address" placeholder="Dirección de entrega" autocomplete="off">
        </div>
      </div>
      
      <!-- Products -->
      <div class="order-section">
        <span class="order-section-title">Productos</span>
        <div class="order-product-list">
          ${products.map(p => `
            <div class="order-product-item" data-product="${p.id}">
              <div class="order-product-info">
                <span class="order-product-name">${p.name}</span>
                <span class="order-product-price">$${p.price.toFixed(2)}</span>
              </div>
              <div class="order-product-qty">
                <button class="order-qty-btn" data-action="minus" data-pid="${p.id}">−</button>
                <span class="order-qty-value" id="qty-${p.id}">0</span>
                <button class="order-qty-btn" data-action="plus" data-pid="${p.id}">+</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Payment & Shipping -->
      <div class="order-section">
        <span class="order-section-title">Pago y envío</span>
        <div class="input-group">
          <label class="input-label">Método de pago</label>
          <select class="input" id="order-payment">
            ${PAYMENT_METHODS.map(pm => `<option value="${pm.name}">${pm.name}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">¿Cobró envío?</label>
          <div class="order-shipping-toggle">
            <button class="order-shipping-option" data-shipping="no" id="ship-no">No</button>
            <button class="order-shipping-option" data-shipping="yes" id="ship-yes">Sí</button>
          </div>
        </div>
        <div class="order-shipping-amount" id="shipping-amount-group">
          <div class="input-group">
            <label class="input-label">Monto del envío ($)</label>
            <input type="number" class="input" id="shipping-amount" placeholder="0.00" min="0" step="0.50" value="">
          </div>
        </div>
      </div>
      
      <!-- Observations -->
      <div class="order-section">
        <span class="order-section-title">Observaciones</span>
        <textarea class="input" id="order-observations" placeholder="Notas adicionales (opcional)" rows="2"></textarea>
      </div>
      
      <!-- Summary -->
      <div class="order-summary">
        <span class="order-section-title">Resumen del pedido</span>
        <div id="order-summary-items">
          <p class="text-muted text-sm">Selecciona productos</p>
        </div>
        <div class="order-summary-row total">
          <span>Total (<span id="order-total-qty">0</span> uds)</span>
          <span id="order-total">$0.00</span>
        </div>
      </div>
      
      <!-- Submit -->
      <div class="order-submit">
        <button class="order-submit-btn" id="btn-submit-order" disabled>
          📤 Enviar Pedido
        </button>
      </div>
    </div>
  `;
  
  // --- Event Handlers ---
  
  // Back button
  container.querySelector('#btn-back')?.addEventListener('click', () => {
    router.navigate('home');
  });
  
  // Quantity buttons
  container.querySelectorAll('.order-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.pid;
      const action = btn.dataset.action;
      
      if (action === 'plus') {
        quantities[pid] = (quantities[pid] || 0) + 1;
      } else if (action === 'minus' && quantities[pid] > 0) {
        quantities[pid]--;
      }
      
      // Update display
      const qtyEl = container.querySelector(`#qty-${pid}`);
      if (qtyEl) qtyEl.textContent = quantities[pid];
      
      // Toggle selected class
      const itemEl = btn.closest('.order-product-item');
      if (itemEl) itemEl.classList.toggle('selected', quantities[pid] > 0);
      
      updateSummary(container, products);
    });
  });
  
  // Shipping toggle
  const shipNo = container.querySelector('#ship-no');
  const shipYes = container.querySelector('#ship-yes');
  const shipAmountGroup = container.querySelector('#shipping-amount-group');
  
  // Set default state
  shipNo?.classList.add('active');
  
  shipNo?.addEventListener('click', () => {
    shippingCharged = false;
    shipNo.classList.add('active');
    shipYes?.classList.remove('active');
    shipAmountGroup?.classList.remove('visible');
    updateSummary(container, products);
  });
  
  shipYes?.addEventListener('click', () => {
    shippingCharged = true;
    shipYes.classList.add('active');
    shipNo?.classList.remove('active');
    shipAmountGroup?.classList.add('visible');
    updateSummary(container, products);
  });
  
  // Shipping amount change
  container.querySelector('#shipping-amount')?.addEventListener('input', () => {
    updateSummary(container, products);
  });
  
  // Submit
  container.querySelector('#btn-submit-order')?.addEventListener('click', () => {
    const client = container.querySelector('#order-client')?.value?.trim();
    const address = container.querySelector('#order-address')?.value?.trim();
    const paymentMethod = container.querySelector('#order-payment')?.value;
    const observations = container.querySelector('#order-observations')?.value?.trim() || '';
    const shippingAmount = shippingCharged ? Number(container.querySelector('#shipping-amount')?.value || 0) : 0;
    const items = getSelectedItems();
    
    // Validation
    if (!client) { toastError('Ingresa el nombre del cliente'); return; }
    if (!address) { toastError('Ingresa la dirección'); return; }
    if (items.length === 0) { toastError('Selecciona al menos un producto'); return; }
    if (shippingCharged && shippingAmount <= 0) { toastError('Ingresa el monto del envío'); return; }
    
    try {
      const orderData = {
        userId: user.id,
        client,
        address,
        items,
        paymentMethod,
        shippingCharged,
        shippingAmount,
        observations
      };
      
      const order = store.processOrder(orderData);
      
      toastSuccess('Pedido registrado exitosamente');
      
      // Generate WhatsApp message
      const msg = generateWhatsAppMessage(orderData, products, user);
      const encoded = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/?text=${encoded}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Navigate back to home
      setTimeout(() => {
        router.navigate('home');
      }, 500);
      
    } catch (err) {
      toastError('Error al procesar el pedido');
      console.error(err);
    }
  });
}
