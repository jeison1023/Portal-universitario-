// ===============================
// DATOS SIMULADOS
// ===============================
const materiasData = [
  {
    id: 1,
    codigo: "MAT-401",
    nombre: "Matemáticas Avanzadas",
    docente: "Dr. Miguel López",
    horario: "Lun 08:00-10:00, Mié 08:00-10:00",
    aula: "A-201",
    creditos: 4,
    estado: "activa",
    promedio: 17.5,
    color: "#3b82f6"
  },
  {
    id: 2,
    codigo: "PROG-305",
    nombre: "Programación Web Avanzada",
    docente: "Msc. Laura Pérez",
    horario: "Mar 10:30-12:30, Jue 10:30-12:30",
    aula: "B-105",
    creditos: 4,
    estado: "activa",
    promedio: 19.2,
    color: "#10b981"
  },
  {
    id: 3,
    codigo: "BD-301",
    nombre: "Base de Datos Relacionales",
    docente: "Ing. Ana Gómez",
    horario: "Vie 14:00-16:00",
    aula: "C-308",
    creditos: 4,
    estado: "finalizada",
    promedio: 17.8,
    color: "#3b82f6"
  },
  {
    id: 4,
    codigo: "RED-302",
    nombre: "Redes de Computadoras",
    docente: "Msc. Juan Martínez",
    horario: "Lun 14:00-16:00, Mié 14:00-16:00",
    aula: "D-120",
    creditos: 4,
    estado: "activa",
    promedio: 16.5,
    color: "#f59e0b"
  },
  {
    id: 5,
    codigo: "FIS-402",
    nombre: "Física Cuántica",
    docente: "Dr. Carlos Ruiz",
    horario: "Mar 08:00-10:00",
    aula: "F-205",
    creditos: 4,
    estado: "reprobada",
    promedio: 12.8,
    color: "#ef4444"
  }
];

let materiasFiltradas = [...materiasData];
let vistaActual = 'table';

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  inicializarMaterias();
});

function inicializarMaterias() {
  verificarSesion();

  actualizarEstadisticas();
  poblarFiltros();
  renderizarTabla();
  renderizarCards();
  generarHorario();
}

// ===============================
// SESIÓN
// ===============================
function verificarSesion() {
  const sesion = localStorage.getItem('sesionActiva');
  if (!sesion) {
    window.location.href = 'index.html';
  }
}

// ===============================
// ESTADÍSTICAS
// ===============================
function actualizarEstadisticas() {
  const activas = materiasData.filter(m => m.estado === 'activa').length;
  const aprobadas = materiasData.filter(m => m.estado === 'finalizada').length;
  const creditos = materiasData.reduce((sum, m) => sum + m.creditos, 0);

  setText('totalMateriasDash', materiasData.length);
  setText('materiasAprobadas', aprobadas);
  setText('materiasCurso', activas);
  setText('creditosTotal', creditos);
  setText('materiasActivas', `${activas} activas`);
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

// ===============================
// FILTROS
// ===============================
function poblarFiltros() {
  const selectEstado = document.getElementById('filtroEstadoMateria');
  if (!selectEstado) return;

  const estados = [...new Set(materiasData.map(m => m.estado))];

  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    selectEstado.appendChild(option);
  });

  selectEstado.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
  const estado = document.getElementById('filtroEstadoMateria')?.value;

  materiasFiltradas = materiasData.filter(m => {
    return !estado || m.estado === estado;
  });

  renderizarTabla();
  renderizarCards();
}

// ===============================
// TABLA
// ===============================
function renderizarTabla() {
  const tbody = document.getElementById('tabla-materias');
  if (!tbody) return;

  const data = materiasFiltradas;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">No hay datos</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(m => `
    <tr>
      <td>${m.codigo}</td>
      <td>${m.nombre}</td>
      <td>${m.docente}</td>
      <td>${m.horario}</td>
      <td>${m.aula}</td>
      <td>${m.creditos}</td>
      <td>${m.estado}</td>
      <td>
        <button onclick="verCalificaciones(${m.id})">📊</button>
        <button onclick="verHorario(${m.id})">📅</button>
        <button onclick="abrirMateria(${m.id})">🚀</button>
      </td>
    </tr>
  `).join('');
}

// ===============================
// CARDS
// ===============================
function renderizarCards() {
  const container = document.getElementById('materias-cards-container');
  if (!container) return;

  container.innerHTML = materiasFiltradas.map(m => `
    <div style="border:1px solid #ddd; padding:1rem; border-radius:10px;">
      <h3>${m.nombre}</h3>
      <p>${m.docente}</p>
      <p>${m.horario}</p>
    </div>
  `).join('');
}

// ===============================
// HORARIO
// ===============================
function generarHorario() {
  const container = document.getElementById('horarioSemanal');
  if (!container) return;

  const dias = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const horas = ['08:00-10:00','10:30-12:30','14:00-16:00','16:30-18:30'];

  let html = `<div>Hora</div>${dias.map(d => `<div>${d}</div>`).join('')}`;

  horas.forEach(h => {
    html += `<div>${h}</div>`;

    dias.forEach(d => {
      const mat = materiasData.find(m => m.horario.includes(d) && m.horario.includes(h));
      html += `<div style="padding:5px; background:${mat ? mat.color : '#eee'}">
        ${mat ? mat.nombre : ''}
      </div>`;
    });
  });

  container.innerHTML = html;
}

// ===============================
// ACCIONES
// ===============================
function verCalificaciones(id) {
  alert("Calificaciones de " + id);
}

function verHorario(id) {
  alert("Horario de " + id);
}

function abrirMateria(id) {
  alert("Abriendo materia " + id);
}