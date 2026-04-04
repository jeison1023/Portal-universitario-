// ============================================================================
// PORTAL UNIVERSITARIO - MAIN PRO
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    initAuth();
    renderLayout();
    initEvents();
    initTables();
    initForms();
}

// ============================================================================
// AUTH
// ============================================================================

function initAuth() {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        console.error('Error parsing user');
        logout();
    }

    if (!user && !window.location.pathname.includes('index.html')) {
        window.location.href = '/universidad/index.html';
        return;
    }

    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        el.textContent = user?.nombre || user?.username || 'Usuario';
    });
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// ============================================================================
// LAYOUT (SIDEBAR + HEADER)
// ============================================================================

function renderLayout() {
    renderSidebar();
    renderHeader();
}

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
                <a href="/universidad/dashboard.html" class="nav-item">Principal</a>
                <a href="/universidad/materias.html" class="nav-item">Materias</a>
                <a href="/universidad/calificaciones.html" class="nav-item">Calificaciones</a>
                <a href="/universidad/solicitudes.html" class="nav-item">Solicitudes</a>
                <a href="/universidad/perfil.html" class="nav-item">Perfil</a>
                <a href="#" id="logoutBtn" class="nav-item logout">Cerrar Sesión</a>
            </nav>
        </aside>
    `;
}

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

    // Sidebar toggle
    document.addEventListener('click', (e) => {
        if (e.target.closest('.menu-toggle')) {
            document.body.classList.toggle('sidebar-collapsed');
        }
    });

    // Logout
    document.addEventListener('click', (e) => {
        if (e.target.closest('#logoutBtn')) {
            e.preventDefault();
            logout();
        }
    });

    // Modal open
    document.addEventListener('click', (e) => {
        if (e.target.closest('#btnNuevaSolicitud')) {
            document.getElementById('modalSolicitud')?.classList.add('active');
        }
    });

    // Modal close
    document.addEventListener('click', (e) => {
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