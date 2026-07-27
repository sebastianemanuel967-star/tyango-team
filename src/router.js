class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.appElement = null;
    window.addEventListener('hashchange', () => this._handleRoute());
  }
  
  register(path, handler) {
    this.routes.set(path, handler);
  }
  
  navigate(path) {
    window.location.hash = '#/' + path;
  }
  
  _handleRoute() {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const hash = rawHash || 'login';
    this.currentRoute = hash;
    
    if (!this.appElement) {
      this.appElement = document.getElementById('app');
    }
    
    if (!this.appElement) return;

    const handler = this.routes.get(hash);
    if (handler) {
      this.appElement.style.opacity = '1';
      this.appElement.style.transform = 'none';
      handler(this.appElement);
    } else {
      this.navigate('login');
    }
  }
  
  getCurrentRoute() { return this.currentRoute; }
  
  start() {
    this._handleRoute();
  }
}

export const router = new Router();
