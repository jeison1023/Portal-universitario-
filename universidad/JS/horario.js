// JS/horarios.js - COMPLETO Y FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // DATOS DE HORARIO (ejemplo realista)
    // =============================================
    const horariosData = {
        semestre: '2024-1',
        clases: [
            {
                id: 1,
                materia: 'Programación Web Avanzada',
                profesor: 'Dr. Juan Pérez',
                aula: 'A-301',
                dia: 'Lunes',
                horaInicio: '09:00',
                horaFin: '11:00',
                color: 'default'
            },
            {
                id: 2,
                materia: 'Base de Datos II',
                profesor: 'MSc. María Gómez',
                aula: 'B-205',
                dia: 'Lunes',
                horaInicio: '14:00',
                horaFin: '16:00',
                color: 'mate'
            },
            {
                id: 3,
                materia: 'Matemáticas Discretas',
                profesor: 'Dr. Luis Rodríguez',
                aula: 'C-112',
                dia: 'Martes',
                horaInicio: '08:00',
                horaFin: '10:00',
                color: 'mate'
            },
            {
                id: 4,
                materia: 'Inglés Técnico IV',
                profesor: 'Lic. Ana Martínez',
                aula: 'D-101',
                dia: 'Martes',
                horaInicio: '10:00',
                horaFin: '12:00',
                color: 'ingles'
            },
            {
                id: 5,
                materia: 'Laboratorio de Redes',
                profesor: 'Ing. Carlos López',
                aula: 'LAB-01',
                dia: 'Miércoles',
                horaInicio: '15:00',
                horaFin: '18:00',
                color: 'laboratorio'
            }
        ]
    };

    let clases = [...horariosData.clases];
    let vistaActual = 'semanal';

    // =============================================
    // INICIALIZACIÓN
    // =============================================
    initHorarios();

    function initHorarios() {
        renderizarEstadisticas();
        renderizarHorarioSemanal();
        inicializarEventos();
        actualizarProximasClases();
    }

    function inicializarEventos() {
        // Toggle vistas
        document.querySelectorAll('[data-vista]').forEach(btn => {
            btn.addEventListener('click', function() {
                cambiarVista(this.dataset.vista);
            });
        });

        // Toggle horario/lista
        document.getElementById('toggleHorario')?.addEventListener('click', toggleVistaHorario);
        document.getElementById('toggleBackToGrid')?.addEventListener('click', toggleBackToGrid);

        // Selector semestre
        document.getElementById('semestreSelector')?.addEventListener('change', function() {
            // Cambiar semestre (simulado)
            document.getElementById('horariosTitle').textContent = this.value;
        });

        // Imprimir
        document.getElementById('btnImprimirHorario')?.addEventListener('click', imprimirHorario);

        // Sidebar (común)
        inicializarSidebar();
    }

    function inicializarSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const overlay = document.getElementById('sidebarOverlay');
        const sidebar = document.getElementById('sidebar');

        sidebarToggle?.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
        mobileToggle?.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
        });
        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        });
    }

    // =============================================
    // RENDERIZADO
    // =============================================
    function renderizarEstadisticas() {
        const totalClases = clases.length;
        const horasSemanales = clases.reduce((sum, c) => sum + calcularHoras(c.horaInicio, c.horaFin), 0);
        const creditos = 18; // Fijo por semestre

        document.getElementById('totalClases').textContent = totalClases;
        document.getElementById('horasSemanales').textContent = horasSemanales;
        document.getElementById('creditosHorario').textContent = creditos;
    }

    function renderizarHorarioSemanal() {
        const container = document.getElementById('horarioSemanal');
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        let html = `
            <table class="horario-table">
                <thead>
                    <tr>
                        <th>Hora</th>
                        ${dias.map(dia => `<th>${dia}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        // Horas del día (8:00 - 20:00)
        for (let h = 8; h <= 20; h += 2) {
            html += `<tr>
                <td>${String(h).padStart(2, '0')}:00 - ${String(h+2).padStart(2, '0')}:00</td>`;
            
            dias.forEach(dia => {
                const clasesDia = clases.filter(c => c.dia === dia && 
                    parseInt(c.horaInicio.split(':')[0]) >= h && 
                    parseInt(c.horaInicio.split(':')[0]) < h+2);
                
                if (clasesDia.length > 0) {
                    const clase = clasesDia[0];
                    html += `
                        <td>
                            <div class="horario-clase ${clase.color}">
                                <div class="clase-titulo">${clase.materia}</div>
                                <div class="clase-detalles">${clase.profesor}</div>
                                <div class="clase-aula">${clase.aula}</div>
                            </div>
                        </td>
                    `;
                } else {
                    html += '<td></td>';
                }
            });
            
            html += '</tr>';
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    function renderizarListaClases() {
        const container = document.getElementById('listaClases');
        container.innerHTML = clases.map(clase => `
            <div class="lista-clase">
                <div class="clase-hora">${clase.horaInicio} - ${clase.horaFin}</div>
                <div class="clase-dia">${clase.dia}</div>
                <div class="class-info flex-1">
                    <strong>${clase.materia}</strong>
                    <div>${clase.profesor} • ${clase.aula}</div>
                </div>
                <button class="action-btn">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
            </div>
        `).join('');
    }

    function actualizarProximasClases() {
        const container = document.getElementById('proximasClases');
        const proximas = clases.slice(0, 5); // Primeras 5
        
        container.innerHTML = proximas.map((clase, i) => `
            <div class="class-item proximas-clase">
                <div class="class-time">${clase.horaInicio}</div>
                <div class="class-info">
                    <strong>${clase.materia}</strong>
                    <div>${clase.profesor} • ${clase.aula}</div>
                </div>
                <div class="countdown">${i + 1}</div>
            </div>
        `).join('');
    }

    // =============================================
    // FUNCIONES DE VISTA
    // =============================================
    function cambiarVista(vista) {
        vistaActual = vista;
        document.querySelectorAll('[data-vista]').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Renderizar vista específica
        switch(vista) {
            case 'semanal':
                document.getElementById('horarioSemanalContainer').style.display = 'block';
                break;
            case 'diaria':
                alert('Vista diaria próximamente');
                break;
            case 'lista':
                toggleVistaHorario();
                break;
        }
    }

    function toggleVistaHorario() {
        const grid = document.getElementById('horarioSemanalContainer');
        const lista = document.getElementById('listaClasesContainer');
        
        grid.style.display = 'none';
        lista.style.display = 'block';
        renderizarListaClases();
        document.getElementById('toggleHorario').textContent = 'Horario';
    }

    function toggleBackToGrid() {
        document.getElementById('horarioSemanalContainer').style.display = 'block';
        document.getElementById('listaClasesContainer').style.display = 'none';
        document.getElementById('toggleHorario').textContent = 'Lista';
    }

    function imprimirHorario() {
        window.print();
    }

    function calcularHoras(inicio, fin) {
        const [h1] = inicio.split(':').map(Number);
        const [h2] = fin.split(':').map(Number);
        return h2 - h1;
    }

    // =============================================
    // SIMULACIÓN ACTUALIZACIÓN EN TIEMPO REAL
    // =============================================
    setInterval(actualizarProximasClases, 30000); // Cada 30s
});