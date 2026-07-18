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

  // Special Ultra Minimalist & Exclusive Founder Card (Apple + Nothing + Tesla style)
  if (user.cardType === 'founder') {
    return `
      <div class="tyango-card card-founder-centurion animate-scale-in">
        <!-- Titanium texture background and glassmorphism reflection overlay -->
        <div class="card-centurion-bg"></div>
        <div class="card-centurion-reflection"></div>
        <div class="card-centurion-glow"></div>
        
        <!-- Minimalist Metallic Seal on the Right Side -->
        <div class="card-centurion-emblem">
          <img src="src/components/card/tyango_emblem.jpg" class="card-centurion-emblem-img" alt="TYANGO Metal Emblem">
          <div class="card-centurion-emblem-glare"></div>
        </div>

        <div class="tyango-card-content">
          <!-- Top Row -->
          <div class="centurion-top">
            <span class="centurion-logo">TYANGO</span>
            <span class="centurion-badge">FOUNDER CARD</span>
          </div>

          <!-- Middle Section: Modern Metallic Chip -->
          <div class="centurion-chip-container">
            <div class="tyango-card-chip centurion-chip"></div>
          </div>

          <!-- Owner Information (Centered Vibe) -->
          <div class="centurion-user-info">
            <h2 class="centurion-name">${user.name || 'Tyan Mena'}</h2>
            <span class="centurion-rank">FOUNDER GO</span>
          </div>

          <!-- Bottom Row: Three Minimalist Benefits -->
          <div class="centurion-benefits">
            <div class="centurion-benefit-item">
              <span class="centurion-benefit-dot"></span>
              <span class="centurion-benefit-text">Lead the Vision</span>
            </div>
            <div class="centurion-benefit-item">
              <span class="centurion-benefit-dot"></span>
              <span class="centurion-benefit-text">Scale the Brand</span>
            </div>
            <div class="centurion-benefit-item">
              <span class="centurion-benefit-dot"></span>
              <span class="centurion-benefit-text">Make an Impact</span>
            </div>
          </div>
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
