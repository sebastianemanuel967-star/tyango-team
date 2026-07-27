// ============================================
// DigitalCard - Componente de Tarjetas Digitales Premium
// ============================================

import { RANKS } from '../services/commission.js';

const CARD_TEMPLATES = {
    tyan: (user) => `
        <div class="digital-card card-tyan">
            <div class="digital-card-inner">
                <div class="card-header-row">
                    <div class="card-top-left">TYANGO</div>
                    <div class="card-top-right">FOUNDER CARD</div>
                </div>
                <div class="card-center">
                    <div class="card-name">${user.name}</div>
                    <div class="card-rank">${RANKS[user.rank]?.name || user.rank}</div>
                </div>
                <div class="card-footer-row">
                    <div class="card-benefits">
                        <div>• Lead the Vision</div>
                        <div>• Scale the Brand</div>
                        <div>• Make an Impact</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div class="card-chip"></div>
                        <div class="card-seal">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-watermark">TYAN</div>
        </div>
    `,

    jordan: (user) => `
        <div class="digital-card card-jordan">
            <div class="digital-card-inner">
                <div class="card-header-row">
                    <div class="card-chip"></div>
                    <span class="badge badge-silver" style="font-size:0.6rem;">${RANKS[user.rank]?.name || user.rank}</span>
                </div>
                <div class="card-center" style="align-items:center;text-align:center;">
                    <div class="card-motivation-top">Siempre persigue tus sueños.</div>
                    <div class="card-motivation-quote">Nunca te rindas</div>
                </div>
                <div class="card-footer-row">
                    <div>
                        <div style="font-size:0.75rem;font-weight:600;color:rgba(255,255,255,0.7);">${user.name}</div>
                        <div style="font-size:0.625rem;color:rgba(255,255,255,0.4);">CONSULTOR GO</div>
                    </div>
                    <div class="card-signature">Jordan</div>
                </div>
            </div>
            <div class="card-watermark">JRD</div>
        </div>
    `,

    ayde: (user) => `
        <div class="digital-card card-ayde">
            <div class="digital-card-inner">
                <div class="card-header-row">
                    <div class="card-chip"></div>
                    <span class="badge badge-bronze" style="font-size:0.6rem;">${RANKS[user.rank]?.name || user.rank}</span>
                </div>
                <div class="card-center" style="align-items:center;text-align:center;">
                    <div class="card-motivation-top">Lidera con el corazón</div>
                    <div class="card-motivation-quote">logra sin límites.</div>
                </div>
                <div class="card-footer-row">
                    <div>
                        <div style="font-size:0.75rem;font-weight:600;color:rgba(255,255,255,0.7);">${user.name}</div>
                        <div style="font-size:0.625rem;color:rgba(255,255,255,0.4);">EXPLORADOR GO</div>
                    </div>
                    <div class="card-signature">Ayde</div>
                </div>
            </div>
            <div class="card-watermark">AYD</div>
        </div>
    `,

    salome: (user) => `
        <div class="digital-card card-salome">
            <div class="digital-card-inner">
                <div class="card-header-row">
                    <div class="card-chip"></div>
                    <span class="badge badge-bronze" style="font-size:0.6rem;">${RANKS[user.rank]?.name || user.rank}</span>
                </div>
                <div class="card-center" style="align-items:center;text-align:center;">
                    <div class="card-motivation-quote">Haz que cada paso te acerque a tu mejor versión.</div>
                </div>
                <div class="card-footer-row">
                    <div>
                        <div style="font-size:0.75rem;font-weight:600;color:rgba(255,255,255,0.7);">${user.name}</div>
                        <div style="font-size:0.625rem;color:rgba(255,255,255,0.4);">EXPLORADOR GO</div>
                    </div>
                    <div class="card-signature">Salomé</div>
                </div>
            </div>
            <div class="card-watermark">SLM</div>
        </div>
    `,

    david: (user) => `
        <div class="digital-card card-david">
            <div class="spotlight-left"></div>
            <div class="spotlight-right"></div>
            <div class="field-lines"></div>
            <div class="particles">
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
            </div>
            <div class="digital-card-inner">
                <div class="card-header-row">
                    <div class="card-chip"></div>
                    <span class="badge badge-bronze" style="font-size:0.6rem;">${RANKS[user.rank]?.name || user.rank}</span>
                </div>
                <div class="card-center" style="align-items:center;text-align:center;">
                    <div class="card-motivation-top">El talento gana partidos</div>
                    <div class="card-motivation-quote">la disciplina gana campeonatos.</div>
                </div>
                <div class="card-footer-row">
                    <div>
                        <div style="font-size:0.75rem;font-weight:600;color:rgba(255,255,255,0.7);">${user.name}</div>
                        <div style="font-size:0.625rem;color:rgba(255,255,255,0.4);">EXPLORADOR GO</div>
                    </div>
                    <div class="card-signature">David</div>
                </div>
            </div>
            <div class="card-watermark">DAV</div>
        </div>
    `
};

export function renderDigitalCard(user) {
    const template = CARD_TEMPLATES[user.cardStyle] || CARD_TEMPLATES.tyan;
    return template(user);
}

export function renderRankBadge(rank) {
    const rankData = RANKS[rank];
    if (!rankData) return '';
    return `<span class="badge ${rankData.badge}">${rankData.name}</span>`;
}

export default { renderDigitalCard, renderRankBadge };
