// ============================================
// Ranking Page - Tabla de posiciones
// ============================================

import DataStore from '../services/datastore.js';
import { RANKS } from '../services/commission.js';
import AuthService from '../services/auth.js';

export function renderRanking() {
    const users = (DataStore.get('users') || [])
        .filter(u => u.role === 'asesor' || u.role === 'admin')
        .sort((a, b) => b.totalProducts - a.totalProducts);

    const currentUser = AuthService.getUserData();

    return `
        <div class="page">
            <div class="container">
                <div class="page-header">
                    <p class="page-subtitle">Competencia global</p>
                    <h1 class="page-title">Ranking</h1>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Asesor</th>
                                <th>Rango</th>
                                <th style="text-align:right;">Productos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map((user, index) => {
                                const rankData = RANKS[user.rank];
                                const isCurrent = currentUser && user.id === currentUser.id;

                                return `
                                    <tr style="${isCurrent ? 'background:rgba(124,58,237,0.05);' : ''}">
                                        <td>
                                            <div style="display:flex;align-items:center;gap:8px;">
                                                ${index < 3 ? `
                                                    <span style="font-size:1.25rem;">${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                                                ` : `<span style="color:var(--text-muted);font-weight:600;">${index + 1}</span>`}
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display:flex;align-items:center;gap:10px;">
                                                <div style="width:32px;height:32px;border-radius:var(--radius-full);background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8125rem;">
                                                    ${user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style="font-weight:600;">${user.name}</div>
                                                    ${isCurrent ? '<div style="font-size:0.6875rem;color:var(--accent-primary);">Tu</div>' : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge ${rankData.badge}" style="font-size:0.625rem;">${rankData.name}</span>
                                        </td>
                                        <td style="text-align:right;font-weight:700;">${user.totalProducts}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function initRanking() {}

export default { renderRanking, initRanking };
