// ============================================================================
// PORTAL UNIVERSITARIO - MAIN.JS (CORREGIDO PARA RENDER)
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// ============================================================================
// INIT
// ============================================================================

function initApp() {
    initSidebar();
    initModals();
    initTables();
    initStats();
    initForms();
    loadUserData();
}

// ============================================================================
// AUTENTICACIÓN Y USUARIO
// ============================================================================

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // ✅ CORRECCIÓN: redirección relativa
        const current = window.location.pathname;

        if (!current.includes('index.html')) {
            window.location.href = '../index.html';
        }
        return;
    }

    const userNameElements = document.querySelectorAll('#userName');

    userNameElements.forEach(el => {
        el.textContent = user.nombre || user.username;
    });

    updateDashboardStats(user);
}

function updateDashboardStats(user) {
    if (!user) return;

    const stats = {
        totalMaterias: user.materias?.length || 6,
        promedio: user.promedio || 4.2,
        solicitudes: user.solicitudesPendientes || 3
    };

    const statElements = {
        totalMaterias: document.getElementById('totalMaterias'),
        promedio: document.getElementById('promedio'),
        solicitudes: document.getElementById('solicitudes')
    };

    Object.keys(statElements).forEach(key => {
        if (statElements[key]) {
            statElements[key].textContent = stats[key];
        }
    });
}

function logout() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('user');

        // ✅ CORRECCIÓN
        window.location.href = '../index.html';
    }
}

// ============================================================================
// SIDEBAR
// ============================================================================

function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');

    if (!menuToggle) return;

    menuToggle.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
    });
}

// ============================================================================
// MODALES
// ============================================================================

function initModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
}

function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    if (modal) modal.style.display = 'none';
}

// ============================================================================
// TABLAS
// ============================================================================

function initTables() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const headers = table.querySelectorAll('th');

        headers.forEach((header, index) => {
            header.addEventListener('click', () => sortTable(table, index));
        });
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.reverse();
    tbody.append(...rows);
}

// ============================================================================
// STATS
// ============================================================================

function initStats() {
    const statNumbers = document.querySelectorAll('[id*="total"], [id*="promedio"], [id*="solicitudes"]');

    statNumbers.forEach(el => animateCounter(el));
}

function animateCounter(element) {
    const target = parseFloat(element.textContent);
    let current = 0;

    const timer = setInterval(() => {
        current += target / 20;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = current.toFixed(1);
    }, 30);
}

// ============================================================================
// FORMULARIOS
// ============================================================================

function initForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    alert('Solicitud enviada correctamente');

    const modal = e.target.closest('.modal');
    if (modal) closeModal(modal);

    e.target.reset();
}

// ============================================================================
// UTILIDADES
// ============================================================================

async function loadDemoData() {
    try {
        // ✅ CORRECCIÓN RUTA
        const response = await fetch('../data/usuarios.json');

        if (response.ok) {
            return await response.json();
        }

    } catch (error) {
        console.log('Error cargando usuarios');
    }

    return [];
}

// ============================================================================
// SERVICE WORKER (DESACTIVADO EN RENDER SI NO EXISTE)
// ============================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch(() => {});
    });
}