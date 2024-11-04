// Cargar y mostrar progreso de las materias
window.onload = function() {
    loadProgress();
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
