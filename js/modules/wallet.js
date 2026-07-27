// ============================================
// Wallet Page - Cartera y transacciones
// ============================================

import AuthService from '../services/auth.js';
import DataStore from '../services/datastore.js';

const TYPE_LABELS = {
    commission: { label: 'Comision', color: 'var(--success)' },
    shipping: { label: 'Envio', color: 'var(--info)' },
    royalty: { label: 'Regalia', color: 'var(--accent-primary)' },
    mentor_override: { label: 'Override', color: 'var(--warning)' },
    bonus: { label: 'Bono', color: 'var(--gold)' }
};

export function renderWallet() {
    const user = AuthService.getUserData();
    const wallets = DataStore.get('wallets') || {};
    const wallet = wallets[user.id] || { balance: 0, history: [] };

    const formattedBalance = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(wallet.balance);

    const byType = {};
    wallet.history.forEach(tx => {
        if (!byType[tx.type]) byType[tx.type] = { count: 0, total: 0 };
        byType[tx.type].count++;
        byType[tx.type].total += tx.amount;
    });

    return `
        <div class="page">
            <div class="container">
                <div class="page-header">
                    <p class="page-subtitle">Tu cartera</p>
                    <h1 class="page-title">Cartera</h1>
                </div>

                <div class="card" style="background:linear-gradient(135deg,var(--accent-primary),var(--accent-primary-dark));margin-bottom:var(--space-lg);text-align:center;padding:var(--space-xl);">
                    <div style="font-size:0.875rem;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:var(--space-sm);">Saldo Disponible</div>
                    <div style="font-size:2.5rem;font-weight:800;color:white;letter-spacing:-0.02em;">${formattedBalance}</div>
                </div>

                ${Object.keys(byType).length > 0 ? `
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-sm);margin-bottom:var(--space-lg);">
                        ${Object.entries(byType).map(([type, data]) => {
                            const info = TYPE_LABELS[type] || { label: type, color: 'var(--text-secondary)' };
                            return `
                                <div class="card" style="padding:var(--space-md);text-align:center;">
                                    <div style="font-size:0.6875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">${info.label}</div>
                                    <div style="font-size:1.125rem;font-weight:700;color:${info.color};">
                                        $${Math.round(data.total).toLocaleString('es-CO')}
                                    </div>
                                    <div style="font-size:0.75rem;color:var(--text-muted);">${data.count} trans.</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}

                <div>
                    <h3 style="font-size:1rem;font-weight:600;margin-bottom:var(--space-md);">Historial</h3>
                    ${wallet.history.length === 0 ? `
                        <div class="card empty-state">
                            <div class="empty-state-icon">📭</div>
                            <div class="empty-state-title">Sin transacciones</div>
                            <div class="empty-state-text">Tus ganancias apareceran aqui</div>
                        </div>
                    ` : `
                        <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
                            ${[...wallet.history].reverse().map(tx => {
                                const info = TYPE_LABELS[tx.type] || { label: tx.type, color: 'var(--text-secondary)' };
                                return `
                                    <div class="card" style="padding:var(--space-md);display:flex;justify-content:space-between;align-items:center;">
                                        <div>
                                            <div style="font-weight:600;font-size:0.9375rem;">${tx.description}</div>
                                            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                                                ${new Date(tx.date).toLocaleDateString('es-CO')} · <span style="color:${info.color};">${info.label}</span>
                                            </div>
                                        </div>
                                        <div style="font-weight:700;color:${info.color};font-size:1rem;">
                                            +$${Math.round(tx.amount).toLocaleString('es-CO')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

export function initWallet() {}

export default { renderWallet, initWallet };
