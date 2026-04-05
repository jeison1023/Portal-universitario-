// ============================================
// MATERIAS.JS - VERSION PRO
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // SIDEBAR MOBILE (FIX)
  // ============================
  const sidebar = document.getElementById("sidebar");
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const overlay = document.getElementById("sidebarOverlay");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (overlay) {
    overlay.addEventListener("click", cerrarMenu);
  }

  function cerrarMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", cerrarMenu);
  });

  // ============================
  // DATA MOCK
  // ============================
  const materiasData = [
    { id: 1, nombre: 'Programación Web II', docente: 'Dr. María Gómez', aula: 'A-301', estado: 'activa', credito: 4 },
    { id: 2, nombre: 'Base de Datos II', docente: 'Ing. Carlos Ruiz', aula: 'Lab-105', estado: 'activa', credito: 4 },
    { id: 3, nombre: 'Matemáticas Discretas', docente: 'MSc. Laura Torres', aula: 'B-204', estado: 'finalizada', credito: 3 },
    { id: 4, nombre: 'Ingeniería de Software', docente: 'Dr. Pedro López', aula: 'C-112', estado: 'activa', credito: 4 },
    { id: 5, nombre: 'Redes de Computadoras', docente: 'Ing. Ana Martínez', aula: 'Lab-201', estado: 'reprobada', credito: 4 }
  ];

  // ============================
  // RENDER TABLA
  // ============================
  const tbody = document.getElementById('tabla-materias');
  const emptyState = document.getElementById('emptyState');

  function renderTable(data = materiasData) {

    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = "";
      emptyState.style.display = 'block';
      return;
    }

    tbody.innerHTML = data.map(materia => `
      <tr>
        <td><strong>${materia.nombre}</strong></td>
        <td>${materia.docente}</td>
        <td>${materia.aula}</td>
        <td>
          <span class="status-badge status-${materia.estado}">
            ${formatearEstado(materia.estado)}
          </span>
        </td>
        <td class="actions-cell">
          <button class="action-btn action-edit" title="Ver detalles" data-id="${materia.id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn action-delete" title="Retirar" data-id="${materia.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    emptyState.style.display = 'none';
  }

  // ============================
  // FORMATO ESTADO (PRO)
  // ============================
  function formatearEstado(estado) {
    return {
      activa: "En curso",
      finalizada: "Finalizada",
      reprobada: "Reprobada"
    }[estado] || estado;
  }

  // ============================
  // EVENTOS TABLA (DELEGACIÓN)
  // ============================
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;

    if (btn.classList.contains('action-edit')) {
      verMateria(id);
    }

    if (btn.classList.contains('action-delete')) {
      retirarMateria(id);
    }
  });

  // ============================
  // FILTROS
  // ============================
  const filtroEstado = document.getElementById('filtroEstadoMateria');
  const buscarInput = document.getElementById('buscarMateria');

  if (filtroEstado) {
    filtroEstado.addEventListener('change', () => aplicarFiltros());
  }

  if (buscarInput) {
    buscarInput.addEventListener('input', () => aplicarFiltros());
  }

  function aplicarFiltros() {
    const estado = filtroEstado.value;
    const termino = buscarInput.value.toLowerCase();

    const filtrado = materiasData.filter(m =>
      (!estado || m.estado === estado) &&
      (
        m.nombre.toLowerCase().includes(termino) ||
        m.docente.toLowerCase().includes(termino)
      )
    );

    renderTable(filtrado);
  }

  // ============================
  // STATS
  // ============================
  const aprobadas = materiasData.filter(m => m.estado === 'finalizada').length;
  const enCurso = materiasData.filter(m => m.estado === 'activa').length;
  const creditos = materiasData.reduce((sum, m) => sum + m.credito, 0);

  document.getElementById('materiasAprobadas').textContent = aprobadas;
  document.getElementById('materiasCurso').textContent = enCurso;
  document.getElementById('creditosTotal').textContent = creditos;

  // ============================
  // BOTÓN NUEVA MATERIA
  // ============================
  const btnNueva = document.getElementById('btnNuevaMateria');

  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      alert('🚧 Módulo de matrícula próximamente');
    });
  }

  // ============================
  // INIT
  // ============================
  renderTable();

});

// ============================================
// FUNCIONES GLOBALES
// ============================================

function verMateria(id) {
  alert(`📘 Ver detalles de materia ID: ${id}`);
}

function retirarMateria(id) {
  if (confirm('¿Seguro que deseas retirar esta materia?')) {
    alert(`✅ Materia ${id} retirada`);
    location.reload();
  }
}