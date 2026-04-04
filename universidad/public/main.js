// ============================================================================
// PORTAL UNIVERSITARIO - MAIN ULTRA PRO MAX
// ✨ Partículas | Animaciones 3D | Efectos hover | Transiciones perfectas
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);

// ============================================================================
// INIT ULTRA
// ============================================================================
function initApp() {
    initParticles();     // ✨ Partículas de fondo
    initLogin();         // 🔥 Login animado
    initAuth();          // 🔐 Auth pro
    renderLayout();      // 🎨 Layout dinámico
    initEvents();        // 🎯 Eventos avanzados
    initTables();        // 📊 Tablas interactivas
    initForms();         // 📝 Forms animados
    initProfile();       // 👤 Perfil completo
    initHistorial();     // 📚 Historial académico
    initDashboard();     // 📈 Dashboard pro
    initAnimations();    // ✨ Micro-interacciones
}

// ============================================================================
// PARTÍCULAS MÁGICAS
// ============================================================================
function initParticles() {
    if (!document.querySelector('.landing, .login-body')) return;
    
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        document.body.appendChild(particle);
        particles.push(particle);
    }
}

// ============================================================================
// LOGIN ÉPICO
// ============================================================================
function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        if (!username) {
            shakeError(form);
            return;
        }

        showLoading(true);
        animateLoginSuccess(form);

        const user = generarUsuarioCompleto(username);
        localStorage.setItem('user', JSON.stringify(user));

        // Transición suave
        await sleep(1200);
        document.body.classList.add('login-success');
        await sleep(800);
        window.location.href = 'dashboard.html';
    });
}

function shakeError(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => element.style.animation = '', 500);
}

function animateLoginSuccess(form) {
    form.querySelectorAll('input').forEach(input => {
        input.style.transform = 'scale(0)';
        input.style.opacity = '0';
    });
    
    form.style.transform = 'scale(0.95)';
    form.style.opacity = '0.7';
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// USUARIOS REALISTAS PRO
// ============================================================================
function generarUsuarioCompleto(username) {
    const templates = {
        codigos: ['2023001', '2023002', '2023003', '2024001', '2024002'],
        programas: ['Ingeniería de Sistemas', 'Ingeniería Civil', 'Medicina', 'Derecho', 'Arquitectura'],
        nombres: ['Ana María', 'Carlos Andrés', 'Laura Sofía', 'Diego Alejandro', 'Valentina']
    };
    
    const codigo = templates.codigos[Math.floor(Math.random() * templates.codigos.length)];
    const programa = templates.programas[Math.floor(Math.random() * templates.programas.length)];
    const nombreAleatorio = templates.nombres[Math.floor(Math.random() * templates.nombres.length)];
    
    return {
        nombreCompleto: `${nombreAleatorio} ${username.toUpperCase()}`,
        codigo: codigo,
        username: codigo,
        correoInstitucional: `${codigo.toLowerCase()}@universidad.edu.co`,
        programa: programa,
        semestre: Math.floor(Math.random() * 10) + 1,
        promedio: (8 + Math.random() * 1.8).toFixed(2),
        creditos: Math.floor(Math.random() * 25) + 18,
        fechaNacimiento: new Date(2000 + Math.floor(Math.random() * 5), 
                                 Math.floor(Math.random() * 12), 
                                 10 + Math.floor(Math.random() * 20))
                         .toLocaleDateString('es-CO'),
        telefono: `+57 3${Math.floor(Math.random() * 10)}0 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
        foto: null,
        fechaIngreso: new Date(2022 + Math.floor(Math.random() * 3), 0, 1).toLocaleDateString('es-CO')
    };
}

// ============================================================================
// LOADING ANIMADO
// ============================================================================
function showLoading(show) {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay && show) {
        overlay = createLoadingOverlay();
        document.body.appendChild(overlay);
    }
    
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
        if (show) animateLoading();
    }
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <span>Entrando al portal...</span>
        </div>
    `;
    return overlay;
}

function animateLoading() {
    const rings = document.querySelectorAll('.spinner-ring');
    rings.forEach((ring, i) => {
        ring.style.animationDelay = `${i * 0.2}s`;
    });
}

// ============================================================================
// AUTH PRO
// ============================================================================
function initAuth() {
    const isLoginPage = window.location.pathname.includes('index.html');
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        logout();
        return;
    }

    if (!user && !isLoginPage) {
        window.location.href = 'index.html';
        return;
    }

    // Actualizar UI con datos del usuario
    updateUserUI(user);
    
    // Efecto de entrada
    document.body.classList.add('user-loaded');
}

// ============================================================================
// UI DEL USUARIO
// ============================================================================
function updateUserUI(user) {
    document.querySelectorAll('#userName, [data-user="name"]').forEach(el => {
        el.textContent = user.nombreCompleto || user.username || 'Usuario';
        el.dataset.originalTitle = user.nombreCompleto;
    });

    // Avatar dinámico
    const avatar = document.querySelector('.user-avatar');
    if (avatar && !user.foto) {
        const initials = user.nombreCompleto.match(/\b\w/g) || ['U'];
        avatar.innerHTML = initials.join('').toUpperCase();
    }
}

// ============================================================================
// LAYOUT DINÁMICO PRO
// ============================================================================
function renderLayout() {
    renderSidebar();
    renderHeader();
    
    // Efecto de carga
    setTimeout(() => {
        document.body.classList.add('layout-ready');
    }, 100);
}

function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    sidebar.innerHTML = `
        <aside class="sidebar">
            <div class="sidebar-header center gap-1">
                <div class="sidebar-logo">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <span>Portal UN</span>
            </div>

            <nav class="sidebar-nav">
                <a href="dashboard.html" class="nav-item ${currentPage.includes('dashboard') ? 'active' : ''}" data-page="dashboard">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="materias.html" class="nav-item ${currentPage.includes('materias') ? 'active' : ''}" data-page="materias">
                    <i class="fas fa-book"></i>
                    <span>Materias</span>
                </a>
                <a href="calificaciones.html" class="nav-item ${currentPage.includes('calificaciones') ? 'active' : ''}" data-page="calificaciones">
                    <i class="fas fa-chart-line"></i>
                    <span>Calificaciones</span>
                </a>
                <a href="historial-academico.html" class="nav-item ${currentPage.includes('historial') ? 'active' : ''}" data-page="historial">
                    <i class="fas fa-history"></i>
                    <span>Historial</span>
                </a>
                <a href="perfil.html" class="nav-item ${currentPage.includes('perfil') ? 'active' : ''}" data-page="perfil">
                    <i class="fas fa-user"></i>
                    <span>Perfil</span>
                </a>
                <a href="solicitudes.html" class="nav-item" data-page="solicitudes">
                    <i class="fas fa-file-alt"></i>
                    <span>Solicitudes</span>
                </a>
                <div class="sidebar-divider"></div>
                <a href="#" id="logoutBtn" class="nav-item logout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
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
                <button class="menu-toggle" aria-label="Menú">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="page-title">
                    <h1>${pageTitle}</h1>
                    <div class="title-glow"></div>
                </div>
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
// EVENTOS ULTRA PRO
// ============================================================================
function initEvents() {
    // Event delegation principal
    document.addEventListener('click', handleGlobalClicks);
    document.addEventListener('mousemove', handleMouseMove);
    
    // Resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
}

function handleGlobalClicks(e) {
    // Mobile menu
    if (e.target.closest('.menu-toggle')) {
        document.body.classList.toggle('sidebar-open');
        animateSidebar();
    }

    // Logout con confirmación animada
    if (e.target.closest('#logoutBtn')) {
        e.preventDefault();
        showLogoutModal();
    }

    // Modales
    if (e.target.closest('[data-modal]')) {
        const modalId = e.target.closest('[data-modal]').dataset.modal;
        document.getElementById(modalId)?.classList.add('active');
    }

    if (e.target.closest('.modal-close') || e.target.classList.contains('modal')) {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Foto perfil
    if (e.target.id === 'fotoInput') {
        handleFotoPerfil(e.target.files[0]);
    }

    // Filtros
    if (e.target.closest('#limpiarFiltros')) {
        limpiarFiltros();
    }
}

function handleMouseMove(e) {
    // Efecto parallax sutil en header
    const header = document.querySelector('.header');
    if (header) {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        header.style.transform = `translate(${x}px, ${y}px)`;
    }
}

function handleResize() {
    if (window.innerWidth > 992) {
        document.body.classList.remove('sidebar-open');
    }
}

// ============================================================================
// PERFIL ESTUDIANTE PRO
// ============================================================================
function initProfile() {
    const isProfilePage = window.location.pathname.includes('perfil');
    if (!isProfilePage) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Datos completos del perfil
    const profileData = {
        'nombreCompleto': user.nombreCompleto,
        'codigoEstudiantil': user.codigo,
        'usuario': user.username,
        'correoInstitucional': user.correoInstitucional,
        'programaAcademico': user.programa,
        'semestreActual': `${user.semestre}° Semestre`,
        'promedioGeneral': user.promedio,
        'creditosMatriculados': user.creditos,
        'nombre': user.nombreCompleto.split(' ')[0],
        'correoPersonal': user.correoInstitucional,
        'fechaNacimiento': user.fechaNacimiento,
        'telefono': user.telefono,
        'fechaIngreso': user.fechaIngreso || '08/01/2023'
    };

    // Llenar campos con animación
    Object.entries(profileData).forEach(([id, valor], index) => {
        const el = document.getElementById(id);
        if (el) {
            setTimeout(() => {
                el.textContent = valor;
                el.classList.add('fade-in');
            }, index * 100);
        }
    });

    // Foto con efecto
    const fotoPerfil = document.getElementById('fotoPerfil');
    if (fotoPerfil) {
        fotoPerfil.src = user.foto || 'data:image/svg+xml;base64,...'; // Default SVG
        fotoPerfil.onload = () => fotoPerfil.classList.add('loaded');
    }
}

// ============================================================================
// HISTORIAL ACADÉMICO ULTRA
// ============================================================================
function initHistorial() {
    const isHistorialPage = window.location.pathname.includes('historial-academico');
    if (!isHistorialPage) return;

    setTimeout(() => {
        renderizarHistorialAcademico();
        initHistorialFilters();
    }, 500);
}

function renderizarHistorialAcademico() {
    const container = document.getElementById('historialContainer');
    if (!container) return;

    const historial = generarHistorialCompleto();
    
    // Stats con animación
    animateCounter('promedioGeneral', historial.promedioGeneral);
    animateCounter('creditosAprobados', historial.creditosAprobados);
    animateCounter('materiasAprobadas', historial.materiasAprobadas);
    animateCounter('materiasReprobadas', historial.materiasReprobadas);

    // Render periodos con stagger
    container.innerHTML = '';
    historial.periodos.forEach((periodo, index) => {
        setTimeout(() => {
            const section = createPeriodoSection(periodo);
            container.appendChild(section);
        }, index * 200);
    });
}

function generarHistorialCompleto() {
    return {
        promedioGeneral: 8.45,
        creditosAprobados: 156,
        materiasAprobadas: 42,
        materiasReprobadas: 3,
        periodos: [
            {
                codigo: '2024-I',
                promedio: 8.5,
                estado: 'Aprobado',
                materias: [
                    { nombre: 'Matemáticas Avanzadas I', creditos: 4, calificacion: 9.2, estado: 'Aprobada' },
                    { nombre: 'Programación OO II', creditos: 4, calificacion: 8.7, estado: 'Aprobada' },
                    { nombre: 'Bases de Datos II', creditos: 3, calificacion: 8.0, estado: 'En curso' }
                ]
            },
            {
                codigo: '2023-II',
                promedio: 8.3,
                estado: 'Aprobado',
                materias: [
                    { nombre: 'Redes de Computadores', creditos: 4, calificacion: 8.9, estado: 'Aprobada' },
                    { nombre: 'Física III', creditos: 4, calificacion: 2.8, estado: 'Reprobada' },
                    { nombre: 'Estadística Aplicada', creditos: 3, calificacion: 9.1, estado: 'Aprobada' }
                ]
            },
            {
                codigo: '2023-I',
                promedio: 8.7,
                estado: 'Aprobado',
                materias: [
                    { nombre: 'Algoritmos Avanzados', creditos: 4, calificacion: 9.0, estado: 'Aprobada' },
                    { nombre: 'Ingeniería de Software', creditos: 3, calificacion: 8.5, estado: 'Aprobada' }
                ]
            }
        ]
    };
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    
    let start = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = start.toFixed(target % 1 === 0 ? 0 : 2);
        }
    }, 20);
}

// ============================================================================
// DASHBOARD PRO
// ============================================================================
function initDashboard() {
    const isDashboard = window.location.pathname.includes('dashboard');
    if (!isDashboard) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateDashboardStats(user);
        initDashboardCharts();
    }
}

function updateDashboardStats(user) {
    const stats = {
        'dashPromedio': user.promedio,
        'dashCreditos': user.creditos,
        'dashSemestre': user.semestre
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.classList.add('animate-stat');
        }
    });
}

//