export const ROLES = { ADMIN: 'admin', ASESOR: 'asesor' };

export const RANKS = {
  EXPLORADOR_GO: { id: 'explorador_go', name: 'Explorador GO', threshold: 0, card: 'bronze', order: 0 },
  CONSULTOR_GO: { id: 'consultor_go', name: 'Consultor GO', threshold: 50, card: 'silver', order: 1 },
  MENTOR_GO: { id: 'mentor_go', name: 'Mentor GO', threshold: 150, card: 'gold', order: 2 },
  LIDER_GO: { id: 'lider_go', name: 'L\u00edder GO', threshold: 300, card: 'titanium', order: 3 },
  FOUNDER_GO: { id: 'founder_go', name: 'Founder GO', threshold: 500, card: 'founder', order: 4 },
};

export const CARDS = {
  bronze: { name: 'Bronze Card', gradient: ['#8B6914', '#CD853F'], accent: '#DAA520' },
  silver: { name: 'Silver Card', gradient: ['#708090', '#C0C0C0'], accent: '#B0C4DE' },
  gold: { name: 'Gold Card', gradient: ['#B8860B', '#FFD700'], accent: '#FFC125' },
  titanium: { name: 'Titanium Card', gradient: ['#2F4F4F', '#778899'], accent: '#87CEEB' },
  founder: { name: 'Founder Card', gradient: ['#4B0082', '#7c3aed'], accent: '#a855f7' },
};

export const PAYMENT_METHODS = [
  { id: 'efectivo', name: 'Efectivo' },
  { id: 'transferencia', name: 'Transferencia' },
  { id: 'tarjeta', name: 'Tarjeta' },
];

export const ROUTES = {
  LOGIN: 'login',
  HOME: 'home',
  ORDER: 'order',
  WALLET: 'wallet',
  PROGRESS: 'progress',
  RANKING: 'ranking',
  ADMIN: 'admin',
};

// Helper to get rank by id
export function getRankById(rankId) {
  return Object.values(RANKS).find(r => r.id === rankId) || RANKS.EXPLORADOR_GO;
}

// Helper to get rank by total products
export function getRankByProducts(totalProducts) {
  const sorted = Object.values(RANKS).sort((a, b) => b.threshold - a.threshold);
  return sorted.find(r => totalProducts >= r.threshold) || RANKS.EXPLORADOR_GO;
}

// Helper to get next rank
export function getNextRank(currentRankId) {
  const current = getRankById(currentRankId);
  const sorted = Object.values(RANKS).sort((a, b) => a.order - b.order);
  const nextIndex = sorted.findIndex(r => r.id === currentRankId) + 1;
  return nextIndex < sorted.length ? sorted[nextIndex] : null;
}
