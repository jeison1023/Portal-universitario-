// ========================================
// FINANZAS.JS - COMPLETO Y RESPONSIVE
// ========================================

// Datos simulados de pagos (REALISTAS)
const pagosData = [
  {
    id: 1,
    concepto: 'Matrícula Ordinaria 2024-2',
    monto: 4800,
    vencimiento: '2024-10-15',
    estado: 'pagado',
    fechaPago: '2024-09-20',
    comprobante: 'COMP-2024-001'
  },
  {
    id: 2,
    concepto: 'Cuota Extraordinaria #2',
    monto: 1250,
    vencimiento: '2024-10-15',
    estado: 'pendiente'
  },
  {
    id: 3,
    concepto: 'Seguro Estudiantil Anual',
    monto: 200,
    vencimiento: '2024-09-30',
    estado: 'atrasado',
    diasAtraso: 5
  },
  {
    id: 4,
    concepto: 'Laboratorio Informática',
    monto: 800,
    vencimiento: '2024-09-25',
    estado: 'pagado',
    fechaPago: '2024-09-22',
    comprobante: 'COMP-2024-004'
  },
  {
    id: 5,
    concepto: 'Cuota 3 - Octubre 2024',
    monto: 1250,
    vencimiento: '2024-11-10',
    estado: 'pendiente'
  },
  {
    id: 6,
    concepto: 'Multa Biblioteca',
    monto: 50,
    vencimiento: '2024-10-05',
    estado: 'pendiente'
  }
];

// Inicialización completa
document.addEventListener('DOMContentLoaded', function() {
  inicializarSidebar();
  actualizarEstadisticas();
  renderizarTablaPagos();
  crearGraficoFinanzas();
  inicializarEventos();
  animarEstadisticas();
});

// ========================================
// EVENTOS
// ========================================
function inicializarEventos() {
  // Filtro tabla
  document.getElementById('filtroEstadoPago').addEventListener('change', renderizarTablaPagos);
  
  // Exportar
  document.querySelector('.card-actions button[onclick="exportarPagos()"]')?.addEventListener('click', exportarPagos);
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('¿Cerrar sesión?')) {
      localStorage.removeItem('userSession');
      window.location.href = 'login.html';
    }
  });

  // Notificaciones
  document.querySelector('.header-btn:has(.badge)')?.addEventListener('click', function() {
    alert('🔔 2 notificaciones:\n• Pago #3 atrasado\n• Cuota #2 vence mañana');
  });
}

// ========================================
// ESTADÍSTICAS
// ========================================
function actualizarEstadisticas() {
  const stats = calcularEstadisticas();
  
  // Actualizar contadores
  document.getElementById('pendientesCount').textContent = stats.pendientes;
  document.getElementById('pagadosCount').textContent = stats.pagados;
  document.getElementById('proximoVencimiento').textContent = stats.proximoVencimiento;
  document.getElementById('totalMatricula').textContent = formatCurrency(stats.total);
  
  // Stats rápidos
  const pagadosTotal = pagosData.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.monto, 0);
  const pendientesTotal = pagosData.filter(p => p.estado !== 'pagado').reduce((sum, p) => sum + p.monto, 0);
  
  document.querySelector('.stat-quick:nth-child(1) span').textContent = formatCurrency(pagadosTotal);
  document.querySelector('.stat-quick:nth-child(2) span').textContent = formatCurrency(pendientesTotal);
  document.querySelector('.stat-quick:nth-child(3) span').textContent = stats.porcentajeCompletado + '%';
}

function calcularEstadisticas() {
  const hoy = new Date();
  const pendientes = pagosData.filter(p => p.estado === 'pendiente').length;
  const pagados = pagosData.filter(p => p.estado === 'pagado').length;
  const atrasados = pagosData.filter(p => p.estado === 'atrasado').length;
  const total = pagosData.reduce((sum, p) => sum + p.monto, 0);
  
  // Próximo vencimiento
  const proximos = pagosData
    .filter(p => p.estado !== 'pagado')
    .map(p => ({ fecha: new Date(p.vencimiento), concepto: p.concepto }))
    .sort((a, b) => a.fecha - b.fecha);
  
  const proximoVencimiento = proximos.length > 0 
    ? proximos[0].fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    : 'N/A';
  
  const porcentaje = pagosData.length > 0 ? Math.round((pagados / pagosData.length) * 100) : 0;
  
  return {
    pendientes,
    pagados,
    atrasados,
    total,
    proximoVencimiento,
    porcentajeCompletado: porcentaje
  };
}

// ========================================
// TABLA DINÁMICA
// ========================================
function renderizarTablaPagos() {
  const filtro = document.getElementById('filtroEstadoPago').value;
  const tbody = document.getElementById('tablaPagos');
  
  const pagosFiltrados = filtro 
    ? pagosData.filter(p => p.estado === filtro)
    : pagosData;
  
  tbody.innerHTML = pagosFiltrados.length 
    ? pagosFiltrados.map(pago => crearFilaPago(pago)).join('')
    : '<tr><td colspan="5" class="text-center py-8"><i class="fas fa-inbox text-gray-400 text-2xl mb-2 block"></i><p class="text-gray-500">No hay pagos que mostrar</p></td></tr>';
}

function crearFilaPago(pago) {
  const claseEstado = getClaseEstado(pago.estado);
  const textoEstado = getTextoEstado(pago.estado);
  const iconoEstado = getIconoEstado(pago.estado);
  const btnAccion = getBotonAccion(pago.estado, pago.id, pago);
  
  return `
    <tr class="hover:bg-gray-50 transition-all group ${claseEstado}">
      <td class="font-medium">${pago.concepto}</td>
      <td class="font-semibold text-lg">${formatCurrency(pago.monto)}</td>
      <td>
        <span class="inline-block px-2 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
          ${formatearFecha(pago.vencimiento)}
        </span>
      </td>
      <td>
        <span class="estado-badge ${claseEstado}">
          <i class="fas ${iconoEstado} mr-1"></i>
          ${textoEstado}
        </span>
      </td>
      <td>${btnAccion}</td>
    </tr>
  `;
}

function getClaseEstado(estado) {
  return { pagado: 'success', pendiente: 'warning', atrasado: 'danger' }[estado] || '';
}

function getTextoEstado(estado) {
  return { pagado: 'Pagado', pendiente: 'Pendiente', atrasado: 'Atrasado' }[estado] || estado;
}

function getIconoEstado(estado) {
  return { 
    pagado: 'fa-check-circle', 
    pendiente: 'fa-clock', 
    atrasado: 'fa-exclamation-triangle' 
  }[estado] || 'fa-question';
}

function getBotonAccion(estado, id, pago) {
  const botones = {
    pendiente: `
      <div class="btn-group">
        <button class="btn-sm primary" onclick="pagar(${id})" title="Pagar ahora">
          <i class="fas fa-credit-card"></i>
        </button>
        <button class="btn-sm secondary" onclick="verDetalle(${id})" title="Ver detalle">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    `,
    pagado: `
      <button class="btn-sm success" onclick="verComprobante(${id})" title="Ver comprobante">
        <i class="fas fa-receipt"></i>
      </button>
    `,
    atrasado: `
      <div class="btn-group">
        <button class="btn-sm danger" onclick="pagar(${id})" title="Pagar URGENTE">
          <i class="fas fa-exclamation-circle"></i>
        </button>
        <button class="btn-sm secondary" onclick="verDetalle(${id})" title="Detalle">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    `
  };
  return botones[estado] || '<span class="text-gray-400">-</span>';
}

// ========================================
// GRÁFICO FINANCIERO
// ========================================
function crearGraficoFinanzas() {
  const ctx = document.getElementById('finanzasChart').getContext('2d');
  
  if (window.finanzasChart) window.finanzasChart.destroy();
  
  const pagados = pagosData.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.monto, 0);
  const pendientes = pagosData.filter(p => p.estado !== 'pagado').reduce((sum, p) => sum + p.monto, 0);
  
  window.finanzasChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['💰 Pagados', '⏳ Pendientes'],
      datasets: [{
        data: [pagados, pendientes],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 3,
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 25,
            usePointStyle: true,
            font: { size: 14, weight: '600' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${formatCurrency(context.parsed)}`;
            }
          }
        }
      }
    }
  });
}

// ========================================
// ACCIONES
// ========================================
function pagar(id) {
  const pago = pagosData.find(p => p.id === id);
  if (confirm(`¿Pagar ${pago.concepto}?\n\n💰 Monto: ${formatCurrency(pago.monto)}`)) {
    // Simular pago
    pago.estado = 'pagado';
    pago.fechaPago = new Date().toISOString().split('T')[0];
    pago.comprobante = `COMP-${Date.now()}`;
    
    actualizarEstadisticas();
    renderizarTablaPagos();
    crearGraficoFinanzas();
    
    alert(`✅ Pago realizado exitosamente!\nComprobante: ${pago.comprobante}`);
  }
}

function verDetalle(id) {
  const pago = pagosData.find(p => p.id === id);
  const modalHTML = `
    <div class="modal-overlay" onclick="this.remove()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <h3>Detalle del Pago #${id}</h3>
        <div class="modal-body">
          <p><strong>Concepto:</strong> ${pago.concepto}</p>
          <p><strong>Monto:</strong> ${formatCurrency(pago.monto)}</p>
          <p><strong>Vencimiento:</strong> ${formatearFecha(pago.vencimiento)}</p>
          <p><strong>Estado:</strong> <span class="estado-badge ${getClaseEstado(pago.estado)}">${getTextoEstado(pago.estado)}</span></p>
          ${pago.fechaPago ? `<p><strong>Fecha Pago:</strong> ${pago.fechaPago}</p>` : ''}
          ${pago.comprobante ? `<p><strong>Comprobante:</strong> ${pago.comprobante}</p>` : ''}
          ${pago.diasAtraso ? `<p class="text-danger"><strong>Días de atraso:</strong> ${pago.diasAtraso}</p>` : ''}
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
          ${pago.estado !== 'pagado' ? `<button class="btn-primary" onclick="pagar(${id}); this.closest('.modal-overlay').remove()">Pagar Ahora</button>` : ''}
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function verComprobante(id) {
  const pago = pagosData.find(p => p.id === id);
  alert(`📄 COMPROBANTE DE PAGO\n\n#${pago.comprobante}\n${pago.concepto}\n${formatCurrency(pago.monto)}\nFecha: ${pago.fechaPago}`);
}

function exportarPagos() {
  const data = pagosData.map(p => ({
    Concepto: p.concepto,
    Monto: formatCurrency(p.monto),
    'Vencimiento': p.vencimiento,
    Estado: getTextoEstado(p.estado),
    'Fecha Pago': p.fechaPago || '',
    Comprobante: p.comprobante || ''
  }));
  
  const csv = 'data:text/csv;charset=utf-8,' + 
    Object.keys(data[0]).join(',') + '\n' +
    data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
  
  const link = document.createElement('a');
  link.href = encodeURI(csv);
  link.download = `historial_pagos_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  // Feedback
  const btn = event.target;
  btn.innerHTML = '<i class="fas fa-check"></i> Exportado';
  btn.style.background = '#10b981';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-download"></i>';
    btn.style.background = '';
  }, 2000);
}

// ========================================
// FORMATO
// ========================================
function formatCurrency(monto) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0
  }).format(monto);
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// ========================================
// ANIMACIONES
// ========================================
function animarEstadisticas() {
  const contadores = document.querySelectorAll('[id$="Count"], [id$="Matricula"] .stat-quick span');
  
  contadores.forEach(contador => {
    const valorFinal = contador.textContent;
    contador.textContent = '0';
    
    const animar = (current, target, duration = 1500) => {
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          contador.textContent = valorFinal;
          clearInterval(timer);
        } else {
          contador.textContent = Math.floor(current);
        }
      }, 16);
    };
    
    // Detectar si es número o moneda
    if (valorFinal.includes('$')) {
      const num = parseFloat(valorFinal.replace(/[^\d]/g, ''));
      animar(0, num);
    } else {
      const num = parseInt(valorFinal);
      if (!isNaN(num)) animar(0, num);
    }
  });
}

// ========================================
// SIDEBAR (REUTILIZABLE)
function inicializarSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');

  const toggleSidebar = () => {
    sidebar.classList.toggle('collapsed');
    sidebarOverlay.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
  };

  const closeSidebar = () => {
    sidebar.classList.add('collapsed');
    sidebarOverlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  };

  sidebarToggle?.addEventListener('click', toggleSidebar);
  mobileMenuToggle?.addEventListener('click', toggleSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Cerrar sidebar al hacer click fuera (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 1024 && !sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      closeSidebar();
    }
  });
}

// ========================================
// INIT COMPLETO
// ========================================
console.log('🚀 UNI-PORTAL Finanzas cargado correctamente');
console.log(`📊 Total pagos: ${pagosData.length} | Pendientes: ${calcularEstadisticas().pendientes}`);