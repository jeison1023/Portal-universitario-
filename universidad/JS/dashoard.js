// JS/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
  }

  sidebarToggle?.addEventListener('click', toggleSidebar);
  mobileMenuToggle?.addEventListener('click', toggleSidebar);
  sidebarOverlay?.addEventListener('click', toggleSidebar);

  // Active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Dynamic stats (mock data)
  const statsData = [
    { title: 'Materias Inscritas', value: '6', trend: '+1', color: 'success' },
    { title: 'Créditos Totales', value: '18', trend: '0', color: 'primary' },
    { title: 'Promedio Semestre', value: '4.5', trend: '+0.3', color: 'success' },
    { title: 'Pendientes', value: '2', trend: '-1', color: 'warning' }
  ];

  const statsContainer = document.getElementById('statsContainer');
  statsContainer.innerHTML = statsData.map(stat => `
    <div class="stat-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="color: var(--secondary); font-size: 0.9rem;">${stat.title}</span>
        <i class="fas fa-arrow-${stat.trend.includes('+') ? 'up' : 'down'} text-${stat.color}" style="color: var(--${stat.color})"></i>
      </div>
      <div style="font-size: 2.5rem; font-weight: 700; color: var(--${stat.color})">${stat.value}</div>
    </div>
  `).join('');

  // Update dynamic content
  document.getElementById('quickPromedio').textContent = '4.5';
  document.getElementById('quickCreditos').textContent = '18';
});