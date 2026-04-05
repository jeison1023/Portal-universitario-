// ==========================
// CALIFICACIONES PRO SYSTEM
// ==========================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================
  // DATA
  // ==========================
  const calificacionesData = [
    { codigo:'MAT-301', materia:'Matemáticas III', nota1:4.2, nota2:4.5, parcial:4.35, final:4.8, promedio:4.6, estado:'Aprobada', periodo:'2024-2', creditos:4 },
    { codigo:'FIS-202', materia:'Física II', nota1:3.8, nota2:4.0, parcial:3.9, final:4.2, promedio:4.0, estado:'Aprobada', periodo:'2024-2', creditos:4 },
    { codigo:'PROG-401', materia:'Programación IV', nota1:4.8, nota2:4.9, parcial:4.85, final:null, promedio:4.85, estado:'En curso', periodo:'2024-2', creditos:4 },
    { codigo:'CAL-201', materia:'Cálculo II', nota1:2.8, nota2:3.0, parcial:2.9, final:2.5, promedio:2.7, estado:'Reprobada', periodo:'2024-1', creditos:4 },
    { codigo:'ING-101', materia:'Inglés Técnico I', nota1:4.5, nota2:4.7, parcial:4.6, final:4.9, promedio:4.7, estado:'Aprobada', periodo:'2024-1', creditos:3 },
    { codigo:'BD-301', materia:'Bases de Datos', nota1:4.3, nota2:4.1, parcial:4.2, final:null, promedio:4.2, estado:'En curso', periodo:'2024-2', creditos:4 }
  ];

  let datosFiltrados = [...calificacionesData];
  let chart = null;
  let debounceTimer;

  // ==========================
  // AUTH
  // ==========================
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return window.location.href = 'login.html';

  // ==========================
  // HELPERS
  // ==========================
  const $ = id => document.getElementById(id);

  const format = (n, d=2) => n != null ? n.toFixed(d) : '-';

  // ==========================
  // RENDER TABLA
  // ==========================
  function renderTabla() {
    const tbody = $('tabla-calificaciones');
    if (!tbody) return;

    tbody.innerHTML = datosFiltrados.map((item, i) => `
      <tr>
        <td>
          <div class="materia-nombre">${item.materia}</div>
          <div class="materia-codigo">${item.codigo} (${item.creditos} cr)</div>
        </td>
        <td class="nota-cell">${format(item.nota1,1)}</td>
        <td class="nota-cell">${format(item.nota2,1)}</td>
        <td class="nota-cell">${format(item.parcial,2)}</td>
        <td class="nota-cell">${format(item.final,1)}</td>
        <td class="promedio-final">${format(item.promedio)}</td>
        <td><span class="estado-badge estado-${item.estado.toLowerCase().replace(/ /g,'-')}">${item.estado}</span></td>
        <td>
          <button class="action-btn" onclick="verDetalle(${i})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');

    $('totalRegistros').textContent = `${datosFiltrados.length} registros`;

    actualizarStats();
  }

  // ==========================
  // STATS PRO
  // ==========================
  function actualizarStats() {
    const total = datosFiltrados.length || 1;

    const stats = {
      aprobadas: 0,
      reprobadas: 0,
      creditos: 0,
      promedio: 0
    };

    datosFiltrados.forEach(d => {
      if (d.estado === 'Aprobada') stats.aprobadas++;
      if (d.estado === 'Reprobada') stats.reprobadas++;
      stats.creditos += d.creditos;
      stats.promedio += d.promedio || 0;
    });

    $('promedioGeneral').textContent = (stats.promedio / total).toFixed(2);
    $('materiasAprobadas').textContent = stats.aprobadas;
    $('materiasReprobadas').textContent = stats.reprobadas;
    $('creditosAprobados').textContent = stats.creditos;
  }

  // ==========================
  // FILTROS
  // ==========================
  function filtrar() {
    const periodo = $('filtroPeriodo').value;
    const estado = $('filtroEstado').value;
    const q = $('buscarMateria').value.toLowerCase();

    datosFiltrados = calificacionesData.filter(d =>
      (!periodo || d.periodo === periodo) &&
      (!estado || d.estado === estado) &&
      (!q || d.materia.toLowerCase().includes(q) || d.codigo.toLowerCase().includes(q))
    );

    renderTabla();
    renderChart();
  }

  $('aplicarFiltros')?.addEventListener('click', filtrar);

  $('limpiarFiltros')?.addEventListener('click', () => {
    ['filtroPeriodo','filtroEstado','buscarMateria'].forEach(id => $(id).value = '');
    datosFiltrados = [...calificacionesData];
    renderTabla();
    renderChart();
  });

  // 🔥 debounce (PRO)
  $('buscarMateria')?.addEventListener('input', e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => filtrar(), 300);
  });

  // ==========================
  // CHART PRO
  // ==========================
  function renderChart() {
    const ctx = $('chartCanvas')?.getContext('2d');
    if (!ctx) return;

    chart?.destroy();

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datosFiltrados.map(d => d.materia.slice(0,12)),
        datasets: [{
          data: datosFiltrados.map(d => d.promedio || 0),
          backgroundColor: datosFiltrados.map(p =>
            p.promedio >= 4 ? '#10b981' :
            p.promedio >= 3 ? '#f59e0b' : '#ef4444'
          ),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display:false }},
        scales: {
          y: { beginAtZero:true, max:5 }
        }
      }
    });
  }

  // ==========================
  // MODAL PRO
  // ==========================
  window.verDetalle = index => {
    const d = datosFiltrados[index];

    const modal = document.createElement('div');
    modal.className = 'modal-pro';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close">×</button>
        <h3>${d.materia}</h3>
        <p><strong>Código:</strong> ${d.codigo}</p>
        <p><strong>Promedio:</strong> ${format(d.promedio)}</p>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = e => e.target === modal && modal.remove();
  };

  // ==========================
  // SIDEBAR PRO (UNIFICADO)
  // ==========================
  const sidebar = $('sidebar');
  const overlay = $('sidebarOverlay');
  const mobileBtn = $('mobileMenuToggle');
  const toggle = $('sidebarToggle');

  mobileBtn?.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebar', sidebar.classList.contains('collapsed'));
  });

  // persistencia
  if (localStorage.getItem('sidebar') === 'true') {
    sidebar.classList.add('collapsed');
  }

  // ==========================
  // INIT
  // ==========================
  renderTabla();
  renderChart();

  console.log('🔥 Sistema PRO cargado:', usuario.nombre);
});