import { auth } from '../../core/auth.js';
import { router } from '../../router.js';
import { showNavbar, removeNavbar } from '../../components/navbar/navbar.js';
import { toastSuccess, toastError } from '../../components/toast/toast.js';

let pin = '';
const PIN_LENGTH = 4;

function updateDots(container) {
  const dots = container.querySelectorAll('.login-pin-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < pin.length);
    dot.classList.remove('error');
  });
}

function showError(container) {
  const dots = container.querySelectorAll('.login-pin-dot');
  dots.forEach(dot => {
    dot.classList.remove('filled');
    dot.classList.add('error');
  });
  
  const errorEl = container.querySelector('.login-error');
  if (errorEl) errorEl.textContent = 'PIN incorrecto';
  
  setTimeout(() => {
    dots.forEach(dot => dot.classList.remove('error'));
    if (errorEl) errorEl.textContent = '';
  }, 1000);
}

function handleKeyPress(key, container) {
  if (key === 'delete') {
    pin = pin.slice(0, -1);
    updateDots(container);
    return;
  }
  
  if (pin.length >= PIN_LENGTH) return;
  
  pin += key;
  updateDots(container);
  
  if (pin.length === PIN_LENGTH) {
    // Attempt login after a brief delay for visual feedback
    setTimeout(() => {
      const user = auth.login(pin);
      if (user) {
        toastSuccess(`Bienvenido, ${user.name}`);
        showNavbar();
        router.navigate('home');
      } else {
        toastError('PIN incorrecto');
        showError(container);
        pin = '';
      }
    }, 200);
  }
}

export function renderLogin(container) {
  // Reset state
  pin = '';
  removeNavbar();
  auth.logout();
  
  container.innerHTML = `
    <div class="login-page">
      <div class="login-container">
        <div class="login-brand">
          <div class="login-logo">T</div>
          <h1 class="login-title">TYANGO</h1>
          <p class="login-subtitle">Staff Portal</p>
        </div>
        
        <div class="login-pin-area">
          <span class="login-pin-label">Ingresa tu PIN</span>
          
          <div class="login-pin-dots">
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
          </div>
          
          <p class="login-error"></p>
          
          <div class="login-keypad">
            <button class="login-key" data-key="1">1</button>
            <button class="login-key" data-key="2">2</button>
            <button class="login-key" data-key="3">3</button>
            <button class="login-key" data-key="4">4</button>
            <button class="login-key" data-key="5">5</button>
            <button class="login-key" data-key="6">6</button>
            <button class="login-key" data-key="7">7</button>
            <button class="login-key" data-key="8">8</button>
            <button class="login-key" data-key="9">9</button>
            <div class="login-key login-key-empty"></div>
            <button class="login-key" data-key="0">0</button>
            <button class="login-key login-key-delete" data-key="delete">⌫</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Event delegation for keypad
  const keypad = container.querySelector('.login-keypad');
  keypad.addEventListener('click', (e) => {
    const key = e.target.closest('.login-key');
    if (key && key.dataset.key) {
      handleKeyPress(key.dataset.key, container);
    }
  });
  
  // Also listen for physical keyboard
  const keyHandler = (e) => {
    if (router.getCurrentRoute() !== 'login') {
      document.removeEventListener('keydown', keyHandler);
      return;
    }
    if (e.key >= '0' && e.key <= '9') {
      handleKeyPress(e.key, container);
    } else if (e.key === 'Backspace') {
      handleKeyPress('delete', container);
    }
  };
  document.addEventListener('keydown', keyHandler);
}
