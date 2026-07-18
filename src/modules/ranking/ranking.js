import { auth } from '../../core/auth.js';
import { store } from '../../core/store.js';
import { router } from '../../router.js';
import { showNavbar, updateNavbar } from '../../components/navbar/navbar.js';
import { getRankById } from '../../core/constants.js';

export function renderRanking(container) {
  if (!auth.isLoggedIn()) {
    router.navigate('login');
    return;
  }

  const currentUser = auth.getCurrentUser();
  const ranking = store.getTeamRanking();

  showNavbar();
  updateNavbar();

  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

  const getPositionClass = (index) => {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze-pos';
    return 'normal';
  };

  const getPositionIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  container.innerHTML = `
    <div class="ranking-page">
      <div class="ranking-header">
        <h1 class="ranking-title">Ranking</h1>
      </div>

      <div class="ranking-list">
        ${ranking.map((member, i) => {
          const rankInfo = getRankById(member.rank);
          const isMe = member.id === currentUser.id;
          return `
            <div class="ranking-item ${isMe ? 'is-me' : ''}">
              <div class="ranking-position ${getPositionClass(i)}">${getPositionIcon(i)}</div>
              <div class="ranking-info">
                <span class="ranking-name">${member.name || ''}${isMe ? ' (Tú)' : ''}</span>
                <span class="ranking-rank">${rankInfo.name}</span>
              </div>
              <div class="ranking-stats">
                <span class="ranking-products">${member.totalProducts || 0}</span>
                <span class="ranking-earnings">${fmt(member.totalEarnings)}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
