// ============================================
// AuthService - Autenticación y Control de Sesión
// ============================================

import DataStore from './datastore.js';

const SESSION_KEY = 'session';

export class AuthService {
    static getCurrentUser() {
        return DataStore.get(SESSION_KEY);
    }

    static isAuthenticated() {
        return !!this.getCurrentUser();
    }

    static getRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }

    static isAdmin() {
        return this.getRole() === 'admin';
    }

    static isAsesor() {
        return this.getRole() === 'asesor';
    }

    static login(pin) {
        const users = DataStore.get('users') || [];
        const user = users.find(u => u.pin === pin);

        if (!user) {
            return { success: false, error: 'PIN incorrecto' };
        }

        if (!user.active) {
            return { success: false, error: 'Usuario inactivo' };
        }

        const session = {
            id: user.id,
            name: user.name,
            role: user.role,
            rank: user.rank,
            mentorId: user.mentorId || null,
            loginAt: new Date().toISOString()
        };

        DataStore.set(SESSION_KEY, session);
        return { success: true, user: session };
    }

    static logout() {
        DataStore.remove(SESSION_KEY);
        window.location.hash = '#/login';
    }

    static getUserData() {
        const session = this.getCurrentUser();
        if (!session) return null;

        const users = DataStore.get('users') || [];
        return users.find(u => u.id === session.id) || null;
    }

    static updateSession(updates) {
        const session = this.getCurrentUser();
        if (!session) return false;

        const updated = { ...session, ...updates };
        DataStore.set(SESSION_KEY, updated);
        return true;
    }
}

export default AuthService;
