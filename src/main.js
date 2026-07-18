import { store } from './core/store.js';
import { seedDatabase } from './core/seed.js';
import { auth } from './core/auth.js';
import { router } from './router.js';
import { ROUTES } from './core/constants.js';

// Module imports
import { renderLogin } from './modules/login/login.js';
import { renderHome } from './modules/home/home.js';
import { renderOrder } from './modules/order/order.js';
import { renderWallet } from './modules/wallet/wallet.js';
import { renderProgress } from './modules/progress/progress.js';
import { renderRanking } from './modules/ranking/ranking.js';
import { renderAdmin } from './modules/admin/admin.js';
import { showNavbar, updateNavbar } from './components/navbar/navbar.js';

// Initialize database
seedDatabase();

// Register all routes
router.register(ROUTES.LOGIN, renderLogin);
router.register(ROUTES.HOME, renderHome);
router.register(ROUTES.ORDER, renderOrder);
router.register(ROUTES.WALLET, renderWallet);
router.register(ROUTES.PROGRESS, renderProgress);
router.register(ROUTES.RANKING, renderRanking);
router.register(ROUTES.ADMIN, renderAdmin);

// Start router
router.start();
