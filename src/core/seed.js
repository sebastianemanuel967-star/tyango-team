import { store } from './store.js';

export function seedDatabase() {
  const users = [
    { id: 'u_admin', name: 'Tyan Mena', pin: '0000', role: 'admin', rank: 'founder_go', cardType: 'founder', cardCustom: null, mentorId: null, totalProducts: 31, monthProducts: 31, historicalProducts: 31, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_david', name: 'David', pin: '1111', role: 'asesor', rank: 'explorador_go', cardType: 'bronze', cardCustom: null, mentorId: 'u_admin', totalProducts: 9, monthProducts: 9, historicalProducts: 9, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_jordan', name: 'Jordan', pin: '2222', role: 'asesor', rank: 'explorador_go', cardType: 'silver', cardCustom: { gradient: ['#1a1a1a', '#8B0000'], accent: '#ff3333', style: 'urban', initials: 'JRD', pattern: 'graffiti' }, mentorId: 'u_admin', totalProducts: 5, monthProducts: 5, historicalProducts: 5, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_ayde', name: 'Ayde', pin: '3333', role: 'asesor', rank: 'explorador_go', cardType: 'bronze', cardCustom: null, mentorId: 'u_admin', totalProducts: 5, monthProducts: 5, historicalProducts: 5, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_salome', name: 'Salom\u00e9', pin: '4444', role: 'asesor', rank: 'explorador_go', cardType: 'bronze', cardCustom: null, mentorId: 'u_admin', totalProducts: 3, monthProducts: 3, historicalProducts: 3, createdAt: '2026-01-01T00:00:00' },
  ];

  const products = [
    { id: 'p_tyango', name: 'Tyango', price: 2.50, commissions: { asesor: 0.25, mentor: 0.10 } },
    { id: 'p_bendito', name: 'Bendito Mango', price: 3.00, commissions: { asesor: 0.30, mentor: 0.10 } },
    { id: 'p_uva', name: 'Uva Pulpa', price: 2.50, commissions: { asesor: 0.25, mentor: 0.10 } },
    { id: 'p_picazana', name: 'Picazana', price: 2.50, commissions: { asesor: 0.25, mentor: 0.10 } },
    { id: 'p_pepinazo', name: 'Pepinazo', price: 2.50, commissions: { asesor: 0.25, mentor: 0.10 } },
    { id: 'p_takimango', name: 'Takimango', price: 2.50, commissions: { asesor: 0.25, mentor: 0.10 } },
    { id: 'p_clasico', name: 'Mango Cl\u00e1sico', price: 2.50, commissions: { asesor: 0.25, mentor: 0.10 } },
    { id: 'p_pinadiablo', name: 'Pi\u00f1adiablo', price: 2.50, commissions: { asesor: 0.25, mentor: 0.10 } },
    { id: 'p_raffaello', name: 'Tyango x Raffaello', price: 4.50, commissions: { asesor: 0.45, mentor: 0.15 } },
    { id: 'p_paccari', name: 'Tyango x Paccari', price: 4.50, commissions: { asesor: 0.45, mentor: 0.15 } },
    { id: 'p_bowl', name: 'Bowl TYANGO', price: 5.00, commissions: { asesor: 0.50, mentor: 0.20 } },
  ];

  const settings = { monthlyGoal: 100, leadershipBonus: 50.00 };

  // Seeding initial run if completely empty
  if (!store.isInitialized()) {
    store.initialize({ users, products, settings });
  }

  // Force migration on pre-existing databases
  if (!localStorage.getItem('tyango_historical_migrated_v5')) {
    const historicalData = {
      'u_admin': { historicalProducts: 31, commission: 8.15, delivery: 9.50, mentor: 0.00, total: 17.65 },
      'u_david': { historicalProducts: 9, commission: 4.05, delivery: 1.50, mentor: 0.00, total: 5.55 },
      'u_jordan': { historicalProducts: 5, commission: 1.70, delivery: 3.50, mentor: 0.00, total: 5.20 },
      'u_ayde': { historicalProducts: 5, commission: 1.30, delivery: 2.00, mentor: 1.05, total: 4.35 },
      'u_salome': { historicalProducts: 3, commission: 1.35, delivery: 0.00, mentor: 0.00, total: 1.35 }
    };

    const currentUsers = store.getUsers();
    const currentWallets = store._getCollection('wallets');

    currentUsers.forEach(user => {
      const hist = historicalData[user.id];
      if (hist) {
        user.historicalProducts = hist.historicalProducts;
        user.totalProducts = hist.historicalProducts;
        user.monthProducts = hist.historicalProducts;
        
        // Recalculate rank for advisors, preserve founder rank for admin
        if (user.role !== 'admin') {
          const newRankObj = store.calculateRank(user.totalProducts);
          user.rank = newRankObj.id;
          if (!user.cardCustom) {
            user.cardType = newRankObj.card;
          }
        }

        // Reset and populate wallet entries
        let wallet = currentWallets.find(w => w.userId === user.id);
        if (!wallet) {
          wallet = { id: store._generateId('w'), userId: user.id, entries: [], balance: 0 };
          currentWallets.push(wallet);
        }
        
        wallet.entries = [];
        wallet.balance = hist.total;

        if (hist.commission > 0) {
          wallet.entries.push({
            id: store._generateId('e'),
            type: 'commission',
            amount: hist.commission,
            description: 'Saldo hist\u00f3rico: Comisiones',
            date: new Date().toISOString()
          });
        }
        if (hist.delivery > 0) {
          wallet.entries.push({
            id: store._generateId('e'),
            type: 'shipping',
            amount: hist.delivery,
            description: 'Saldo hist\u00f3rico: Env\u00edos',
            date: new Date().toISOString()
          });
        }
        if (hist.mentor > 0) {
          wallet.entries.push({
            id: store._generateId('e'),
            type: 'mentor_commission',
            amount: hist.mentor,
            description: 'Saldo hist\u00f3rico: Regal\u00edas Mentor',
            date: new Date().toISOString()
          });
        }
      }
    });

    store._setCollection('users', currentUsers);
    store._setCollection('wallets', currentWallets);
    localStorage.setItem('tyango_historical_migrated_v5', 'true');
  }
}
