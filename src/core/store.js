import { getRankByProducts, getRankById } from './constants.js';

class DataStore {
  _getCollection(name) {
    return JSON.parse(localStorage.getItem('tyango_' + name)) || [];
  }

  _setCollection(name, data) {
    localStorage.setItem('tyango_' + name, JSON.stringify(data));
  }

  _getObject(name) {
    return JSON.parse(localStorage.getItem('tyango_' + name)) || {};
  }

  _setObject(name, data) {
    localStorage.setItem('tyango_' + name, JSON.stringify(data));
  }

  _generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  // --- Users ---
  getUsers() {
    return this._getCollection('users');
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  }

  getUserByPin(pin) {
    return this.getUsers().find(u => u.pin === pin) || null;
  }

  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this._setCollection('users', users);
      return users[index];
    }
    return null;
  }

  addUser(userData) {
    const users = this.getUsers();
    const newUser = {
      ...userData,
      id: this._generateId('u'),
      totalProducts: 0,
      monthProducts: 0,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this._setCollection('users', users);
    return newUser;
  }

  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this._setCollection('users', users);
  }

  // --- Products ---
  getProducts() {
    return this._getCollection('products');
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  }

  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this._setCollection('products', products);
      return products[index];
    }
    return null;
  }

  addProduct(data) {
    const products = this.getProducts();
    const newProduct = {
      ...data,
      id: this._generateId('p')
    };
    products.push(newProduct);
    this._setCollection('products', products);
    return newProduct;
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this._setCollection('products', products);
  }

  // --- Orders ---
  getOrders() {
    return this._getCollection('orders');
  }

  getOrdersByUser(userId) {
    return this.getOrders().filter(o => o.userId === userId);
  }

  getOrdersThisMonth(userId = null) {
    const now = new Date();
    const orders = userId ? this.getOrdersByUser(userId) : this.getOrders();
    return orders.filter(o => {
      const d = new Date(o.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
  }

  addOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      ...orderData,
      id: this._generateId('o'),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    this._setCollection('orders', orders);
    return newOrder;
  }

  // --- Wallet ---
  getWallet(userId) {
    const wallets = this._getCollection('wallets');
    let wallet = wallets.find(w => w.userId === userId);
    if (!wallet) {
      wallet = { id: this._generateId('w'), userId, entries: [], balance: 0 };
      wallets.push(wallet);
      this._setCollection('wallets', wallets);
    }
    return wallet;
  }

  addWalletEntry(userId, entry) {
    const wallets = this._getCollection('wallets');
    const wallet = wallets.find(w => w.userId === userId);
    if (wallet) {
      entry.id = this._generateId('e');
      entry.date = entry.date || new Date().toISOString();
      wallet.entries.unshift(entry); // newest first
      wallet.balance = Number((wallet.balance + entry.amount).toFixed(2));
      this._setCollection('wallets', wallets);
    }
  }

  getWalletBalance(userId) {
    return this.getWallet(userId).balance;
  }

  creditMoney(userId, amount, description) {
    this.addWalletEntry(userId, { type: 'credit', amount: Number(amount), description });
  }

  // --- Settings ---
  getSettings() {
    return this._getObject('settings');
  }

  updateSettings(updates) {
    const current = this.getSettings();
    this._setObject('settings', { ...current, ...updates });
  }

  // --- CRITICAL: processOrder(orderData) ---
  processOrder(orderData) {
    // 1. Calculate total from items
    let itemsTotal = 0;
    let totalItemsQty = 0;
    
    // Compute totals and get product details
    const orderItems = orderData.items.map(item => {
      const product = this.getProductById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const qty = Number(item.qty);
      const subtotal = product.price * qty;
      itemsTotal += subtotal;
      totalItemsQty += qty;
      return { ...item, product, subtotal };
    });

    const total = itemsTotal + (orderData.shippingCharged ? Number(orderData.shippingAmount || 0) : 0);

    // 2 & 3. Save order
    const order = this.addOrder({
      ...orderData,
      total
    });

    // 4. Get the user (asesor)
    const asesor = this.getUserById(orderData.userId);
    if (!asesor) throw new Error(`User ${orderData.userId} not found`);

    // 5. Get the mentor (by user.mentorId)
    const mentor = asesor.mentorId ? this.getUserById(asesor.mentorId) : null;

    let totalAsesorCommission = 0;
    let totalMentorCommission = 0;

    // 6. Calculate commission per item
    orderItems.forEach(item => {
      const p = item.product;
      const qty = Number(item.qty);
      
      if (orderData.shippingCharged) {
        // Asesor gets NOTHING from product commission
        // Mentor gets the FULL product asesor commission + mentor commission for EACH unit
        totalMentorCommission += (p.commissions.asesor * qty);
        totalMentorCommission += (p.commissions.mentor * qty);
      } else {
        // Normal commissions
        totalAsesorCommission += (p.commissions.asesor * qty);
        totalMentorCommission += (p.commissions.mentor * qty);
      }
    });

    // 7. Shipping logic for asesor
    if (orderData.shippingCharged && Number(orderData.shippingAmount || 0) > 0) {
      this.addWalletEntry(asesor.id, {
        type: 'shipping',
        amount: Number(orderData.shippingAmount),
        description: `Env\u00edo cobrado pedido ${order.id}`
      });
    }

    // 8. Asesor commission wallet entry
    if (totalAsesorCommission > 0) {
      this.addWalletEntry(asesor.id, {
        type: 'commission',
        amount: totalAsesorCommission,
        description: `Comisiones pedido ${order.id}`
      });
    }

    // 9. Mentor commission wallet entry
    if (mentor && totalMentorCommission > 0) {
      this.addWalletEntry(mentor.id, {
        type: 'mentor_commission',
        amount: totalMentorCommission,
        description: `Regal\u00edas por asesor ${asesor.name} pedido ${order.id}`
      });
    }

    // 10 & 11. Update user products
    this.updateUser(asesor.id, {
      totalProducts: asesor.totalProducts + totalItemsQty,
      monthProducts: asesor.monthProducts + totalItemsQty
    });

    // 12. Check rank upgrade
    this.checkRankUpgrade(asesor.id);

    return order;
  }

  // --- calculateRank(totalProducts) ---
  calculateRank(totalProducts) {
    return getRankByProducts(totalProducts);
  }

  // --- checkRankUpgrade(userId) ---
  checkRankUpgrade(userId) {
    const user = this.getUserById(userId);
    if (!user) return;

    const currentRankObj = getRankById(user.rank);
    const newRankObj = this.calculateRank(user.totalProducts);

    if (currentRankObj.id !== newRankObj.id) {
      const updates = { rank: newRankObj.id };
      if (!user.cardCustom) {
        updates.cardType = newRankObj.card;
      }
      this.updateUser(userId, updates);
    }
  }

  // --- getUserStats(userId) ---
  getUserStats(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;

    const rankInfo = getRankById(user.rank);
    const wallet = this.getWallet(userId);
    
    // totalEarnings = sum of all positive entries
    const totalEarnings = wallet.entries
      .filter(e => e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0);

    // monthEarnings = sum of this month's positive entries
    const now = new Date();
    const monthEarnings = wallet.entries
      .filter(e => {
        if (e.amount <= 0) return false;
        const d = new Date(e.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const settings = this.getSettings();

    return {
      name: user.name,
      rank: rankInfo,
      cardType: user.cardType,
      cardCustom: user.cardCustom,
      totalProducts: user.totalProducts,
      monthProducts: user.monthProducts,
      totalEarnings,
      monthEarnings,
      walletBalance: wallet.balance,
      monthlyGoal: settings.monthlyGoal || 100
    };
  }

  // --- getTeamRanking() ---
  getTeamRanking() {
    const users = this.getUsers();
    
    return users.map(u => {
      const wallet = this.getWallet(u.id);
      const totalEarnings = wallet.entries
        .filter(e => e.amount > 0)
        .reduce((sum, e) => sum + e.amount, 0);
        
      return {
        id: u.id,
        name: u.name,
        rank: u.rank,
        cardType: u.cardType,
        totalProducts: u.totalProducts,
        totalEarnings
      };
    }).sort((a, b) => b.totalProducts - a.totalProducts);
  }

  // --- isInitialized() ---
  isInitialized() {
    return this.getUsers().length > 0;
  }

  // --- initialize(seedData) ---
  initialize(seedData) {
    if (!this.isInitialized()) {
      this._setCollection('users', seedData.users || []);
      this._setCollection('products', seedData.products || []);
      this._setObject('settings', seedData.settings || {});
      
      const users = this.getUsers();
      const wallets = users.map(u => ({
        id: this._generateId('w'),
        userId: u.id,
        entries: [],
        balance: 0
      }));
      this._setCollection('wallets', wallets);
    }
  }

  // --- reset() ---
  reset() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('tyango_')) {
        keys.push(key);
      }
    }
    keys.forEach(k => localStorage.removeItem(k));
  }
}

export const store = new DataStore();
