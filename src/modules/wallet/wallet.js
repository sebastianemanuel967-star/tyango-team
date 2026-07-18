import { auth } from '../../core/auth.js';
import { store } from '../../core/store.js';
import { router } from '../../router.js';
import { showNavbar, updateNavbar } from '../../components/navbar/navbar.js';

const ENTRY_ICONS = {
  commission: { icon: '💰', class: 'commission', label: 'Comisión' },
  mentor_commission: { icon: '👥', class: 'commission', label: 'Regalía' },
  shipping: { icon: '🚚', class: 'shipping', label: 'Envío' },
  credit: { icon: '💵', class: 'credit', label: 'Acreditación' },
  bonus: { icon: '🎁', class: 'bonus', label: 'Bono' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmt(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export function renderWallet(container) {
  if (!auth.isLoggedIn()) {
    router.navigate('login');
    return;
  }
  
  const user = auth.getCurrentUser();
  const wallet = store.getWallet(user.id);
  const entries = wallet.entries || [];
  
  // Calculate category totals
  const commissions = entries
    .filter(e => e.type === 'commission' || e.type === 'mentor_commission')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  
  const shippingEarnings = entries
    .filter(e => e.type === 'shipping')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  
  const bonuses = entries
    .filter(e => e.type === 'bonus' || e.type === 'credit')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  
  showNavbar();
  updateNavbar();
  
  container.innerHTML = `
    <div class="wallet-page">
      <div class="wallet-header">
        <h1 class="wallet-title">Cartera</h1>
      </div>
      
      <!-- Balance Card -->
      <div class="wallet-balance-card">
        <span class="wallet-balance-label">Saldo disponible</span>
        <div class="wallet-balance-value">${fmt(wallet.balance)}</div>
      </div>
      
      <!-- Stats -->
      <div class="wallet-stats">
        <div class="wallet-stat">
          <span class="wallet-stat-value">${fmt(commissions)}</span>
          <span class="wallet-stat-label">Comisiones</span>
        </div>
        <div class="wallet-stat">
          <span class="wallet-stat-value">${fmt(shippingEarnings)}</span>
          <span class="wallet-stat-label">Envíos</span>
        </div>
        <div class="wallet-stat">
          <span class="wallet-stat-value">${fmt(bonuses)}</span>
          <span class="wallet-stat-label">Bonos</span>
        </div>
      </div>
      
      <!-- History -->
      <div class="wallet-history">
        <span class="wallet-history-title">Historial</span>
        <div class="wallet-history-list">
          ${entries.length > 0 ? entries.map(entry => {
            const info = ENTRY_ICONS[entry.type] || ENTRY_ICONS.commission;
            const isPositive = (entry.amount || 0) >= 0;
            return `
              <div class="wallet-entry">
                <div class="wallet-entry-row">
                  <div class="wallet-entry-icon ${info.class}">${info.icon}</div>
                  <div class="wallet-entry-left">
                    <span class="wallet-entry-type">${info.label}</span>
                    <span class="wallet-entry-desc">${entry.description || ''}</span>
                    <span class="wallet-entry-date">${formatDate(entry.date)}</span>
                  </div>
                </div>
                <span class="wallet-entry-amount ${isPositive ? 'positive' : 'negative'}">
                  ${isPositive ? '+' : ''}${fmt(entry.amount)}
                </span>
              </div>
            `;
          }).join('') : `
            <div class="empty-state">
              <div class="empty-state-icon">💳</div>
              <p class="empty-state-text">Aún no tienes movimientos</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
