// Datos de ejemplo de calificaciones
const calificacionesData = [
  {
    id: 1,
    materia: "Matemáticas Avanzadas",
    periodo: "2024-I",
    nota1: 18,
    nota2: 16,
    parcial: 17,
    final: 19,
    promedio: 17.5,
    estado: "Aprobada"
  },
  {
    id: 2,
    materia: "Física Cuántica",
    periodo: "2024-I",
    nota1: 12,
    nota2: 14,
    parcial: 13,
    final: 15,
    promedio: 13.5,
    estado: "Reprobada"
  },
  {
    id: 3,
    materia: "Programación Web",
    periodo: "2024-I",
    nota1: 19,
    nota2: 20,
    parcial: 19.5,
    final: 18,
    promedio: 19.1,
    estado: "Aprobada"
  },
  {
    id: 4,
    materia: "Base de Datos",
    periodo: "2024-II",
    nota1: 17,
    nota2: 16,
    parcial: 16.5,
    final: null,
    promedio: 16.5,
    estado: "En curso"
  },
  {
    id: 5,
    materia: "Redes de Computadoras",
    periodo: "2023-II",
    nota1: 15,
    nota2: 16,
    parcial: 15.5,
    final: 17,
    promedio: 15.8,
    estado: "Aprobada"
  }
];

let calificaciones = [...calificacionesData];
let sortColumn = null;
let sortDirection = 'asc';
let chart = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  cargarSidebar();
  cargarHeader();
  inicializarCalificaciones();
});

// Cargar sidebar y header (funciones placeholder)
function cargarSidebar() {
  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo">
      <i class="fas fa-graduation-cap"></i>
      <span>UniPortal</span>
    </div>
    <!-- Más contenido del sidebar -->
  `;
}

function cargarHeader() {
  document.getElementById('header').innerHTML = `
    <div class="header-left">
      <button class="menu-toggle"><i class="fas fa-bars"></i></button>
      <h2>Dashboard</h2>
    </div>
    <div class="header-right">
      <div class="user-profile">
        <img src="https://via.placeholder.com/40" alt="Usuario">
        <span>Estudiante</span>
      </div>
    </div>
  `;
}

function inicializarCalificaciones() {
  mostrarEstadisticas();
  poblarFiltros();
  renderizarTabla();
  inicializarGrafico();
  actualizarContadores();
}

function mostrarEstadisticas() {
  const aprobadas = calificaciones.filter(c => c.estado === 'Aprobada').length;
  const reprobadas = calificaciones.filter(c => c.estado === 'Reprobada').length;
  const enCurso = calificaciones.filter(c => c.estado === 'En curso').length;
  const promedioGeneral = calificaciones.reduce((sum, c) => sum + c.promedio, 0) / calificaciones.length;

  document.getElementById('statsContainer').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
      <h3>${aprobadas}</h3>
      <p>Materias Aprobadas</p>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
      <h3>${reprobadas}</h3>
      <p>Materias Reprobadas</p>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-clock"></i></div>
      <h3>${enCurso}</h3>
      <p>En Curso</p>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
      <h3>${promedioGeneral.toFixed(1)}</h3>
      <p>Promedio General</p>
    </div>
  `;
}

function poblarFiltros() {
  const periodos = [...new Set(calificaciones.map(c => c.periodo))];
  const selectPeriodo = document.getElementById('filtroPeriodo');
  
  selectPeriodo.innerHTML = '<option value="">Todos los periodos</option>';
  periodos.forEach(periodo => {
    const option = document.createElement('option');
    option.value = periodo;
    option.textContent = periodo;
    selectPeriodo.appendChild(option);
  });
}

function renderizarTabla() {
  const tbody = document.getElementById('tabla-calificaciones');
  const filtradas = aplicarFiltros();
  
  if (filtradas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No se encontraron calificaciones</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtradas.map(calificacion => `
    <tr>
      <td><strong>${calificacion.materia}</strong></td>
      <td><span class="nota">${calificacion.nota1 || '-'}</span></td>
      <td><span class="nota">${calificacion.nota2 || '-'}</span></td>
      <td><span class="nota">${calificacion.parcial || '-'}</span></td>
      <td><span class="nota">${calificacion.final || '-'}</span></td>
      <td><span class="nota">${calificacion.promedio.toFixed(1)}</span></td>
      <td>
        <span class="calificacion-${calificacion.estado.toLowerCase().replace(' ', '-')}">
          ${calificacion.estado}
        </span>
      </td>
      <td>
        <div class="btn-group">
          <button class="action-btn" onclick="verDetalle(${calificacion.id})" title="Ver detalle">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn" onclick="editarCalificacion(${calificacion.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function aplicarFiltros() {
  let filtradas = [...calificaciones];

  // Filtro por periodo
  const periodo = document.getElementById('filtroPeriodo').value;
  if (periodo) {
    filtradas = filtradas.filter(c => c.periodo === periodo);
  }

  // Filtro por estado
  const estado = document.getElementById('filtroEstado').value;
  if (estado) {
    filtradas = filtradas.filter(c => c.estado === estado);
  }

  // Filtro por búsqueda
  const busqueda = document.getElementById('buscarMateria').value.toLowerCase();
  if (busqueda) {
    filtradas = filtradas.filter(c => 
      c.materia.toLowerCase().includes(busqueda)
    );
  }

  // Ordenamiento
  if (sortColumn) {
    filtradas.sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtradas;
}

function filtrarCalificaciones() {
  renderizarTabla();
  actualizarContadores();
  actualizarGrafico();
}

function limpiarFiltrosCalificaciones() {
  document.getElementById('filtroPeriodo').value = '';
  document.getElementById('filtroEstado').value = '';
  document.getElementById('buscarMateria').value = '';
  filtrarCalificaciones();
}

function actualizarContadores() {
  const total = calificaciones.length;
  const promedio = calificaciones.reduce((sum, c) => sum + c.promedio, 0) / total || 0;
  
  document.getElementById('totalMaterias').textContent = `Total: ${total} materias`;
  document.getElementById('promedioActual').textContent = `Promedio: ${promedio.toFixed(1)}`;
}

function inicializarGrafico() {
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Aprobadas', 'Reprobadas', 'En curso'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: [
          '#10b981',
          '#ef4444', 
          '#f59e0b'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
  
  actualizarGrafico();
}

function actualizarGrafico() {
  if (!chart) return;
  
  const aprobadas = calificaciones.filter(c => c.estado === 'Aprobada').length;
  const reprobadas = calificaciones.filter(c => c.estado === 'Reprobada').length;
  const enCurso = calificaciones.filter(c => c.estado === 'En curso').length;
  
  chart.data.datasets[0].data = [aprobadas, reprobadas, enCurso];
  chart.update('none');
}

// EVENTOS DE ORDENAMIENTO
document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', function() {
    const column = this.getAttribute('data-sort');
    
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
    
    // Actualizar clases visuales
    document.querySelectorAll('th').forEach(t => {
      t.classList.remove('sort-asc', 'sort-desc');
    });
    this.classList.add(`sort-${sortDirection}`);
    
    filtrarCalificaciones();
  });
});

// FUNCIONES DE ACCIONES
function exportarCalificaciones() {
  // Simular exportación PDF
  alert('🔄 Exportando calificaciones a PDF... (Función simulada)');}