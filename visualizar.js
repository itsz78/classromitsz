// Cargar materias desde localStorage
window.onload = function() {
    loadSubjects();
};

// Cargar materias desde localStorage
function loadSubjects() {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const subjectsList = document.getElementById('subjectsList');
    if (subjectsList) {
        subjectsList.innerHTML = ''; // Limpiar la lista antes de cargar

        subjects.forEach((subject, index) => {
            const li = document.createElement('li');
            li.textContent = subject.name;
            li.addEventListener('click', function() {
                viewTopics(index);
                loadExams(index); // Cargar los exámenes al hacer clic en una materia
            });
            subjectsList.appendChild(li);
        });
    }
}

// Mostrar temas de una materia
function viewTopics(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const topicsContainer = document.getElementById('topicsContainer');
    const topicsList = document.getElementById('topicsList');

    if (topicsList && topicsContainer) {
        topicsList.innerHTML = ''; // Limpiar la lista de temas

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
}

// Visualizar el video de la lección
function viewVideo(videoUrl, subjectIndex, topicIndex) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoContainer = document.getElementById('videoContainer');

    if (videoPlayer && videoContainer) {
        const videoId = extractVideoId(videoUrl);
        if (videoId) {
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            videoContainer.style.display = 'block';
        } else {
            alert('URL del video no válida.');
        }
    }

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

    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.textContent = `Porcentaje de lecciones vistas: ${percentage.toFixed(2)}%`;
        progressContainer.style.display = 'block';
    }
}

// Función para extraer el ID del video de YouTube
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

// Cargar exámenes desde localStorage para una materia
function loadExams(subjectIndex) {
    const savedExamsContainer = document.getElementById('savedExamsContainer');
    savedExamsContainer.innerHTML = ''; // Limpiar antes de mostrar

    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const exams = subjects[subjectIndex].exams || [];

    exams.forEach((exam, index) => {
        const examLink = document.createElement('a');
        examLink.href = exam.link;
        examLink.textContent = `${exam.name} (Examen ${index + 1})`; // Mostrar nombre del examen
        examLink.target = '_blank'; // Abrir en una nueva pestaña
        savedExamsContainer.appendChild(examLink);
    });

    // Mostrar el contenedor de exámenes si hay exámenes disponibles
    if (exams.length > 0) {
        savedExamsContainer.style.display = 'block';
    } else {
        savedExamsContainer.style.display = 'none'; // Ocultar si no hay exámenes
    }
}
