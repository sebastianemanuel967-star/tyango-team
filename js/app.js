// ============================================
// TYANGO STAFF v2 - Aplicacion Principal
// ============================================

import DataStore from './services/datastore.js';
import { initData } from './services/initData.js';
import AuthService from './services/auth.js';
import { renderNavbar, hideNavbar } from './components/navbar.js';

// Pages
import { renderLogin, initLogin } from './modules/login.js';
import { renderHome, initHome } from './modules/home.js';
import { renderOrder, initOrder } from './modules/order.js';
import { renderWallet, initWallet } from './modules/wallet.js';
import { renderProgress, initProgress } from './modules/progress.js';
import { renderRanking, initRanking } from './modules/ranking.js';
import { renderAdmin, initAdmin } from './modules/admin.js';

// Inicializar datos
initData();

// Router
const ROUTES = {
    '#/login': { render: renderLogin, init: initLogin, public: true },
    '#/home': { render: renderHome, init: initHome },
    '#/order': { render: renderOrder, init: initOrder },
    '#/wallet': { render: renderWallet, init: initWallet },
    '#/progress': { render: renderProgress, init: initProgress },
    '#/ranking': { render: renderRanking, init: initRanking },
    '#/admin': { render: renderAdmin, init: initAdmin }
};

function navigate() {
    const hash = window.location.hash || '#/login';
    const route = ROUTES[hash];
    const mainContent = document.getElementById('main-content');

    if (!route) {
        window.location.hash = '#/login';
        return;
    }

    // Proteccion de rutas
    if (!route.public && !AuthService.isAuthenticated()) {
        window.location.hash = '#/login';
        return;
    }

    // Renderizar pagina
    mainContent.innerHTML = route.render();

    // Navbar
    if (route.public) {
        hideNavbar();
    } else {
        renderNavbar();
    }

    // Inicializar pagina
    if (route.init) {
        setTimeout(() => route.init(), 0);
    }

    // Scroll top
    mainContent.scrollTop = 0;
}

// Event listeners
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);

// Prevenir zoom en inputs (iOS)
document.addEventListener('gesturestart', (e) => e.preventDefault());

console.log('🥭 TYANGO STAFF v2 cargado');
