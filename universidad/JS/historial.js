// JS/historial.js
class HistorialAcademico {
  constructor() {
    this.datosHistorial = [];
    this.datosFiltrados = [];
    this.init();
  }

  init() {
    this.cargarSidebar();
    this.cargarHeader();
    this.cargarDatos();
    this.initEventListeners();
    this.initSidebarToggle();
  }

  cargarSidebar() {
    document.getElementById('sidebar').innerHTML = `
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-graduation-cap"></i>
          <span>UNI-PORTAL</span>
        </div>
        <button class="sidebar-toggle" id="sidebarToggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="dashboard.html" class="nav-link"><i class="fas fa-tachometer-alt"></i><span>Dashboard</span></a></li>
          <li class="nav-item"><a href="materias.html" class="nav-link"><i class="fas fa-book"></i><span>Materias</span></a></li>
          <li class="nav-item"><a href="calificaciones.html" class="nav-link"><i class="fas fa-chart-bar"></i><span>Calificaciones</span></a></li>
          <li class="nav-item"><a href="horarios.html" class="nav-link"><i class="fas fa-calendar-alt"></i><span>Horarios</span></a></li>
          <li class="nav-item active"><a href="historial.html" class="nav-link active"><i class="fas fa-history"></i><span>Historial</span></a></li>
          <li class="nav-item"><a href="solicitudes.html" class="nav-link"><i class="fas fa-file-invoice"></i><span>Solicitudes</span></a></li>
          <li class="nav-item"><a href="finanzas.html" class="nav-link"><i class="fas fa-dollar-sign"></i><span>Finanzas</span></a></li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile">
          <img src="https://via.placeholder.com/40" alt="Foto de perfil" class="user-avatar">
          <div>
            <div class="user-name">Juan Pérez</div>
            <div class="user-role">Estudiante - 2024001</div>
          </div>
        </div>
        <a href="#" class="logout-btn"><i class="fas fa-sign-out-alt"></i><span>Cerrar Sesión</span></a>
      </div>
    `;
  }

  cargarHeader() {
    document.getElementById('header').innerHTML = `
      <div class="header-left">
        <button class="mobile-menu-toggle" id="mobileMenuToggle">
          <i class="fas fa-bars"></i>
        </button>
        <div class="breadcrumb">
          <a href="dashboard.html"><i class="fas fa-home"></i> Dashboard</a>
          <i class="fas fa-chevron-right"></i>
          <span>Historial Académico</span>
        </div>
      </div>
      <div class="header-right">
        <div class="header-actions">
          <button class="header-btn" aria-label="Notificaciones">
            <i class="fas fa-bell"></i>
            <span class="badge">2</span>
          </button>
          <button class="header-btn" aria-label="Configuración">
            <i class="fas fa-cog"></i>
          </button>
        </div>
      </div>
    `;
  }

  cargarDatos() {
    // Simular carga de datos
    setTimeout(() => {
      this.datosHistorial = [
        {
          periodo: '2024-II',
          promedio: 4.35,
          creditos: 20,
          materiasAprobadas: 5,
          materiasReprobadas: 0,
          materias: [
            {codigo: 'PROG-401', nombre: 'Programación IV', profesor: 'Dr. Carlos López', creditos: 4, promedio: 4.85, estado: 'En curso'},
            {codigo: 'FIS-202', nombre: 'Física II', profesor: 'Ing. María Gómez', creditos: 4, promedio: 4.0, estado: 'Aprobada'}
          ]
        },
        {
          periodo: '2024-I',
          promedio: 3.85,
          creditos: 18,
          materiasAprobadas: 4,
          materiasReprobadas: 1,
          materias: [
            {codigo: 'CAL-201', nombre: 'Cálculo II', profesor: 'Dr. Ana Torres', creditos: 4, promedio: 2.7, estado: 'Reprobada'},
            {codigo: 'MAT-301', nombre: 'Matemáticas III', profesor: 'Ing. Luis Ramírez', creditos: 4, promedio: 4.6, estado: 'Aprobada'}
          ]
        }
      ];
      
      this.datosFiltrados = [...this.datosHistorial];
      this.actualizarEstadisticas();
      this.renderizarHistorial();
      document.getElementById('historialContainer').classList.remove('loading');
    }, 1500);
  }

  actualizarEstadisticas() {
    const totalMaterias = this.datosFiltrados.reduce((sum, p) => sum + p.materias.length, 0);
    const totalAprobadas = this.datosFiltrados.reduce((sum, p) => sum + p.materiasAprobadas, 0);
    const totalReprobadas = this.datosFiltrados.reduce((sum, p) => sum + p.materiasReprobadas, 0);
    const totalCreditos = this.datosFiltrados.reduce((sum, p) => sum + p.creditos, 0);
    const promedioGeneral = this.datosFiltrados.reduce((sum, p) => sum + (p.promedio * p.creditos), 0) / totalCreditos || 0;

    document.getElementById('promedioGeneral').textContent = promedioGeneral.toFixed(2);
    document.getElementById('creditosAprobados').textContent = totalCreditos;
    document.getElementById('materiasAprobadas').textContent = totalAprobadas;
    document.getElementById('materiasReprobadas').textContent = totalReprobadas;
    document.getElementById('totalPeriodos').textContent = `${this.datosFiltrados.length} periodos`;
  }

  renderizarHistorial() {
    const container = document.getElementById('historialContainer');
    container.innerHTML = this.datosFiltrados.map(periodo => `
      <div class="periodo-card">
        <div class="periodo-header">
          <div class="periodo-titulo">${periodo.periodo}</div>
          <div class="periodo-stats">
            <div class="stat-periodo">
              <span class="value">${periodo.promedio.toFixed(2)}</span>
              <span>Promedio</span>
            </div>
            <div class="stat-periodo">
              <span class="value">${periodo.materiasAprobadas}</span>
              <span>Aprob.</span>
            </div>
            <div class="stat-periodo">
              <span class="value">${periodo.materiasReprobadas}</span>
              <span>Repr.</span>
            </div>
          </div>
        </div>
        <div class="materias-grid">
          ${periodo.materias.map(materia => `
            <div class="materia-item">
              <div class="materia-header">
                <div>
                  <div class="materia-nombre">${materia.nombre}</div>
                  <div class="materia-codigo">${materia.codigo}</div>
                </div>
                <div class="materia-promedio promedio-${materia.estado.toLowerCase().replace(/ /g,'-')}">
                  ${materia.promedio.toFixed(2)}
                </div>
              </div>
              <div class="materia-info">
                <div class="info-item">
                  <span class="info-label">Profesor</span>
                  <span class="info-value">${materia.profesor}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Créditos</span>
                  <span class="info-value">${materia.creditos}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Estado</span>
                  <span class="info-value">${materia.estado}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  initEventListeners() {
    // Filtros
    document.getElementById('btnAplicarFiltros').addEventListener('click', () => this.aplicarFiltros());
    document.getElementById('btnLimpiarHistorial').addEventListener('click', () => this.limpiarFiltros());
    document.getElementById('buscarMateria').addEventListener('input', (e) => this.buscarMateria(e.target.value));
    
    // Acciones
    document.getElementById('btnExportarHistorial').addEventListener('click', () => {
      window.print();
      console.log('Exportando PDF...');
    });
    
    document.getElementById('btnImprimirHistorial').addEventListener('click', () => window.print());
  }

  aplicarFiltros() {
    const periodo = document.getElementById('filtroPeriodo').value;
    const estado = document.getElementById('filtroEstado').value;
    
    this.datosFiltrados = this.datosHistorial.filter(periodoData => {
      const periodoMatch = !periodo || periodoData.periodo.includes(periodo);
      const estadoMatch = !estado || periodoData.materias.some(m => m.estado === estado);
      return periodoMatch && estadoMatch;
    });
    
    this.actualizarEstadisticas();
    this.renderizarHistorial();
  }

  limpiarFiltros() {
    document.getElementById('filtroPeriodo').value = '';
    document.getElementById('filtroEstado').value = '';
    document.getElementById('buscarMateria').value = '';
    this.datosFiltrados = [...this.datosHistorial];
    this.actualizarEstadisticas();
    this.renderizarHistorial();
  }

  buscarMateria(termino) {
    if (!termino) {
      this.datosFiltrados = [...this.datosHistorial];
    } else {
      this.datosFiltrados = this.datosHistorial
        .map(periodo => ({
          ...periodo,
          materias: periodo.materias.filter(materia => 
            materia.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            materia.codigo.toLowerCase().includes(termino.toLowerCase())
          )
        }))
        .filter(periodo => periodo.materias.length > 0);
    }
    this.actualizarEstadisticas();
    this.renderizarHistorial();
  }

  initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
      sidebar.classList.toggle('collapsed');
      overlay.classList.toggle('active');
    }

    sidebarToggle?.addEventListener('click', toggleSidebar);
    mobileToggle?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);
  }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
  new HistorialAcademico();
});