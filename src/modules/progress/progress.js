import { auth } from '../../core/auth.js';
import { store } from '../../core/store.js';
import { router } from '../../router.js';
import { renderCard } from '../../components/card/tyango-card.js';
import { showNavbar, updateNavbar } from '../../components/navbar/navbar.js';
import { getRankById, getNextRank } from '../../core/constants.js';

export function renderProgress(container) {
  if (!auth.isLoggedIn()) {
    router.navigate('login');
    return;
  }
  
  const user = auth.getCurrentUser();
  const stats = store.getUserStats(user.id);
  const rankInfo = getRankById(user.rank);
  const nextRank = getNextRank(user.rank);
  
  showNavbar();
  updateNavbar();
  
  // Calculate progress to next rank
  let progressPercent = 100;
  let progressText = '';
  let nextRankSection = '';
  
  if (nextRank) {
    const current = user.totalProducts;
    const needed = nextRank.threshold;
    const prevThreshold = rankInfo.threshold;
    const range = needed - prevThreshold;
    const progress = current - prevThreshold;
    progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    progressText = `${current} / ${needed} productos`;
    
    nextRankSection = `
      <div class="progress-next-rank">
        <div class="progress-next-header">
          <span>Próximo rango</span>
          <span class="progress-next-name">${nextRank.name}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: 0%" data-target="${progressPercent}"></div>
        </div>
        <span class="progress-bar-text">${progressText} (${progressPercent}%)</span>
      </div>
    `;
  } else {
    nextRankSection = `
      <div class="progress-max-rank">
        <div class="progress-max-rank-icon">👑</div>
        <p class="progress-max-rank-text">¡Has alcanzado el rango máximo!</p>
      </div>
    `;
  }
  
  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
  
  container.innerHTML = `
    <div class="progress-page">
      <div class="progress-header">
        <h1 class="progress-title">Mi Progreso</h1>
      </div>
      
      <!-- Card -->
      <div class="progress-card-section">
        ${renderCard(user)}
      </div>
      
      <!-- Rank Info -->
      <div class="progress-rank-info">
        <div class="progress-rank-current">
          <div>
            <span class="progress-rank-label">Rango actual</span>
            <div class="progress-rank-name">${rankInfo.name}</div>
          </div>
          <span class="badge badge-purple">${stats.totalProducts} productos</span>
        </div>
        ${nextRankSection}
      </div>
      
      <!-- Stats -->
      <div class="progress-stats">
        <div class="progress-stat">
          <span class="progress-stat-value">${stats.totalProducts}</span>
          <span class="progress-stat-label">Total histórico</span>
        </div>
        <div class="progress-stat">
          <span class="progress-stat-value">${stats.monthProducts}</span>
          <span class="progress-stat-label">Este mes</span>
        </div>
        <div class="progress-stat">
          <span class="progress-stat-value">${fmt(stats.totalEarnings)}</span>
          <span class="progress-stat-label">Ganancias totales</span>
        </div>
        <div class="progress-stat">
          <span class="progress-stat-value">${fmt(stats.monthEarnings)}</span>
          <span class="progress-stat-label">Ganancias del mes</span>
        </div>
      </div>
    </div>
  `;
  
  // Animate progress bar
  requestAnimationFrame(() => {
    setTimeout(() => {
      const bar = container.querySelector('.progress-bar-fill');
      if (bar) bar.style.width = bar.dataset.target + '%';
    }, 400);
  });
}
