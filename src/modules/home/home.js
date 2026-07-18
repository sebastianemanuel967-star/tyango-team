import { auth } from '../../core/auth.js';
import { store } from '../../core/store.js';
import { router } from '../../router.js';
import { renderCard } from '../../components/card/tyango-card.js';
import { showNavbar, updateNavbar } from '../../components/navbar/navbar.js';
import { getRankById } from '../../core/constants.js';

export function renderHome(container) {
  // Auth guard
  if (!auth.isLoggedIn()) {
    router.navigate('login');
    return;
  }
  
  const user = auth.getCurrentUser();
  const stats = store.getUserStats(user.id);
  
  showNavbar();
  updateNavbar();
  
  // Calculate goal progress
  const goalPercent = Math.min(100, Math.round((stats.monthProducts / stats.monthlyGoal) * 100));
  
  // Format currency
  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
  
  container.innerHTML = `
    <div class="home-page">
      <!-- Header -->
      <div class="home-header">
        <div class="home-greeting">
          <span class="home-greeting-name">Hola, ${user.name}</span>
          <span class="home-greeting-sub">${stats.rank.name}</span>
        </div>
        <button class="home-logout-btn" id="btn-logout" title="Cerrar sesión">⏻</button>
      </div>
      
      <!-- Card -->
      <div class="home-card-section">
        ${renderCard(user)}
      </div>
      
      <!-- Stats -->
      <div class="home-stats">
        <div class="home-stat">
          <div class="home-stat-icon purple">📦</div>
          <span class="home-stat-value">${stats.monthProducts}</span>
          <span class="home-stat-label">Vendidos este mes</span>
        </div>
        <div class="home-stat">
          <div class="home-stat-icon green">💰</div>
          <span class="home-stat-value">${fmt(stats.monthEarnings)}</span>
          <span class="home-stat-label">Ganancias del mes</span>
        </div>
        <div class="home-stat">
          <div class="home-stat-icon cyan">📊</div>
          <span class="home-stat-value">${stats.totalProducts}</span>
          <span class="home-stat-label">Total histórico</span>
        </div>
        <div class="home-stat">
          <div class="home-stat-icon yellow">💳</div>
          <span class="home-stat-value">${fmt(stats.walletBalance)}</span>
          <span class="home-stat-label">Saldo disponible</span>
        </div>
      </div>
      
      <!-- Monthly Goal -->
      <div class="home-goal">
        <div class="home-goal-header">
          <span class="home-goal-title">Meta del mes</span>
          <span class="home-goal-value">${stats.monthProducts} / ${stats.monthlyGoal}</span>
        </div>
        <div class="home-goal-bar">
          <div class="home-goal-bar-fill" style="width: 0%" data-target="${goalPercent}"></div>
        </div>
      </div>
      
      <!-- CTA -->
      <div class="home-cta">
        <button class="home-cta-btn" id="btn-new-order">
          <span class="home-cta-icon">+</span>
          Crear Pedido
        </button>
      </div>
    </div>
  `;
  
  // Animate goal bar
  requestAnimationFrame(() => {
    setTimeout(() => {
      const bar = container.querySelector('.home-goal-bar-fill');
      if (bar) bar.style.width = bar.dataset.target + '%';
    }, 300);
  });
  
  // Event listeners
  container.querySelector('#btn-logout')?.addEventListener('click', () => {
    auth.logout();
    router.navigate('login');
  });
  
  container.querySelector('#btn-new-order')?.addEventListener('click', () => {
    router.navigate('order');
  });
}
