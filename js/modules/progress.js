// ============================================
// Progress Page - Progreso de rango
// ============================================

import AuthService from '../services/auth.js';
import { CommissionEngine, RANKS, RANK_ORDER } from '../services/commission.js';

export function renderProgress() {
    const user = AuthService.getUserData();
    const nextRank = CommissionEngine.getNextRankInfo(user.totalProducts);
    const currentRankData = RANKS[user.rank];

    return `
        <div class="page">
            <div class="container">
                <div class="page-header">
                    <p class="page-subtitle">Tu camino</p>
                    <h1 class="page-title">Progreso</h1>
                </div>

                <div class="card" style="text-align:center;padding:var(--space-xl);margin-bottom:var(--space-lg);">
                    <div style="font-size:0.875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:var(--space-md);">Rango Actual</div>
                    <div style="font-size:2rem;font-weight:800;margin-bottom:var(--space-sm);">${currentRankData.name}</div>
                    <span class="badge ${currentRankData.badge}" style="font-size:0.75rem;">${user.totalProducts} productos</span>
                </div>

                ${nextRank.hasNext ? `
                    <div class="card" style="text-align:center;padding:var(--space-xl);margin-bottom:var(--space-lg);">
                        <div style="position:relative;display:inline-block;">
                            <svg width="200" height="200" viewBox="0 0 200 200" style="transform:rotate(-90deg);">
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stop-color="var(--accent-primary)"/>
                                        <stop offset="100%" stop-color="var(--accent-secondary)"/>
                                    </linearGradient>
                                </defs>
                                <circle cx="100" cy="100" r="85" fill="none" stroke="var(--bg-elevated)" stroke-width="12"/>
                                <circle cx="100" cy="100" r="85" fill="none" stroke="url(#progressGradient)" stroke-width="12"
                                    stroke-linecap="round"
                                    stroke-dasharray="${2 * Math.PI * 85}"
                                    stroke-dashoffset="${2 * Math.PI * 85 * (1 - nextRank.progress / 100)}"
                                    style="transition:stroke-dashoffset 1.5s ease;"/>
                            </svg>
                            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                                <div style="font-size:2.5rem;font-weight:800;">${Math.round(nextRank.progress)}%</div>
                                <div style="font-size:0.75rem;color:var(--text-muted);">completado</div>
                            </div>
                        </div>

                        <div style="margin-top:var(--space-lg);">
                            <div style="font-size:1.125rem;font-weight:600;margin-bottom:var(--space-xs);">Hacia ${nextRank.name}</div>
                            <div style="color:var(--text-secondary);font-size:0.9375rem;">
                                Necesitas <strong style="color:var(--accent-primary);">${nextRank.needed}</strong> productos mas
                            </div>
                            <div style="margin-top:var(--space-sm);font-size:0.8125rem;color:var(--text-muted);">
                                ${user.totalProducts} / ${nextRank.threshold} productos
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="card" style="text-align:center;padding:var(--space-xl);margin-bottom:var(--space-lg);">
                        <div style="font-size:3rem;margin-bottom:var(--space-md);">👑</div>
                        <div style="font-size:1.25rem;font-weight:700;margin-bottom:var(--space-sm);">Rango Maximo Alcanzado!</div>
                        <div style="color:var(--text-secondary);">Eres ${currentRankData.name}. Has llegado a la cima.</div>
                    </div>
                `}

                <div>
                    <h3 style="font-size:1rem;font-weight:600;margin-bottom:var(--space-md);">Todos los rangos</h3>
                    <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
                        ${RANK_ORDER.map((rankKey, index) => {
                            const rank = RANKS[rankKey];
                            const isCurrent = rankKey === user.rank;
                            const isPassed = RANK_ORDER.indexOf(user.rank) > index;
                            const isLocked = RANK_ORDER.indexOf(user.rank) < index;

                            return `
                                <div class="card" style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-md);opacity:${isLocked ? 0.4 : 1};">
                                    <div style="width:40px;height:40px;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;font-size:1.25rem;background:${isCurrent ? 'var(--accent-primary)' : isPassed ? 'var(--success)' : 'var(--bg-elevated)'};color:white;">
                                        ${isCurrent ? '★' : isPassed ? '✓' : (index + 1)}
                                    </div>
                                    <div style="flex:1;">
                                        <div style="font-weight:600;">${rank.name}</div>
                                        <div style="font-size:0.8125rem;color:var(--text-muted);">${rank.threshold}+ productos</div>
                                    </div>
                                    ${isCurrent ? '<span class="badge badge-' + rank.card + '">Actual</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initProgress() {}

export default { renderProgress, initProgress };
