// ============================================
// CommissionEngine - Motor de Comisiones y Rangos
// ============================================

import DataStore from './datastore.js';

// Rangos y umbrales
export const RANKS = {
    explorador: { name: 'Explorador GO', threshold: 0, card: 'bronze', badge: 'badge-bronze' },
    consultor: { name: 'Consultor GO', threshold: 50, card: 'silver', badge: 'badge-silver' },
    mentor: { name: 'Mentor GO', threshold: 150, card: 'gold', badge: 'badge-gold' },
    lider: { name: 'Líder GO', threshold: 300, card: 'titanium', badge: 'badge-titanium' },
    founder: { name: 'Founder GO', threshold: 500, card: 'founder', badge: 'badge-founder' }
};

export const RANK_ORDER = ['explorador', 'consultor', 'mentor', 'lider', 'founder'];

export class CommissionEngine {
    /**
     * Calcula el rango basado en productos acumulados históricos
     */
    static calculateRank(totalProducts) {
        let currentRank = 'explorador';
        for (const rankKey of RANK_ORDER) {
            if (totalProducts >= RANKS[rankKey].threshold) {
                currentRank = rankKey;
            }
        }
        return currentRank;
    }

    /**
     * Obtiene el siguiente rango y productos necesarios
     */
    static getNextRankInfo(totalProducts) {
        const currentRank = this.calculateRank(totalProducts);
        const currentIndex = RANK_ORDER.indexOf(currentRank);

        if (currentIndex === RANK_ORDER.length - 1) {
            return { hasNext: false, rank: currentRank, name: RANKS[currentRank].name };
        }

        const nextRank = RANK_ORDER[currentIndex + 1];
        const needed = RANKS[nextRank].threshold - totalProducts;

        return {
            hasNext: true,
            rank: nextRank,
            name: RANKS[nextRank].name,
            needed: needed,
            threshold: RANKS[nextRank].threshold,
            progress: Math.min(100, (totalProducts / RANKS[nextRank].threshold) * 100)
        };
    }

    /**
     * Procesa un pedido aplicando la Regla del Envío
     * 
     * shippingCharged: boolean - Si el asesor cobró envío al cliente
     * products: array de { productId, quantity, unitPrice, commissionRate, mentorCommissionRate }
     * shippingAmount: number - Valor del envío
     * advisorId: string - ID del asesor
     * 
     * Retorna: { advisorEarnings, mentorEarnings, transactions }
     */
    static processOrder({ shippingCharged, products, shippingAmount, advisorId }) {
        const users = DataStore.get('users') || [];
        const advisor = users.find(u => u.id === advisorId);

        if (!advisor) {
            throw new Error('Asesor no encontrado');
        }

        const transactions = [];
        let advisorTotal = 0;
        let mentorTotal = 0;
        let totalUnits = 0;

        // Productos del pedido
        const orderProducts = products.map(p => {
            const productTotal = p.unitPrice * p.quantity;
            const advisorCommission = productTotal * (p.commissionRate / 100);
            const mentorCommission = productTotal * (p.mentorCommissionRate / 100);
            totalUnits += p.quantity;

            return {
                ...p,
                productTotal,
                advisorCommission,
                mentorCommission
            };
        });

        if (shippingCharged) {
            // ── REGLA DEL ENVÍO ACTIVADA ──
            // El asesor gana SOLO el envío
            advisorTotal = shippingAmount;

            transactions.push({
                type: 'shipping',
                amount: shippingAmount,
                description: 'Envío cobrado al cliente',
                toUserId: advisorId
            });

            // El asesor gana 0% de comisión por productos
            // La comisión total del producto pasa al mentor
            if (advisor.mentorId) {
                const mentor = users.find(u => u.id === advisor.mentorId);
                if (mentor) {
                    orderProducts.forEach(p => {
                        // Mentor recibe: comisión normal del asesor + comisión de mentoría
                        const mentorProductTotal = p.advisorCommission + p.mentorCommission;
                        mentorTotal += mentorProductTotal;

                        transactions.push({
                            type: 'mentor_override',
                            amount: mentorProductTotal,
                            description: `Comisión override: ${p.productName} x${p.quantity}`,
                            toUserId: advisor.mentorId,
                            fromAdvisorId: advisorId,
                            productId: p.productId
                        });
                    });
                }
            }

        } else {
            // ── REGLA NORMAL ──
            // Asesor recibe su comisión normal
            orderProducts.forEach(p => {
                advisorTotal += p.advisorCommission;

                transactions.push({
                    type: 'commission',
                    amount: p.advisorCommission,
                    description: `Comisión: ${p.productName} x${p.quantity}`,
                    toUserId: advisorId,
                    productId: p.productId
                });
            });

            // Mentor recibe su comisión de regalía normal
            if (advisor.mentorId) {
                const mentor = users.find(u => u.id === advisor.mentorId);
                if (mentor) {
                    orderProducts.forEach(p => {
                        mentorTotal += p.mentorCommission;

                        transactions.push({
                            type: 'royalty',
                            amount: p.mentorCommission,
                            description: `Regalía mentoría: ${p.productName} x${p.quantity}`,
                            toUserId: advisor.mentorId,
                            fromAdvisorId: advisorId,
                            productId: p.productId
                        });
                    });
                }
            }
        }

        return {
            advisorTotal,
            mentorTotal,
            totalUnits,
            transactions,
            shippingCharged,
            orderProducts
        };
    }

    /**
     * Actualiza estadísticas del asesor después de un pedido
     */
    static updateAdvisorStats(advisorId, unitsSold) {
        const users = DataStore.get('users') || [];
        const advisorIndex = users.findIndex(u => u.id === advisorId);

        if (advisorIndex === -1) return null;

        const advisor = users[advisorIndex];
        const newTotal = (advisor.totalProducts || 0) + unitsSold;
        const newMonth = (advisor.monthProducts || 0) + unitsSold;
        const newRank = this.calculateRank(newTotal);
        const rankChanged = newRank !== advisor.rank;

        users[advisorIndex] = {
            ...advisor,
            totalProducts: newTotal,
            monthProducts: newMonth,
            rank: newRank
        };

        DataStore.set('users', users);

        return {
            totalProducts: newTotal,
            monthProducts: newMonth,
            rank: newRank,
            rankChanged,
            previousRank: advisor.rank
        };
    }

    /**
     * Registra transacciones en wallets
     */
    static recordTransactions(transactions, orderId) {
        const wallets = DataStore.get('wallets') || {};
        const allTransactions = DataStore.get('transactions') || [];
        const timestamp = new Date().toISOString();

        transactions.forEach(t => {
            // Actualizar wallet
            if (!wallets[t.toUserId]) {
                wallets[t.toUserId] = { balance: 0, history: [] };
            }
            wallets[t.toUserId].balance += t.amount;
            wallets[t.toUserId].history.push({
                id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                orderId,
                type: t.type,
                amount: t.amount,
                description: t.description,
                date: timestamp,
                fromAdvisorId: t.fromAdvisorId || null,
                productId: t.productId || null
            });

            // Registrar en historial global
            allTransactions.push({
                id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                orderId,
                type: t.type,
                amount: t.amount,
                description: t.description,
                toUserId: t.toUserId,
                fromAdvisorId: t.fromAdvisorId || null,
                date: timestamp
            });
        });

        DataStore.set('wallets', wallets);
        DataStore.set('transactions', allTransactions);
    }
}

export default CommissionEngine;
