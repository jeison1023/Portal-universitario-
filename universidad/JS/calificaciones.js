// JS/calificaciones.js
document.addEventListener('DOMContentLoaded', function() {
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
    },
    {
      codigo: 'ING-101',
      materia: 'Inglés Técnico I',
      nota1: 4.5,
      nota2: 4.7,
      parcial: 4.6,
      final: 4.9,
      promedio: 4.7,
      estado: 'Aprobada',
      periodo: '2024-1',
      creditos: 3
    },
    {
      codigo: 'BD-301',
      materia: 'Bases de Datos',
      nota1: 4.3,
      nota2: 4.1,
      parcial: 4.2,
      final: null,
      promedio: 4.2,
      estado: 'En curso',
      periodo: '2024-2',
      creditos: 4
    }
  ];

  let datosFiltrados = [...calificacionesData];
  let chart = null;

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuarioLogueado) {
    window.location.href = 'login.html';
    return;
  }

  function renderTabla() {
    const tbody = document.getElementById('tabla-calificaciones');
    if (!tbody) return;
    
    tbody.innerHTML = datosFiltrados.map((item, index) => `
      <tr>
        <td>
          <div class="materia-nombre">${item.materia}</div>
          <div class="materia-codigo">${item.codigo} (${item.creditos} cr)</div>
        </td>
        <td class="nota-cell">${item.nota1?.toFixed(1) || '-'}</td>
        <td class="nota-cell">${item.nota2?.toFixed(1) || '-'}</td>
        <td class="nota-cell">${item.parcial?.toFixed(2) || '-'}</td>
        <td class="nota-cell">${item.final?.toFixed(1) || '-'}</td>
        <td class="promedio-final">${item.promedio?.toFixed(2) || '-'}</td>
        <td><span class="estado-badge estado-${item.estado.toLowerCase().replace(/ /g, '-')}">${item.estado}</span></td>
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

  function actualizarEstadisticas() {
    const aprobadas = datosFiltrados.filter(d => d.estado === 'Aprobada').length;
    const reprobadas = datosFiltrados.filter(d => d.estado === 'Reprobada').length;
    const enCurso = datosFiltrados.filter(d => d.estado === 'En curso').length;
    const creditos = datosFiltrados.reduce((sum, d) => sum + d.creditos, 0);
    const promedio = datosFiltrados.reduce((sum, d) => sum + (d.promedio || 0), 0) / datosFiltrados.length || 0;

    document.getElementById('promedioGeneral').textContent = promedio.toFixed(2);
    document.getElementById('materiasAprobadas').textContent = aprobadas;
    document.getElementById('materiasReprobadas').textContent = reprobadas;
    document.getElementById('materiasEnCurso').textContent = enCurso;
    document.getElementById('creditosAprobados').textContent = creditos;
  }

  function aplicarFiltros() {
    const periodo = document.getElementById('filtroPeriodo')?.value || '';
    const estado = document.getElementById('filtroEstado')?.value || '';
    const busqueda = document.getElementById('buscarMateria')?.value.toLowerCase() || '';

    datosFiltrados = calificacionesData.filter(item => {
      return (!periodo || item.periodo === periodo) &&
             (!estado || item.estado === estado) &&
             (!busqueda || 
              item.materia.toLowerCase().includes(busqueda) || 
              item.codigo.toLowerCase().includes(busqueda));
    });

    renderTabla();
    actualizarGrafico();
  }

  document.getElementById('aplicarFiltros')?.addEventListener('click', aplicarFiltros);
  
  document.getElementById('limpiarFiltros')?.addEventListener('click', function() {
    const filtros = ['filtroPeriodo', 'filtroEstado', 'buscarMateria'];
    filtros.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    datosFiltrados = [...calificacionesData];
    renderTabla();
    actualizarGrafico();
  });

  document.getElementById('buscarMateria')?.addEventListener('input', function() {
    const busqueda = this.value.toLowerCase();
    datosFiltrados = calificacionesData.filter(item =>
      item.materia.toLowerCase().includes(busqueda) || 
      item.codigo.toLowerCase().includes(busqueda)
    );
    renderTabla();
    actualizarGrafico();
  });

  function actualizarGrafico() {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (chart) {
      chart.destroy();
    }

    const labels = datosFiltrados.map(d => {
      const nombre = d.materia.length > 15 ? d.materia.slice(0, 15) + '...' : d.materia;
      return nombre;
    });
    const data = datosFiltrados.map(d => d.promedio || 0);

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Promedio',
          data: data,
          backgroundColor: data.map(p => {
            if (p >= 4.0) return '#10b981';
            if (p >= 3.0) return '#f59e0b';
            return '#ef4444';
          }),
          borderRadius: 8,
          borderSkipped: false,
          borderWidth: 1,
          borderColor: '#ffffff20'
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
            grid: { display: false },
            ticks: {
              maxRotation: 45,
              minRotation: 0
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  window.verDetalle = function(index) {
    const item = datosFiltrados[index];
    const detalleHTML = `
      <div style="max-width: 500px; font-family: 'Poppins', sans-serif;">
        <h3 style="color: #1f2937; margin-bottom: 1rem;">📚 ${item.materia}</h3>
        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;">
          <p><strong>Código:</strong> ${item.codigo}</p>
          <p><strong>Créditos:</strong> ${item.creditos}</p>
          <p><strong>Período:</strong> ${item.periodo}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div><strong>Nota 1:</strong> ${item.nota1?.toFixed(1) || '-'}</div>
          <div><strong>Nota 2:</strong> ${item.nota2?.toFixed(1) || '-'}</div>
          <div><strong>Parcial:</strong> ${item.parcial?.toFixed(2) || '-'}</div>
          <div><strong>Final:</strong> ${item.final?.toFixed(1) || '-'}</div>
        </div>
        <div style="text-align: center; padding: 1rem; background: ${item.promedio >= 4.0 ? '#dcfce7' : item.promedio >= 3.0 ? '#fef3c7' : '#fee2e2'}; border-radius: 0.75rem; border-left: 4px solid ${item.promedio >= 4.0 ? '#10b981' : item.promedio >= 3.0 ? '#f59e0b' : '#ef4444'};">
          <h4 style="margin: 0; color: ${item.promedio >= 4.0 ? '#166534' : item.promedio >= 3.0 ? '#92400e' : '#991b1b'};">Promedio: ${item.promedio?.toFixed(2) || '-'} ${item.estado}</h4>
        </div>
      </div>
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; 
      z-index: 10000; backdrop-filter: blur(5px);
    `;
    modal.innerHTML = `
      <div style="background: white; border-radius: 1.5rem; max-width: 90vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.25); animation: modalSlide 0.3s ease;">
        <div style="padding: 2rem; position: relative;">
          <button onclick="this.closest('div[style*=\'position: fixed\']').remove()" 
                  style="position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">×</button>
          ${detalleHTML}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.exportarCalificaciones = function() {
    const dataStr = JSON.stringify(datosFiltrados, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calificaciones_${usuarioLogueado?.usuario || 'estudiante'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  window.imprimirCalificaciones = function() {
    window.print();
  };

  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar?.classList.toggle('active');
    });
  }

  document.addEventListener('click', function(e) {
    if (sidebar && !sidebar.contains(e.target) && sidebarToggle && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });

  renderTabla();
  actualizarGrafico();

  console.log('📚 Calificaciones cargadas para:', usuarioLogueado?.nombre || 'Usuario');
});