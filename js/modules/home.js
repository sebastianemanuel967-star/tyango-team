// ============================================
// Home Page - Dashboard principal
// ============================================

import AuthService from '../services/auth.js';
import DataStore from '../services/datastore.js';
import { CommissionEngine } from '../services/commission.js';
import { renderDigitalCard } from '../components/digitalCard.js';

export function renderHome() {
    const user = AuthService.getUserData();
    if (!user) return '<div class="page">Error: Usuario no encontrado</div>';

    const wallets = DataStore.get('wallets') || {};
    const wallet = wallets[user.id] || { balance: 0 };
    const nextRank = CommissionEngine.getNextRankInfo(user.totalProducts);

    const formattedBalance = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(wallet.balance);

    return `
        <div class="page">
            <div class="container">
                <div class="page-header">
                    <p class="page-subtitle">Bienvenido de vuelta</p>
                    <h1 class="page-title">${user.name}</h1>
                </div>

                ${renderDigitalCard(user)}

                <div class="card" style="margin-bottom:var(--space-lg);">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Ganancias</div>
                            <div style="font-size:1.5rem;font-weight:700;color:var(--accent-primary);">${formattedBalance}</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Ventas Mes</div>
                            <div style="font-size:1.5rem;font-weight:700;">${user.monthProducts}</div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Total Historico</div>
                            <div style="font-size:1.25rem;font-weight:700;">${user.totalProducts} <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">productos</span></div>
                        </div>
                        ${nextRank.hasNext ? `
                            <div style="text-align:right;">
                                <div style="font-size:0.625rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Siguiente: ${nextRank.name}</div>
                                <div style="font-size:0.875rem;color:var(--accent-secondary);font-weight:600;">${nextRank.needed} mas</div>
                            </div>
                        ` : '<span class="badge badge-founder">Maximo Rango</span>'}
                    </div>
                </div>

                <div class="card" style="margin-bottom:var(--space-xl);">
                    <h3 style="font-size:1rem;font-weight:600;margin-bottom:var(--space-md);">Resumen del Mes</h3>
                    <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
                            <span style="color:var(--text-secondary);font-size:0.875rem;">Productos vendidos</span>
                            <span style="font-weight:600;">${user.monthProducts}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
                            <span style="color:var(--text-secondary);font-size:0.875rem;">Rango actual</span>
                            <span class="badge badge-${user.rank}">${CommissionEngine.RANKS[user.rank]?.name || user.rank}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;">
                            <span style="color:var(--text-secondary);font-size:0.875rem;">Progreso al siguiente</span>
                            <span style="font-weight:600;color:var(--accent-primary);">${nextRank.hasNext ? Math.round(nextRank.progress) + '%' : '100%'}</span>
                        </div>
                    </div>
                    ${nextRank.hasNext ? `
                        <div style="margin-top:var(--space-md);height:6px;background:var(--bg-elevated);border-radius:var(--radius-full);overflow:hidden;">
                            <div style="height:100%;width:${nextRank.progress}%;background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));border-radius:var(--radius-full);transition:width 1s ease;"></div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <button class="fab" id="fab-order" title="Crear Pedido">+</button>
        </div>
    `;
}

export function initHome() {
    const fab = document.getElementById('fab-order');
    if (fab) {
        fab.addEventListener('click', () => {
            window.location.hash = '#/order';
        });
    }
}

export default { renderHome, initHome };
