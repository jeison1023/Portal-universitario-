// ========================================
// JS/materia.js - VERSION PRO CORREGIDA
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // DATA
    // =============================================
    const materiasData = [
        { id: 1, nombre: 'Programación Web Avanzada', docente: 'Dr. Juan Pérez', aula: 'A-301', estado: 'activa', creditos: 4, calificacion: null, fechaInicio: '2024-08-01' },
        { id: 2, nombre: 'Base de Datos II', docente: 'MSc. María Gómez', aula: 'B-205', estado: 'activa', creditos: 3, calificacion: null, fechaInicio: '2024-08-01' },
        { id: 3, nombre: 'Algoritmos y Estructuras', docente: 'Ing. Carlos López', aula: 'C-112', estado: 'finalizada', creditos: 4, calificacion: 92, fechaInicio: '2024-01-15' },
        { id: 4, nombre: 'Ingeniería de Software', docente: 'Dra. Ana Martínez', aula: 'A-405', estado: 'finalizada', creditos: 3, calificacion: 88, fechaInicio: '2024-01-15' },
        { id: 5, nombre: 'Matemáticas Discretas', docente: 'Dr. Luis Rodríguez', aula: 'D-101', estado: 'activa', creditos: 3, calificacion: null, fechaInicio: '2024-08-01' }
    ];

    let materias = [...materiasData];
    let filtroEstado = '';
    let filtroBusqueda = '';

    // =============================================
    // INIT
    // =============================================
    function initApp() {
        initSidebar(); // 🔥 FIX IMPORTANTE
        renderizarEstadisticas();
        renderizarTabla();
        inicializarEventos();
        actualizarContadorActivas();
    }

    // =============================================
    // SIDEBAR FIX PROFESIONAL
    // =============================================
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const btnDesktop = document.getElementById('sidebarToggle');
        const btnMobile = document.getElementById('mobileMenuToggle');

        // Desktop collapse
        btnDesktop?.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // Mobile open
        btnMobile?.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });

        // Close
        overlay?.addEventListener('click', cerrarSidebar);

        function cerrarSidebar() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }

        // Click fuera (UX PRO)
        document.addEventListener('click', (e) => {
            if (
                window.innerWidth <= 768 &&
                !sidebar.contains(e.target) &&
                !btnMobile.contains(e.target)
            ) {
                cerrarSidebar();
            }
        });
    }

    // =============================================
    // EVENTOS
    // =============================================
    function inicializarEventos() {
        document.getElementById('filtroEstadoMateria').addEventListener('change', function () {
            filtroEstado = this.value;
            filtrarMaterias();
        });

        document.getElementById('buscarMateria').addEventListener('input', debounce(function () {
            filtroBusqueda = this.value.toLowerCase();
            filtrarMaterias();
        }, 300));

        document.getElementById('btnNuevaMateria').addEventListener('click', abrirModalMatricula);

        // Logout
        document.querySelector('.logout-btn')?.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                localStorage.removeItem('userSession');
                window.location.href = 'login.html';
            }
        });
    }

    // =============================================
    // RENDER
    // =============================================
    function renderizarEstadisticas() {
        const aprobadas = materias.filter(m => m.estado === 'finalizada' && m.calificacion >= 70).length;
        const enCurso = materias.filter(m => m.estado === 'activa').length;
        const creditosTotal = materias.reduce((sum, m) => sum + m.creditos, 0);

        document.getElementById('materiasAprobadas').textContent = aprobadas;
        document.getElementById('materiasCurso').textContent = enCurso;
        document.getElementById('creditosTotal').textContent = creditosTotal;
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tabla-materias');
        const data = filtrarMateriasArray();

        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:3rem;">Sin resultados</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(m => `
            <tr data-id="${m.id}">
                <td><strong>${m.nombre}</strong><br><small>${m.creditos} créditos</small></td>
                <td>${m.docente}</td>
                <td>${m.aula}</td>
                <td>
                    <span class="estado-${m.estado}">
                        ${m.estado === 'activa' ? 'En curso' : 'Finalizada'}
                        ${m.calificacion ? `(${m.calificacion}%)` : ''}
                    </span>
                </td>
                <td>
                    <button onclick="ver(${m.id})">👁</button>
                    <button onclick="del(${m.id})">🗑</button>
                </td>
            </tr>
        `).join('');
    }

    // =============================================
    // FILTRO
    // =============================================
    function filtrarMateriasArray() {
        return materias.filter(m =>
            (!filtroEstado || m.estado === filtroEstado) &&
            (!filtroBusqueda || m.nombre.toLowerCase().includes(filtroBusqueda))
        );
    }

    function filtrarMaterias() {
        renderizarTabla();
        actualizarContadorActivas();
    }

    function actualizarContadorActivas() {
        const count = materias.filter(m => m.estado === 'activa').length;
        document.getElementById('materiasActivas').textContent = `${count} activas`;
    }

    // =============================================
    // ACCIONES
    // =============================================
    window.ver = (id) => {
        const m = materias.find(x => x.id === id);
        alert(`${m.nombre}\n${m.docente}`);
    };

    window.del = (id) => {
        if (confirm('Eliminar materia?')) {
            materias = materias.filter(m => m.id !== id);
            renderizarTabla();
            renderizarEstadisticas();
        }
    };

    function abrirModalMatricula() {
        alert('Modal PRO próximamente 😎');
    }

    // =============================================
    // UTIL
    // =============================================
    function debounce(fn, t) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), t);
        };
    }

    // INIT
    initApp();
});