import { store } from './store.js';

class Auth {
  constructor() {
    this._currentUser = null;
    this._loadSession();
  }
  
  _loadSession() {
    const userId = sessionStorage.getItem('tyango_session');
    if (userId) {
      this._currentUser = store.getUserById(userId);
      if (!this._currentUser) sessionStorage.removeItem('tyango_session');
    }
  }
  
  _saveSession(user) {
    sessionStorage.setItem('tyango_session', user.id);
  }
  
  login(pin) {
    const user = store.getUserByPin(pin);
    if (user) {
      this._currentUser = user;
      this._saveSession(user);
      return user;
    }
    return null;
  }
  
  logout() {
    this._currentUser = null;
    sessionStorage.removeItem('tyango_session');
  }
  
  getCurrentUser() {
    if (this._currentUser) {
      // Refresh from store to get latest data
      this._currentUser = store.getUserById(this._currentUser.id);
    }
    return this._currentUser;
  }
  
  isLoggedIn() { return !!this.getCurrentUser(); }
  isAdmin() { return this.getCurrentUser()?.role === 'admin'; }
}

export const auth = new Auth();
