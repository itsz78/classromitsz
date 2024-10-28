// Cargar la página y verificar si hay un usuario logueado
window.onload = function() {
    const currentUserEmail = localStorage.getItem('currentUser');
    const isLoginPage = window.location.pathname.includes('index.html');
    const isRegisterPage = window.location.pathname.includes('register.html');

    if (currentUserEmail && !isLoginPage && !isRegisterPage) {
        window.location.href = 'perfil.html';
    }
};

// Función para registrar usuario
function registerUser() {
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const matricula = document.getElementById('matricula').value.trim();
    const password = document.getElementById('password').value.trim();
    const language = document.getElementById('language').value.trim();
    const career = document.getElementById('career').value.trim();
    const schedule = document.getElementById('schedule').value.trim();
    const type = document.getElementById('type').value;

    // Validar que todos los campos estén completos
    if (!email || !name || !matricula || !password || !language || !career || !schedule || !type) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Verificar si el usuario ya está registrado
    if (localStorage.getItem(email)) {
        alert('Este usuario ya está registrado. Intenta con otro correo.');
        return;
    }

    // Crear objeto de usuario
    const newUser = {
        name: name,
        matricula: matricula,
        password: password,
        language: language,
        career: career,
        schedule: schedule,
        type: type,
        profileImage: "default.png"
    };

    // Guardar usuario en localStorage
    localStorage.setItem(email, JSON.stringify(newUser));

    // Guardar el email como usuario actual
    localStorage.setItem('currentUser', email);

    // Redirigir a la página de perfil
    window.location.href = 'perfil.html';
}

// Función para iniciar sesión
function loginUser() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Verificar si el usuario está registrado
    const userData = localStorage.getItem(email);
    if (userData) {
        const user = JSON.parse(userData);

        // Validar contraseña
        if (user.password === password) {
            // Guardar el usuario actual en localStorage
            localStorage.setItem('currentUser', email);

            // Redirigir a la página de perfil
            window.location.href = 'perfil.html';
        } else {
            alert('Contraseña incorrecta.');
        }
    } else {
        alert('Usuario no registrado. Por favor, regístrate primero.');
    }
}

// Eventos de clic en los botones de registro e inicio de sesión
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    registerUser();
});

document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    loginUser();
});

// Mostrar datos de usuario en el perfil
function loadProfile() {
    const email = localStorage.getItem('currentUser');
    if (email) {
        const userData = JSON.parse(localStorage.getItem(email));
        if (userData) {
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userSchedule').textContent = `Horario: ${userData.schedule}`;
            document.getElementById('profileImage').src = userData.profileImage || "default.png";
        }
    }
}

// Cargar el perfil si estamos en perfil.html
if (window.location.pathname.includes('perfil.html')) {
    loadProfile();
}
