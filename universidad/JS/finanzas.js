// ========================================
// UNI-PORTAL - LÓGICA DE FINANZAS PRO
// ========================================

// 1. SIMULACIÓN DE DATOS (ESTADO INICIAL)
let db_pagos = [
    { id: 101, concepto: 'Matrícula Semestral 2026-1', monto: 15500, vencimiento: '2026-02-15', estado: 'pagado', comprobante: 'UNI-8820', fechaPago: '2026-02-10' },
    { id: 102, concepto: 'Cuota Mensualidad - Marzo', monto: 4500, vencimiento: '2026-03-30', estado: 'pendiente' },
    { id: 103, concepto: 'Derecho a Examen Laboratorio', monto: 1200, vencimiento: '2026-04-10', estado: 'pendiente' },
    { id: 104, concepto: 'Seguro Médico Estudiantil', monto: 2500, vencimiento: '2026-01-20', estado: 'atrasado' },
    { id: 105, concepto: 'Carnetización y Biblioteca', monto: 800, vencimiento: '2026-02-05', estado: 'pagado', comprobante: 'UNI-8845', fechaPago: '2026-02-02' }
];

let myChart = null;

// 2. INICIALIZADOR DE LA APP
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de Finanzas Inicializado...");
    actualizarVista();
    configurarFiltros();
});

// 3. FUNCIÓN CENTRAL DE ACTUALIZACIÓN
function actualizarVista(filtro = "") {
    renderizarTabla(filtro);
    actualizarTarjetas();
    renderizarGrafico();
}

// 4. RENDERIZADO DE LA TABLA
function renderizarTabla(filtro) {
    const tbody = document.getElementById('tablaPagos');
    if (!tbody) return;

    const datosAMostrar = filtro 
        ? db_pagos.filter(p => p.estado === filtro) 
        : db_pagos;

    tbody.innerHTML = datosAMostrar.map(p => `
        <tr>
            <td>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 600; color: #1e293b;">${p.concepto}</span>
                    <small style="color: #94a3b8;">Ref: #${p.id}</small>
                </div>
            </td>
            <td style="font-weight: 600;">${formatMonto(p.monto)}</td>
            <td>${formatFecha(p.vencimiento)}</td>
            <td><span class="badge badge-${p.estado}">${capitalize(p.estado)}</span></td>
            <td>
                <div class="acciones">
                    ${p.estado === 'pagado' 
                        ? `<button class="btn-action" onclick="imprimirTicket(${p.id})"><i class="fas fa-print"></i></button>`
                        : `<button class="btn-action" style="background: #2b63f1; color: white;" onclick="gestionarPago(${p.id})"><i class="fas fa-credit-card"></i></button>`
                    }
                </div>
            </td>
        </tr>
    `).join('');
}

// 5. ACTUALIZACIÓN DE TARJETAS SUPERIORES
function actualizarTarjetas() {
    const pendientes = db_pagos.filter(p => p.estado !== 'pagado').length;
    const pagados = db_pagos.filter(p => p.estado === 'pagado').length;
    const totalMonto = db_pagos.reduce((acc, curr) => acc + curr.monto, 0);

    updateDOMValue('pendientesCount', pendientes);
    updateDOMValue('pagadosCount', pagados);
    updateDOMValue('totalMatricula', formatMonto(totalMonto));
}

// 6. LÓGICA DEL GRÁFICO (CHART.JS)
function renderizarGrafico() {
    const ctx = document.getElementById('finanzasChart')?.getContext('2d');
    if (!ctx) return;

    const totalPagado = db_pagos.filter(p => p.estado === 'pagado').reduce((s, p) => s + p.monto, 0);
    const totalPendiente = db_pagos.filter(p => p.estado !== 'pagado').reduce((s, p) => s + p.monto, 0);

    if (myChart) myChart.destroy(); // Destruir gráfico previo para evitar solapamiento

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pagado', 'Pendiente'],
            datasets: [{
                data: [totalPagado, totalPendiente],
                backgroundColor: ['#2b63f1', '#e2e8f0'],
                hoverOffset: 4,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            }
        }
    });
}

// 7. GESTIÓN DE PAGO (ACCIONES)
window.gestionarPago = function(id) {
    const item = db_pagos.find(p => p.id === id);
    if (confirm(`¿Desea realizar el pago de ${item.concepto} por un monto de ${formatMonto(item.monto)}?`)) {
        
        // Simulación de proceso de pago exitoso
        item.estado = 'pagado';
        item.fechaPago = new Date().toISOString().split('T')[0];
        item.comprobante = `UNI-${Math.floor(1000 + Math.random() * 9000)}`;

        actualizarVista();
        alert("¡Pago realizado con éxito! ✅");
    }
}

window.imprimirTicket = function(id) {
    const item = db_pagos.find(p => p.id === id);
    alert(`GENERANDO COMPROBANTE...\n----------------------\nRecibo: ${item.comprobante}\nConcepto: ${item.concepto}\nMonto: ${formatMonto(item.monto)}\nFecha: ${item.fechaPago}`);
}

// 8. HELPERS (Utilidades)
function configurarFiltros() {
    document.getElementById('filtroEstadoPago')?.addEventListener('change', (e) => {
        actualizarVista(e.target.value);
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if(confirm("¿Cerrar sesión?")) window.location.href = 'login.html';
    });
}

function formatMonto(val) {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(val);
}

function formatFecha(fechaStr) {
    return new Date(fechaStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function updateDOMValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}