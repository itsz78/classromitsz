// Guardar datos en LocalStorage para el registro
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = {
        name: document.getElementById('name').value,
        matricula: document.getElementById('matricula').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        language: document.getElementById('language').value,
        career: document.getElementById('career').value,
        schedule: document.getElementById('schedule').value,
        type: document.getElementById('type').value.toLowerCase(), // Guardar tipo en minúsculas
        profileImage: '', // Para guardar la imagen de perfil
    };

    // Guardar datos del usuario en localStorage
    localStorage.setItem(user.email, JSON.stringify(user));
    window.location.href = 'index.html'; // Redirigir al login después del registro
});

// Validar login y redirigir a la página de perfil
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user = JSON.parse(localStorage.getItem(email));

    // Verificar si el usuario existe y si la contraseña es correcta
    if (user && user.password === password) {
        localStorage.setItem('currentUser', email); // Guardar el email del usuario logueado
        window.location.href = 'profile.html'; // Redirigir al perfil
    } else {
        document.getElementById('errorMessage').textContent = 'Email o contraseña incorrectos';
    }
});

// Mostrar datos en la página de perfil
window.onload = function() {
    const currentUserEmail = localStorage.getItem('currentUser');
    const currentUser = JSON.parse(localStorage.getItem(currentUserEmail));

    if (currentUser) {
        // Mostrar nombre y horario del usuario en la página de perfil
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userSchedule').textContent = `Horario: ${currentUser.schedule}`;

        // Cargar imagen de perfil si existe
        const savedImage = currentUser.profileImage;
        const profileImage = document.getElementById('profileImage');
        if (savedImage) {
            profileImage.src = savedImage;
        }

        // Cambio de imagen de perfil
        const uploadImage = document.getElementById('uploadImage');
        document.getElementById('changeImageButton').addEventListener('click', function() {
            uploadImage.click(); // Simular el clic del botón de cargar imagen
        });

        uploadImage.addEventListener('change', function() {
            const file = uploadImage.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result; // Mostrar la imagen en la página
                currentUser.profileImage = e.target.result; // Guardar la imagen en el objeto del usuario

                // Guardar los cambios en localStorage
                localStorage.setItem(currentUserEmail, JSON.stringify(currentUser));
            };
            reader.readAsDataURL(file); // Convertir la imagen en Base64
        });

        // Función para editar los datos del perfil (nombre y horario)
        document.getElementById('editButton').addEventListener('click', function() {
            const newName = prompt("Editar nombre:", currentUser.name);
            const newSchedule = prompt("Editar horario:", currentUser.schedule);

            if (newName !== null && newSchedule !== null) {
                // Actualizar datos del usuario
                currentUser.name = newName;
                currentUser.schedule = newSchedule;

                // Mostrar los cambios en la página
                document.getElementById('userName').textContent = currentUser.name;
                document.getElementById('userSchedule').textContent = `Horario: ${currentUser.schedule}`;

                // Guardar los nuevos datos en localStorage
                localStorage.setItem(currentUserEmail, JSON.stringify(currentUser));
            }
        });

        // Mostrar materias y temas según el tipo de usuario
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        
        // Mostrar opciones según el tipo de usuario
        if (currentUser.type === 'maestro') { // Comparar en minúsculas
            document.getElementById('addSubjectButton').style.display = 'block';
            document.getElementById('addTopicButton').style.display = 'block';
            document.getElementById('addExamButton').style.display = 'block';
        }

        // Mostrar materias
        const subjectsList = document.getElementById('subjectsList');
        subjects.forEach((subject, index) => {
            const li = document.createElement('li');
            li.textContent = subject.name;
            li.addEventListener('click', function() {
                viewTopics(index);
            });
            subjectsList.appendChild(li);
        });

        // Mostrar progreso
        displayProgress(currentUserEmail);
    } else {
        // Si no hay un usuario logueado, redirigir al login
        window.location.href = 'index.html';
    }
};

// Agregar nueva materia
document.getElementById('addSubjectButton')?.addEventListener('click', function() {
    const newSubject = prompt("Nombre de la nueva materia:");
    if (newSubject) {
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        subjects.push({ name: newSubject, topics: [] });
        localStorage.setItem('subjects', JSON.stringify(subjects));
        window.location.reload();
    }
});

// Agregar nuevo tema a la materia seleccionada
document.getElementById('addTopicButton')?.addEventListener('click', function() {
    const subjectIndex = prompt("Índice de la materia para agregar un tema:");
    const newTopic = prompt("Nombre del nuevo tema:");
    const newLesson = prompt("Enlace del video de la lección:");
    
    if (subjectIndex !== null && newTopic && newLesson) {
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        subjects[subjectIndex].topics.push({ name: newTopic, lesson: newLesson, completed: false });
        localStorage.setItem('subjects', JSON.stringify(subjects));
        window.location.reload();
    }
});

// Mostrar temas de una materia
function viewTopics(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const topicsContainer = document.getElementById('topicsContainer');
    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = '';

    subjects[subjectIndex].topics.forEach((topic, index) => {
        const li = document.createElement('li');
        li.textContent = topic.name;
        li.addEventListener('click', function() {
            watchLesson(subjectIndex, index);
        });
        topicsList.appendChild(li);
    });

    topicsContainer.style.display = 'block';
}

// Ver lección de un tema
function watchLesson(subjectIndex, topicIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const lessonLink = subjects[subjectIndex].topics[topicIndex].lesson;
    window.open(lessonLink, '_blank'); // Abrir el video en una nueva pestaña

    // Marcar como completado
    subjects[subjectIndex].topics[topicIndex].completed = true;
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

// Mostrar el progreso del estudiante
function displayProgress(userEmail) {
    const progressContainer = document.getElementById('progressContainer');
    const progressList = document.getElementById('progressList');
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    progressList.innerHTML = '';

    subjects.forEach((subject) => {
        subject.topics.forEach((topic) => {
            if (topic.completed) {
                const li = document.createElement('li');
                li.textContent = `${subject.name} - ${topic.name}: Completado`;
                progressList.appendChild(li);
            }
        });
    });

    progressContainer.style.display = 'block';
}


