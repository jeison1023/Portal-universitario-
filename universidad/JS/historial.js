// DATOS SIMULADOS DE HISTORIAL ACADÉMICO
const historialData = [
  {
    id: 1,
    periodo: "2024-I",
    estado: "completado",
    promedio: 17.2,
    creditosAprobados: 24,
    materiasTotal: 6,
    materias: [
      {
        nombre: "Matemáticas Avanzadas",
        codigo: "MAT-401",
        profesor: "Dr. Miguel López",
        nota: 18.5,
        creditos: 4,
        estado: "aprobada"
      },
      {
        nombre: "Programación Web",
        codigo: "PROG-305",
        profesor: "Msc. Laura Pérez",
        nota: 19.2,
        creditos: 4,
        estado: "aprobada"
      },
      {
        nombre: "Física Cuántica",
        codigo: "FIS-402",
        profesor: "Dr. Carlos Ruiz",
        nota: 12.8,
        creditos: 4,
        estado: "reprobada"
      },
      {
        nombre: "Base de Datos",
        codigo: "BD-301",
        profesor: "Ing. Ana Gómez",
        nota: 17.8,
        creditos: 4,
        estado: "aprobada"
      },
      {
        nombre: "Redes de Computadoras",
        codigo: "RED-302",
        profesor: "Msc. Juan Martínez",
        nota: 16.5,
        creditos: 4,
        estado: "aprobada"
      },
      {
        nombre: "Estadística Aplicada",
        codigo: "EST-201",
        profesor: "Dr. María Vargas",
        nota: 18.0,
        creditos: 4,
        estado: "aprobada"
      }
    ]
  },
  {
    id: 2,
    periodo: "2023-II",
    estado: "completado",
    promedio: 16.8,
    creditosAprobados: 20,
    materiasTotal: 5,
    materias: [
      {
        nombre: "Algoritmos Avanzados",
        codigo: "ALGO-401",
        profesor: "Dr. Roberto Silva",
        nota: 17.5,
        creditos: 4,
        estado: "aprobada"
      }
    ]
  },
  {
    id: 3,
    periodo: "2024-II",
    estado: "curso",
    promedio: 16.5,
    creditosAprobados: 12,
    materiasTotal: 4,
    materias: [
      {
        nombre: "Inteligencia Artificial",
        codigo: "IA-501",
        profesor: "Msc. Elena Torres",
        nota: null,
        creditos: 4,
        estado: "curso"
      },
      {
        nombre: "Machine Learning",
        codigo: "ML-502",
        profesor: "Dr. David Morales",
        nota: null,
        creditos: 4,
        estado: "curso"
      }
    ]
  }
];

let historialFiltrado = [...historialData];
let sortDirection = 'desc';

// INICIALIZACIÓN ESPECÍFICA PARA HISTORIAL
function inicializarHistorial() {
  cargarSidebar();
  cargarHeader();
  
  // Esperar un momento para simular carga
  setTimeout(() => {
    poblarFiltros();
    calcularEstadisticasGlobales();
    renderizarHistorial();
    inicializarEventos();
  }, 800);
}

// CALCULAR ESTADÍSTICAS GLOBALES
function calcularEstadisticasGlobales() {
  const todasMaterias = historialData.flatMap(periodo => periodo.materias);
  const aprobadas = todasMaterias.filter(m => m.estado === 'aprobada').length;
  const reprobadas = todasMaterias.filter(m => m.estado === 'reprobada').length;
  const creditosAprobados = todasMaterias
    .filter(m => m.estado === 'aprobada')
    .reduce((sum, m) => sum + m.creditos, 0);
  
  const promedioGeneral = todasMaterias
    .filter(m => m.nota !== null)
    .reduce((sum, m) => sum + m.nota, 0) / todasMaterias.filter(m => m.nota !== null).length || 0;

  document.getElementById('promedioGeneral').textContent = promedioGeneral.toFixed(1);
  document.getElementById('creditosAprobados').textContent = creditosAprobados;
  document.getElementById('materiasAprobadas').textContent = aprobadas;
  document.getElementById('materiasReprobadas').textContent = reprobadas;
}

// POBLAR FILTROS
function poblarFiltros() {
  const periodos = [...new Set(historialData.map(p => p.periodo))];
  const selectPeriodo = document.getElementById('filtroPeriodo');
  
  selectPeriodo.innerHTML = '<option value="">Todos</option>';
  periodos.forEach(periodo => {
    const option = document.createElement('option');
    option.value = periodo;
    option.textContent = periodo;
    selectPeriodo.appendChild(option);
  });
}

// RENDERIZAR HISTORIAL
function renderizarHistorial() {
  const container = document.getElementById('historialContainer');
  const filtrado = aplicarFiltros();
  
  if (filtrado.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>No se encontraron periodos</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtrado.map(periodo => `
    <div class="historial-periodo">
      <div class="periodo-header">
        <div class="periodo-titulo">
          <span class="periodo-badge">${periodo.periodo}</span>
          <div class="periodo-estado estado-${periodo.estado}">
            <i class="fas fa-circle"></i>
            ${periodo.estado === 'completado' ? 'Completado' : 
              periodo.estado === 'curso' ? 'En curso' : 'Pendiente'}
          </div>
        </div>
        
        <div class="periodo-stats">
          <div class="periodo-stat">
            <div class="periodo-stat-value">${periodo.promedio?.toFixed(1) || '-'}</div>
            <div class="periodo-stat-label">Promedio</div>
          </div>
          <div class="periodo-stat">
            <div class="periodo-stat-value">${periodo.creditosAprobados}</div>
            <div class="periodo-stat-label">Créditos</div>
          </div>
          <div class="periodo-stat">
            <div class="periodo-stat-value">${periodo.materias.length}</div>
            <div class="periodo-stat-label">Materias</div>
          </div>
        </div>
      </div>
      
      <div class="materias-lista">
        ${periodo.materias.map(materia => `
          <div class="materia-item">
            <div class="materia-info">
              <div class="materia-icon" style="background: linear-gradient(135deg, ${materia.estado === 'aprobada' ? '#10b981' : materia.estado === 'reprobada' ? '#ef4444' : '#f59e0b'}20, ${materia.estado === 'aprobada' ? '#059669' : materia.estado === 'reprobada' ? '#dc2626' : '#d97706'}10); color: ${materia.estado === 'aprobada' ? '#10b981' : materia.estado === 'reprobada' ? '#ef4444' : '#f59e0b'};">
                <i class="fas fa-book"></i>
              </div>
              <div class="materia-detalle">
                <h4>${materia.nombre}</h4>
                <p><strong>${materia.codigo}</strong> | ${materia.profesor}</p>
              </div>
            </div>
            <div class="materia-calificacion ${materia.estado === 'aprobada' ? 'calif-aprobada' : materia.estado === 'reprobada' ? 'calif-reprobada' : 'calif-curso'}">
              ${materia.nota !== null ? materia.nota.toFixed(1) : '-'}
            </div>
            <div class="materia-creditos">${materia.creditos} cr.</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// APLICAR FILTROS
function aplicarFiltros() {
  let filtrado = [...historialData];

  // Filtro por periodo
  const periodo = document.getElementById('filtroPeriodo').value;
  if (periodo) {
    filtrado = filtrado.filter(p => p.periodo === periodo);
  }

  // Filtro por estado de materias (aplicado a periodos que contengan materias con ese estado)
  const estado = document.getElementById('filtroEstado').value;
  if (estado) {
    filtrado = filtrado.filter(periodo => 
      periodo.materias.some(m => 
        (estado === 'Aprobada' && m.estado === 'aprobada') ||
        (estado === 'Reprobada' && m.estado === 'reprobada') ||
        (estado === 'En curso' && m.estado === 'curso')
      )
    );
  }

  // Filtro de búsqueda
  const busqueda = document.getElementById('buscarMateria').value.toLowerCase();
  if (busqueda) {
    filtrado = filtrado.filter(periodo => 
      periodo.materias.some(materia => 
        materia.nombre.toLowerCase().includes(busqueda) ||
        materia.codigo.toLowerCase().includes(busqueda)
      )
    );
  }

  // Ordenar por periodo (más reciente primero)
  filtrado.sort((a, b) => {
    const dateA = new Date(a.periodo.split('-')[0], a.periodo.split('-')[1] === 'I' ? 0 : 6);
    const dateB = new Date(b.periodo.split('-')[0], b.periodo.split('-')[1] === 'I' ? 0 : 6);
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return filtrado;
}

// EVENTOS
function inicializarEventos() {
  // Filtros
  document.getElementById('filtroPeriodo').addEventListener('change', filtrarHistorial);
  document.getElementById('filtroEstado').addEventListener('change', filtrarHistorial);
  document.getElementById('buscarMateria').addEventListener('input', filtrarHistorial);
  
  // Botones
  document.getElementById('btnLimpiarHistorial')}