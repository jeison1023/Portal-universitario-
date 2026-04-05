// DATOS DEL PERFIL SIMULADOS
const perfilData = {
  personal: {
    nombre: "Ana García López",
    codigo: "20230001",
    fechaNacimiento: "15/03/2002",
    telefono: "+51 987 654 321",
    correo: "ana.garcia@email.com"
  },
  academico: {
    programa: "Ingeniería de Sistemas",
    fechaIngreso: "15/03/2023",
    semestre: "2024-I",
    creditos: 48,
    promedio: 17.2,
    asistencia: "95%"
  },
  institucional: {
    correoInstitucional: "ana.garcia@universidad.edu.pe",
    usuario: "agarcia2023"
  },
  historial: [
    {
      periodo: "2024-I",
      promedio: 17.2,
      creditos: 24,
      estado: "curso"
    },
    {
      periodo: "2023-II",
      promedio: 16.8,
      creditos: 24,
      estado: "completado"
    },
    {
      periodo: "2023-I",
      promedio: 17.5,
      creditos: 24,
      estado: "completado"
    }
  ]
};

// INICIALIZACIÓN DEL PERFIL
function inicializarPerfil() {
  verificarSesion();
  
  cargarSidebar();
  cargarHeader();
  
  setTimeout(() => {
    cargarDatosPerfil();
    inicializarEventosPerfil();
    inicializarTabs();
  }, 500);
}

// CARGAR DATOS DEL PERFIL
function cargarDatosPerfil() {
  // Datos principales
  document.getElementById('nombreCompleto').textContent = perfilData.personal.nombre;
  document.getElementById('codigoEstudiantil').textContent = perfilData.personal.codigo;
  document.getElementById('fechaNacimiento').textContent = perfilData.personal.fechaNacimiento;
  document.getElementById('telefono').textContent = perfilData.personal.telefono;
  document.getElementById('correoPersonal').textContent = perfilData.personal.correo;
  
  // Académico
  document.getElementById('programaAcademico').textContent = perfilData.academico.programa;
  document.getElementById('fechaIngreso').textContent = perfilData.academico.fechaIngreso;
  document.getElementById('programaBadge').textContent = perfilData.academico.programa;
  
  // Institucional
  document.getElementById('correoInstitucional').textContent = perfilData.institucional.correoInstitucional;
  document.getElementById('usuario').textContent = perfilData.institucional.usuario;
  
  // Estadísticas
  document.getElementById('creditosMatriculados').textContent = perfilData.academico.creditos;
  document.getElementById('semestreActual').textContent = perfilData.academico.semestre;
  document.getElementById('promedioGeneral').textContent = perfilData.academico.promedio;
  document.getElementById('asistencia').textContent = perfilData.academico.asistencia;
  
  // Historial
  renderizarHistorialPreview();
}

// RENDERIZAR HISTORIAL PREVIEW
function renderizarHistorialPreview() {
  const container = document.getElementById('historialPreview');
  container.innerHTML = perfilData.historial.map(item => `
    <div class="history-item">
      <div class="history-periodo">${item.periodo}</div>
      <div class="history-promedio">${item.promedio}</div>
      <div class="history-creditos">${item.creditos} créditos</div>
    </div>
  `).join('');
}

// INICIALIZAR TABS
function inicializarTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Remover clases activas
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // Activar tab seleccionada
      this.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });
}

// EVENTOS DEL PERFIL
function inicializarEventosPerfil() {
  // Cambiar foto de perfil
  const fotoInput = document.getElementById('fotoInput');
  const fotoPerfil = document.getElementById('fotoPerfil');
  
  fotoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        fotoPerfil.src = e.target.result;
        mostrarNotificacion('Foto actualizada correctamente ✅');
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Botones de acción
  document.getElementById('btnEditarPerfil').addEventListener('click', editarPerfil);
  document.getElementById('btnCambiarPassword').addEventListener('click', cambiarPassword);
  document.getElementById('btnDescargarDatos').addEventListener('click', descargarDatos);
}

// FUNCIONES DE ACCIÓN
function editarPerfil() {
  mostrarNotificacion('🔧 Modo edición activado');
  // Aquí iría la lógica para activar campos editables
}

function cambiarPassword() {
  mostrarNotificacion('🔐 Redirigiendo a cambio de contraseña...');
  // window.location.href = 'cambiar-password.html';
}

function descargarDatos() {
  mostrarNotificacion('📥 Descargando datos personales...');
  // Lógica para generar PDF o JSON
}

// NOTIFICACIONES
function mostrarNotificacion(mensaje) {
  // Crear notificación toast
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
    z-index: 10000;
    transform: translateX(400px);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-weight: 500;
  `;
  notif.textContent = mensaje;
  document.body.appendChild(notif);
  
  // Animar entrada
  requestAnimationFrame(() => {
    notif.style.transform = 'translateX(0)';
  });
  
  // Auto-eliminar
  setTimeout(() => {
    notif.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notif);
    }, 400);
  }, 4000);
}

// SIMULAR EDICIÓN DE CAMPOS
function activarEdicion(campoId) {
  const campo = document.getElementById(campoId);
  const input = document.createElement('input');
  input.type = 'text';
  input.value = campo.textContent;
  input.style.cssText = `
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    background: white;
  `;
  
  campo.innerHTML = '';
  campo.appendChild(input);
  input.focus();
  
  input.addEventListener('blur', function() {
    campo.textContent = this.value;
  });
  
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      this.blur();
    }
  });
}