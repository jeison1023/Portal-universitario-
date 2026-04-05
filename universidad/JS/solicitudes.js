// ===============================
// DATOS SIMULADOS
// ===============================
const tiposSolicitud = [
  { value: 'constancia-estudios', label: 'Constancia de Estudios' },
  { value: 'carta-recomendacion', label: 'Carta de Recomendación' },
  { value: 'cambio-materia', label: 'Cambio de Materia' },
  { value: 'retiro-materia', label: 'Retiro de Materia' },
  { value: 'certificado-notas', label: 'Certificado de Notas' },
  { value: 'convalidacion', label: 'Convalidación' },
  { value: 'pension', label: 'Trámite Pensión' },
  { value: 'otros', label: 'Otros' }
];

const solicitudesData = [
  {
    id: 1,
    numero: "#SOL-2024-001",
    tipo: "Constancia de Estudios",
    fecha: "2024-03-15",
    estado: "aprobada",
    descripcion: "Constancia para banco.",
    prioridad: "media"
  },
  {
    id: 2,
    numero: "#SOL-2024-002",
    tipo: "Cambio de Materia",
    fecha: "2024-03-10",
    estado: "pendiente",
    descripcion: "Cambio por horario.",
    prioridad: "alta"
  },
  {
    id: 3,
    numero: "#SOL-2024-003",
    tipo: "Certificado de Notas",
    fecha: "2024-02-28",
    estado: "rechazada",
    descripcion: "Certificado para beca.",
    prioridad: "baja"
  }
];

let solicitudesFiltradas = [...solicitudesData];

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  inicializarSolicitudes();
});

function inicializarSolicitudes() {
  verificarSesion();
  poblarFiltrosSolicitudes();
  actualizarEstadisticasSolicitudes();
  renderizarSolicitudes();
}

// ===============================
// SESIÓN
// ===============================
function verificarSesion() {
  if (!localStorage.getItem("sesionActiva")) {
    window.location.href = "index.html";
  }
}

// ===============================
// FILTROS
// ===============================
function poblarFiltrosSolicitudes() {
  const select = document.getElementById("filtroTipoSolicitud");
  if (!select) return;

  tiposSolicitud.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.value;
    opt.textContent = t.label;
    select.appendChild(opt);
  });

  select.addEventListener("change", aplicarFiltrosSolicitudes);
}

function aplicarFiltrosSolicitudes() {
  const tipo = document.getElementById("filtroTipoSolicitud")?.value;

  solicitudesFiltradas = solicitudesData.filter(s => {
    if (!tipo) return true;

    return s.tipo.toLowerCase().includes(tipo.replace("-", " "));
  });

  renderizarSolicitudes();
}

// ===============================
// ESTADÍSTICAS
// ===============================
function actualizarEstadisticasSolicitudes() {
  setText("totalSolicitudes", solicitudesData.length);

  const pendientes = solicitudesData.filter(s => s.estado === "pendiente").length;
  setText("solicitudesPendientes", pendientes);
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

// ===============================
// RENDER (CARDS)
// ===============================
function renderizarSolicitudes() {
  const container = document.getElementById("solicitudesContainer");
  if (!container) return;

  if (solicitudesFiltradas.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;">
        <h3>No hay solicitudes</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = solicitudesFiltradas.map(s => `
    <div class="solicitud-card" style="
      border:1px solid #e5e7eb;
      padding:1.5rem;
      border-radius:14px;
      background:white;
      box-shadow:0 10px 25px rgba(0,0,0,0.05);
    ">

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${s.numero}</strong>
        <span style="
          padding:5px 10px;
          border-radius:8px;
          font-size:0.8rem;
          background:${getColorEstado(s.estado)};
          color:white;
        ">
          ${s.estado}
        </span>
      </div>

      <h3 style="margin:10px 0;">${s.tipo}</h3>
      <p style="color:#6b7280;">${s.descripcion}</p>

      <small>📅 ${s.fecha}</small>

      <div style="margin-top:1rem; display:flex; gap:10px;">
        <button onclick="verSolicitud(${s.id})">Ver</button>
        <button onclick="eliminarSolicitud(${s.id})">Eliminar</button>
      </div>

    </div>
  `).join("");
}

// ===============================
// UTILIDADES
// ===============================
function getColorEstado(estado) {
  switch (estado) {
    case "aprobada": return "#10b981";
    case "pendiente": return "#f59e0b";
    case "rechazada": return "#ef4444";
    default: return "#6b7280";
  }
}

// ===============================
// ACCIONES
// ===============================
function verSolicitud(id) {
  const s = solicitudesData.find(x => x.id === id);
  alert(`📄 ${s.numero}\n\n${s.descripcion}`);
}

function eliminarSolicitud(id) {
  solicitudesFiltradas = solicitudesFiltradas.filter(s => s.id !== id);
  renderizarSolicitudes();
}

// ===============================
// NUEVA SOLICITUD (SIMULADA)
// ===============================
function abrirModalSolicitud() {
  const nueva = {
    id: Date.now(),
    numero: "#SOL-" + Date.now(),
    tipo: "Otros",
    fecha: new Date().toISOString().split("T")[0],
    estado: "pendiente",
    descripcion: "Nueva solicitud creada",
    prioridad: "media"
  };

  solicitudesData.push(nueva);
  solicitudesFiltradas = [...solicitudesData];
  renderizarSolicitudes();
}