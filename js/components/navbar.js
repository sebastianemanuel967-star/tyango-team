// ============================================
// Navbar - Barra de navegacion inferior
// ============================================

import AuthService from '../services/auth.js';

const NAV_ITEMS_ASESOR = [
    { path: '#/home', icon: '⌂', label: 'Inicio' },
    { path: '#/wallet', icon: '💳', label: 'Cartera' },
    { path: '#/progress', icon: '⭐', label: 'Progreso' },
    { path: '#/ranking', icon: '🏆', label: 'Ranking' }
];

const NAV_ITEMS_ADMIN = [
    { path: '#/home', icon: '⌂', label: 'Inicio' },
    { path: '#/wallet', icon: '💳', label: 'Cartera' },
    { path: '#/ranking', icon: '🏆', label: 'Ranking' },
    { path: '#/admin', icon: '⚙️', label: 'Admin' }
];

export function renderNavbar() {
    const nav = document.getElementById('bottom-nav');
    if (!nav) return;

    const isAdmin = AuthService.isAdmin();
    const items = isAdmin ? NAV_ITEMS_ADMIN : NAV_ITEMS_ASESOR;
    const currentHash = window.location.hash || '#/home';

    nav.innerHTML = items.map(item => `
        <a href="${item.path}" class="nav-item ${currentHash === item.path ? 'active' : ''}" data-path="${item.path}">
            <span class="nav-icon">${item.icon}</span>
            <span>${item.label}</span>
        </a>
    `).join('');

    nav.classList.remove('hidden');
}

export function hideNavbar() {
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.classList.add('hidden');
}

export default { renderNavbar, hideNavbar };
