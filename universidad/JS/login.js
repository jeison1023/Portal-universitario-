// ===============================
// LOGIN SIMPLE UNIVERSITARIO
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const loading = document.getElementById("loadingOverlay");
    const botonLogin = document.querySelector(".btn-login");

    // ===============================
    // LOGIN
    // ===============================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value;
        const clave = document.getElementById("clave").value;

        // Validación básica
        if (!usuario || !clave) {
            alert("⚠️ Completa todos los campos");
            return;
        }

        // Mostrar loading
        loading.style.display = "flex";

        setTimeout(() => {

            // Guardar sesión (cualquier usuario válido)
            localStorage.setItem("usuarioAutenticado", JSON.stringify({
                nombre: usuario
            }));

            localStorage.setItem("sesionActiva", "true");

            // Redirigir
            window.location.href = "dashboard.html";

        }, 1200);
    });

    // ===============================
    // EFECTO HOVER BOTÓN
    // ===============================
    if (botonLogin) {
        botonLogin.addEventListener("mouseenter", () => {
            botonLogin.style.transform = "scale(1.05)";
        });

        botonLogin.addEventListener("mouseleave", () => {
            botonLogin.style.transform = "scale(1)";
        });
    }

});