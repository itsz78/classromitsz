// Cargar y mostrar progreso de las materias
window.onload = function() {
    loadProgress();
    startInactivityTimer(); // Iniciar el temporizador de inactividad
};

function loadProgress() {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const progressList = document.getElementById('progressList');
    progressList.innerHTML = ''; // Limpiar la lista antes de cargar

    subjects.forEach(subject => {
        const subjectItem = document.createElement('li');
        subjectItem.classList.add('subject-progress');
        subjectItem.textContent = subject.name;

        const topicsProgress = document.createElement('ul');

        subject.topics.forEach(topic => {
            const topicItem = document.createElement('li');
            topicItem.textContent = `${topic.name} - ${topic.viewed ? 'Visto' : 'No visto'}`;
            topicsProgress.appendChild(topicItem);
        });

        subjectItem.appendChild(topicsProgress);
        progressList.appendChild(subjectItem);
    });
}

// Variables para el temporizador
let inactivityTimer;
const INACTIVITY_LIMIT = 2 * 60 * 1000; // 2 minutos en milisegundos

// Función para iniciar el temporizador de inactividad
function startInactivityTimer() {
    // Limpiar el temporizador existente
    resetInactivityTimer();

    // Configurar el temporizador de inactividad
    inactivityTimer = setTimeout(function() {
        sendInactivityNotification(); // Enviar notificación si no hay actividad
    }, INACTIVITY_LIMIT);

    // Detectar interacciones del usuario y reiniciar el temporizador
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
}

// Función para reiniciar el temporizador de inactividad
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    startInactivityTimer(); // Reiniciar el temporizador
}

// Función para enviar la notificación de inactividad
function sendInactivityNotification() {
    if (Notification.permission === "granted") {
        new Notification("¡Hemos notado que no has ingresado a los cursos en un tiempo!", {
            body: "Recuerda ingresar para continuar con tus lecciones y exámenes.",
            icon: "path_to_icon.png" // Opcional: poner la ruta a un ícono
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("¡Hemos notado que no has ingresado a los cursos en un tiempo!", {
                    body: "Recuerda ingresar para continuar con tus lecciones y exámenes.",
                    icon: "path_to_icon.png"
                });
            }
        });
    }
}
