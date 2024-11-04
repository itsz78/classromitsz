// Mostrar tipos de usuario
window.onload = function() {
    const currentUserEmail = localStorage.getItem('currentUser');
    const currentUser = JSON.parse(localStorage.getItem(currentUserEmail));

    if (currentUser) {
        document.getElementById('userTypeOptions').textContent = `Tipo de Usuario: ${currentUser.type}`;
        if (currentUser.type === 'maestro') { // Mostrar botones solo para maestros
            loadSubjects();
        }
    }
};

// Cargar materias desde localStorage y mostrar imágenes
function loadSubjects() {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = ''; // Limpiar la lista antes de cargar

    subjects.forEach((subject, index) => {
        const li = document.createElement('li');

        // Crear y añadir la imagen de la materia
        const img = document.createElement('img');
        img.src = subject.image;
        img.alt = `Imagen de ${subject.name}`;
        img.style.width = '50px';
        img.style.height = '50px';

        const subjectName = document.createElement('span');
        subjectName.textContent = subject.name;

        li.appendChild(img); // Añadir la imagen al elemento de la lista
        li.appendChild(subjectName); // Añadir el nombre de la materia
        li.dataset.index = index;

        li.addEventListener('click', function() {
            viewTopics(index);
        });

        subjectsList.appendChild(li);
    });
}

// Función para agregar una nueva materia con selección de imagen desde almacenamiento
function addSubject() {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const newSubjectName = prompt("Nombre de la nueva materia:");

    if (newSubjectName) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                const newSubject = {
                    name: newSubjectName,
                    image: e.target.result,
                    topics: [],
                    exams: []
                };

                subjects.push(newSubject);
                localStorage.setItem('subjects', JSON.stringify(subjects));
                loadSubjects();
            };

            reader.readAsDataURL(file);
        };

        fileInput.click();
    } else {
        alert("Se requiere un nombre válido para la materia.");
    }
}

// Vincula el botón de agregar materia con la función addSubject
document.getElementById('addSubjectButton').addEventListener('click', addSubject);

// Función para editar una materia (nombre e imagen)
function editSubject(index) {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const newName = prompt("Nuevo nombre de la materia:", subjects[index].name);

    if (newName) {
        subjects[index].name = newName;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            subjects[index].image = e.target.result;
            localStorage.setItem('subjects', JSON.stringify(subjects));
            loadSubjects();
        };

        reader.readAsDataURL(file);
    };

    fileInput.click();
}

// Eliminar una materia
function deleteSubject(index) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    if (confirm("¿Estás seguro de que quieres eliminar esta materia?")) {
        subjects.splice(index, 1);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        loadSubjects();
    }
}

// Ver y editar temas de una materia
function viewTopics(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const topicsContainer = document.getElementById('topicsContainer');
    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = '';

    subjects[subjectIndex].topics.forEach((topic, index) => {
        const li = document.createElement('li');
        li.textContent = topic.name;

        // Botón para editar tema
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', function() {
            editTopic(subjectIndex, index);
        });

        // Botón para eliminar tema
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', function() {
            deleteTopic(subjectIndex, index);
        });

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        topicsList.appendChild(li);
    });

    // Botón para agregar nueva lección
    const addTopicButton = document.createElement('button');
    addTopicButton.textContent = 'Agregar Lección';
    addTopicButton.addEventListener('click', function() {
        addTopic(subjectIndex);
    });
    topicsContainer.appendChild(addTopicButton);

    topicsContainer.style.display = 'block';
    document.getElementById('examContainer').style.display = 'block';
    loadExams(subjectIndex);
}

// Función para agregar un nuevo tema con un enlace de video
function addTopic(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const newTopicName = prompt("Nombre de la nueva lección:");

    if (newTopicName) {
        const videoLink = prompt("Enlace de video de YouTube:");

        const newTopic = {
            name: newTopicName,
            lesson: videoLink || null
        };
        subjects[subjectIndex].topics.push(newTopic);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        viewTopics(subjectIndex);
    } else {
        alert("No se ingresó un nombre válido para la lección.");
    }
}

// Editar tema
function editTopic(subjectIndex, topicIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const newTopicName = prompt("Nuevo nombre del tema:", subjects[subjectIndex].topics[topicIndex].name);

    if (newTopicName) {
        subjects[subjectIndex].topics[topicIndex].name = newTopicName;
    }

    const newLessonLink = prompt("Nuevo enlace de video de YouTube:", subjects[subjectIndex].topics[topicIndex].lesson);
    if (newLessonLink) {
        subjects[subjectIndex].topics[topicIndex].lesson = newLessonLink;
    }

    localStorage.setItem('subjects', JSON.stringify(subjects));
    viewTopics(subjectIndex);
}

// Eliminar tema
function deleteTopic(subjectIndex, topicIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    if (confirm("¿Estás seguro de que quieres eliminar este tema?")) {
        subjects[subjectIndex].topics.splice(topicIndex, 1);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        viewTopics(subjectIndex);
    }
}

// Cargar exámenes guardados de la materia
function loadExams(subjectIndex) {
    const savedExamsContainer = document.getElementById('savedExamsContainer');
    savedExamsContainer.innerHTML = ''; // Limpiar antes de mostrar

    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const exams = subjects[subjectIndex].exams || [];

    exams.forEach((exam, index) => {
        const examLink = document.createElement('a');
        examLink.href = exam.link;
        examLink.textContent = `${exam.name} (Examen ${index + 1})`; // Mostrar nombre del examen
        examLink.target = '_blank';

        // Botón para eliminar examen
        const deleteExamButton = document.createElement('button');
        deleteExamButton.textContent = 'Eliminar';
        deleteExamButton.addEventListener('click', function() {
            deleteExam(subjectIndex, index);
        });

        savedExamsContainer.appendChild(examLink);
        savedExamsContainer.appendChild(deleteExamButton);
    });

    // Botón para agregar un nuevo examen
    const addExamButton = document.createElement('button');
    addExamButton.textContent = 'Agregar Examen';
    addExamButton.addEventListener('click', function() {
        addExam(subjectIndex);
    });
    savedExamsContainer.appendChild(addExamButton);
}

// Función para agregar un nuevo examen con nombre y enlace a Google Formularios
function addExam(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    const newExamName = prompt("Nombre del nuevo examen:");
    const newExamLink = prompt("Enlace del nuevo examen:");

    if (newExamName && newExamLink) {
        const newExam = {
            name: newExamName,
            link: newExamLink
        };
        subjects[subjectIndex].exams.push(newExam);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        loadExams(subjectIndex); // Recargar los exámenes de la materia
    } else {
        alert("No se ingresó un nombre o enlace válido para el examen.");
    }
}

// Eliminar un examen
function deleteExam(subjectIndex, examIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects'));
    if (confirm("¿Estás seguro de que quieres eliminar este examen?")) {
        subjects[subjectIndex].exams.splice(examIndex, 1);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        loadExams(subjectIndex); // Recargar los exámenes de la materia
    }
}
