document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usuarioInput = document.getElementById('usuario');
    const claveInput = document.getElementById('clave');
    const togglePassword = document.getElementById('togglePassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnLoading = document.getElementById('btnLoading');
    const btnRecuperar = document.getElementById('btnRecuperar');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const errorUsuario = document.getElementById('errorUsuario');
    const errorClave = document.getElementById('errorClave');

    // Credenciales correctas
    const CREDENCIALES_CORRECTAS = {
        usuario: 'luis',
        clave: '12345'
    };

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = claveInput.getAttribute('type') === 'password' ? 'text' : 'password';
        claveInput.setAttribute('type', type);
        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye-slash');
        icon.classList.toggle('fa-eye');
    });

    // Validación y login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        limpiarErrores();
        
        const usuario = usuarioInput.value.trim();
        const clave = claveInput.value.trim();
        
        // Validaciones básicas
        let esValido = true;
        
        if (!usuario) {
            mostrarError(errorUsuario, 'El usuario es requerido');
            esValido = false;
        } else if (usuario !== CREDENCIALES_CORRECTAS.usuario) {
            mostrarError(errorUsuario, 'Usuario incorrecto');
            esValido = false;
        }
        
        if (!clave) {
            mostrarError(errorClave, 'La contraseña es requerida');
            esValido = false;
        } else if (clave.length < 4) {
            mostrarError(errorClave, 'La contraseña debe tener al menos 4 caracteres');
            esValido = false;
        } else if (clave !== CREDENCIALES_CORRECTAS.clave) {
            mostrarError(errorClave, 'Contraseña incorrecta');
            esValido = false;
        }
        
        if (esValido) {
            // LOGIN EXITOSO ✅
            mostrarLoading();
            
            // Simular delay de autenticación
            setTimeout(() => {
                // Guardar datos del usuario logueado
                localStorage.setItem('usuarioLogueado', JSON.stringify({
                    usuario: usuario,
                    nombre: 'Luis Fernández', // Nombre para mostrar en dashboard
                    rol: 'Estudiante'
                }));
                
                // Guardar "recordarme" si está marcado
                if (document.getElementById('recordarme').checked) {
                    localStorage.setItem('recordarme', 'true');
                    localStorage.setItem('ultimoUsuario', usuario);
                }
                
                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            }, 2000);
        }
    });

    // Botón recuperar acceso
    btnRecuperar.addEventListener('click', function() {
        const modalHTML = `
            <div id="recuperarModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                ">
                    <h3 style="color: #1f2937; margin-bottom: 1rem;">🔑 Recuperar Acceso</h3>
                    <p style="color: #64748b; margin-bottom: 1.5rem;">
                        Usuario: <strong>luis</strong><br>
                        Contraseña: <strong>12345</strong>
                    </p>
                    <button onclick="document.getElementById('recuperarModal').remove()" 
                            style="
                                background: #2563eb;
                                color: white;
                                border: none;
                                padding: 0.75rem 2rem;
                                border-radius: 0.75rem;
                                cursor: pointer;
                                font-weight: 600;
                            ">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    });

    // Funciones auxiliares
    function mostrarError(elemento, mensaje) {
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
        elemento.parentElement.classList.add('error');
        
        // Sacudir input con error
        const input = elemento.parentElement.querySelector('input');
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }

    function limpiarErrores() {
        const errores = document.querySelectorAll('.input-error');
        errores.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
            error.parentElement.classList.remove('error');
        });
    }

    function mostrarLoading() {
        // Activar loading en botón
        btnLogin.disabled = true;
        btnLogin.classList.add('loading');
        btnLogin.querySelector('.btn-text').style.opacity = '0';
        btnLoading.style.display = 'flex';
        
        // Mostrar overlay
        loadingOverlay.classList.remove('hidden');
    }

    // Cargar estado "recordarme" si existe
    if (localStorage.getItem('recordarme') === 'true') {
        document.getElementById('recordarme').checked = true;
        const ultimoUsuario = localStorage.getItem('ultimoUsuario');
        if (ultimoUsuario) {
            usuarioInput.value = ultimoUsuario;
            usuarioInput.focus();
        }
    } else {
        // Enfocar primer input
        usuarioInput.focus();
    }

    // Agregar animación shake al CSS dinámicamente
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
});