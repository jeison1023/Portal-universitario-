// ========================================
// HORARIOS.JS - VERSION FINAL PRO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// ========================================
// INIT APP
// ========================================
function initApp() {
  initSidebar();
  initEventos();
  renderizarTodo();
  actualizarProximasClases();

  // Auto refresh
  setInterval(actualizarProximasClases, 30000);
}

// ========================================
// SIDEBAR GLOBAL
// ========================================
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('sidebarOverlay');

  // Desktop collapse
  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Mobile open
  mobileToggle?.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('menu-open');
  });

  // Mobile close
  overlay?.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  // Auto close on click outside
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth < 768 &&
      !sidebar.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      closeSidebar();
    }
  });

  // Active link automático
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// ========================================
// DATA (SIMULADA)
// ========================================
const horariosData = [
  {
    materia: 'Programación Web',
    profesor: 'Dr. Juan Pérez',
    aula: 'A-301',
    dia: 'Lunes',
    inicio: 9,
    fin: 11
  },
  {
    materia: 'Base de Datos II',
    profesor: 'María Gómez',
    aula: 'B-205',
    dia: 'Lunes',
    inicio: 14,
    fin: 16
  },
  {
    materia: 'Matemáticas Discretas',
    profesor: 'Luis Rodríguez',
    aula: 'C-112',
    dia: 'Martes',
    inicio: 8,
    fin: 10
  },
  {
    materia: 'Inglés Técnico',
    profesor: 'Ana Martínez',
    aula: 'D-101',
    dia: 'Miércoles',
    inicio: 10,
    fin: 12
  },
  {
    materia: 'Laboratorio Redes',
    profesor: 'Carlos López',
    aula: 'LAB-01',
    dia: 'Jueves',
    inicio: 15,
    fin: 18
  }
];

// ========================================
// EVENTOS
// ========================================
function initEventos() {
  // Cambiar vista
  document.querySelectorAll('[data-vista]').forEach(btn => {
    btn.addEventListener('click', () => cambiarVista(btn.dataset.vista));
  });

  // Toggle lista/grid
  document.getElementById('toggleHorario')?.addEventListener('click', mostrarLista);
  document.getElementById('toggleBackToGrid')?.addEventListener('click', mostrarGrid);

  // Imprimir
  document.getElementById('btnImprimirHorario')?.addEventListener('click', () => window.print());

  // Cambio semestre
  document.getElementById('semestreSelector')?.addEventListener('change', function () {
    document.getElementById('horariosTitle').textContent = `Semestre ${this.value}`;
  });
}

// ========================================
// RENDER GENERAL
// ========================================
function renderizarTodo() {
  renderStats();
  renderHorario();
}

// ========================================
// STATS
// ========================================
function renderStats() {
  const total = horariosData.length;
  const horas = horariosData.reduce((acc, c) => acc + (c.fin - c.inicio), 0);

  document.getElementById('totalClases').textContent = total;
  document.getElementById('horasSemanales').textContent = horas;
  document.getElementById('creditosHorario').textContent = 18;
}

// ========================================
// TABLA HORARIO
// ========================================
function renderHorario() {
  const container = document.getElementById('horarioSemanal');
  const dias = ['Lunes','Martes','Miércoles','Jueves','Viernes'];

  let html = `
    <table class="horario-table">
      <thead>
        <tr>
          <th>Hora</th>
          ${dias.map(d => `<th>${d}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;

  for (let hora = 8; hora <= 20; hora += 2) {
    html += `<tr><td>${hora}:00 - ${hora + 2}:00</td>`;

    dias.forEach(dia => {
      const clase = horariosData.find(c => c.dia === dia && c.inicio === hora);

      if (clase) {
        html += `
          <td>
            <div class="horario-clase">
              <div class="materia">${clase.materia}</div>
              <div class="profesor">${clase.profesor}</div>
              <div class="aula">${clase.aula}</div>
            </div>
          </td>
        `;
      } else {
        html += `<td class="horario-vacio"></td>`;
      }
    });

    html += `</tr>`;
  }

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// ========================================
// VISTA LISTA
// ========================================
function mostrarLista() {
  document.getElementById('horarioSemanalContainer').style.display = 'none';
  document.getElementById('listaClasesContainer').style.display = 'block';

  const container = document.getElementById('listaClases');

  container.innerHTML = horariosData.map(c => `
    <div class="lista-clase">
      <div class="lista-clase-dia">${c.dia}</div>
      <div class="lista-clase-info">
        <div class="lista-clase-titulo">${c.materia}</div>
        <div class="lista-clase-detalles">
          <span>${c.profesor}</span>
          <span>${c.aula}</span>
          <span>${c.inicio}:00 - ${c.fin}:00</span>
        </div>
      </div>
    </div>
  `).join('');
}

function mostrarGrid() {
  document.getElementById('horarioSemanalContainer').style.display = 'block';
  document.getElementById('listaClasesContainer').style.display = 'none';
}

// ========================================
// CAMBIO DE VISTA
// ========================================
function cambiarVista(vista) {
  document.querySelectorAll('[data-vista]').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-vista="${vista}"]`).classList.add('active');

  if (vista === 'lista') {
    mostrarLista();
  } else {
    mostrarGrid();
  }
}

// ========================================
// PRÓXIMAS CLASES
// ========================================
function actualizarProximasClases() {
  const container = document.getElementById('proximasClases');

  container.innerHTML = horariosData.slice(0, 3).map(c => `
    <div class="class-item">
      <div class="class-time">${c.inicio}:00</div>
      <div class="class-info">
        <strong>${c.materia}</strong>
        <div>${c.profesor} • ${c.aula}</div>
      </div>
    </div>
  `).join('');
}

// ========================================
// DEBUG
// ========================================
console.log('✅ HORARIOS cargado sin errores');