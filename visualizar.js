// Cargar materias y exámenes desde localStorage
window.onload = function() {
    loadSubjects();
    loadExams();
};

// Cargar materias desde localStorage
function loadSubjects() {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = ''; // Limpiar la lista antes de cargar

    subjects.forEach((subject, index) => {
        const li = document.createElement('li');
        li.textContent = subject.name;
        li.addEventListener('click', function() {
            viewTopics(index);
        });
        subjectsList.appendChild(li);
    });
}

// Mostrar temas de una materia
function viewTopics(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const topicsContainer = document.getElementById('topicsContainer');
    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = '';

    subjects[subjectIndex].topics.forEach((topic, topicIndex) => {
        const li = document.createElement('li');
        li.textContent = topic.name;
        li.addEventListener('click', function() {
            viewVideo(topic.lesson, subjectIndex, topicIndex);
        });
        topicsList.appendChild(li);
    });

    topicsContainer.style.display = 'block';
}

// Visualizar el video de la lección
function viewVideo(videoUrl, subjectIndex, topicIndex) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoId = extractVideoId(videoUrl);
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    document.getElementById('videoContainer').style.display = 'block';

    // Marcar la lección como vista
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    subjects[subjectIndex].topics[topicIndex].viewed = true;
    localStorage.setItem('subjects', JSON.stringify(subjects));

    // Calcular y mostrar el porcentaje de lecciones vistas
    updateProgress(subjectIndex);
}

// Calcular y mostrar el porcentaje de lecciones vistas
function updateProgress(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const topics = subjects[subjectIndex].topics;
    const viewedCount = topics.filter(topic => topic.viewed).length;
    const percentage = (viewedCount / topics.length) * 100;

    // Muestra el porcentaje en la interfaz
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.textContent = `Porcentaje de lecciones vistas: ${percentage.toFixed(2)}%`;
    progressContainer.style.display = 'block';
}

// Función para extraer el ID del video de YouTube
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

// Cargar exámenes desde localStorage
function loadExams() {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    const examsList = document.getElementById('examsList');
    examsList.innerHTML = ''; // Limpiar la lista antes de cargar

    if (exams.length === 0) {
        document.getElementById('examContainer').style.display = 'none'; // Ocultar si no hay exámenes
        return;
    }

    exams.forEach((exam, index) => {
        const li = document.createElement('li');
        li.textContent = exam.examName;
        li.addEventListener('click', function() {
            openExam(index); // Cambia a la función para abrir el examen
        });
        examsList.appendChild(li);
    });

    // Mostrar el contenedor de exámenes si hay exámenes disponibles
    document.getElementById('examContainer').style.display = 'block'; 
}

// Función para abrir el examen (aquí puedes definir cómo abrir el examen)
function openExam(examIndex) {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    const examUrl = exams[examIndex].url; // Asegúrate de que 'url' esté definido en el objeto del examen

    if (examUrl) {
        window.open(examUrl, '_blank'); // Abre el examen en una nueva pestaña
    } else {
        alert('URL del examen no disponible.'); // Mensaje si no hay URL
    }
}


