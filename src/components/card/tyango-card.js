import { CARDS, getRankById } from '../../core/constants.js';

/**
 * Renders a premium TYANGO card for a user.
 * @param {Object} user - user object with: name, rank, cardType, cardCustom
 * @returns {string} HTML string for the card
 */
export function renderCard(user) {
  const rankInfo = getRankById(user.rank);
  const cardConfig = CARDS[user.cardType] || CARDS.bronze;
  const custom = user.cardCustom;

  // Determine colors
  const color1 = custom ? custom.gradient[0] : cardConfig.gradient[0];
  const color2 = custom ? custom.gradient[1] : cardConfig.gradient[1];
  const accent = custom ? custom.accent : cardConfig.accent;
  const cardName = cardConfig.name;
  const pattern = custom?.pattern || 'default';
  const initials = custom?.initials || '';

  // Special Ultra Premium Layout for the Founder Card
  if (user.cardType === 'founder') {
    return `
      <div class="tyango-card card-founder-premium animate-scale-in">
        <div class="tyango-card-bg"></div>
        <div class="tyango-card-holo"></div>
        <div class="tyango-card-glow-effects"></div>
        
        <!-- Premium 3D Mascot on the Right -->
        <div class="tyango-card-mango-wrapper">
          <img src="src/components/card/founder_mango.jpg" class="tyango-card-mango-img" alt="Founder Mango">
          <div class="tyango-card-mango-overlay"></div>
        </div>

        <div class="tyango-card-content">
          <!-- Top Section -->
          <div class="tyango-card-top">
            <div class="tyango-card-brand-group">
              <span class="tyango-card-logo">TYANGO</span>
              <span class="tyango-card-crown-grabado">👑</span>
            </div>
            <span class="tyango-card-type badge-founder">Founder Card</span>
          </div>

          <!-- Middle Section -->
          <div class="tyango-card-middle">
            <div class="tyango-card-chip gold-chip"></div>
            <div class="tyango-card-user-info">
              <span class="tyango-card-name">${user.name || 'Tyan Mena'}</span>
              <span class="tyango-card-rank founder-rank-badge">Founder GO</span>
            </div>
          </div>

          <!-- Bottom Benefits Section -->
          <div class="tyango-card-benefits">
            <div class="benefit-item">
              <span class="benefit-icon">🚀</span>
              <span class="benefit-text">Lead the Vision</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">📈</span>
              <span class="benefit-text">Scale the Brand</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">💎</span>
              <span class="benefit-text">Make an Impact</span>
            </div>
          </div>

          <!-- Grabados / Signature -->
          <div class="tyango-card-signature">Tyan</div>
        </div>
      </div>
    `;
  }

  // Standard layouts for normal cards
  return `
    <div class="tyango-card animate-scale-in" 
         style="--card-color-1: ${color1}; --card-color-2: ${color2}; --card-accent: ${accent}; --card-glow: ${accent}30;">
      <div class="tyango-card-bg"></div>
      <div class="tyango-card-holo"></div>
      <div class="tyango-card-pattern ${pattern === 'graffiti' ? 'pattern-graffiti' : ''}"></div>
      ${initials ? `<div class="tyango-card-initials">${initials}</div>` : ''}
      <div class="tyango-card-content">
        <div class="tyango-card-top">
          <span class="tyango-card-logo">TYANGO</span>
          <span class="tyango-card-type">${cardName}</span>
        </div>
        <div class="tyango-card-chip"></div>
        <div class="tyango-card-bottom">
          <span class="tyango-card-name">${user.name || ''}</span>
          <span class="tyango-card-rank">${rankInfo.name}</span>
        </div>
      </div>
    </div>
  `;
}
