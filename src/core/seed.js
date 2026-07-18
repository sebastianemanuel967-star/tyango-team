import { store } from './store.js';

export function seedDatabase() {
  if (store.isInitialized()) return;
  
  const users = [
    { id: 'u_admin', name: 'Tyan Mena', pin: '0000', role: 'admin', rank: 'founder_go', cardType: 'founder', cardCustom: null, mentorId: null, totalProducts: 0, monthProducts: 0, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_david', name: 'David', pin: '1111', role: 'asesor', rank: 'explorador_go', cardType: 'bronze', cardCustom: null, mentorId: 'u_admin', totalProducts: 0, monthProducts: 0, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_jordan', name: 'Jordan', pin: '2222', role: 'asesor', rank: 'consultor_go', cardType: 'silver', cardCustom: { gradient: ['#1a1a1a', '#8B0000'], accent: '#ff3333', style: 'urban', initials: 'JRD', pattern: 'graffiti' }, mentorId: 'u_admin', totalProducts: 55, monthProducts: 12, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_ayde', name: 'Ayde', pin: '3333', role: 'asesor', rank: 'explorador_go', cardType: 'bronze', cardCustom: null, mentorId: 'u_admin', totalProducts: 0, monthProducts: 0, createdAt: '2026-01-01T00:00:00' },
    { id: 'u_salome', name: 'Salom\u00e9', pin: '4444', role: 'asesor', rank: 'explorador_go', cardType: 'bronze', cardCustom: null, mentorId: 'u_admin', totalProducts: 0, monthProducts: 0, createdAt: '2026-01-01T00:00:00' },
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

  store.initialize({ users, products, settings });
}
