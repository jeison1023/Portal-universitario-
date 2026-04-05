// JS/materia.js - COMPLETO Y FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // DATOS DE EJEMPLO (en app real: API)
    // =============================================
    const materiasData = [
        {
            id: 1,
            nombre: 'Programación Web Avanzada',
            docente: 'Dr. Juan Pérez',
            aula: 'A-301',
            estado: 'activa',
            creditos: 4,
            calificacion: null,
            fechaInicio: '2024-08-01'
        },
        {
            id: 2,
            nombre: 'Base de Datos II',
            docente: 'MSc. María Gómez',
            aula: 'B-205',
            estado: 'activa',
            creditos: 3,
            calificacion: null,
            fechaInicio: '2024-08-01'
        },
        {
            id: 3,
            nombre: 'Algoritmos y Estructuras',
            docente: 'Ing. Carlos López',
            aula: 'C-112',
            estado: 'finalizada',
            creditos: 4,
            calificacion: 92,
            fechaInicio: '2024-01-15'
        },
        {
            id: 4,
            nombre: 'Ingeniería de Software',
            docente: 'Dra. Ana Martínez',
            aula: 'A-405',
            estado: 'finalizada',
            creditos: 3,
            calificacion: 88,
            fechaInicio: '2024-01-15'
        },
        {
            id: 5,
            nombre: 'Matemáticas Discretas',
            docente: 'Dr. Luis Rodríguez',
            aula: 'D-101',
            estado: 'activa',
            creditos: 3,
            calificacion: null,
            fechaInicio: '2024-08-01'
        }
    ];

    let materias = [...materiasData];
    let filtroEstado = '';
    let filtroBusqueda = '';

    // =============================================
    // INICIALIZACIÓN
    // =============================================
    function initApp() {
        renderizarEstadisticas();
        renderizarTabla();
        inicializarEventos();
        actualizarContadorActivas();
    }

    function inicializarEventos() {
        // Filtros
        document.getElementById('filtroEstadoMateria').addEventListener('change', function() {
            filtroEstado = this.value;
            filtrarMaterias();
        });

        document.getElementById('buscarMateria').addEventListener('input', debounce(function() {
            filtroBusqueda = this.value.toLowerCase();
            filtrarMaterias();
        }, 300));

        // Botón nueva materia
        document.getElementById('btnNuevaMateria').addEventListener('click', abrirModalMatricula);

        // Sidebar responsive
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebar = document.getElementById('sidebar');

        if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
        if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', cerrarSidebarMovil);

        // Logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    alert('Redirigiendo al login...');
                    // window.location.href = 'login.html';
                }
            });
        }
    }

    // =============================================
    // RENDERIZADO
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
        const materiasFiltradas = filtrarMateriasArray();

        if (materiasFiltradas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 4rem; color: var(--secondary);">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>No se encontraron materias</p>
                        <small>Ajusta los filtros para ver resultados</small>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = materiasFiltradas.map(materia => crearFilaMateria(materia)).join('');

        // Event listeners para botones de acción (después de renderizar)
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const id = parseInt(row.dataset.id);
                verDetallesMateria(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const nombre = row.querySelector('td:nth-child(1) strong').textContent;
                confirmarEliminarMateria(nombre, row.dataset.id);
            });
        });
    }

    function crearFilaMateria(materia) {
        const calificacion = materia.calificacion ? `(${materia.calificacion}%)` : '';
        return `
            <tr class="materia-row" data-id="${materia.id}">
                <td style="padding: 1.2rem 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="materia-icon" style="
                            width: 45px; height: 45px; border-radius: 12px; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            display: flex; align-items: center; justify-content: center; 
                            color: white; font-weight: 600; font-size: 1.1rem;
                        ">
                            ${materia.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong style="font-weight: 600; color: var(--dark);">${materia.nombre}</strong>
                            <br><small style="color: var(--secondary);">${materia.creditos} créditos</small>
                        </div>
                    </div>
                </td>
                <td style="padding: 1.2rem 1rem; color: var(--dark); font-weight: 500;">
                    ${materia.docente}
                </td>
                <td style="padding: 1.2rem 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--primary);">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${materia.aula}</span>
                    </div>
                </td>
                <td style="padding: 1.2rem 1rem;">
                    <span class="status-badge status-${materia.estado}">
                        ${materia.estado === 'activa' ? 'En curso' : 'Finalizada'}
                        ${calificacion}
                    </span>
                </td>
                <td style="padding: 1.2rem 1rem;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-btn view-btn" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${materia.estado === 'activa' ? 
                            '<button class="action-btn edit-btn" title="Gestionar"><i class="fas fa-cog"></i></button>' : 
                            ''
                        }
                        <button class="action-btn delete-btn" title="Retirar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // =============================================
    // FILTROS
    // =============================================
    function filtrarMateriasArray() {
        return materias.filter(materia => {
            const coincideEstado = !filtroEstado || materia.estado === filtroEstado;
            const coincideBusqueda = !filtroBusqueda || 
                materia.nombre.toLowerCase().includes(filtroBusqueda) ||
                materia.docente.toLowerCase().includes(filtroBusqueda);
            return coincideEstado && coincideBusqueda;
        });
    }

    function filtrarMaterias() {
        renderizarTabla();
        actualizarContadorActivas();
    }

    function actualizarContadorActivas() {
        const activas = materias.filter(m => m.estado === 'activa').length;
        document.getElementById('materiasActivas').textContent = `${activas} activas`;
    }

    // =============================================
    // FUNCIONES DE UI
    // =============================================
    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('collapsed');
    }

    function toggleMobileMenu() {
        document.getElementById('sidebar').classList.add('mobile-open');
        document.getElementById('sidebarOverlay').classList.add('active');
    }

    function cerrarSidebarMovil() {
        document.getElementById('sidebar').classList.remove('mobile-open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }

    // =============================================
    // FUNCIONES DE NEGOCIO
    // =============================================
    function abrirModalMatricula() {
        const modal = `
            <div class="modal-overlay" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
                align-items: center; justify-content: center; backdrop-filter: blur(2px);
            " id="modalMatricula">
                <div style="
                    background: white; border-radius: 16px; padding: 2rem; max-width: 500px; 
                    width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                ">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1.5rem;">
                        <h3 style="margin: 0;"><i class="fas fa-plus"></i> Matricular Nueva Materia</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" style="
                            background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--secondary);
                        ">&times;</button>
                    </div>
                    <div style="display: grid; gap: 1rem;">
                        <input placeholder="Nombre de la materia" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <input placeholder="Docente" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <input placeholder="Aula" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <input type="number" placeholder="Créditos" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <button style="
                            background: var(--primary); color: white; border: none; 
                            padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; 
                            cursor: pointer; width: 100%;
                        ">Matricular Materia</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    function verDetallesMateria(id) {
        const materia = materias.find(m => m.id === id);
        if (materia) {
            alert(`📚 DETALLES DE "${materia.nombre}"\n\n` +
                  `👨‍🏫 Docente: ${materia.docente}\n` +
                  `🏫 Aula: ${materia.aula}\n` +
                  `📅 Inicio: ${new Date(materia.fechaInicio).toLocaleDateString('es-ES')}\n` +
                  `🎯 Estado: ${materia.estado === 'activa' ? 'En curso' : 'Finalizada'}\n` +
                  `${materia.calificacion ? `⭐ Calificación: ${materia.calificacion}%` : ''}`);
        }
    }

    function confirmarEliminarMateria(nombre, id) {
        if (confirm(`⚠️ ¿Retirar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
            // Simular eliminación
            materias = materias.filter(m => m.id != id);
            renderizarEstadisticas();
            renderizarTabla();
            actualizarContadorActivas();
            alert('✅ Materia retirada exitosamente');
        }
    }

    // =============================================
    // UTILIDADES
    // =============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // INICIAR APLICACIÓN
    initApp();
});