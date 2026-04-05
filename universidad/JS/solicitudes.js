// ========================================
// JS/solicitudes.js - VERSION PRO COMPLETA
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // DATA (SIMULADA)
    // =============================================
    let solicitudes = [
        {
            id: 1,
            tipo: 'certificado',
            descripcion: 'Certificado de estudios',
            fecha: '2024-09-01',
            estado: 'aprobada'
        },
        {
            id: 2,
            tipo: 'convalidacion',
            descripcion: 'Convalidación de materias',
            fecha: '2024-09-10',
            estado: 'pendiente'
        },
        {
            id: 3,
            tipo: 'certificado',
            descripcion: 'Certificado de notas',
            fecha: '2024-09-15',
            estado: 'rechazada'
        },
        {
            id: 4,
            tipo: 'certificado',
            descripcion: 'Constancia de matrícula',
            fecha: '2024-09-18',
            estado: 'pendiente'
        }
    ];

    let filtros = {
        estado: '',
        tipo: '',
        fecha: '',
        busqueda: ''
    };

    let vistaTabla = false;

    // =============================================
    // INIT
    // =============================================
    initSidebar();
    initEventos();
    renderSolicitudes();
    actualizarStats();

    // =============================================
    // SIDEBAR (GLOBAL)
    // =============================================
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const btnDesktop = document.getElementById('sidebarToggle');
        const btnMobile = document.getElementById('mobileMenuToggle');

        btnDesktop?.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        btnMobile?.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });

        overlay?.addEventListener('click', cerrarSidebar);

        function cerrarSidebar() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    // =============================================
    // EVENTOS
    // =============================================
    function initEventos() {

        // Filtros
        document.getElementById('filtroEstadoSolicitud').addEventListener('change', e => {
            filtros.estado = e.target.value;
            aplicarFiltros();
        });

        document.getElementById('filtroTipoSolicitud').addEventListener('change', e => {
            filtros.tipo = e.target.value;
            aplicarFiltros();
        });

        document.getElementById('buscarSolicitud').addEventListener('input', debounce(e => {
            filtros.busqueda = e.target.value.toLowerCase();
            aplicarFiltros();
        }, 300));

        document.getElementById('btnLimpiarFiltros').addEventListener('click', limpiarFiltros);

        // Nueva solicitud
        document.getElementById('btnNuevaSolicitud').addEventListener('click', crearSolicitud);

        // Toggle vista
        document.getElementById('toggleVista').addEventListener('click', toggleVista);

        // Logout
        document.querySelector('.logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                window.location.href = 'login.html';
            }
        });
    }

    // =============================================
    // RENDER
    // =============================================
    function renderSolicitudes() {
        const container = document.getElementById('solicitudesGrid');
        const data = filtrarSolicitudes();

        if (data.length === 0) {
            container.innerHTML = `<p style="text-align:center;color:gray;">No hay resultados</p>`;
            return;
        }

        if (!vistaTabla) {
            container.innerHTML = data.map(s => `
                <div class="lista-clase">
                    <div class="lista-clase-dia">${s.id}</div>
                    <div class="lista-clase-info">
                        <div class="lista-clase-titulo">${s.descripcion}</div>
                        <div class="lista-clase-detalles">
                            <span>${s.tipo}</span>
                            <span>${formatearFecha(s.fecha)}</span>
                        </div>
                    </div>
                    <span class="estado-badge estado-${s.estado}">
                        ${s.estado}
                    </span>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <table style="width:100%">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descripción</th>
                            <th>Tipo</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(s => `
                            <tr>
                                <td>${s.id}</td>
                                <td>${s.descripcion}</td>
                                <td>${s.tipo}</td>
                                <td>${formatearFecha(s.fecha)}</td>
                                <td>${s.estado}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    }

    // =============================================
    // FILTROS
    // =============================================
    function filtrarSolicitudes() {
        return solicitudes.filter(s => {
            return (
                (!filtros.estado || s.estado === filtros.estado) &&
                (!filtros.tipo || s.tipo === filtros.tipo) &&
                (!filtros.busqueda || s.descripcion.toLowerCase().includes(filtros.busqueda))
            );
        });
    }

    function aplicarFiltros() {
        renderSolicitudes();
    }

    function limpiarFiltros() {
        filtros = { estado: '', tipo: '', fecha: '', busqueda: '' };

        document.getElementById('filtroEstadoSolicitud').value = '';
        document.getElementById('filtroTipoSolicitud').value = '';
        document.getElementById('buscarSolicitud').value = '';

        renderSolicitudes();
    }

    // =============================================
    // ACCIONES
    // =============================================
    function crearSolicitud() {
        const nueva = {
            id: solicitudes.length + 1,
            tipo: 'certificado',
            descripcion: 'Nueva solicitud',
            fecha: new Date().toISOString().split('T')[0],
            estado: 'pendiente'
        };

        solicitudes.unshift(nueva);
        renderSolicitudes();
        actualizarStats();

        mostrarToast('📄 Solicitud creada');
    }

    function toggleVista() {
        vistaTabla = !vistaTabla;
        document.getElementById('toggleVista').textContent = vistaTabla ? 'Vista Cards' : 'Vista Tabular';
        renderSolicitudes();
    }

    // =============================================
    // STATS
    // =============================================
    function actualizarStats() {
        document.getElementById('totalSolicitudes').textContent = solicitudes.length;
        document.getElementById('solicitudesPendientes').textContent = solicitudes.filter(s => s.estado === 'pendiente').length;
        document.getElementById('solicitudesAprobadas').textContent = solicitudes.filter(s => s.estado === 'aprobada').length;
    }

    // =============================================
    // UTILIDADES
    // =============================================
    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES');
    }

    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function mostrarToast(msg) {
        const t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = `
            position:fixed;bottom:20px;right:20px;
            background:#111;color:#fff;padding:10px 16px;
            border-radius:8px;z-index:9999;
        `;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2000);
    }

});