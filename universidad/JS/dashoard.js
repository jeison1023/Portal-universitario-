document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  // =========================
  // SIDEBAR STATE (PRO)
  // =========================
  const savedState = localStorage.getItem('sidebar-collapsed');
  if (savedState === 'true') {
    sidebar.classList.add('collapsed');
  }

  // =========================
  // DESKTOP TOGGLE
  // =========================
  sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');

    localStorage.setItem(
      'sidebar-collapsed',
      sidebar.classList.contains('collapsed')
    );
  });

  // =========================
  // MOBILE OPEN
  // =========================
  mobileMenuToggle?.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.classList.add('menu-open');
  });

  // =========================
  // CLOSE FUNCTION (REUTILIZABLE)
  // =========================
  const closeSidebar = () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  // =========================
  // MOBILE CLOSE
  // =========================
  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Cerrar al hacer click en link (móvil)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) closeSidebar();
    });
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // =========================
  // ACTIVE LINK (INTELIGENTE)
  // =========================
  const currentPage = window.location.pathname.split('/').pop();

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');

    if (href === currentPage) {
      link.classList.add('active');
      link.parentElement.classList.add('active');
    }

    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('active');
        l.parentElement.classList.remove('active');
      });

      this.classList.add('active');
      this.parentElement.classList.add('active');
    });
  });

  // =========================
  // STATS DINÁMICOS
  // =========================
  const statsData = [
    { title: 'Materias Inscritas', value: '6', trend: '+1', color: 'success' },
    { title: 'Créditos Totales', value: '18', trend: '0', color: 'primary' },
    { title: 'Promedio Semestre', value: '4.5', trend: '+0.3', color: 'success' },
    { title: 'Pendientes', value: '2', trend: '-1', color: 'warning' }
  ];

  const statsContainer = document.getElementById('statsContainer');

  if (statsContainer) {
    statsContainer.innerHTML = statsData.map(stat => `
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <span style="color:var(--secondary);font-size:0.9rem;">${stat.title}</span>
          <i class="fas fa-arrow-${stat.trend.includes('+') ? 'up' : 'down'}" 
             style="color:var(--${stat.color})"></i>
        </div>
        <div style="font-size:2.5rem;font-weight:700;color:var(--${stat.color})">
          ${stat.value}
        </div>
      </div>
    `).join('');
  }

  // =========================
  // QUICK STATS
  // =========================
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('quickPromedio', '4.5');
  setText('quickCreditos', '18');
});