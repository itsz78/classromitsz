document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario recargue la página

        // Obtener valores del formulario
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Verificar si existe un usuario con este correo en localStorage
        const userData = localStorage.getItem(email);

        if (!userData) {
            alert('El usuario no existe. Por favor, verifica tu correo.');
            return;
        }

        // Analizar los datos del usuario
        let user;
        try {
            user = JSON.parse(userData);
        } catch (error) {
            console.error('Error al analizar los datos del usuario:', error);
            alert('Hubo un problema con los datos del usuario.');
            return;
        }

        // Validar las credenciales
        if (user.password === password && user.type.toLowerCase() === 'maestro') {
            alert('Inicio de sesión exitoso. Bienvenido maestro.');
            localStorage.setItem('currentUser', email); // Establecer el usuario actual
            window.location.href = 'agregar.html'; // Redirigir a la página principal
        } else {
            alert('Credenciales incorrectas o no tienes permiso para acceder.');
        }
    });
});
