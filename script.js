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

    // Redirigir a la página de inicio de sesión (index.html)
    window.location.href = 'index.html';
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
            window.location.href = 'profile.html';
        } else {
            alert('Contraseña incorrecta.');
        }
    } else {
        alert('Usuario no registrado. Por favor, regístrate primero.');
    }
}

// Cargar datos del perfil y mostrar imagen
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

// Función para subir una imagen de perfil
document.getElementById('changeImageButton').addEventListener('click', function() {
    document.getElementById('uploadImage').click();
});

document.getElementById('uploadImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const email = localStorage.getItem('currentUser');
            const userData = JSON.parse(localStorage.getItem(email));
            userData.profileImage = e.target.result; // Guardar la imagen como base64 en localStorage
            localStorage.setItem(email, JSON.stringify(userData));
            document.getElementById('profileImage').src = e.target.result; // Actualizar imagen en la página
        };
        reader.readAsDataURL(file);
    }
});

// Función para editar los datos del usuario desde profile.html
function editUserData() {
    const email = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem(email));

    // Obtener nuevos datos del usuario
    userData.name = prompt("Edita tu nombre:", userData.name) || userData.name;
    userData.schedule = prompt("Edita tu horario:", userData.schedule) || userData.schedule;

    // Guardar los cambios en localStorage
    localStorage.setItem(email, JSON.stringify(userData));

    // Actualizar en la página
    loadProfile();
}

// Evento para editar los datos al hacer clic en el botón de edición
document.getElementById('editButton').addEventListener('click', editUserData);

// Cargar el perfil si estamos en profile.html
if (window.location.pathname.includes('profile.html')) {
    loadProfile();
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
