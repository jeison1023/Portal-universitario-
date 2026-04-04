// ============================================================================
// PORTAL UNIVERSITARIO - MAIN PRO
// Arquitectura modular y escalable
// ============================================================================

document.addEventListener('DOMContentLoaded', App.init);

// ============================================================================
// APP CORE
// ============================================================================
const App = {

    init() {
        this.cacheDOM();
        this.bindGlobalEvents();
        this.initModules();
    },

    cacheDOM() {
        this.body = document.body;
        this.path = window.location.pathname;
    },

    bindGlobalEvents() {
        window.addEventListener('resize', Utils.debounce(this.handleResize, 200));
    },

    initModules() {
        Auth.init();
        Layout.init();
        Pages.init();
        UI.init();
    },

    handleResize() {
        if (window.innerWidth > 992) {
            document.body.classList.remove('sidebar-open');
        }
    }
};

// ============================================================================
// AUTH MODULE
// ============================================================================
const Auth = {

    init() {
        this.user = this.getUser();
        this.protectRoutes();
        this.updateUserUI();
    },

    getUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    },

    protectRoutes() {
        const isLogin = location.pathname.includes('index.html');

        if (!this.user && !isLogin) {
            window.location.href = 'index.html';
        }
    },

    updateUserUI() {
        if (!this.user) return;

        document.querySelectorAll('[data-user="name"]').forEach(el => {
            el.textContent = this.user.nombreCompleto || 'Usuario';
        });
    },

    logout() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
};

// ============================================================================
// LAYOUT MODULE
// ============================================================================
const Layout = {

    init() {
        this.renderSidebar();
        this.renderHeader();
        this.bindEvents();
    },

    renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const current = location.pathname;

        sidebar.innerHTML = `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <i class="fas fa-graduation-cap"></i> Portal UN
                </div>

                <nav class="sidebar-nav">
                    <a href="dashboard.html" class="nav-item ${current.includes('dashboard') ? 'active' : ''}">
                        <i class="fas fa-home"></i> Dashboard
                    </a>
                    <a href="materias.html" class="nav-item ${current.includes('materias') ? 'active' : ''}">
                        <i class="fas fa-book"></i> Materias
                    </a>
                    <a href="calificaciones.html" class="nav-item ${current.includes('calificaciones') ? 'active' : ''}">
                        <i class="fas fa-chart-line"></i> Calificaciones
                    </a>
                    <a href="historial-academico.html" class="nav-item ${current.includes('historial') ? 'active' : ''}">
                        <i class="fas fa-history"></i> Historial
                    </a>
                    <a href="perfil.html" class="nav-item ${current.includes('perfil') ? 'active' : ''}">
                        <i class="fas fa-user"></i> Perfil
                    </a>

                    <a href="#" id="logoutBtn" class="nav-item logout">
                        <i class="fas fa-sign-out-alt"></i> Salir
                    </a>
                </nav>
            </aside>
        `;
    },

    renderHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        header.innerHTML = `
            <header class="header">
                <h1>${document.title}</h1>
                <div class="user-avatar" data-user="name"></div>
            </header>
        `;
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#logoutBtn')) {
                e.preventDefault();
                Auth.logout();
            }
        });
    }
};

// ============================================================================
// PAGES MODULE (CONTROLADOR DE VISTAS)
// ============================================================================
const Pages = {

    init() {
        this.currentPage = location.pathname;

        if (this.currentPage.includes('dashboard')) Dashboard.init();
        if (this.currentPage.includes('perfil')) Profile.init();
        if (this.currentPage.includes('historial')) Historial.init();
        if (this.currentPage.includes('calificaciones')) Calificaciones.init();
    }
};

// ============================================================================
// DASHBOARD
// ============================================================================
const Dashboard = {

    init() {
        const user = Auth.user;
        if (!user) return;

        this.render(user);
    },

    render(user) {
        this.setText('dashPromedio', user.promedio);
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
};

// ============================================================================
// PROFILE
// ============================================================================
const Profile = {

    init() {
        const user = Auth.user;
        if (!user) return;

        this.render(user);
        this.bindEvents();
    },

    render(user) {
        this.set('nombreCompleto', user.nombreCompleto);
        this.set('programaAcademico', user.programa);
        this.set('correoInstitucional', user.correoInstitucional);
    },

    bindEvents() {
        const input = document.getElementById('fotoInput');

        if (input) {
            input.addEventListener('change', this.handlePhoto);
        }
    },

    handlePhoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('fotoPerfil').src = reader.result;
        };
        reader.readAsDataURL(file);
    },

    set(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '-';
    }
};

// ============================================================================
// HISTORIAL
// ============================================================================
const Historial = {

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('filtroPeriodo')
            ?.addEventListener('change', this.filter);

        document.getElementById('buscarMateria')
            ?.addEventListener('input', this.filter);
    },

    filter() {
        console.log('Filtrando historial...');
    }
};

// ============================================================================
// CALIFICACIONES
// ============================================================================
const Calificaciones = {

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('filtroPeriodo')
            ?.addEventListener('change', this.filter);
    },

    filter() {
        console.log('Filtrando calificaciones...');
    }
};

// ============================================================================
// UI UTILITIES
// ============================================================================
const UI = {

    init() {},

    showLoading(show) {
        let el = document.getElementById('loading');

        if (!el && show) {
            el = document.createElement('div');
            el.id = 'loading';
            el.className = 'loading-overlay';
            el.innerHTML = 'Cargando...';
            document.body.appendChild(el);
        }

        if (el) el.style.display = show ? 'flex' : 'none';
    }
};

// ============================================================================
// UTILIDADES
// ============================================================================
const Utils = {

    debounce(fn, delay) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), delay);
        };
    }
};