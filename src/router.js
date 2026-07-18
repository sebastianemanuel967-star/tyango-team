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
    const hash = window.location.hash.slice(2) || 'login'; // Remove '#/'
    this.currentRoute = hash;
    
    if (!this.appElement) {
      this.appElement = document.getElementById('app');
    }
    
    const handler = this.routes.get(hash);
    if (handler) {
      // Add fade transition
      this.appElement.style.opacity = '0';
      this.appElement.style.transform = 'translateY(5px)';
      
      setTimeout(() => {
        handler(this.appElement);
        requestAnimationFrame(() => {
          this.appElement.style.transition = 'opacity 200ms ease, transform 200ms ease';
          this.appElement.style.opacity = '1';
          this.appElement.style.transform = 'translateY(0)';
        });
      }, 150);
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
