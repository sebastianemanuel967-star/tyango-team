import { router } from '../../router.js';
import { auth } from '../../core/auth.js';
import { ROUTES } from '../../core/constants.js';

const NAV_ITEMS_ASESOR = [
  { route: ROUTES.HOME, icon: '⌂', label: 'Inicio' },
  { route: ROUTES.WALLET, icon: '💳', label: 'Cartera' },
  { route: ROUTES.PROGRESS, icon: '⭐', label: 'Progreso' },
  { route: ROUTES.RANKING, icon: '🏆', label: 'Ranking' },
];

const NAV_ITEMS_ADMIN = [
  { route: ROUTES.HOME, icon: '⌂', label: 'Inicio' },
  { route: ROUTES.WALLET, icon: '💳', label: 'Cartera' },
  { route: ROUTES.RANKING, icon: '🏆', label: 'Ranking' },
  { route: ROUTES.ADMIN, icon: '⚙️', label: 'Admin' },
];

/**
 * Renders the bottom navbar and appends it to body.
 * Call this after login, remove on logout.
 */
export function showNavbar() {
  removeNavbar();
  
  const items = auth.isAdmin() ? NAV_ITEMS_ADMIN : NAV_ITEMS_ASESOR;
  const currentRoute = router.getCurrentRoute();
  
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';
  nav.innerHTML = `
    <div class="navbar-inner">
      ${items.map(item => `
        <button class="navbar-item ${currentRoute === item.route ? 'active' : ''}" 
                data-route="${item.route}"
                aria-label="${item.label}">
          <span class="navbar-item-icon">${item.icon}</span>
          <span class="navbar-item-label">${item.label}</span>
        </button>
      `).join('')}
    </div>
  `;
  
  // Event delegation
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.navbar-item');
    if (btn) {
      const route = btn.dataset.route;
      router.navigate(route);
      // Update active state
      nav.querySelectorAll('.navbar-item').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
    }
  });
  
  document.body.appendChild(nav);
}

/**
 * Removes the navbar from the DOM.
 */
export function removeNavbar() {
  const existing = document.getElementById('main-navbar');
  if (existing) existing.remove();
}

/**
 * Updates the active state of navbar items based on current route.
 */
export function updateNavbar() {
  const nav = document.getElementById('main-navbar');
  if (!nav) return;
  
  const currentRoute = router.getCurrentRoute();
  nav.querySelectorAll('.navbar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.route === currentRoute);
  });
}
