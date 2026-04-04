// ============================================================================
// PORTAL UNIVERSITARIO - MAIN PRO (COMPLETO SIN BACKEND)
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);

// ============================================================================
// INIT
// ============================================================================

function initApp() {
    initLogin();        // 🔥 LOGIN DESDE FORM
    initAuth();         // 🔥 validar sesión
    renderLayout();
    initEvents();
    initTables();
    initForms();
    initProfile();      // 🔥 PERFIL ESTUDIANTE
    initHistorial();    // 🔥 HISTORIAL ACADÉMICO
    initDashboard();    // 🔥 DASHBOARD
}

// ============================================================================
// LOGIN (ACEPTA TODO)
// ============================================================================

function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();

        if (!username) {
            alert('Ingresa un usuario');
            return;
        }

        // 🔥 USUARIO DINÁMICO COMPLETO
        const user = generarUsuarioCompleto(username);
        localStorage.setItem('user', JSON.stringify(user));

        showLoading(true);

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    });
}

// ============================================================================
// USUARIOS FALSOS (SIN BACKEND)
// ============================================================================

function generarUsuarioCompleto(username) {
    const codigos = ['2023001', '2023002', '2023003', '2024001'];
    const programas = ['Ingeniería de Sistemas', 'Ingeniería Civil', 'Medicina', 'Derecho'];
    
    const codigo = codigos[Math.floor(Math.random() * codigos.length)];
    
    return {
        nombreCompleto: `${username.charAt(0).toUpperCase() + username.slice(1)} Pérez`,
        codigo: codigo,
        username: codigo,
        correoInstitucional: `${codigo}@universidad.edu.co`,
        programa: programas[Math.floor(Math.random() * programas.length)],
        semestre: Math.floor(Math.random() * 10) + 1,
        promedio: (Math.random() * 2 + 8).toFixed(2),
        creditos: Math.floor(Math.random() * 20) + 15,
        fechaNacimiento: '15/03/2002',
        telefono: '+57 300 123 4567',
        foto: null
    };
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
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

    // 🔥 mostrar nombre en toda la app
    document.querySelectorAll('#userName, [data-user="name"]').forEach(el => {
        el.textContent = user?.nombreCompleto || user?.username || 'Usuario';
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
                <a href="dashboard.html" class="nav-item ${window.location.pathname.includes('dashboard') ? 'active' : ''}">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a href="materias.html" class="nav-item ${window.location.pathname.includes('materias') ? 'active' : ''}">
                    <i class="fas fa-book"></i> Materias
                </a>
                <a href="calificaciones.html" class="nav-item ${window.location.pathname.includes('calificaciones') ? 'active' : ''}">
                    <i class="fas fa-chart-line"></i> Calificaciones
                </a>
                <a href="historial.html" class="nav-item ${window.location.pathname.includes('historial') ? 'active' : ''}">
                    <i class="fas fa-history"></i> Historial
                </a>
                <a href="perfil.html" class="nav-item ${window.location.pathname.includes('perfil') ? 'active' : ''}">
                    <i class="fas fa-user"></i> Perfil
                </a>
                <a href="solicitudes.html" class="nav-item">
                    <i class="fas fa-file-alt"></i> Solicitudes
                </a>
                <a href="#" id="logoutBtn" class="nav-item logout">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </a>
            </nav>
        </aside>
    `;
}

function renderHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const pageTitle = document.title.replace(' | Portal Universitario', '');
    
    header.innerHTML = `
        <header class="header">
            <div class="header-left">
                <button class="menu-toggle"><i class="fas fa-bars"></i></button>
                <h1>${pageTitle}</h1>
            </div>

            <div class="header-right">
                <span id="userName" class="user-name" data-user="name"></span>
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        </header>
    `;
}

// ============================================================================
// EVENTOS GLOBALES
// ============================================================================

function initEvents() {
    document.addEventListener('click', (e) => {
        // Menu toggle
        if (e.target.closest('.menu-toggle')) {
            document.body.classList.toggle('sidebar-collapsed');
        }

        // Logout
        if (e.target.closest('#logoutBtn')) {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                logout();
            }
        }

        // Modales
        if (e.target.closest('#btnNuevaSolicitud')) {
            document.getElementById('modalSolicitud')?.classList.add('active');
        }

        if (e.target.closest('#closeModal') || e.target.classList.contains('modal')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }

        // Foto perfil
        if (e.target.id === 'fotoInput') {
            handleFotoPerfil(e.target.files[0]);
        }
    });
}

// ============================================================================
// PERFIL ESTUDIANTE
// ============================================================================

function initProfile() {
    const perfilPage = window.location.pathname.includes('perfil.html');
    if (!perfilPage) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Llenar todos los datos del perfil
    const campos = {
        'nombreCompleto': user.nombreCompleto,
        'codigoEstudiantil': user.codigo,
        'usuario': user.username,
        'correoInstitucional': user.correoInstitucional,
        'programaAcademico': user.programa,
        'semestreActual': `${user.semestre}° Semestre`,
        'promedioGeneral': user.promedio,
        'creditosMatriculados': user.creditos,
        'nombre': user.nombreCompleto.split(' ')[0],
        'correoPersonal': user.correoInstitucional
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    });

    // Foto de perfil
    const fotoPerfil = document.getElementById('fotoPerfil');
    if (fotoPerfil) {
        fotoPerfil.src = user.foto || '/public/images/default-avatar.jpg';
    }
}

function handleFotoPerfil(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('fotoPerfil');
        if (img) {
            img.src = e.target.result;
            
            const user = JSON.parse(localStorage.getItem('user'));
            user.foto = e.target.result;
            localStorage.setItem('user', JSON.stringify(user));
        }
    };
    reader.readAsDataURL(file);
}

// ============================================================================
// HISTORIAL ACADÉMICO
// ============================================================================

function initHistorial() {
    const historialPage = window.location.pathname.includes('historial.html');
    if (!historialPage) return;

    renderizarHistorialAcademico();
}

function renderizarHistorialAcademico() {
    const container = document.getElementById('historialContainer');
    if (!container) return;

    const historial = generarHistorialFalso();
    
    // Estadísticas
    document.getElementById('promedioGeneral').textContent = historial.promedioGeneral;
    document.getElementById('creditosAprobados').textContent = historial.creditosAprobados;
    document.getElementById('materiasAprobadas').textContent = historial.materiasAprobadas;
    document.getElementById('materiasReprobadas').textContent = historial.materiasReprobadas;

    // Renderizar periodos
    container.innerHTML = historial.periodos.map(periodo => `
        <div class="periodo-section" data-periodo="${periodo.codigo}">
            <div class="periodo-header">
                <h4>${periodo.codigo} <span class="periodo-promedio">${periodo.promedio}</span></h4>
                <div class="periodo-status ${periodo.estado === 'Aprobado' ? 'aprobado' : 'reprobado'}">
                    <i class="fas fa-${periodo.estado === 'Aprobado' ? 'check-circle' : 'times-circle'}"></i> 
                    ${periodo.estado}
                </div>
            </div>
            <div class="materias-list">
                ${periodo.materias.map(materia => `
                    <div class="materia-item ${materia.estado.toLowerCase().replace(' ', '-')}" data-estado="${materia.estado}">
                        <div class="materia-info">
                            <strong>${materia.nombre}</strong>
                            <span class="creditos">${materia.creditos} cr</span>
                        </div>
                        <div class="materia-calificacion ${materia.estado === 'En curso' ? 'parcial' : ''}">
                            ${materia.estado === 'En curso' ? `Parcial: ${materia.calificacion}` : materia.calificacion}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function generarHistorialFalso() {
    return {
        promedioGeneral: '8.45',
        creditosAprobados: '156',
        materiasAprobadas: '42',
        materiasReprobadas: '3',
        periodos: [
            {
                codigo: '2024-I',
                promedio: '8.5',
                estado: 'Aprobado',
                materias: [
                    { nombre: 'Matemáticas Avanzadas I', creditos: 4, calificacion: '9.2', estado: 'Aprobada' },
                    { nombre: 'Programación OO', creditos: 4, calificacion: '8.7', estado: 'Aprobada' },
                    { nombre: 'Bases de Datos II', creditos: 3, calificacion: '8.0', estado: 'En curso' }
                ]
            },
            {
                codigo: '2023-II',
                promedio: '8.3',
                estado: 'Aprobado',
                materias: [
                    { nombre: 'Redes de Computadores', creditos: 4, calificacion: '8.9', estado: 'Aprobada' },
                    { nombre: 'Física III', creditos: 4, calificacion: '2.8', estado: 'Reprobada' }
                ]
            }
        ]
    };
}

// ============================================================================
// DASHBOARD
// ============================================================================

function initDashboard() {
    const dashboardPage = window.location.pathname.includes('dashboard.html');
    if (!dashboardPage) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Actualizar stats del dashboard
    document.getElementById('dashPromedio') && (document.getElementById('dashPromedio').textContent = user.promedio);
    document.getElementById('dashCreditos') && (document.getElementById('dashCreditos').textContent = user.creditos);
    document.getElementById('dashSemestre') && (document.getElementById('dashSemestre').textContent = user.semestre);
}

// ============================================================================
// FILTROS HISTORIAL
// ============================================================================

document.addEventListener('change', (e) => {
    if (e.target.id === 'filtroPeriodo' || e.target.id === 'filtroEstado') {
        filtrarHistorial();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.target.id === 'buscarMateria') {
        filtrarHistorial();
    }
});

function filtrarHistorial() {
    const filtroPeriodo = document.getElementById('filtroPeriodo')?.value || '';
    const filtroEstado = document.getElementById('filtroEstado')?.value || '';
    const buscar = document.getElementById('buscarMateria')?.value.toLowerCase() || '';

    document.querySelectorAll('.periodo-section').forEach(section => {
        const periodo = section.dataset.periodo;
        const materias = section.querySelectorAll('.materia-item');
        
        let mostrarPeriodo = true;
        
        materias.forEach(materia => {
            const textoMateria = materia.querySelector('strong')?.textContent.toLowerCase() || '';
            const estado = materia.dataset.estado;
            
            const coincidePeriodo = !filtroPeriodo || periodo === filtroPeriodo;
            const coincideEstado = !filtroEstado || estado === filtroEstado;
            const coincideBusqueda = !buscar || textoMateria.includes(buscar);
            
            materia.style.display = coincidePeriodo && coincideEstado && coincideBusqueda ? '' : 'none';
        });
        
        const materiasVisibles = Array.from(section.querySelectorAll('.materia-item')).some(m => m.style.display !== 'none');
        section.style.display = materiasVisibles ? '' : 'none';
    });
}

function limpiarFiltros() {
    const selects = ['filtroPeriodo', 'filtroEstado'];
    const inputs = ['buscarMateria'];
    
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    filtrarHistorial();
}

// ============================================================================
// TABLAS
// ============================================================================

function initTables() {
    document.querySelectorAll('th[data-sort]').forEach((header) => {
        header.addEventListener('click', () => {
            const table = header.closest('table');
            const columnIndex = Array.from(header.parentNode.children).indexOf(header);
            sortTable(table, columnIndex);
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
            showNotification('✅ Solicitud enviada correctamente', 'success');
            document.querySelector('.modal')?.classList.remove('active');
            e.target.reset();
        }
    });
}

// ============================================================================
// UTILIDADES
// ============================================================================

function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification show ${type}`;
    notif.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    notif.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-notification')) {
            notif.remove();
        }
    });

    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

function exportarHistorial() {
    window.print();
}

function imprimirHistorial() {
    window.print();
}