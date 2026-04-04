// ============================================================================
// PORTAL UNIVERSITARIO - MAIN PRO (AUTO LOGIN CONTROLADO)
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);

// ============================================================================
// INIT
// ============================================================================

function initApp() {
    autoLogin();     // 🔥 manejar login automático
    initAuth();      // 🔥 validar sesión
    renderLayout();
    initEvents();
    initTables();
    initForms();
}

// ============================================================================
// AUTO LOGIN (SOLO EN INDEX)
// ============================================================================

function autoLogin() {
    const isLoginPage = window.location.pathname.includes('index.html');

    if (!isLoginPage) return;

    const existingUser = localStorage.getItem('user');

    // 🔥 si ya hay usuario → ir directo
    if (existingUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    // 🔥 crear usuario automático
    const user = {
        nombre: "Luis",
        username: "luis"
    };

    localStorage.setItem('user', JSON.stringify(user));

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// ============================================================================
// AUTH
// ============================================================================

function initAuth() {
    const isLoginPage = window.location.pathname.includes('index.html');

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        console.error('Error parsing user');
        logout();
    }

    // 🔥 proteger páginas
    if (!user && !isLoginPage) {
        window.location.href = 'index.html';
        return;
    }

    // 🔥 mostrar nombre
    document.querySelectorAll('#userName').forEach(el => {
        el.textContent = user?.nombre || user?.username || 'Usuario';
    });
}

// ============================================================================
// LOGOUT
// ============================================================================

function logout() {
    localStorage.removeItem('user');

    window.location.href = 'index.html';
}

// ============================================================================
// LAYOUT
// ============================================================================

function renderLayout() {
    renderSidebar();
    renderHeader();
}

// Sidebar dinámico
function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <i class="fas fa-graduation-cap"></i>
                <span>Portal UN</span>
            </div>

            <nav class="sidebar-nav">
                <a href="dashboard.html" class="nav-item">Dashboard</a>
                <a href="materias.html" class="nav-item">Materias</a>
                <a href="calificaciones.html" class="nav-item">Calificaciones</a>
                <a href="solicitudes.html" class="nav-item">Solicitudes</a>
                <a href="perfil.html" class="nav-item">Perfil</a>
                <a href="#" id="logoutBtn" class="nav-item logout">Cerrar Sesión</a>
            </nav>
        </aside>
    `;
}

// Header dinámico
function renderHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    header.innerHTML = `
        <header class="header">
            <div class="header-left">
                <button class="menu-toggle"><i class="fas fa-bars"></i></button>
                <h1>${document.title}</h1>
            </div>

            <div class="header-right">
                <span id="userName" class="user-name"></span>
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        </header>
    `;
}

// ============================================================================
// EVENTOS
// ============================================================================

function initEvents() {

    document.addEventListener('click', (e) => {

        // Sidebar
        if (e.target.closest('.menu-toggle')) {
            document.body.classList.toggle('sidebar-collapsed');
        }

        // Logout
        if (e.target.closest('#logoutBtn')) {
            e.preventDefault();
            logout();
        }

        // Modal abrir
        if (e.target.closest('#btnNuevaSolicitud')) {
            document.getElementById('modalSolicitud')?.classList.add('active');
        }

        // Modal cerrar
        if (e.target.closest('#closeModal') || e.target.classList.contains('modal')) {
            document.querySelector('.modal')?.classList.remove('active');
        }

    });
}

// ============================================================================
// TABLAS
// ============================================================================

function initTables() {
    document.querySelectorAll('th').forEach((header, index) => {
        header.addEventListener('click', () => {
            const table = header.closest('table');
            sortTable(table, index);
        });
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const A = a.children[columnIndex].innerText;
        const B = b.children[columnIndex].innerText;
        return A.localeCompare(B, undefined, { numeric: true });
    });

    tbody.append(...rows);
}

// ============================================================================
// FORMULARIOS
// ============================================================================

function initForms() {
    document.addEventListener('submit', (e) => {

        if (e.target.id === 'formSolicitud') {
            e.preventDefault();

            showNotification('Solicitud enviada correctamente', 'success');

            document.querySelector('.modal')?.classList.remove('active');
            e.target.reset();
        }

    });
}

// ============================================================================
// NOTIFICACIONES
// ============================================================================

function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification show ${type}`;
    notif.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;

    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 3000);
}