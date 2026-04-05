// ========================================
// JS/perfil.js - VERSION PRO COMPLETA
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // INIT
    // =============================================
    initSidebar();
    initTabs();
    initEventosPerfil();

    // =============================================
    // SIDEBAR (MISMO SISTEMA GLOBAL)
    // =============================================
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const btnDesktop = document.getElementById('sidebarToggle');
        const btnMobile = document.getElementById('mobileMenuToggle');

        btnDesktop?.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        btnMobile?.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });

        overlay?.addEventListener('click', cerrarSidebar);

        function cerrarSidebar() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }

        document.addEventListener('click', (e) => {
            if (
                window.innerWidth <= 768 &&
                !sidebar.contains(e.target) &&
                !btnMobile.contains(e.target)
            ) {
                cerrarSidebar();
            }
        });
    }

    // =============================================
    // TABS PERFIL
    // =============================================
    function initTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {

                // Quitar activos
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Activar actual
                tab.classList.add('active');
                const target = document.getElementById(`tab-${tab.dataset.tab}`);
                target?.classList.add('active');
            });
        });
    }

    // =============================================
    // EVENTOS PERFIL
    // =============================================
    function initEventosPerfil() {

        // Guardar cambios
        document.getElementById('btnGuardarCambios')?.addEventListener('click', () => {
            mostrarToast('✅ Cambios guardados correctamente');
        });

        // Editar perfil
        document.getElementById('btnEditarPerfil')?.addEventListener('click', () => {
            mostrarToast('✏️ Modo edición activado');
        });

        // Cambiar contraseña
        document.getElementById('btnCambiarPassword')?.addEventListener('click', () => {
            alert('🔒 Aquí irá el módulo de cambio de contraseña');
        });

        // Descargar datos
        document.getElementById('btnDescargarDatos')?.addEventListener('click', () => {
            descargarDatos();
        });

        // Foto perfil
        const inputFoto = document.getElementById('fotoInput');
        const img = document.getElementById('fotoPerfil');

        inputFoto?.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                mostrarToast('📸 Foto actualizada');
            };
            reader.readAsDataURL(file);
        });

        // Logout
        document.querySelector('.logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                localStorage.removeItem('userSession');
                window.location.href = 'login.html';
            }
        });
    }

    // =============================================
    // FUNCIONES
    // =============================================
    function descargarDatos() {
        const data = {
            nombre: document.getElementById('nombreCompleto').textContent,
            codigo: document.getElementById('codigoEstudiantil').textContent,
            programa: document.getElementById('programaAcademico').textContent
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'perfil.json';
        a.click();

        mostrarToast('📥 Datos descargados');
    }

    // =============================================
    // TOAST PRO
    // =============================================
    function mostrarToast(mensaje) {
        const toast = document.createElement('div');
        toast.textContent = mensaje;

        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = '#111';
        toast.style.color = '#fff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '10px';
        toast.style.zIndex = '9999';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2500);
    }

});