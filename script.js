// Register the Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/TaskPlanner/service-worker.js')
        .then(() => console.log('Service Worker registered successfully.'))
        .catch(err => console.error('Service Worker registration failed:', err));
}

let currentColumnId = '';
let currentEditTask = null;
let taskCounter = 0;
let filterAssignedTo = '';
let autoScrollInterval;

let maxScreenWidth = window.innerWidth;
let maxScreenHeight = window.innerHeight;

window.addEventListener('resize', () => {
    maxScreenWidth = Math.max(maxScreenWidth, window.innerWidth);
    maxScreenHeight = Math.max(maxScreenHeight, window.innerHeight);
});

const translations = {
    en: {
        task: "Task",
        due: "Due",
        assignedTo: "Assigned to",
        addEditTask: "Add / Edit Task",
        delete: "Delete",
        save: "Save",
        toDo: "To Do",
        inProgress: "In Progress",
        done: "Done",
        filterTasks: "Filter Tasks",
        menu: "Menu",
        file: "File",
        load: "Load",
        export: "Export",
        settings: "Settings",
        darkMode: "Dark Mode",
        fontStyle: "Font Style",
        fontFamily: "Font Family",
        language: "Language",
        about: "About",
        reorderTasks: "Reorder Tasks",
        filterList: "Filter List",
        filterListAlt: "Filter List Alt",
        confirmDeleteDoneTasks: "Are you sure you want to delete all tasks in the Done column?",
        tasksCopied: "Tasks copied to clipboard!",
        tasksReordered: "Tasks reordered by due date!",
        weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        singleColorTasks: "Single Color Tasks",
        oneColor: "One Color",
        assignPriority: "Assign Priority",
        removePriority: "Remove Priority",
        setPassword: "Set Password",
        password: "Password",
        setPasswordPlaceholder: "Password",
        enterPasswordPlaceholder: "Enter your password",
        setPasswordButton: "Set Password",
        submitButton: "Submit",
        tooManyAttempts: "Too many failed attempts. Please wait {time} seconds.",
        incorrectPassword: "Incorrect password. Please try again.",
        passwordCannotBeEmpty: "Password cannot be empty.",
        writeDownPassword: "Remember your password as it will be used to decrypt your data.",
        passwordsDoNotMatch: "Passwords do not match. Please try again."
    },
    it: {
        task: "Compito",
        due: "Scadenza",
        assignedTo: "Assegnato a",
        addEditTask: "Aggiungi / Modifica Compito",
        delete: "Elimina",
        save: "Salva",
        toDo: "Da Fare",
        inProgress: "In Corso",
        done: "Fatto",
        filterTasks: "Filtra Compiti",
        menu: "Menu",
        file: "File",
        load: "Carica",
        export: "Esporta",
        settings: "Impostazioni",
        darkMode: "Modalità Scura",
        fontStyle: "Stile del Carattere",
        fontFamily: "Famiglia del Carattere",
        language: "Lingua",
        about: "Informazioni",
        reorderTasks: "Riordina Compiti",
        filterList: "Lista Filtri",
        filterListAlt: "Lista Filtri Alternativa",
        confirmDeleteDoneTasks: "Sei sicuro di voler eliminare tutti i compiti nella colonna Fatto?",
        tasksCopied: "Compiti copiati negli appunti!",
        tasksReordered: "Compiti riordinati per data di scadenza!",
        weekdays: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
        singleColorTasks: "Compiti a Colore Unico",
        oneColor: "Un Colore",
        assignPriority: "Assegna Priorità",
        removePriority: "Rimuovi Priorità",
        setPassword: "Imposta Password",
        password: "Password",
        setPasswordPlaceholder: "Password",
        enterPasswordPlaceholder: "Inserisci la tua password",
        setPasswordButton: "Imposta Password",
        submitButton: "Invia",
        tooManyAttempts: "Troppi tentativi falliti. Attendere {time} secondi.",
        incorrectPassword: "Password errata. Riprova.",
        passwordCannotBeEmpty: "La password non può essere vuota.",
        writeDownPassword: "Ricorda la tua password poiché verrà utilizzata per decrittografare i tuoi dati."
    },
    es: {
        task: "Tarea",
        due: "Vence",
        assignedTo: "Asignado a",
        addEditTask: "Agregar / Editar Tarea",
        delete: "Eliminar",
        save: "Guardar",
        toDo: "Por Hacer",
        inProgress: "En Progreso",
        done: "Hecho",
        filterTasks: "Filtrar Tareas",
        menu: "Menú",
        file: "Archivo",
        load: "Cargar",
        export: "Exportar",
        settings: "Configuraciones",
        darkMode: "Modo Oscuro",
        fontStyle: "Estilo de Fuente",
        fontFamily: "Familia de Fuente",
        language: "Idioma",
        about: "Acerca de",
        reorderTasks: "Reordenar Tareas",
        filterList: "Lista de Filtros",
        filterListAlt: "Lista de Filtros Alternativa",
        confirmDeleteDoneTasks: "¿Estás seguro de que deseas eliminar todas las tareas en la columna Hecho?",
        tasksCopied: "¡Tareas copiadas al portapapeles!",
        tasksReordered: "¡Tareas reordenadas por fecha de vencimiento!",
        weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        singleColorTasks: "Tareas de Color Único",
        oneColor: "Un Color",
        assignPriority: "Asignar Prioridad",
        removePriority: "Quitar Prioridad",
        setPassword: "Establecer Contraseña",
        password: "Contraseña",
        setPasswordPlaceholder: "Contraseña",
        enterPasswordPlaceholder: "Introduce tu contraseña",
        setPasswordButton: "Establecer Contraseña",
        submitButton: "Enviar",
        tooManyAttempts: "Demasiados intentos fallidos. Espere {time} segundos.",
        incorrectPassword: "Contraseña incorrecta. Inténtalo de nuevo.",
        passwordCannotBeEmpty: "La contraseña no puede estar vacía.",
        writeDownPassword: "Recuerda tu contraseña ya que se utilizará para descifrar tus datos."
    },
    pt: {
        task: "Tarefa",
        due: "Vence",
        assignedTo: "Atribuído a",
        addEditTask: "Adicionar / Editar Tarefa",
        delete: "Excluir",
        save: "Salvar",
        toDo: "A Fazer",
        inProgress: "Em Progresso",
        done: "Feito",
        filterTasks: "Filtrar Tarefas",
        menu: "Menu",
        file: "Arquivo",
        load: "Carregar",
        export: "Exportar",
        settings: "Configurações",
        darkMode: "Modo Escuro",
        fontStyle: "Estilo da Fonte",
        fontFamily: "Família da Fonte",
        language: "Idioma",
        about: "Sobre",
        reorderTasks: "Reordenar Tarefas",
        filterList: "Lista de Filtros",
        filterListAlt: "Lista de Filtros Alternativa",
        confirmDeleteDoneTasks: "Tem certeza de que deseja excluir todas as tarefas na coluna Feito?",
        tasksCopied: "Tarefas copiadas para a área de transferência!",
        tasksReordered: "Tarefas reordenadas por data de vencimento!",
        weekdays: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        singleColorTasks: "Tarefas de Cor Única",
        oneColor: "Uma Cor",
        assignPriority: "Atribuir Prioridade",
        removePriority: "Remover Prioridade",
        setPassword: "Definir Senha",
        password: "Senha",
        setPasswordPlaceholder: "Senha",
        enterPasswordPlaceholder: "Digite sua senha",
        setPasswordButton: "Definir Senha",
        submitButton: "Enviar",
        tooManyAttempts: "Muitas tentativas falharam. Aguarde {time} segundos.",
        incorrectPassword: "Senha incorreta. Tente novamente.",
        passwordCannotBeEmpty: "A senha não pode estar vazia.",
        writeDownPassword: "Lembre-se da sua senha, pois ela será usada para descriptografar seus dados."
    },
    ro: {
        task: "Sarcină",
        due: "Termen",
        assignedTo: "Atribuit lui",
        addEditTask: "Adaugă / Editează Sarcină",
        delete: "Șterge",
        save: "Salvează",
        toDo: "De Făcut",
        inProgress: "În Progres",
        done: "Terminat",
        filterTasks: "Filtrează Sarcini",
        menu: "Meniu",
        file: "Fișier",
        load: "Încarcă",
        export: "Exportă",
        settings: "Setări",
        darkMode: "Mod Întunecat",
        fontStyle: "Stilul Fontului",
        fontFamily: "Familia Fontului",
        language: "Limbă",
        about: "Despre",
        reorderTasks: "Reordonează Sarcini",
        filterList: "Listă de Filtre",
        filterListAlt: "Listă de Filtre Alternativă",
        confirmDeleteDoneTasks: "Ești sigur că vrei să ștergi toate sarcinile din coloana Terminat?",
        tasksCopied: "Sarcinile au fost copiate în clipboard!",
        tasksReordered: "Sarcinile au fost reordonate după data termenului!",
        weekdays: ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"],
        singleColorTasks: "Sarcini de Culoare Unică",
        oneColor: "O Culoare",
        assignPriority: "Atribuie Prioritate",
        removePriority: "Elimină Prioritate",
        setPassword: "Setează Parola",
        password: "Parola",
        setPasswordPlaceholder: "Parolă",
        enterPasswordPlaceholder: "Introdu parola",
        setPasswordButton: "Setează Parola",
        submitButton: "Trimite",
        tooManyAttempts: "Prea multe tentative eșuate. Așteptați {time} secunde.",
        incorrectPassword: "Parolă incorectă. Încercați din nou.",
        passwordCannotBeEmpty: "Parola nu poate fi goală.",
        writeDownPassword: "Ține minte parola ta, deoarece va fi folosită pentru a decripta datele tale."
    },
    de: {
        task: "Aufgabe",
        due: "Fällig",
        assignedTo: "Zugewiesen an",
        addEditTask: "Aufgabe Hinzufügen / Bearbeiten",
        delete: "Löschen",
        save: "Speichern",
        toDo: "Zu Erledigen",
        inProgress: "In Bearbeitung",
        done: "Erledigt",
        filterTasks: "Aufgaben Filtern",
        menu: "Menü",
        file: "Datei",
        load: "Laden",
        export: "Exportieren",
        settings: "Einstellungen",
        darkMode: "Dunkelmodus",
        fontStyle: "Schriftstil",
        fontFamily: "Schriftfamilie",
        language: "Sprache",
        about: "Über",
        reorderTasks: "Aufgaben Neu Ordnen",
        filterList: "Filterliste",
        filterListAlt: "Alternative Filterliste",
        confirmDeleteDoneTasks: "Sind Sie sicher, dass Sie alle Aufgaben in der Spalte Erledigt löschen möchten?",
        tasksCopied: "Aufgaben in die Zwischenablage kopiert!",
        tasksReordered: "Aufgaben nach Fälligkeitsdatum neu geordnet!",
        weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        singleColorTasks: "Einfarbige Aufgaben",
        oneColor: "Eine Farbe",
        assignPriority: "Priorität Zuweisen",
        removePriority: "Priorität Entfernen",
        setPassword: "Passwort Festlegen",
        password: "Passwort",
        setPasswordPlaceholder: "Passwort",
        enterPasswordPlaceholder: "Geben Sie Ihr Passwort ein",
        setPasswordButton: "Passwort Festlegen",
        submitButton: "Einreichen",
        tooManyAttempts: "Zu viele fehlgeschlagene Versuche. Bitte warten Sie {time} Sekunden.",
        incorrectPassword: "Falsches Passwort. Bitte versuchen Sie es erneut.",
        passwordCannotBeEmpty: "Das Passwort darf nicht leer sein.",
        writeDownPassword: "Merken Sie sich Ihr Passwort, da es zur Entschlüsselung Ihrer Daten verwendet wird."
    },
    zh: {
        task: "任务",
        due: "截止日期",
        assignedTo: "分配给",
        addEditTask: "添加 / 编辑任务",
        delete: "删除",
        save: "保存",
        toDo: "待办",
        inProgress: "进行中",
        done: "已完成",
        filterTasks: "筛选任务",
        menu: "菜单",
        file: "文件",
        load: "加载",
        export: "导出",
        settings: "设置",
        darkMode: "深色模式",
        fontStyle: "字体样式",
        fontFamily: "字体家族",
        language: "语言",
        about: "关于",
        reorderTasks: "重新排序任务",
        filterList: "筛选列表",
        filterListAlt: "筛选列表（替代）",
        confirmDeleteDoneTasks: "确定要删除“已完成”列中的所有任务吗？",
        tasksCopied: "任务已复制到剪贴板！",
        tasksReordered: "任务已按截止日期重新排序！",
        weekdays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        singleColorTasks: "单色任务",
        oneColor: "单色",
        assignPriority: "分配优先级",
        removePriority: "移除优先级",
        setPassword: "设置密码",
        password: "密码",
        setPasswordPlaceholder: "密码",
        enterPasswordPlaceholder: "输入您的密码",
        setPasswordButton: "设置密码",
        submitButton: "提交",
        tooManyAttempts: "尝试次数过多。请等待 {time} 秒。",
        incorrectPassword: "密码错误。请再试一次。",
        passwordCannotBeEmpty: "密码不能为空。",
        writeDownPassword: "记住您的密码，因为它将用于解密您的数据。"
    }
    // Add more languages as needed
};

function getDayOfWeek(date, language) {
    const dayIndex = new Date(date).getDay();
    return translations[language].weekdays[dayIndex];
}

function applyTranslations(language) {
    document.querySelectorAll('.task .description').forEach(description => {
        const details = description.nextElementSibling;
        const [dueText, assignedToText] = details.innerText.split('|');
        const dueDate = dueText.split(': ')[1].split(' ')[0];
        const dayOfWeek = getDayOfWeek(dueDate, language);
        const assignedTo = assignedToText.split(': ')[1];
        details.innerText = `${translations[language].due}: ${dueDate} (${dayOfWeek}) | ${translations[language].assignedTo}: ${assignedTo}`;
    });

    document.querySelector('#popup h3').innerText = translations[language].addEditTask;
    document.querySelector('#popup button[onclick="deleteTask()"]').innerText = translations[language].delete;
    document.querySelector('#popup button[onclick="saveTask()"]').innerText = translations[language].save;
    document.querySelector('#taskDescription').placeholder = translations[language].task;
    document.querySelector('#taskAssignedTo').placeholder = translations[language].assignedTo;
    document.querySelector('#todo-column h2').innerText = translations[language].toDo;
    document.querySelector('#in-progress-column h2').innerText = translations[language].inProgress;
    document.querySelector('#done-column h2').innerText = translations[language].done;
    document.querySelector('#settings-popup h2').innerText = translations[language].menu;
    document.querySelector('#settings-popup h3:nth-of-type(1)').innerText = translations[language].file;
    document.querySelector('#settings-popup button[onclick="document.getElementById(\'loadFile\').click()"]').innerText = translations[language].load;
    document.querySelector('#settings-popup button[onclick="exportTasks()"]').innerText = translations[language].export;
    document.querySelector('#settings-popup h3:nth-of-type(2)').innerText = translations[language].settings;
    document.querySelector('label[for="darkModeToggle"]').innerText = translations[language].darkMode;
    document.querySelector('label[for="fontStyle"]').innerText = translations[language].fontStyle;
    document.querySelector('label[for="fontFamily"]').innerText = translations[language].fontFamily;
    document.querySelector('label[for="languageSelect"]').innerText = translations[language].language;
    document.querySelector('#settings-popup h3:nth-of-type(3)').innerText = translations[language].about;
    document.querySelector('#settings-popup p').innerText = `Task Planner v0.8.0 beta test version.\n`;
    document.querySelector('#settings-popup footer').innerText = `©2025 FOAcode`;
    document.querySelector('label[for="taskStyleToggle"]').innerText = translations[language].oneColor;
    const priorityLabel = document.getElementById('priorityLabel');
    const taskPriorityCheckbox = document.getElementById('taskPriority');
    priorityLabel.textContent = taskPriorityCheckbox.checked 
        ? translations[language].removePriority 
        : translations[language].assignPriority;
    if (floatingPopup) {
        const reorderTaskLabel = floatingPopup.querySelector('li:nth-child(1)');
        const filterTaskLabel = floatingPopup.querySelector('li:nth-child(2)');
        const settingsLabel = floatingPopup.querySelector('li:nth-child(3)');
        
        reorderTaskLabel.childNodes[1].nodeValue = ` ${translations[language].reorderTasks}`;
        filterTaskLabel.childNodes[1].nodeValue = ` ${translations[language].filterTasks}`;
        settingsLabel.childNodes[1].nodeValue = ` ${translations[language].settings}`;
    }
    updateTodayDate(); // Update the initial column date
    // Update other UI elements as needed
}

function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    localStorage.setItem('language', language);
    applyTranslations(language);
}

function createTaskElement(description, date, assignedTo, isPrioritary = false) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.classList.add(getTaskColorClass(date));
    task.setAttribute('draggable', 'true');
    task.setAttribute('id', `task-${taskCounter++}`);
    const language = localStorage.getItem('language') || 'en';
    const dayOfWeek = getDayOfWeek(date, language);
    const formattedDescription = description.replace(/\n/g, '<br>'); // Replace newline with <br>
    task.innerHTML = `
        <div class="description">${formattedDescription}</div>
        <div class="details">${translations[language].due}: ${date} (${dayOfWeek}) | ${translations[language].assignedTo}: ${assignedTo}</div>
    `;
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    task.addEventListener('dblclick', () => openPopup(task.parentElement.id, task));

    // Apply font style to new task
    const fontStyle = localStorage.getItem('fontStyle');
    if (fontStyle) {
        const descriptionElement = task.querySelector('.description');
        descriptionElement.style.fontStyle = fontStyle === 'italic' ? 'italic' : 'normal';
        descriptionElement.style.fontWeight = fontStyle === 'bold' ? 'bold' : 'normal';
    }

    if (isPrioritary) {
        task.classList.add('prioritary');
    }

    return task;
}

// Set color for the tasks based on date
function getTaskColorClass(date) {
    const today = new Date();
    const taskDate = new Date(date);
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'past';
    } else if (diffDays === 0) {
        return 'today';
    } else if (diffDays <= 7) {
        return `red-${diffDays}`;
    } else {
        return 'grey';
    }
}

// Ensure popups are always in view when opened
function openPopup(columnId, task = null) {
    currentColumnId = columnId;
    currentEditTask = task;

    const assignedToList = document.getElementById('assignedToList');
    assignedToList.innerHTML = '';
    const assignedToValues = [...new Set([...document.querySelectorAll('.task .details')].map(details => details.innerText.split('|')[1].split(': ')[1]))];
    assignedToValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        assignedToList.appendChild(option);
    });

    if (task) {
        document.getElementById('taskDescription').value = task.querySelector('.description').innerText;
        const dateText = task.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0];
        const date = new Date(dateText);
        date.setDate(date.getDate());
        document.getElementById('taskDate').value = date.toISOString().split('T')[0];
        document.getElementById('taskAssignedTo').value = task.querySelector('.details').innerText.split('|')[1].split(': ')[1];
        document.getElementById('taskPriority').checked = task.classList.contains('prioritary');
    } else {
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('taskAssignedTo').value = '';
        document.getElementById('taskPriority').checked = false;
    }

    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    popup.style.zIndex = '1002'; // Ensure popup is on top
    popup.style.width = window.innerWidth > 900 ? '30%' : '85%'; // Ensure popup width is within 30% on big screens and 85% on small screens
    popup.style.maxWidth = `${maxScreenWidth * 0.9}px`; // Set max width based on initial screen size
    popup.style.maxHeight = `${maxScreenHeight * 0.9}px`; // Set max height based on initial screen size
    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => popup.classList.add('show'), 10); // Add show class after a short delay
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }, 150); // Wait for the fade-out transition to complete
}

function saveTask() {
    const description = document.getElementById('taskDescription').value.replace(/\n/g, '<br>'); // Replace newline with <br>
    const date = document.getElementById('taskDate').value;
    let assignedTo = document.getElementById('taskAssignedTo').value;
    const isPrioritary = document.getElementById('taskPriority').checked;

    if (description && date) {
        if (currentColumnId === 'todo-column' && !assignedTo) {
            assignedTo = 'None';
        } else if (currentColumnId === 'in-progress-column' && !assignedTo) {
            alert('Please fill in the Assigned To field.');
            return;
        }

        if (currentEditTask) {
            currentEditTask.querySelector('.description').innerHTML = description.replace(/\n/g, '<br>'); // Replace newline with <br>
            const language = localStorage.getItem('language') || 'en';
            const dayOfWeek = getDayOfWeek(date, language);
            currentEditTask.querySelector('.details').innerText = `${translations[language].due}: ${date} (${dayOfWeek}) | ${translations[language].assignedTo}: ${assignedTo}`;
            currentEditTask.className = `task ${getTaskColorClass(date)}`;
            if (isPrioritary) {
                currentEditTask.classList.add('prioritary');
            } else {
                currentEditTask.classList.remove('prioritary');
            }
        } else {
            const column = document.getElementById(currentColumnId);
            column.appendChild(createTaskElement(description, date, assignedTo, isPrioritary));
        }

        closePopup();
        autoSave();
        updateAssignedToList();
    } else {
        alert('Please fill in all fields except Assigned To.');
    }
}

function deleteTask() {
    if (currentEditTask) {
        currentEditTask.remove();
        closePopup();
        autoSave();
    }
}

// Update the assignedTo list in the popup based on current names
function updateAssignedToList() {
    const assignedToList = document.getElementById('assignedToList');
    assignedToList.innerHTML = '';
    const assignedToValues = [...new Set([...document.querySelectorAll('.task .details')].map(details => details.innerText.split('|')[1].split(': ')[1]))];
    assignedToValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        assignedToList.appendChild(option);
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
    startAutoScroll();
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    stopAutoScroll();
    autoSave();
}

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        const draggingTask = document.querySelector('.dragging');
        if (!draggingTask) return;

        const rect = draggingTask.getBoundingClientRect();
        const scrollMargin = 20; // Margin from the edge to start scrolling
        const scrollSpeed = 10; // Speed of scrolling

        if (rect.top < scrollMargin) {
            window.scrollBy(0, -scrollSpeed);
        } else if (rect.bottom > window.innerHeight - scrollMargin) {
            window.scrollBy(0, scrollSpeed);
        }
    }, 50);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

function dragOver(event) {
    event.preventDefault();
    const draggingTask = document.querySelector('.dragging');
    const column = event.target.closest('.column');
    const afterElement = getDragAfterElement(column, event.clientY);
    if (afterElement == null) {
        column.appendChild(draggingTask);
    } else {
        column.insertBefore(draggingTask, afterElement);
    }
}

function getDragAfterElement(column, y) {
    const draggableElements = [...column.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const task = document.getElementById(taskId);
    const column = event.target.closest('.column');
    const afterElement = getDragAfterElement(column, event.clientY);
    if (column) {
        if (afterElement == null) {
            column.appendChild(task);
        } else {
            column.insertBefore(task, afterElement);
        }
        if (column.id === 'done-column') {
            task.classList.remove('prioritary'); // Remove "prioritary" status
            task.className = 'task green'; // Apply "Done" column styling
        } else {
            const dateText = task.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0];
            task.className = `task ${getTaskColorClass(dateText)} ${task.classList.contains('prioritary') ? 'prioritary' : ''}`;
        }
        autoSave();
    }
    stopAutoScroll();
}

function openSettings() {
    hideFloatingPopup();
    const settingsPopup = document.getElementById('settings-popup');
    settingsPopup.style.display = 'block';
    settingsPopup.style.zIndex = '1002'; // Ensure popup is on top
    settingsPopup.style.width = window.innerWidth > 900 ? '30%' : '85%'; // Ensure popup width is within 30% on big screens and 85% on small screens
    settingsPopup.style.maxWidth = `${maxScreenWidth * 0.9}px`; // Set max width based on initial screen size
    settingsPopup.style.maxHeight = `${maxScreenHeight * 0.9}px`; // Set max height based on initial screen size
    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => settingsPopup.classList.add('show'), 10); // Add show class after a short delay
}

function closeSettings() {
    const settingsPopup = document.getElementById('settings-popup');
    settingsPopup.classList.remove('show');
    setTimeout(() => {
        settingsPopup.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }, 150); // Wait for the fade-out transition to complete
}

function closeSettingsOnClickOutside(event) {
    const settingsPopup = document.getElementById('settings-popup');
    if (event.target === settingsPopup) {
        closeSettings();
    }
}

function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = JSON.parse(e.target.result);
        loadTasks(content);
        closeSettings();
    };
    reader.readAsText(file);
}

// Import tasks from a JSON file
function loadTasks(content) {
    document.querySelectorAll('.task').forEach(task => task.remove());
    content.forEach(taskData => {
        const column = document.getElementById(taskData.columnId);
        const taskElement = createTaskElement(taskData.description.replace(/<br>/g, '\n'), taskData.date, taskData.assignedTo, taskData.isPrioritary); // Replace <br> with newline
        if (column.id === 'done-column') {
            taskElement.className = 'task green';
        }
        column.appendChild(taskElement);
    });
    autoSave(); // Save tasks to memory after loading from file
}

// export tasks to a JSON file
function exportTasks() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        const description = task.querySelector('.description').innerText;
        const details = task.querySelector('.details').innerText.split('|');
        const date = details[0].split(': ')[1].split(' ')[0];
        const assignedTo = details[1].split(': ')[1];
        const columnId = task.parentElement.id;
        const isPrioritary = task.classList.contains('prioritary');
        tasks.push({ description, date, assignedTo, columnId, isPrioritary });
    });
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0].replace(/-/g, '');
    const localTime = now.toLocaleTimeString('en-GB', { hour12: false }).replace(/:/g, '');
    a.href = URL.createObjectURL(blob);
    a.download = `tasks-${formattedDate}-${localTime}.json`;
    a.click();
}

// Derive an AES encryption key from a password
async function deriveKeyFromPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

let isSettingPassword = false;
let failedAttempts = 0;
let lockoutTimeout = null;
let countdownInterval = null;

function updateEntryPopupLanguage() {
    const language = document.getElementById('entry-language-select').value;
    const entryTitle = document.getElementById('entry-title');
    const entryPassword = document.getElementById('entry-password');
    const confirmPasswordField = document.getElementById('entry-confirm-password');
    const entryButton = document.getElementById('entry-button');
    const entryMessage = document.getElementById('entry-message');

    entryTitle.innerText = isSettingPassword 
        ? translations[language].setPassword 
        : translations[language].password;
    entryPassword.placeholder = isSettingPassword 
        ? translations[language].setPasswordPlaceholder 
        : translations[language].enterPasswordPlaceholder;
    confirmPasswordField.placeholder = translations[language].setPasswordPlaceholder;
    entryButton.innerText = isSettingPassword 
        ? translations[language].setPasswordButton 
        : translations[language].submitButton;
    
    // Update any existing message
    if (entryMessage.innerText) {
        if (entryMessage.innerText.includes('attempt')) {
            const remainingTime = entryMessage.innerText.match(/\d+/);
            if (remainingTime) {
                entryMessage.innerText = translations[language].tooManyAttempts.replace('{time}', remainingTime[0]);
            }
        } else if (isSettingPassword) {
            entryMessage.innerText = translations[language].writeDownPassword;
        } else if (entryMessage.innerText.includes('incorrect')) {
            entryMessage.innerText = translations[language].incorrectPassword;
        }
    }
}

async function showEntryPage(message, isSetting = false) {
    const language = localStorage.getItem('language') || 'en';
    const entryPage = document.getElementById('entry-page');
    const entryContainer = document.getElementById('entry-container');
    const entryMessage = document.getElementById('entry-message');
    const entryPassword = document.getElementById('entry-password');
    const confirmPasswordField = document.getElementById('entry-confirm-password');
    const entryTitle = document.getElementById('entry-title');
    const entryButton = document.getElementById('entry-button');

    // Set the language dropdown to match the app's language
    document.getElementById('entry-language-select').value = language;

    isSettingPassword = isSetting;
    entryMessage.innerText = isSetting 
        ? translations[language].writeDownPassword 
        : message;
    entryPassword.placeholder = isSetting 
        ? translations[language].setPasswordPlaceholder 
        : translations[language].enterPasswordPlaceholder;
    confirmPasswordField.placeholder = translations[language].setPasswordPlaceholder;
    confirmPasswordField.style.display = isSetting ? 'block' : 'none';
    entryTitle.innerText = isSetting 
        ? translations[language].setPassword 
        : translations[language].password;
    entryButton.innerText = isSetting 
        ? translations[language].setPasswordButton 
        : translations[language].submitButton;
    
    entryPage.style.display = "flex";
    setTimeout(() => {
        entryContainer.classList.add('show');
    }, 0.5);
}

async function handleEntry() {
    const password = document.getElementById('entry-password').value;
    const confirmPassword = document.getElementById('entry-confirm-password').value;
    const entryPage = document.getElementById('entry-page');
    const lockIcon = document.querySelector('.lock-icon');
    const entryMessage = document.getElementById('entry-message');
    const language = document.getElementById('entry-language-select').value;

    if (lockoutTimeout) {
        return; // Prevent further attempts during lockout
    }

    if (!password) {
        entryMessage.innerText = translations[language].passwordCannotBeEmpty;
        return;
    }

    if (isSettingPassword) {
        if (password !== confirmPassword) {
            entryMessage.innerText = translations[language].passwordsDoNotMatch;
            return;
        }
        const salt = crypto.getRandomValues(new Uint8Array(16));
        localStorage.setItem("encryptionSalt", Array.from(salt).join(","));
        localStorage.setItem('language', language); // Store selected language
        encryptionKey = await deriveKeyFromPassword(password, salt);
        const entryContainer = document.getElementById('entry-container');
        entryContainer.classList.remove('show');
        setTimeout(() => {
            entryPage.style.display = "none";
            document.body.classList.add("unlocked");
            document.getElementById('languageSelect').value = language; // Sync language selector
            applyTranslations(language); // Apply translations immediately
        }, 500);

        // Create the first task in the "In Progress" column
        const today = new Date().toISOString().split('T')[0];
        const firstTask = createTaskElement("Welcome to Task Planner!\nThis is an example task.", today, "None");
        document.getElementById('in-progress-column').appendChild(firstTask);
        autoSave(); // Save the task
    } else {
        const salt = localStorage.getItem("encryptionSalt");
        encryptionKey = await deriveKeyFromPassword(password, salt.split(",").map(Number));
        try {
            await loadAutoSavedTasks(); // Attempt to decrypt tasks
            lockIcon.textContent = 'lock_open'; // Change to open lock icon
            failedAttempts = 0; // Reset failed attempts on success
            entryMessage.innerText = ""; // Clear any error messages
            const entryContainer = document.getElementById('entry-container');
            entryContainer.classList.remove('show');
            setTimeout(() => {
                entryPage.style.display = "none";
                document.body.classList.add("unlocked");
                const savedLanguage = localStorage.getItem('language') || 'en';
                document.getElementById('languageSelect').value = savedLanguage; // Sync language selector
                applyTranslations(savedLanguage); // Apply translations
            }, 500);
        } catch (error) {
            if (error.message === "No tasks to decrypt") {
                // Unlock the application even if there are no tasks, as long as the password is correct
                lockIcon.textContent = 'lock_open';
                failedAttempts = 0;
                entryMessage.innerText = "";
                const entryContainer = document.getElementById('entry-container');
                entryContainer.classList.remove('show');
                setTimeout(() => {
                    entryPage.style.display = "none";
                    document.body.classList.add("unlocked");
                }, 500);
            } else {
                failedAttempts++;
                lockIcon.classList.add('shake'); // Add shake animation
                setTimeout(() => lockIcon.classList.remove('shake'), 500); // Remove shake animation after 0.5s

                if (failedAttempts >= 5) {
                    let remainingTime = 5; // 5 seconds countdown
                    entryMessage.innerText = translations[language].tooManyAttempts.replace("{time}", remainingTime);
                    lockoutTimeout = true;

                    countdownInterval = setInterval(() => {
                        remainingTime--;
                        if (remainingTime > 0) {
                            entryMessage.innerText = translations[language].tooManyAttempts.replace("{time}", remainingTime);
                        } else {
                            clearInterval(countdownInterval);
                            lockoutTimeout = null;
                            entryMessage.innerText = ""; // Clear the message after countdown
                        }
                    }, 1000);
                } else {
                    entryMessage.innerText = translations[language].incorrectPassword;
                }
            }
        }
    }
}

async function promptForPassword() {
    const salt = localStorage.getItem("encryptionSalt");
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    // Set language in entry popup
    document.getElementById('entry-language-select').value = savedLanguage;
    updateEntryPopupLanguage();

    if (!salt) {
        await showEntryPage(translations[savedLanguage].writeDownPassword, true);
    } else {
        await showEntryPage("", false);
    }
}

// Encrypt data using AES-GCM
async function encryptData(data) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        encryptionKey,
        encoder.encode(data)
    );
    return { iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) };
}

// Decrypt data using AES-GCM
async function decryptData(encryptedData) {
    const { iv, data } = encryptedData;
    const decoder = new TextDecoder();
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        encryptionKey,
        new Uint8Array(data)
    );
    return decoder.decode(decrypted);
}

// Makes sure the tasks are saved in local storage
async function autoSave() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        const description = task.querySelector('.description').innerHTML.replace(/<br>/g, '\n'); // Replace <br> with newline
        const details = task.querySelector('.details').innerText.split('|');
        const date = details[0].split(': ')[1].split(' ')[0];
        const assignedTo = details[1].split(': ')[1];
        const columnId = task.parentElement.id;
        const isPrioritary = task.classList.contains('prioritary');
        tasks.push({ description, date, assignedTo, columnId, isPrioritary });
    });
    const encryptedTasks = await encryptData(JSON.stringify(tasks));
    localStorage.setItem('TaskPlanner', JSON.stringify(encryptedTasks));
}

async function loadAutoSavedTasks() {
    const encryptedTasks = localStorage.getItem('TaskPlanner');
    if (encryptedTasks) {
        try {
            const tasks = JSON.parse(await decryptData(JSON.parse(encryptedTasks)));
            loadTasks(tasks);
        } catch {
            throw new Error("Decryption failed"); // Ensure failure if decryption fails
        }
    } else {
        throw new Error("No tasks to decrypt"); // Ensure failure if no tasks are present
    }
}

function confirmDeleteDoneTasks() {
    if (confirm(translations[localStorage.getItem('language') || 'en'].confirmDeleteDoneTasks)) {
        deleteDoneTasks();
    }
}

function deleteDoneTasks() {
    const doneColumn = document.getElementById('done-column');
    doneColumn.querySelectorAll('.task').forEach(task => task.remove());
    autoSave();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function changeFontStyle() {
    const fontStyle = document.getElementById('fontStyle').value;
    document.querySelectorAll('.task .description').forEach(description => {
        description.style.fontStyle = fontStyle === 'italic' ? 'italic' : 'normal';
        description.style.fontWeight = fontStyle === 'bold' ? 'bold' : 'normal';
    });
    localStorage.setItem('fontStyle', fontStyle);
}

function changeFontFamily() {
    const fontFamily = document.getElementById('fontFamily').value;
    document.body.style.fontFamily = fontFamily;
    localStorage.setItem('fontFamily', fontFamily);
}

function openFilterPopup() {
    hideFloatingPopup();
    const filterSelect = document.getElementById('filterSelect');
    const tasks = document.querySelectorAll('.task');
    const assignedToValues = [...new Set([...tasks].map(task => task.querySelector('.details').innerText.split('|')[1].split(': ')[1]))];
    
    
    assignedToValues.sort((a, b) => a.localeCompare(b)); // Sort assignedTo values alphabetically
    filterSelect.innerHTML = ''; // Clear existing options
    const allOption = document.createElement('div');
    allOption.className = 'filter-tile';
    allOption.innerText = 'All';
    allOption.onclick = () => applyFilterAndHighlight('All');
    filterSelect.appendChild(allOption);
    assignedToValues.forEach(value => {
        const option = document.createElement('div');
        option.className = 'filter-tile';
        option.innerText = value;
        option.onclick = () => applyFilterAndHighlight(value);
        filterSelect.appendChild(option);
    });
    highlightCurrentFilter();
    const filterPopup = document.getElementById('filter-popup');
    filterPopup.style.display = 'block';
    filterPopup.style.zIndex = '1002'; // Ensure popup is on top
    filterPopup.style.width = window.innerWidth > 900 ? '30%' : '85%'; // Ensure popup width is within 30% on big screens and 85% on small screens
    filterPopup.style.maxWidth = `${maxScreenWidth * 0.9}px`; // Set max width based on initial screen size
    filterPopup.style.maxHeight = `${maxScreenHeight * 0.9}px`; // Set max height based on initial screen size
    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => filterPopup.classList.add('show'), 10); // Add show class after a short delay
}

function highlightCurrentFilter() {
    const filterSelect = document.getElementById('filterSelect');
    const filterTiles = filterSelect.querySelectorAll('.filter-tile');
    filterTiles.forEach(tile => {
        if (tile.innerText === filterAssignedTo || (filterAssignedTo === '' && tile.innerText === 'All')) {
            tile.classList.add('selected');
        } else {
            tile.classList.remove('selected');
        }
    });
    updateBlinkingCircle(filterAssignedTo); // Update the blinking circle based on the current filter
}

function applyFilterAndHighlight(value) {
    filterAssignedTo = value === 'All' ? '' : value; // Update the current filter value
    highlightCurrentFilter(); 
    applyFilter(filterAssignedTo);
    // Highlight the current filter
}

function applyFilter(filterValue = filterAssignedTo) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const assignedTo = task.querySelector('.details').innerText.split('|')[1].split(': ')[1];
        task.style.display = filterValue === '' || assignedTo === filterValue ? 'block' : 'none';
    });
    const filterIconText = filterValue === '' ? 'filter_list' : 'filter_list_alt';
    document.getElementById('filterIcon').innerText = filterIconText;
    document.getElementById('doneFilterIcon').innerText = filterIconText;

    updateBlinkingCircle(filterValue);
    highlightCurrentFilter(); // Highlight the current filter
    updateAssignedToList();
}

function closeFilterPopup() {
    const filterPopup = document.getElementById('filter-popup');
    filterPopup.classList.remove('show');
    setTimeout(() => {
        filterPopup.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }, 150); // Wait for the fade-out transition to complete
}

function closeFilterOnClickOutside(event) {
    if (event.target === document.getElementById('overlay')) {
        closeFilterPopup();
    }
}

document.getElementById('overlay').addEventListener('click', closePopupOnClickOutside);
document.addEventListener('click', closeSettingsOnClickOutside);

function copyTasksToClipboard(columnId) {
    const column = document.getElementById(columnId);
    const tasks = column.querySelectorAll('.task');
    let tasksText = '';

    tasks.forEach(task => {
        if (task.style.display !== 'none') {
            const description = task.querySelector('.description').innerText;
            const details = task.querySelector('.details').innerText;
            // tasksText += `${translations[localStorage.getItem('language') || 'en'].task}: ${description}\n${details}\n\n`;
            tasksText += `• ${description}\n${details}\n\n`;
        }
    });

    if (navigator.clipboard) {
        navigator.clipboard.writeText(tasksText).then(() => {
            showCopyAlert();
        }).catch(err => {
            console.error('Could not copy text: ', err);
            fallbackCopyTextToClipboard(tasksText);
        });
    } else {
        fallbackCopyTextToClipboard(tasksText);
    }
}

// Fallback function for copying text to clipboard if navigator.clipboard is not supported
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopyAlert();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

// Show a temporary alert when tasks are copied to clipboard
function showCopyAlert() {
    const copyAlert = document.createElement('div');
    copyAlert.innerText = translations[localStorage.getItem('language') || 'en'].tasksCopied;
    copyAlert.className = 'copy-alert';
    copyAlert.style.position = 'fixed';
    copyAlert.style.bottom = '20px';
    copyAlert.style.left = '50%';
    copyAlert.style.transform = 'translateX(-50%)';
    copyAlert.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#FF7F00' : '#007BFF'; // Darker orange in dark mode
    copyAlert.style.color = document.body.classList.contains('dark-mode') ? 'black' : 'white';
    copyAlert.style.fontWeight = 'bold';
    copyAlert.style.opacity = '1';
    copyAlert.style.padding = '10px';
    copyAlert.style.borderRadius = '5px';
    copyAlert.style.zIndex = '1001';
    copyAlert.style.transition = 'opacity 1s';
    document.body.appendChild(copyAlert);

    setTimeout(() => {
        copyAlert.style.opacity = '0';
        setTimeout(() => {
            copyAlert.remove();
        }, 2000);
    }, 3500);
}

// Reorder the tasks within the columns
function reorderTasks() {
    hideFloatingPopup();
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        const tasks = Array.from(column.querySelectorAll('.task'));
        tasks.sort((a, b) => {
            const isPrioritaryA = a.classList.contains('prioritary');
            const isPrioritaryB = b.classList.contains('prioritary');
            if (isPrioritaryA && !isPrioritaryB) return -1;
            if (!isPrioritaryA && isPrioritaryB) return 1;
            const dateA = new Date(a.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0]);
            const dateB = new Date(b.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0]);
            return dateA - dateB;
        });
        tasks.forEach(task => column.appendChild(task));
    });

    const reorderAlert = document.createElement('div');
    reorderAlert.innerText = translations[localStorage.getItem('language') || 'en'].tasksReordered;
    reorderAlert.className = 'reorder-alert';
    reorderAlert.style.position = 'fixed';
    reorderAlert.style.bottom = '20px';
    reorderAlert.style.left = '50%';
    reorderAlert.style.transform = 'translateX(-50%)';
    reorderAlert.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#FF7F00' : '#007BFF'; // Darker orange in dark mode
    reorderAlert.style.color = document.body.classList.contains('dark-mode') ? 'black' : 'white';
    reorderAlert.style.padding = '10px';
    reorderAlert.style.borderRadius = '5px';
    reorderAlert.style.zIndex = '1001';
    reorderAlert.style.transition = 'opacity 1s';
    reorderAlert.style.opacity = '1';
    reorderAlert.style.fontWeight = 'bold';
    document.body.appendChild(reorderAlert);

    setTimeout(() => {
        reorderAlert.style.opacity = '0';
        setTimeout(() => {
            reorderAlert.remove();
        }, 2000);
    }, 3500);

    autoSave(); // Save tasks to memory after reordering
}

function updateTodayDate() {
    const today = new Date();
    const language = localStorage.getItem('language') || 'en';
    const dayOfWeek = translations[language].weekdays[today.getDay()];
    const options = { day: '2-digit', month: '2-digit' };
    const formattedDate = today.toLocaleDateString(language, options);
    document.getElementById('today-date').innerText = `${dayOfWeek}, ${formattedDate}`;
}

function showAllOptions() {
    const assignedToInput = document.getElementById('taskAssignedTo');
    assignedToInput.value = '';
    assignedToInput.size = assignedToInput.options.length;
    assignedToInput.addEventListener('blur', () => assignedToInput.size = 1);
}

function toggleFloatingLabel() {
    const floatingLabel = document.getElementById('floating-label');
    floatingLabel.style.display = floatingLabel.style.display === 'none' ? 'block' : 'none';
}

document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
});

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('drop', drop);
});

function setVersion(version) {
    const aboutSection = document.querySelector('#settings-popup p');
    aboutSection.innerHTML = `Task Planner v${version} beta.<br>Test version website and associated PWA app.`;
    const footer = document.querySelector('#settings-popup footer');
    footer.innerHTML = `&copy;2025 Flavius O. Abrudan`;
}

window.addEventListener('load', async () => {
    await promptForPassword(); // Ensure password is prompted only once
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
    const savedFontStyle = localStorage.getItem('fontStyle');
    if (savedFontStyle) {
        document.getElementById('fontStyle').value = savedFontStyle;
        changeFontStyle();
    }
    const savedFontFamily = localStorage.getItem('fontFamily');
    if (savedFontFamily) {
        document.body.style.fontFamily = savedFontFamily;
        document.getElementById('fontFamily').value = savedFontFamily;
    } else {
        document.body.style.fontFamily = 'Arial';
        document.getElementById('fontFamily').value = 'Arial';
    }
    const savedLanguage = localStorage.getItem('language') || 'en';
    document.getElementById('languageSelect').value = savedLanguage;
    applyTranslations(savedLanguage);

    // Ensure floating-popup translations are applied on load
    const floatingPopup = document.querySelector('.floating-popup');
    if (floatingPopup) {
        const reorderTaskLabel = floatingPopup.querySelector('li:nth-child(1)');
        const filterTaskLabel = floatingPopup.querySelector('li:nth-child(2)');
        const settingsLabel = floatingPopup.querySelector('li:nth-child(3)');
        
        reorderTaskLabel.childNodes[1].nodeValue = ` ${translations[savedLanguage].reorderTasks}`;
        filterTaskLabel.childNodes[1].nodeValue = ` ${translations[savedLanguage].filterTasks}`;
        settingsLabel.childNodes[1].nodeValue = ` ${translations[savedLanguage].settings}`;
    }

    // Update icon tooltips based on the selected language
    document.querySelector('.reorder-icon').setAttribute('title', translations[savedLanguage].reorderTasks);
    document.querySelector('.filter-icon').setAttribute('title', translations[savedLanguage].filterTasks);
    document.querySelector('.settings-icon').setAttribute('title', translations[savedLanguage].settings);

    // Update floating button menu labels based on the selected language
    document.querySelector('.floating-popup .reorder-tasks').innerText = translations[savedLanguage].reorderTasks;
    document.querySelector('.floating-popup .filter-tasks').innerText = translations[savedLanguage].filterTasks;
    document.querySelector('.floating-popup .settings').innerText = translations[savedLanguage].settings;

    updateTodayDate();

    // Set the initial state of the filter to "All"
    const filterValue = 'All';
    document.getElementById('filterSelect').value = filterValue;
    filterAssignedTo = filterValue === 'All' ? '' : filterValue;
    applyFilter(filterAssignedTo);

    // Update the blinking circle after setting the filter
    updateBlinkingCircle(filterAssignedTo);

    // Highlight the initial filter tile
    highlightCurrentFilter();

    setVersion("0.1"); // Dynamically set the version
});

// Update the blinking circle based on the current filter value
function updateBlinkingCircle(filterValue) {
    const blinkingCircle = document.getElementById('blinking-circle');
    if (filterValue === '' || filterValue === 'All') {
        blinkingCircle.style.display = 'none';
    } else {
        blinkingCircle.style.display = 'block';
    }
}

// Add event listeners for the task style toggle and filter select
document.addEventListener('DOMContentLoaded', () => {
    const entryPassword = document.getElementById('entry-password');
    entryPassword.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleEntry(); // Trigger submit on ENTER key
        }
    });
});

function toggleTaskStyle() {
    const futureTaskStyle = document.getElementById('taskStyleToggle').checked;
    if (futureTaskStyle) {
        document.body.classList.add('future-task-style');
    } else {
        document.body.classList.remove('future-task-style');
    }
    localStorage.setItem('futureTaskStyle', futureTaskStyle);
}

// Close popup when user clicks outside of popups
function closePopupOnClickOutside(event) {
    const overlay = document.getElementById('overlay');
    if (event.target === overlay) {
        closePopup();
        closeSettings();
        closeFilterPopup();
    }
}

function togglePopupMenu() {
    const popupMenu = document.getElementById('popup-menu');
    popupMenu.classList.toggle('show');
}

function toggleNewPopupMenu() {
    const newPopupMenu = document.getElementById('new-popup-menu');
    newPopupMenu.classList.toggle('show');
}

function toggleFloatingPopup() {
    const floatingPopup = document.getElementById('floating-popup');
    floatingPopup.classList.toggle('show');
}

function hideFloatingPopup() {
    const floatingPopup = document.getElementById('floating-popup');
    floatingPopup.classList.remove('show');
}

document.querySelector('.floating-button').addEventListener('click', toggleFloatingLabel);

document.getElementById('filterSelect').addEventListener('change', () => {
    applyFilterAndClosePopup(); // Apply filter and close popup on change
});

document.getElementById('filterSelect').addEventListener('blur', () => {
    closeFilterPopup(); // Close the filter popup when the combobox loses focus
});

// Ensure the highlighted tile is updated when the filter is applied
window.addEventListener('load', () => {
    const savedFilter = localStorage.getItem('filterAssignedTo') || '';
    filterAssignedTo = savedFilter;
    applyFilter();
    highlightCurrentFilter();
});

// Immediately update the highlighted tile when the filter is applied
document.getElementById('filterSelect').addEventListener('change', () => {
    highlightCurrentFilter();
});

// Update the highlighted tile while the popup is still open
document.getElementById('filterSelect').addEventListener('click', (event) => {
    if (event.target.classList.contains('filter-tile')) {
        applyFilterAndHighlight(event.target.innerText);
    }
});

// Update the floating popup labels based on the selected language
function updateFloatingPopupLabels() {
    const language = localStorage.getItem('language') || 'en';
    document.getElementById('reorderTasksLabel').textContent = translations[language].reorderTasks;
    document.getElementById('filterTasksLabel').textContent = translations[language].filterTasks;
    document.getElementById('settingsLabel').textContent = translations[language].settings;
}

// Call the function to update labels on page load
window.addEventListener('load', () => {
    updateFloatingPopupLabels();
});

// Update floating popup labels when the language changes
document.getElementById('languageSelect').addEventListener('change', () => {
    updateFloatingPopupLabels();
});

function togglePasswordVisibility(isConfirm = false) {
    const passwordField = isConfirm ? document.getElementById('entry-confirm-password') : document.getElementById('entry-password');
    const toggleIcon = isConfirm ? document.getElementById('toggle-confirm-password-visibility') : document.getElementById('toggle-password-visibility');
    const isPasswordVisible = passwordField.type === 'password';
    passwordField.type = isPasswordVisible ? 'text' : 'password';
    toggleIcon.innerText = isPasswordVisible ? 'visibility' : 'visibility_off';
}

function showConfirmPasswordField() {
    const passwordField = document.getElementById('entry-password');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const confirmToggleIcon = document.getElementById('toggle-confirm-password-visibility');
    if (isSettingPassword && passwordField.value.trim() !== '') {
        confirmPasswordContainer.style.display = 'block';
        confirmToggleIcon.style.display = 'inline'; // Show the second toggle only when setting a password
    } else {
        confirmPasswordContainer.style.display = 'none';
        confirmToggleIcon.style.display = 'none'; // Hide the second toggle otherwise
    }
}