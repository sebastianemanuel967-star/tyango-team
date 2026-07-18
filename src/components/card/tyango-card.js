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

  // Special Ultra Premium & Custom card for David (Athletic discipline, Champions League and Porsche inspiration)
  if (user.id === 'u_david' || user.name === 'David') {
    return `
      <div class="tyango-card card-david-premium animate-scale-in">
        <div class="card-david-bg"></div>
        <div class="card-david-reflection"></div>
        <div class="card-david-glow"></div>
        <div class="card-david-stadium-lights"></div>
        <div class="card-david-pitch-lines"></div>
        <div class="card-david-particles"></div>
        
        <!-- Large DAV Watermark Background -->
        <div class="david-watermark">DAV</div>

        <div class="tyango-card-content">
          <!-- Top Row -->
          <div class="centurion-top">
            <span class="centurion-logo">TYANGO</span>
            <span class="centurion-badge badge-bronze">BRONZE CARD</span>
          </div>

          <!-- Middle: Modern Chip, Name and Rank -->
          <div class="david-middle">
            <div class="tyango-card-chip bronze-chip"></div>
            <div class="david-user-details">
              <span class="david-name">${user.name || 'David'}</span>
              <span class="david-rank">EXPLORADOR GO</span>
            </div>
          </div>

          <!-- Bottom Area -->
          <div class="david-bottom">
            <!-- Inspirational Quote Left -->
            <div class="david-quote-box">
              <span class="david-quote-marks">“</span>
              <span class="david-quote-top">El talento gana partidos,</span>
              <span class="david-quote-main">la disciplina gana campeonatos.</span>
            </div>
            
            <!-- Elegant Handwritten Signature Right -->
            <div class="david-signature">David</div>
          </div>
        </div>
      </div>
    `;
  }

  // Special Ultra Premium & Custom card for Salomé (Rose Gold & Delicacy inspiration)
  if (user.id === 'u_salome' || user.name === 'Salomé' || user.name === 'Salom\u00e9') {
    return `
      <div class="tyango-card card-salome-premium animate-scale-in">
        <div class="card-salome-bg"></div>
        <div class="card-salome-reflection"></div>
        <div class="card-salome-glow"></div>
        
        <!-- Rose Gold Light Wave Animation at the bottom -->
        <div class="card-salome-light-wave"></div>
        
        <!-- Large SLM Watermark Background -->
        <div class="salome-watermark">SLM</div>

        <div class="tyango-card-content">
          <!-- Top Row -->
          <div class="centurion-top">
            <span class="centurion-logo">TYANGO</span>
            <span class="centurion-badge badge-bronze">BRONZE CARD</span>
          </div>

          <!-- Middle: Modern Chip, Name and Rank -->
          <div class="salome-middle">
            <div class="tyango-card-chip rose-gold-chip"></div>
            <div class="salome-user-details">
              <span class="salome-name">${user.name || 'Salomé'}</span>
              <span class="salome-rank">EXPLORADOR GO</span>
            </div>
          </div>

          <!-- Bottom Area -->
          <div class="salome-bottom">
            <!-- Inspirational Quote Left -->
            <div class="salome-quote-box">
              <span class="salome-quote-marks">“</span>
              <span class="salome-quote-top">Haz que cada paso te acerque</span>
              <span class="salome-quote-main">a tu mejor versión.</span>
            </div>
            
            <!-- Elegant Handwritten Signature Right -->
            <div class="salome-signature">Salomé</div>
          </div>
        </div>
      </div>
    `;
  }

  // Special Ultra Premium & Custom card for Ayde (Celeste & White Argentine skies inspiration)
  if (user.id === 'u_ayde' || user.name === 'Ayde') {
    return `
      <div class="tyango-card card-ayde-premium animate-scale-in">
        <div class="card-ayde-bg"></div>
        <div class="card-ayde-reflection"></div>
        <div class="card-ayde-glow"></div>
        
        <!-- Celeste Light Wave Animation at the bottom -->
        <div class="card-ayde-light-wave"></div>
        
        <!-- Large AYD Watermark Background -->
        <div class="ayde-watermark">AYD</div>

        <div class="tyango-card-content">
          <!-- Top Row -->
          <div class="centurion-top">
            <span class="centurion-logo">TYANGO</span>
            <span class="centurion-badge badge-bronze">BRONZE CARD</span>
          </div>

          <!-- Middle: Modern Chip, Name and Rank -->
          <div class="ayde-middle">
            <div class="tyango-card-chip silver-chip"></div>
            <div class="ayde-user-details">
              <span class="ayde-name">${user.name || 'Ayde'}</span>
              <span class="ayde-rank">EXPLORADOR GO</span>
            </div>
          </div>

          <!-- Bottom Area -->
          <div class="ayde-bottom">
            <!-- Inspirational Quote Left -->
            <div class="ayde-quote-box">
              <span class="ayde-quote-marks">“</span>
              <span class="ayde-quote-top">Lidera con el corazón</span>
              <span class="ayde-quote-main">logra sin límites.</span>
            </div>
            
            <!-- Elegant Handwritten Signature Right -->
            <div class="ayde-signature">Ayde</div>
          </div>
        </div>
      </div>
    `;
  }

  // Special Ultra Premium & Custom card for Jordan
  if (user.id === 'u_jordan' || (custom && custom.initials === 'JRD')) {
    return `
      <div class="tyango-card card-jordan-premium animate-scale-in">
        <div class="card-jordan-bg"></div>
        <div class="card-jordan-reflection"></div>
        <div class="card-jordan-glow"></div>
        
        <!-- Large JRD Watermark Background -->
        <div class="jordan-watermark">JRD</div>

        <div class="tyango-card-content">
          <!-- Top Row -->
          <div class="centurion-top">
            <span class="centurion-logo">TYANGO</span>
            <span class="centurion-badge badge-silver">SILVER CARD</span>
          </div>

          <!-- Middle: Modern Chip, Name and Rank -->
          <div class="jordan-middle">
            <div class="tyango-card-chip silver-chip"></div>
            <div class="jordan-user-details">
              <span class="jordan-name">${user.name || 'Jordan'}</span>
              <span class="jordan-rank">EXPLORADOR GO</span>
            </div>
          </div>

          <!-- Bottom Area -->
          <div class="jordan-bottom">
            <!-- Inspirational Quote Left -->
            <div class="jordan-quote-box">
              <span class="jordan-quote-marks">“</span>
              <span class="jordan-quote-top">Siempre persigue</span>
              <span class="jordan-quote-main">tus sueños.</span>
            </div>
            
            <!-- Elegant Handwritten Signature Right -->
            <div class="jordan-signature">Jordan</div>
          </div>
        </div>
      </div>
    `;
  }

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
