// ========================================
// FINANZAS.JS - PRO VERSION (LIMPIO Y ESCALABLE)
// ========================================

// =======================
// DATA MOCK
// =======================
const pagosData = [
  { id: 1, concepto: 'Matrícula Ordinaria 2024-2', monto: 4800, vencimiento: '2024-10-15', estado: 'pagado', fechaPago: '2024-09-20', comprobante: 'COMP-001' },
  { id: 2, concepto: 'Cuota Extraordinaria', monto: 1250, vencimiento: '2024-10-15', estado: 'pendiente' },
  { id: 3, concepto: 'Seguro Estudiantil', monto: 200, vencimiento: '2024-09-30', estado: 'atrasado' },
  { id: 4, concepto: 'Laboratorio', monto: 800, vencimiento: '2024-09-25', estado: 'pagado', fechaPago: '2024-09-22', comprobante: 'COMP-004' }
];

// =======================
// INIT
// =======================
document.addEventListener('DOMContentLoaded', () => {
  actualizarEstadisticas();
  renderizarTablaPagos();
  crearGrafico();
  eventos();
});

// =======================
// EVENTOS
// =======================
function eventos() {
  document.getElementById('filtroEstadoPago')?.addEventListener('change', renderizarTablaPagos);

  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('¿Cerrar sesión?')) {
      localStorage.removeItem('userSession');
      window.location.href = 'login.html';
    }
  });
}

// =======================
// STATS
// =======================
function actualizarEstadisticas() {
  const pendientes = pagosData.filter(p => p.estado === 'pendiente').length;
  const pagados = pagosData.filter(p => p.estado === 'pagado').length;
  const total = pagosData.reduce((sum, p) => sum + p.monto, 0);

  setText('pendientesCount', pendientes);
  setText('pagadosCount', pagados);
  setText('totalMatricula', formatMoney(total));
}

// =======================
// TABLA
// =======================
function renderizarTablaPagos() {
  const filtro = document.getElementById('filtroEstadoPago')?.value;
  const tbody = document.getElementById('tablaPagos');

  const data = filtro ? pagosData.filter(p => p.estado === filtro) : pagosData;

  tbody.innerHTML = data.map(p => `
    <tr>
      <td>${p.concepto}</td>
      <td>${formatMoney(p.monto)}</td>
      <td>${formatDate(p.vencimiento)}</td>
      <td>${estadoTexto(p.estado)}</td>
      <td>
        ${botonAccion(p)}
      </td>
    </tr>
  `).join('');
}

// =======================
// BOTONES
// =======================
function botonAccion(p) {
  if (p.estado === 'pagado') {
    return `<button onclick="verComprobante(${p.id})">📄</button>`;
  }
  return `<button onclick="pagar(${p.id})">💳</button>`;
}

// =======================
// ACCIONES
// =======================
function pagar(id) {
  const pago = pagosData.find(p => p.id === id);
  if (!pago) return;

  if (!confirm(`Pagar ${pago.concepto}?`)) return;

  pago.estado = 'pagado';
  pago.fechaPago = new Date().toISOString().split('T')[0];

  actualizarEstadisticas();
  renderizarTablaPagos();
  crearGrafico();

  alert('Pago realizado ✅');
}

function verComprobante(id) {
  const pago = pagosData.find(p => p.id === id);
  alert(`Comprobante: ${pago.comprobante || 'N/A'}`);
}

// =======================
// CHART
// =======================
function crearGrafico() {
  const ctx = document.getElementById('finanzasChart')?.getContext('2d');
  if (!ctx) return;

  const pagados = pagosData.filter(p => p.estado === 'pagado').length;
  const pendientes = pagosData.filter(p => p.estado !== 'pagado').length;

  if (window.chart) window.chart.destroy();

  window.chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pagados', 'Pendientes'],
      datasets: [{
        data: [pagados, pendientes],
        backgroundColor: ['#10b981', '#f59e0b']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// =======================
// HELPERS
// =======================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatMoney(n) {
  return `$${n.toLocaleString()}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}

function estadoTexto(e) {
  return {
    pagado: 'Pagado',
    pendiente: 'Pendiente',
    atrasado: 'Atrasado'
  }[e];
}

// =======================
console.log('🔥 Finanzas cargado correctamente');