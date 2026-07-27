// ============================================
// DataStore - Persistencia con localStorage
// ============================================

const PREFIX = 'tyango_';

export class DataStore {
    static get(key) {
        try {
            const data = localStorage.getItem(PREFIX + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('DataStore get error:', e);
            return null;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('DataStore set error:', e);
            return false;
        }
    }

    static remove(key) {
        localStorage.removeItem(PREFIX + key);
    }

    static clear() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
        keys.forEach(k => localStorage.removeItem(k));
    }

    static getAll() {
        const result = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(PREFIX)) {
                try {
                    result[key.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(key));
                } catch (e) {
                    result[key.replace(PREFIX, '')] = localStorage.getItem(key);
                }
            }
        }
        return result;
    }
}

export default DataStore;
