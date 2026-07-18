let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {'success'|'error'|'info'|'warning'} type - Toast type
 * @param {number} duration - Duration in ms (default 3000)
 */
export function toast(message, type = 'info', duration = 3000) {
  const c = getContainer();
  
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    <span class="toast-icon">${ICONS[type] || ''}</span>
    <span class="toast-message">${message}</span>
  `;
  
  c.appendChild(el);
  
  setTimeout(() => {
    el.classList.add('toast-exit');
    el.addEventListener('animationend', () => el.remove());
  }, duration);
}

export function toastSuccess(message, duration) { toast(message, 'success', duration); }
export function toastError(message, duration) { toast(message, 'error', duration); }
export function toastInfo(message, duration) { toast(message, 'info', duration); }
export function toastWarning(message, duration) { toast(message, 'warning', duration); }
