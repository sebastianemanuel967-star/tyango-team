// ============================================
// initData - Datos iniciales de TYANGO STAFF v2
// ============================================

import DataStore from './datastore.js';

export function initData() {
    // Solo inicializar si no hay datos
    if (DataStore.get('initialized')) return;

    // ── USUARIOS ──
    const users = [
        {
            id: 'u1',
            name: 'Tyan Mena',
            pin: '1111',
            role: 'admin',
            rank: 'founder',
            totalProducts: 850,
            monthProducts: 45,
            mentorId: null,
            cardStyle: 'tyan',
            active: true,
            createdAt: '2024-01-01'
        },
        {
            id: 'u2',
            name: 'Jordan',
            pin: '2222',
            role: 'asesor',
            rank: 'consultor',
            totalProducts: 78,
            monthProducts: 12,
            mentorId: 'u1',
            cardStyle: 'jordan',
            active: true,
            createdAt: '2024-02-15'
        },
        {
            id: 'u3',
            name: 'Ayde',
            pin: '3333',
            role: 'asesor',
            rank: 'explorador',
            totalProducts: 23,
            monthProducts: 8,
            mentorId: 'u1',
            cardStyle: 'ayde',
            active: true,
            createdAt: '2024-03-01'
        },
        {
            id: 'u4',
            name: 'Salomé',
            pin: '4444',
            role: 'asesor',
            rank: 'explorador',
            totalProducts: 15,
            monthProducts: 5,
            mentorId: 'u1',
            cardStyle: 'salome',
            active: true,
            createdAt: '2024-03-10'
        },
        {
            id: 'u5',
            name: 'David',
            pin: '5555',
            role: 'asesor',
            rank: 'explorador',
            totalProducts: 31,
            monthProducts: 10,
            mentorId: 'u1',
            cardStyle: 'david',
            active: true,
            createdAt: '2024-03-15'
        }
    ];

    // ── PRODUCTOS ──
    const products = [
        {
            id: 'p1',
            name: 'Pack Inicial GO',
            price: 120000,
            commissionRate: 25,
            mentorCommissionRate: 10,
            description: 'Pack de inicio con 5 productos esenciales',
            active: true
        },
        {
            id: 'p2',
            name: 'Kit Avanzado Pro',
            price: 250000,
            commissionRate: 30,
            mentorCommissionRate: 12,
            description: 'Kit completo para profesionales',
            active: true
        },
        {
            id: 'p3',
            name: 'Suplemento Mensual',
            price: 85000,
            commissionRate: 20,
            mentorCommissionRate: 8,
            description: 'Suplemento mensual premium',
            active: true
        },
        {
            id: 'p4',
            name: 'Pack Familiar',
            price: 350000,
            commissionRate: 28,
            mentorCommissionRate: 10,
            description: 'Pack para toda la familia',
            active: true
        },
        {
            id: 'p5',
            name: 'Pack Ejecutivo',
            price: 500000,
            commissionRate: 32,
            mentorCommissionRate: 13,
            description: 'Pack ejecutivo premium',
            active: true
        }
    ];

    // ── CONFIGURACIÓN ──
    const config = {
        monthlyGoal: 500,
        shippingDefault: 15000,
        bonusEnabled: true,
        companyName: 'TYANGO',
        appVersion: '2.0.0'
    };

    // ── WALLETS (vacíos inicialmente) ──
    const wallets = {};

    // ── TRANSACCIONES (vacías inicialmente) ──
    const transactions = [];

    // ── ÓRDENES (vacías inicialmente) ──
    const orders = [];

    // Guardar todo
    DataStore.set('users', users);
    DataStore.set('products', products);
    DataStore.set('config', config);
    DataStore.set('wallets', wallets);
    DataStore.set('transactions', transactions);
    DataStore.set('orders', orders);
    DataStore.set('initialized', true);

    console.log('✅ TYANGO STAFF v2 - Datos inicializados');
}

export default initData;
