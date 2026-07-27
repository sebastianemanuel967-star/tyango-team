// ============================================
// Login Page - Autenticacion con PIN
// ============================================

import AuthService from '../services/auth.js';
import { showError } from '../components/toast.js';
import { hideNavbar } from '../components/navbar.js';

let pin = '';

export function renderLogin() {
    hideNavbar();
    pin = '';

    return `
        <div class="page" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:var(--space-xl);">
            <div style="text-align:center;margin-bottom:var(--space-2xl);">
                <div style="font-size:3rem;margin-bottom:var(--space-md);">🥭</div>
                <h1 style="font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:var(--space-xs);">TYANGO</h1>
                <p style="color:var(--text-muted);font-size:0.9375rem;">STAFF v2</p>
            </div>

            <div style="width:100%;max-width:320px;">
                <div class="pin-display" id="pin-display">
                    <div class="pin-dot"></div>
                    <div class="pin-dot"></div>
                    <div class="pin-dot"></div>
                    <div class="pin-dot"></div>
                </div>

                <div class="pin-keyboard" id="pin-keyboard">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `
                        <button class="pin-key" data-digit="${n}">${n}</button>
                    `).join('')}
                    <div></div>
                    <button class="pin-key" data-digit="0">0</button>
                    <button class="pin-key pin-key-backspace" data-action="backspace">⌫</button>
                </div>
            </div>

            <p style="margin-top:var(--space-xl);color:var(--text-muted);font-size:0.8125rem;text-align:center;">
                Ingresa tu PIN de 4 digitos
            </p>
        </div>
    `;
}

export function initLogin() {
    const keyboard = document.getElementById('pin-keyboard');
    const display = document.getElementById('pin-display');

    if (!keyboard) return;

    keyboard.addEventListener('click', (e) => {
        const key = e.target.closest('.pin-key');
        if (!key) return;

        const action = key.dataset.action;

        if (action === 'backspace') {
            pin = pin.slice(0, -1);
        } else if (pin.length < 4) {
            pin += key.dataset.digit;
        }

        updatePinDisplay(display);

        if (pin.length === 4) {
            setTimeout(() => attemptLogin(), 200);
        }
    });
}

function updatePinDisplay(display) {
    const dots = display.querySelectorAll('.pin-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('filled', i < pin.length);
    });
}

function attemptLogin() {
    const display = document.getElementById('pin-display');
    const result = AuthService.login(pin);

    if (result.success) {
        window.location.hash = '#/home';
    } else {
        pin = '';
        updatePinDisplay(display);

        display.classList.add('animate-shake');
        setTimeout(() => display.classList.remove('animate-shake'), 500);

        showError(result.error);
    }
}

export default { renderLogin, initLogin };
