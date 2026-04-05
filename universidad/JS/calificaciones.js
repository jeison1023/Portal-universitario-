// JS/calificaciones.js
document.addEventListener('DOMContentLoaded', function() {
  // Datos de ejemplo
  const calificacionesData = [
    {
      codigo: 'MAT-301',
      materia: 'Matemáticas III',
      nota1: 4.2,
      nota2: 4.5,
      parcial: 4.35,
      final: 4.8,
      promedio: 4.6,
      estado: 'Aprobada',
      periodo: '2024-2',
      creditos: 4
    },
    {
      codigo: 'FIS-202',
      materia: 'Física II',
      nota1: 3.8,
      nota2: 4.0,
      parcial: 3.9,
      final: 4.2,
      promedio: 4.0,
      estado: 'Aprobada',
      periodo: '2024-2',
      creditos: 4
    },
    {
      codigo: 'PROG-401',
      materia: 'Programación IV',
      nota1: 4.8,
      nota2: 4.9,
      parcial: 4.85,
      final: null,
      promedio: 4.85,
      estado: 'En curso',
      periodo: '2024-2',
      creditos: 4
    },
    {
      codigo: 'CAL-201',
      materia: 'Cálculo II',
      nota1: 2.8,
      nota2: 3.0,
      parcial: 2.9,
      final: 2.5,
      promedio: 2.7,
      estado: 'Reprobada',
      periodo: '2024-1',
      creditos: 4
    }
  ];

  let datosFiltrados = [...calificacionesData];
  let chart = null;

  // Renderizar tabla
  function renderTabla() {
    const tbody = document.getElementById('tabla-calificaciones');
    tbody.innerHTML = datosFiltrados.map((item, index) => `
      <tr>
        <td>
          <div class="materia-nombre">${item.materia}</div>
          <div class="materia-codigo">${item.codigo} (${item.creditos} cr)</div>
        </td>
        <td class="nota-cell">${item.nota1 || '-'}</td>
        <td class="nota-cell">${item.nota2 || '-'}</td>
        <td class="nota-cell">${item.parcial || '-'}</td>
        <td class="nota-cell">${item.final || '-'}</td>
        <td class="promedio-final">${item.promedio}</td>
        <td><span class="estado-badge estado-${item.estado.toLowerCase().replace(' ', '-')}">${item.estado}</span></td>
        <td>
          <button class="accion-btn" title="Ver detalle" onclick="verDetalle(${index})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');

    document.getElementById('totalRegistros').textContent = `${datosFiltrados.length} registros`;
    actualizarEstadisticas();
  }

  // Actualizar estadísticas
  function actualizarEstadisticas() {
    const aprobadas = datosFiltrados.filter(d => d.estado === 'Aprobada').length;
    const reprobadas = datosFiltrados.filter(d => d.estado === 'Reprobada').length;
    const creditos = datosFiltrados.reduce((sum, d) => sum + d.creditos, 0);
    const promedio = datosFiltrados.reduce((sum, d) => sum + d.promedio, 0) / datosFiltrados.length || 0;

    document.getElementById('promedioGeneral').textContent = promedio.toFixed(2);
    document.getElementById('materiasAprobadas').textContent = aprobadas;
    document.getElementById('materiasReprobadas').textContent = reprobadas;
    document.getElementById('creditosAprobados').textContent = creditos;
  }

  // Filtros
  document.getElementById('aplicarFiltros').addEventListener('click', function() {
    const periodo = document.getElementById('filtroPeriodo').value;
    const estado = document.getElementById('filtroEstado').value;
    const busqueda = document.getElementById('buscarMateria').value.toLowerCase();

    datosFiltrados = calificacionesData.filter(item => {
      return (!periodo || item.periodo === periodo) &&
             (!estado || item.estado === estado) &&
             (!busqueda || 
              item.materia.toLowerCase().includes(busqueda) || 
              item.codigo.toLowerCase().includes(busqueda));
    });

    renderTabla();
    actualizarGrafico();
  });

  document.getElementById('limpiarFiltros').addEventListener('click', function() {
    document.getElementById('filtroPeriodo').value = '';
    document.getElementById('filtroEstado').value = '';
    document.getElementById('buscarMateria').value = '';
    datosFiltrados = [...calificacionesData];
    renderTabla();
    actualizarGrafico();
  });

  // Búsqueda en tiempo real
  document.getElementById('buscarMateria').addEventListener('input', function() {
    const busqueda = this.value.toLowerCase();
    datosFiltrados = calificacionesData.filter(item =>
      item.materia.toLowerCase().includes(busqueda) || 
      item.codigo.toLowerCase().includes(busqueda)
    );
    renderTabla();
    actualizarGrafico();
  });

  // Gráfico
  function actualizarGrafico() {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    
    if (chart) {
      chart.destroy();
    }

    const labels = datosFiltrados.map(d => d.materia.slice(0, 15) + '...');
    const data = datosFiltrados.map(d => d.promedio);

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Promedio',
          data: data,
          backgroundColor: data.map(p => p >= 4.0 ? '#10b981' : p >= 3.0 ? '#f59e0b' : '#ef4444'),
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            grid: { color: '#f1f5f9' },
            ticks: { stepSize: 1 }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // Funciones de acciones
  window.verDetalle = function(index) {
    const item = datosFiltrados[index];
    alert(`Detalle de ${item.materia}:\nCódigo: ${item.codigo}\nPromedio: ${item.promedio}\nEstado: ${item.estado}`);
  };

  window.exportarCalificaciones = function() {
    window.print();
  };

  window.imprimirCalificaciones = function() {
    window.print();
  };

  // Inicializar
  renderTabla();
  actualizarGrafico();

  // Sidebar functionality (same as dashboard)
  const;}}