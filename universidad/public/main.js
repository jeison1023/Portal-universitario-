// ============================================================================
// PORTAL UNIVERSITARIO - MAIN FIX PRO
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    initLogin();
    initAuth();
    renderLayout();
    initEvents();
    initDashboard();
    initProfile();
}

// ============================================================================
// LOGIN
// ============================================================================
function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        if (!username) return shakeError(form);

        const user = generarUsuarioCompleto(username);
        localStorage.setItem('user', JSON.stringify(user));

        showLoading(true);
        await sleep(1000);
        window.location.href = 'dashboard.html';
    });
}

function shakeError(el) {
    el.style.animation = 'shake 0.5s';
    setTimeout(() => el.style.animation = '', 500);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ============================================================================
// USER
// ============================================================================
function generarUsuarioCompleto(username) {
    return {
        nombreCompleto: "Usuario " + username,
        username,
        promedio: (8 + Math.random()).toFixed(2),
        creditos: 20,
        semestre: 5
    };
}

// ============================================================================
// AUTH
// ============================================================================
function initAuth() {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch {
        logout();
    }

    const isLogin = location.pathname.includes('index.html');

    if (!user && !isLogin) {
        location.href = 'index.html';
        return;
    }

    if (user) updateUserUI(user);
}

function logout() {
    localStorage.removeItem('user');
    location.href = 'index.html';
}

// ============================================================================
// UI USER
// ============================================================================
function updateUserUI(user) {
    document.querySelectorAll('#userName').forEach(el => {
        el.textContent = user.nombreCompleto;
    });

    const avatar = document.querySelector('.user-avatar');
    if (avatar) {
        avatar.textContent = user.nombreCompleto[0];
    }
}

// ============================================================================
// LAYOUT
// ============================================================================
function renderLayout() {
    renderSidebar();
    renderHeader();
}

function renderSidebar() {
    const el = document.getElementById('sidebar');
    if (!el) return;

    el.innerHTML = `
        <aside class="sidebar">
            <a href="dashboard.html" class="nav-item">Dashboard</a>
            <a href="perfil.html" class="nav-item">Perfil</a>
            <a href="#" id="logoutBtn" class="nav-item">Salir</a>
        </aside>
    `;
}

function renderHeader() {
    const el = document.getElementById('header');
    if (!el) return;

    el.innerHTML = `
        <header class="header">
            <h1>Portal Universitario</h1>
            <span id="userName"></span>
        </header>
    `;
}

// ============================================================================
// EVENTOS
// ============================================================================
function initEvents() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('#logoutBtn')) {
            e.preventDefault();
            logout();
        }
    });

    window.addEventListener('resize', debounce(() => {
        console.log('resize');
    }, 300));
}

function debounce(fn, delay) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

// ============================================================================
// DASHBOARD
// ============================================================================
function initDashboard() {
    if (!location.pathname.includes('dashboard')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const el = document.getElementById('dashPromedio');
    if (el) el.textContent = user.promedio;
}

// ============================================================================
// PROFILE
// ============================================================================
function initProfile() {
    if (!location.pathname.includes('perfil')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const el = document.getElementById('nombreCompleto');
    if (el) el.textContent = user.nombreCompleto;
}

// ============================================================================
// LOADING
// ============================================================================
function showLoading(show) {
    let el = document.getElementById('loading');

    if (!el) {
        el = document.createElement('div');
        el.id = 'loading';
        el.innerHTML = 'Cargando...';
        document.body.appendChild(el);
    }

    el.style.display = show ? 'block' : 'none';
}