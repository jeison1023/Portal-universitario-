// =============================================
// JS/solicitudes.js - VERSION PRO (CON FORMULARIO)
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    // DATA INICIAL
    let solicitudes = [
        { id: 1, tipo: 'Certificado', descripcion: 'Certificado de estudios', fecha: '2024-09-01', estado: 'aprobada' },
        { id: 2, tipo: 'Convalidación', descripcion: 'Convalidación de materias', fecha: '2024-09-10', estado: 'pendiente' }
    ];

    let filtros = { estado: '', tipo: '', busqueda: '' };
    let vistaTabla = false;

    // INIT
    initEventos();
    renderSolicitudes();
    actualizarStats();

    function initEventos() {
        // Botón para abrir el formulario (Asegúrate de tener un <dialog> o modal en tu HTML)
        document.getElementById('btnNuevaSolicitud').addEventListener('click', abrirModal);

        // Evento del formulario de nueva solicitud
        const form = document.getElementById('formNuevaSolicitud');
        form?.addEventListener('submit', guardarNuevaSolicitud);

        // Filtros existentes
        document.getElementById('filtroEstadoSolicitud').addEventListener('change', e => {
            filtros.estado = e.target.value;
            renderSolicitudes();
        });

        document.getElementById('buscarSolicitud').addEventListener('input', e => {
            filtros.busqueda = e.target.value.toLowerCase();
            renderSolicitudes();
        });

        document.getElementById('toggleVista').addEventListener('click', () => {
            vistaTabla = !vistaTabla;
            renderSolicitudes();
        });
    }

    // =============================================
    // LÓGICA PARA AÑADIR SOLICITUDES
    // =============================================

    function abrirModal() {
        // Si usas la etiqueta <dialog> de HTML5 es así de simple:
        const modal = document.getElementById('modalSolicitud');
        if (modal) {
            modal.showModal(); 
        } else {
            // Fallback: Si no tienes modal, un prompt rápido para probar
            const desc = prompt("Descripción de la solicitud:");
            if(desc) procesarNuevaSolicitud(desc, "Certificado");
        }
    }

    function guardarNuevaSolicitud(e) {
        e.preventDefault();
        
        const descripcion = document.getElementById('newDesc').value;
        const tipo = document.getElementById('newTipo').value;

        procesarNuevaSolicitud(descripcion, tipo);

        // Cerrar modal y limpiar
        e.target.reset();
        document.getElementById('modalSolicitud').close();
    }

    function procesarNuevaSolicitud(desc, tipo) {
        const nueva = {
            id: solicitudes.length + 1,
            tipo: tipo,
            descripcion: desc,
            fecha: new Date().toISOString().split('T')[0],
            estado: 'pendiente'
        };

        // Añadir al inicio del array
        solicitudes.unshift(nueva);
        
        // Refrescar UI
        renderSolicitudes();
        actualizarStats();
        mostrarToast('✅ Solicitud enviada correctamente');
    }

    // =============================================
    // RENDER Y UTILS (OPTIMIZADOS)
    // =============================================

    function renderSolicitudes() {
        const container = document.getElementById('solicitudesGrid');
        const data = solicitudes.filter(s => {
            return (!filtros.estado || s.estado === filtros.estado) &&
                   (!filtros.busqueda || s.descripcion.toLowerCase().includes(filtros.busqueda));
        });

        if (vistaTabla) {
            renderTabla(container, data);
        } else {
            renderCards(container, data);
        }
    }

    function renderCards(container, data) {
        container.innerHTML = data.map(s => `
            <div class="lista-clase fade-in">
                <div class="lista-clase-dia">${s.id}</div>
                <div class="lista-clase-info">
                    <div class="lista-clase-titulo">${s.descripcion}</div>
                    <div class="lista-clase-detalles">
                        <span><i class="fas fa-tag"></i> ${s.tipo}</span>
                        <span><i class="far fa-calendar"></i> ${formatearFecha(s.fecha)}</span>
                    </div>
                </div>
                <span class="estado-badge estado-${s.estado}">${s.estado}</span>
            </div>
        `).join('');
    }

    function actualizarStats() {
        setText('totalSolicitudes', solicitudes.length);
        setText('solicitudesPendientes', solicitudes.filter(s => s.estado === 'pendiente').length);
    }

    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function formatearFecha(f) { return new Date(f).toLocaleDateString('es-ES'); }

    function mostrarToast(msg) {
        const t = document.createElement('div');
        t.className = 'toast-notif';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }
});