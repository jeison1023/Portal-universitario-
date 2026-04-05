// DATOS SIMULADOS
const estudianteData = {
  nombre: "Ana García López",
  promedio: 16.8,
  creditos: 24,
  semestre: "2024-I"
};

const statsData = [
  {
    label: "Materias Aprobadas",
    value: 12,
    change: "+2",
    icon: "fa-check-circle",
    type: "success"
  },
  {
    label: "Créditos Matriculados",
    value: 24,
    change: "0",
    icon: "fa-book",
    type: "primary"
  },
  {
    label: "Promedio Semestre",
    value: "16.8",
    change: "+0.4",
    icon: "fa-chart-line",
    type: "info"
  },
  {
    label: "Materias Pendientes",
    value: 2,
    change: "-1",
    icon: "fa-clock",
    type: "warning"
  },
  {
    label: "Calificaciones < 14",
    value: 1,
    change: "0",
    icon: "fa-exclamation-triangle",
    type: "danger"
  }
];

const clasesData = [
  {
    materia: "Matemáticas Avanzadas",
    hora: "08:00 - 10:00",
    profesor: "Dr. López",
    sala: "A-201",
    color: "#3b82f6"
  },
  {
    materia: "Programación Web",
    hora: "10:30 - 12:30",
    profesor: "Msc. Pérez",
    sala: "B-105",
    color: "#10b981"
  },
  {
    materia: "Base de Datos",
    hora: "14:00 - 16:00",
    profesor: "Ing. Rodríguez",
    sala: "C-308",
    color: "#f59e0b"
  }
];

const notificationsData = [
  {
    title: "Nueva calificación disponible",
    message: "Matemáticas Avanzadas - Nota Final: 18.5",
    type: "success",
    time: "Hace 2h",
    icon: "fa-chart-bar"
  },
  {
    title: "Recordatorio de clase",
    message: "Programación Web inicia en 30 minutos",
    type: "warning",
    time: "Hace 15min",
    icon: "fa-clock"
  },
  {
    title: "Pago pendiente",
    message: "Matricula semestre 2024-II vence en 3 días",
    type: "danger",
    time: "Ayer",
    icon: "fa-credit-card"
  }
];

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
  cargarSidebar();
  cargarHeader();
  inicializarDashboard();
});

// SIDEBAR Y HEADER
function cargarSidebar() {
  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo">
      <i class="fas fa-graduation-cap"></i>
      <span>UniPortal</span>
    </div>
    
    <nav class="sidebar-nav">
      <a href="dashboard.html" class="nav-item active">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </a>
      <a href="calificaciones.html" class="nav-item">
        <i class="fas fa-chart-bar"></i>
        <span>Calificaciones</span>
      </a>
      <a href="materias.html" class="nav-item">
        <i class="fas fa-book-open"></i>
        <span>Materias</span>
      </a>
      <a href="historial-academico.html" class="nav-item">
        <i class="fas fa-history"></i>
        <span>Historial</span>
      </a>
      <a href="solicitudes.html" class="nav-item">
        <i class="fas fa-file-invoice"></i>
        <span>Solicitudes</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="user-sidebar">
        <img src="https://via.placeholder.com/40" alt="Usuario" class="user-avatar">
        <div>
          <div class="user-name">${estudianteData.nombre}</div>
          <div class="user-role">Estudiante</div>
        </div>
      </div>
    </div>
  `;
}

function cargarHeader() {
  document.getElementById('header').innerHTML = `
    <div class="header-left">
      <button class="menu-toggle" id="menuToggle">
        <i class="fas fa-bars"></i>
      </button>
      <div class="header-title">
        <h1>Dashboard</h1>
        <p>Semestre ${estudianteData.semestre}</p>
      </div>
    </div>
    
    <div class="header-right">
      <div class="header-search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Buscar...">
      </div>
      <div class="notifications">
        <button class="notif-btn">
          <i class="fas fa-bell"></i>
          <span class="notif-dot"></span>
        </button>
      </div>
      <div class="user-profile">
        <img src="https://via.placeholder.com/40" alt="Usuario" class="profile-avatar">
        <span>${estudianteData.nombre.split(' ')[0]}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  `;

  // Event listeners del header
  document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
}

function inicializarDashboard() {
  // Welcome
  inicializarWelcome();
  
  // Stats cards
  renderizarStats();
  
  // Clases
  renderizarClases();
  
  // Notificaciones
  renderizarNotificaciones();
  
  // Gráfico
  inicializarGraficoRendimiento();
  
  // Animaciones
  animarStats();
}

function inicializarWelcome() {
  document.getElementById('welcomeUser').textContent = estudianteData.nombre;
  document.getElementById('quickPromedio').textContent = estudianteData.promedio;
  document.getElementById('quickCreditos').textContent = estudianteData.creditos;
}

function renderizarStats() {
  const container = document.getElementById('statsContainer');
  container.innerHTML = statsData.map(stat => `
    <div class="stat-card">
      <div class="stat-icon stat-${stat.type}">
        <i class="fas ${stat.icon}"></i>
      </div>
      <div class="stat-value">${stat.value}</div>
      <p class="stat-label">${stat.label}</p>
      <div class="stat-change ${stat.change.startsWith('+') ? 'change-positive' : 'change-negative'}">
        <i class="fas ${stat.change.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
        ${stat.change}
      </div>
    </div>
  `).join('');
}

function renderizarClases() {
  const container = document.getElementById('classesContainer');
  if (clasesData.length === 0) {
    container.innerHTML = '<p class="empty-state">No hay clases programadas</p>';
    return;
  }
  
  container.innerHTML = clasesData.map(clase => `
    <div class="class-item">
      <div class="class-icon" style="background-color: ${clase.color}20; color: ${clase.color}">
        <i class="fas fa-book"></i>
      </div>
      <div class="class-info">
        <h4>${clase.materia}</h4>
        <p><strong>${clase.profesor}</strong> | ${clase.sala}</p>
      </div>
      <div class="class-time">${clase.hora}</div>
    </div>
  `).join('');
}

function renderizarNotificaciones() {
  const container = document.getElementById('notificationsContainer');
  const countEl = document.getElementById('notifCount');
  
  if (notificationsData.length === 0) {
    container.innerHTML = '<li class="empty-state">Sin notificaciones</li>';
    countEl.textContent = '0';
    countEl.style.display = 'none';
    return;
  }
  
  countEl.textContent = notificationsData.length > 9 ? '9+' : notificationsData.length;
  countEl.style.display = 'flex';
  
  container.innerHTML = notificationsData.map(notif => `
    <li class="notification-item">
      <div class="notification-icon" style="background-color: var(--${notif.type === 'success' ? 'success' : notif.type === 'warning' ? 'warning' : 'danger'}-light); color: var(--${notif.type}-color);">
        <i class="fas ${notif.icon}"></i>
      </div>
      <div class="notification-info">
        <h4>${notif.title}</h4>
        <p>${notif.message}</p>
      </div>
      <small style="color: var(--text-secondary); font-size: 0.8rem;">${notif.time}</small>
    </li>
  `).join('');
}

function inicializarGraficoRendimiento() {
  // Simular datos del gráfico
  const ctx = document.getElementById('performanceChart').getContext('2d');}
  
