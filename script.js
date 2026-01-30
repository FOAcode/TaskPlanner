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
        languageName: "English",
        languages: {
            en: "English",
            it: "Italian",
            es: "Spanish",
            de: "German",
            fr: "French",
            ro: "Romanian",
            pt: "Portuguese",
            zh: "Chinese"
        },
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
        workloadMatrix: "Workload Matrix",
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
        copyTask: "Copy Task",
        moveToToDo: "Move to <b>To Do</b>",
        moveToInProgress: "Move to <b>In Progress</b>",
        moveToDone: "Move to <b>Done</b>",
        eliminate: "Eliminate",
        fillMissingData: "Please fill in the missing data!",
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
        passwordsDoNotMatch: "Passwords do not match. Please try again.",
        confirmation: "Confirmation",
        date: "Date",
        week: "Week",
        selectWeeksLabel: "Select Weeks to Display (1-4):"
    },
    it: {
        languageName: "Italiano",
        languages: {
            en: "Inglese",
            it: "Italiano",
            es: "Spagnolo",
            de: "Tedesco",
            fr: "Francese",
            ro: "Rumeno",
            pt: "Portoghese",
            zh: "Cinese"
        },
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
        workloadMatrix: "Matrice di Carico di Lavoro",
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
        copyTask: "Copia Compito",
        moveToToDo: "Sposta in <b>Da Fare</b>",
        moveToInProgress: "Sposta in <b>In Corso</b>",
        moveToDone: "Sposta in <b>Fatto</b>",
        eliminate: "Elimina",
        fillMissingData: "Per favore compila i dati mancanti!",
        setPassword: "Imposta Password",
        password: "Password",
        setPasswordPlaceholder: "Password",
        enterPasswordPlaceholder: "Inserisci la tua password",
        setPasswordButton: "Imposta Password",
        submitButton: "Invia",
        tooManyAttempts: "Troppi tentativi falliti. Attendere {time} secondi.",
        incorrectPassword: "Password errata. Riprova.",
        passwordCannotBeEmpty: "La password non può essere vuota.",
        writeDownPassword: "Ricorda la tua password poiché verrà utilizzata per decrittografare i tuoi dati.",
        confirmation: "Conferma",
        date: "Data",
        week: "Settimana",
        selectWeeksLabel: "Seleziona Settimane da Visualizzare (1-4):"
    },
    es: {
        languageName: "Español",
        languages: {
            en: "Inglés",
            it: "Italiano",
            es: "Español",
            de: "Alemán",
            fr: "Francés",
            ro: "Rumano",
            pt: "Portugués",
            zh: "Chino"
        },
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
        workloadMatrix: "Matriz de Carga de Trabajo",
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
        copyTask: "Copiar Tarea",
        moveToToDo: "Mover a <b>Por Hacer</b>",
        moveToInProgress: "Mover a <b>En Progreso</b>",
        moveToDone: "Mover a <b>Hecho</b>",
        eliminate: "Eliminar",
        fillMissingData: "¡Por favor completa los datos faltantes!",
        setPassword: "Establecer Contraseña",
        password: "Contraseña",
        setPasswordPlaceholder: "Contraseña",
        enterPasswordPlaceholder: "Introduce tu contraseña",
        setPasswordButton: "Establecer Contraseña",
        submitButton: "Enviar",
        tooManyAttempts: "Demasiados intentos fallidos. Espere {time} segundos.",
        incorrectPassword: "Contraseña incorrecta. Inténtalo de nuevo.",
        passwordCannotBeEmpty: "La contraseña no puede estar vacía.",
        writeDownPassword: "Recuerda tu contraseña ya que se utilizará para descifrar tus datos.",
        confirmation: "Confirmación",
        date: "Fecha",
        week: "Semana",
        selectWeeksLabel: "Selecciona Semanas a Mostrar (1-4):"
    },
    pt: {
        languageName: "Português",
        languages: {
            en: "Inglês",
            it: "Italiano",
            es: "Espanhol",
            de: "Alemão",
            fr: "Francês",
            ro: "Romeno",
            pt: "Português",
            zh: "Chinês"
        },
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
        workloadMatrix: "Matriz de Carga de Trabalho",
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
        copyTask: "Copiar Tarefa",
        moveToToDo: "Mover para <b>A Fazer</b>",
        moveToInProgress: "Mover para <b>Em Progresso</b>",
        moveToDone: "Mover para <b>Feito</b>",
        eliminate: "Eliminar",
        fillMissingData: "Por favor, preencha os dados ausentes!",
        setPassword: "Definir Senha",
        password: "Senha",
        setPasswordPlaceholder: "Senha",
        enterPasswordPlaceholder: "Digite sua senha",
        setPasswordButton: "Definir Senha",
        submitButton: "Enviar",
        tooManyAttempts: "Muitas tentativas falharam. Aguarde {time} segundos.",
        incorrectPassword: "Senha incorreta. Tente novamente.",
        passwordCannotBeEmpty: "A senha não pode estar vazia.",
        writeDownPassword: "Lembre-se da sua senha, pois ela será usada para descriptografar seus dados.",
        confirmation: "Confirmação",
        date: "Data",
        week: "Semana",
        selectWeeksLabel: "Selecione Semanas para Exibir (1-4):"
    },
    ro: {
        languageName: "Română",
        languages: {
            en: "Engleză",
            it: "Italiană",
            es: "Spaniolă",
            de: "Germană",
            fr: "Franceză",
            ro: "Română",
            pt: "Portugheză",
            zh: "Chineză"
        },
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
        workloadMatrix: "Matrice de Sarcină",
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
        copyTask: "Copiere Sarcină",
        moveToToDo: "Mută în <b>De Făcut</b>",
        moveToInProgress: "Mută în <b>Progres</b>",
        moveToDone: "Mută în <b>Terminat</b>",
        eliminate: "Șterge",
        fillMissingData: "Vă rugăm completați datele lipsă!",
        setPassword: "Setează Parola",
        password: "Parola",
        setPasswordPlaceholder: "Parolă",
        enterPasswordPlaceholder: "Introdu parola",
        setPasswordButton: "Setează Parola",
        submitButton: "Trimite",
        tooManyAttempts: "Prea multe tentative eșuate. Așteptați {time} secunde.",
        incorrectPassword: "Parolă incorectă. Încercați din nou.",
        passwordCannotBeEmpty: "Parola nu poate fi goală.",
        writeDownPassword: "Ține minte parola ta, deoarece va fi folosită pentru a decripta datele tale.",
        confirmation: "Confirmare",
        date: "Data",
        week: "Săptămâna",
        selectWeeksLabel: "Selectează Săptămânile de Afișat (1-4):"
    },
    de: {
        languageName: "Deutsch",
        languages: {
            en: "Englisch",
            it: "Italienisch",
            es: "Spanisch",
            de: "Deutsch",
            fr: "Französisch",
            ro: "Rumänisch",
            pt: "Portugiesisch",
            zh: "Chinesisch"
        },
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
        workloadMatrix: "Arbeitsauslastungsmatrix",
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
        copyTask: "Aufgabe Kopieren",
        moveToToDo: "Zu <b>Aufgaben</b> Verschieben",
        moveToInProgress: "Zu <b>In Bearbeitung</b> Verschieben",
        moveToDone: "Zu <b>Erledigt</b> Verschieben",
        eliminate: "Löschen",
        fillMissingData: "Bitte füllen Sie die fehlenden Daten aus!",
        setPassword: "Passwort Festlegen",
        password: "Passwort",
        setPasswordPlaceholder: "Passwort",
        enterPasswordPlaceholder: "Geben Sie Ihr Passwort ein",
        setPasswordButton: "Passwort Festlegen",
        submitButton: "Einreichen",
        tooManyAttempts: "Zu viele fehlgeschlagene Versuche. Bitte warten Sie {time} Sekunden.",
        incorrectPassword: "Falsches Passwort. Bitte versuchen Sie es erneut.",
        passwordCannotBeEmpty: "Das Passwort darf nicht leer sein.",
        writeDownPassword: "Merken Sie sich Ihr Passwort, da es zur Entschlüsselung Ihrer Daten verwendet wird.",
        confirmation: "Bestätigung",
        date: "Datum",
        week: "Woche",
        selectWeeksLabel: "Wählen Sie Wochen zur Anzeige (1-4):"
    },
    zh: {
        languageName: "中文",
        languages: {
            en: "英文",
            it: "意大利文",
            es: "西班牙文",
            de: "德文",
            fr: "法文",
            ro: "罗马尼亚文",
            pt: "葡萄牙文",
            zh: "中文"
        },
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
        workloadMatrix: "工作负荷矩阵",
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
        copyTask: "复制任务",
        moveToToDo: "移至<b>待做</b>",
        moveToInProgress: "移至<b>进行中</b>",
        moveToDone: "移至<b>已完成</b>",
        eliminate: "删除",
        fillMissingData: "请填写缺失的数据！",
        setPasswordButton: "设置密码",
        submitButton: "提交",
        tooManyAttempts: "尝试次数过多。请等待 {time} 秒。",
        incorrectPassword: "密码错误。请再试一次。",
        passwordCannotBeEmpty: "密码不能为空。",
        writeDownPassword: "记住您的密码，因为它将用于解密您的数据。",
        confirmation: "确认",
        date: "日期",
        week: "周",
        selectWeeksLabel: "选择要显示的周数 (1-4):"
    },
    fr: {
        languageName: "Français",
        languages: {
            en: "Anglais",
            it: "Italien",
            es: "Espagnol",
            de: "Allemand",
            fr: "Français",
            ro: "Roumain",
            pt: "Portugais",
            zh: "Chinois"
        },
        task: "Tâche",
        due: "Échéance",
        assignedTo: "Assigné à",
        addEditTask: "Ajouter / Modifier une Tâche",
        delete: "Supprimer",
        save: "Enregistrer",
        toDo: "À Faire",
        inProgress: "En Cours",
        done: "Terminé",
        filterTasks: "Filtrer les Tâches",
        menu: "Menu",
        file: "Fichier",
        load: "Charger",
        export: "Exporter",
        settings: "Paramètres",
        darkMode: "Mode Sombre",
        fontStyle: "Style de Police",
        fontFamily: "Famille de Police",
        language: "Langue",
        about: "À Propos",
        reorderTasks: "Réorganiser les Tâches",
        workloadMatrix: "Matrice de Charge de Travail",
        filterList: "Liste des Filtres",
        filterListAlt: "Liste des Filtres Alt",
        confirmDeleteDoneTasks: "Êtes-vous sûr de vouloir supprimer toutes les tâches dans la colonne Terminé ?",
        tasksCopied: "Tâches copiées dans le presse-papiers !",
        tasksReordered: "Tâches réorganisées par date d'échéance !",
        weekdays: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        singleColorTasks: "Tâches Monochromes",
        oneColor: "Une Couleur",
        assignPriority: "Assigner la Priorité",
        removePriority: "Supprimer la Priorité",
        copyTask: "Copier la Tâche",
        moveToToDo: "Déplacer en <b>À Faire</b>",
        moveToInProgress: "Déplacer en <b>Cours</b>",
        moveToDone: "Déplacer en <b>Terminé</b>",
        eliminate: "Supprimer",
        fillMissingData: "Veuillez remplir les données manquantes !",
        setPassword: "Définir le Mot de Passe",
        password: "Mot de Passe",
        setPasswordPlaceholder: "Mot de Passe",
        enterPasswordPlaceholder: "Entrez votre mot de passe",
        setPasswordButton: "Définir le Mot de Passe",
        submitButton: "Soumettre",
        tooManyAttempts: "Trop de tentatives échouées. Veuillez attendre {time} secondes.",
        incorrectPassword: "Mot de passe incorrect. Veuillez réessayer.",
        passwordCannotBeEmpty: "Le mot de passe ne peut pas être vide.",
        writeDownPassword: "Mémorisez votre mot de passe car il sera utilisé pour décrypter vos données.",
        confirmation: "Confirmation",
        date: "Date",
        week: "Semaine",
        selectWeeksLabel: "Sélectionnez les Semaines à Afficher (1-4):"
    }
    // Add more languages as needed
};

function getDayOfWeek(date, language) {
    const dayIndex = new Date(date).getDay();
    return translations[language].weekdays[dayIndex];
}

function applyTranslations(language) {
    console.log('applyTranslations() called with language:', language);
    console.log('translations object available:', !!translations);
    console.log('Language data available:', !!translations[language]);
    
    try {
        // Update task details (due date and assigned to)
        document.querySelectorAll('.task').forEach(task => {
            const date = task.getAttribute('data-date');
            const assignedTo = task.getAttribute('data-assigned-to');
            if (date && assignedTo) {
                const dayOfWeek = getDayOfWeek(date, language);
                const detailsElement = task.querySelector('.details');
                if (detailsElement) {
                    detailsElement.innerText = `${translations[language].due}: ${date} (${dayOfWeek}) | ${translations[language].assignedTo}: ${assignedTo}`;
                    console.log('Updated task details for date:', date);
                }
            }
        });
    } catch (e) {
        console.error('Error updating task details:', e);
    }

    // Update popup titles and buttons
    const updateElement = (selector, property, value) => {
        try {
            const element = document.querySelector(selector);
            if (element) {
                console.log('Updating element:', selector, 'with value:', value);
                element[property] = value;
            } else {
                console.warn('Element not found:', selector);
            }
        } catch (e) {
            console.error('Error updating element ' + selector + ':', e);
        }
    };

    console.log('Starting to update UI elements...');
    updateElement('#popup h3', 'innerText', translations[language].addEditTask);
    updateElement('#popup button[onclick="deleteTask()"]', 'innerText', translations[language].delete);
    updateElement('#popup button[onclick="saveTask()"]', 'innerText', translations[language].save);
    updateElement('#taskDescription', 'placeholder', translations[language].task);
    updateElement('#taskAssignedTo', 'placeholder', translations[language].assignedTo);
    
    // Update column headers
    updateElement('#todo-column h2', 'innerText', translations[language].toDo);
    updateElement('#in-progress-column h2', 'innerText', translations[language].inProgress);
    updateElement('#done-column h2', 'innerText', translations[language].done);
    
    // Update settings popup
    updateElement('#settings-popup h2', 'innerText', translations[language].menu);
    updateElement('#settings-popup h3:nth-of-type(1)', 'innerText', translations[language].file);
    updateElement('#settings-popup button[onclick="document.getElementById(\'loadFile\').click()"]', 'innerText', translations[language].load);
    updateElement('#settings-popup button[onclick="exportTasks()"]', 'innerText', translations[language].export);
    updateElement('#settings-popup h3:nth-of-type(2)', 'innerText', translations[language].settings);
    updateElement('label[for="darkModeToggle"]', 'innerText', translations[language].darkMode);
    updateElement('.options-container:has(.font-style-buttons) > label', 'innerText', translations[language].fontStyle);
    updateElement('label[for="fontFamily"]', 'innerText', translations[language].fontFamily);
    updateElement('label[for="languageSelect"]', 'innerText', translations[language].language);
    updateElement('#settings-popup h3:nth-of-type(3)', 'innerText', translations[language].about);
    updateElement('label[for="taskStyleToggle"]', 'innerText', translations[language].oneColor);
    
    const aboutSection = document.querySelector('#settings-popup p');
    if (aboutSection) {
        aboutSection.innerHTML = `Task Planner v0.8.5 beta test version.<br><a href="https://github.com/FOAcode/TaskPlanner" target="_blank" style="color: #4A90E2;">Github Task Planner repository</a>`;
    }
    
    const footer = document.querySelector('#settings-popup footer');
    if (footer) {
        footer.innerText = `©2025 FOAcode`;
    }
    
    // Update priority label
    const priorityLabel = document.getElementById('priorityLabel');
    const taskPriorityCheckbox = document.getElementById('taskPriority');
    if (priorityLabel && taskPriorityCheckbox) {
        priorityLabel.textContent = taskPriorityCheckbox.checked 
            ? translations[language].removePriority 
            : translations[language].assignPriority;
    }
    
    // Update floating popup menu
    const floatingPopup = document.getElementById('floating-popup');
    if (floatingPopup) {
        const reorderTaskLabel = floatingPopup.querySelector('li:nth-child(1)');
        const filterTaskLabel = floatingPopup.querySelector('li:nth-child(2)');
        const settingsLabel = floatingPopup.querySelector('li:nth-child(3)');
        
        if (reorderTaskLabel && reorderTaskLabel.childNodes[1]) {
            reorderTaskLabel.childNodes[1].nodeValue = ` ${translations[language].reorderTasks}`;
        }
        if (filterTaskLabel && filterTaskLabel.childNodes[1]) {
            filterTaskLabel.childNodes[1].nodeValue = ` ${translations[language].filterTasks}`;
        }
        if (settingsLabel && settingsLabel.childNodes[1]) {
            settingsLabel.childNodes[1].nodeValue = ` ${translations[language].settings}`;
        }
    }
    
    // Update confirmation modal text
    const confirmationTitle = document.getElementById('confirmation-title');
    const confirmationMessage = document.getElementById('confirmation-message');
    const confirmationCancel = document.getElementById('confirmation-cancel');
    const confirmationConfirm = document.getElementById('confirmation-confirm');
    
    if (confirmationTitle) confirmationTitle.innerText = translations[language].confirmation;
    if (confirmationMessage) confirmationMessage.innerText = translations[language].confirmDeleteDoneTasks;
    if (confirmationCancel) confirmationCancel.innerText = 'Cancel';
    if (confirmationConfirm) confirmationConfirm.innerText = translations[language].delete;
    
    // Update context menu button
    const copyTaskText = document.getElementById('copy-task-text');
    if (copyTaskText) copyTaskText.innerText = translations[language].copyTask;
    
    const moveToTodoText = document.getElementById('move-to-todo-text');
    if (moveToTodoText) moveToTodoText.innerHTML = translations[language].moveToToDo;
    
    const moveToInProgressText = document.getElementById('move-to-in-progress-text');
    if (moveToInProgressText) moveToInProgressText.innerHTML = translations[language].moveToInProgress;
    
    const moveToDoneText = document.getElementById('move-to-done-text');
    if (moveToDoneText) moveToDoneText.innerHTML = translations[language].moveToDone;
    
    const eliminateText = document.getElementById('eliminate-text');
    if (eliminateText) eliminateText.innerText = translations[language].eliminate;
    
    console.log('About to call updateTodayDate()...');
    updateTodayDate(); // Update the initial column date
    console.log('About to call updateFloatingPopupLabels...');
    updateFloatingPopupLabels(language); // Update floating popup labels
    
    console.log('applyTranslations() completed successfully for language:', language);
}

function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    console.log('changeLanguage() called with language:', language);
    localStorage.setItem('language', language);
    // First update the language option labels so the dropdown shows names in the chosen language,
    // then re-apply translations to update the rest of the UI immediately.
    updateLanguageOptions(language); // Update language option labels
    // Ensure the select shows the correct value after relabeling
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = language;
    // Also update entry page language select if present
    const entryLangSelect = document.getElementById('entry-language-select');
    if (entryLangSelect) entryLangSelect.value = language;
    console.log('About to apply translations for language:', language);
    try {
        applyTranslations(language);
        console.log('applyTranslations completed successfully');
    } catch (error) {
        console.error('Error in applyTranslations:', error);
    }
    updateFloatingDateLabel();
    // Explicitly update floating popup labels to ensure they translate immediately
    updateFloatingPopupLabels(language);
    console.log('changeLanguage() completed');
}

function updateLanguageOptions(currentLanguage) {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;
    const options = languageSelect.querySelectorAll('option');
    const currentLangTranslations = translations[currentLanguage] || {};

    options.forEach(option => {
        const langCode = option.value;
        // Prefer the translated name in current language, fallback to that language's own languageName
        const translatedName = (currentLangTranslations.languages && currentLangTranslations.languages[langCode])
            || (translations[langCode] && translations[langCode].languageName)
            || option.textContent;
        option.textContent = translatedName;
    });

    // Keep the select value as the current language after relabeling
    languageSelect.value = currentLanguage;

    // Also update entry-language-select if it exists (entry popup at startup)
    const entryLangSelect = document.getElementById('entry-language-select');
    if (entryLangSelect) {
        const entryOptions = entryLangSelect.querySelectorAll('option');
        entryOptions.forEach(option => {
            const langCode = option.value;
            const translatedName = (currentLangTranslations.languages && currentLangTranslations.languages[langCode])
                || (translations[langCode] && translations[langCode].languageName)
                || option.textContent;
            option.textContent = translatedName;
        });
        entryLangSelect.value = currentLanguage;
    }
}

function handleTaskRightClick(event, task) {
    event.preventDefault();
    
    // Store reference to the current task
    window.currentContextTask = task;
    
    // Determine which column the task is in
    const columnId = task.closest('.column').id;
    window.currentContextTaskColumn = columnId;
    
    // Get all context menu buttons
    const moveToTodoBtn = document.getElementById('move-to-todo-button');
    const moveToInProgressBtn = document.getElementById('move-to-in-progress-button');
    const moveToDoneBtn = document.getElementById('move-to-done-button');
    
    // Show/hide buttons based on which column the task is in
    if (columnId === 'todo-column') {
        moveToTodoBtn.style.display = 'none';
        moveToInProgressBtn.style.display = 'flex';
        moveToDoneBtn.style.display = 'none';
    } else if (columnId === 'in-progress-column') {
        moveToTodoBtn.style.display = 'none';
        moveToInProgressBtn.style.display = 'none';
        moveToDoneBtn.style.display = 'flex';
    } else if (columnId === 'done-column') {
        moveToTodoBtn.style.display = 'flex';
        moveToInProgressBtn.style.display = 'flex';
        moveToDoneBtn.style.display = 'none';
    }
    
    // Get the context menu
    const contextMenu = document.getElementById('task-context-menu');
    
    // Position the context menu at the mouse cursor
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    
    // Show the context menu
    contextMenu.classList.add('show');
    
    // Close context menu when clicking elsewhere
    document.addEventListener('click', closeContextMenu);
}

function closeContextMenu() {
    const contextMenu = document.getElementById('task-context-menu');
    contextMenu.classList.remove('show');
    document.removeEventListener('click', closeContextMenu);
}

function copyTaskToClipboard() {
    const task = window.currentContextTask;
    if (!task) return;
    
    // Get task information
    const description = task.querySelector('.description').innerText;
    const details = task.querySelector('.details').innerText;
    const taskText = `${description}\n${details}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(taskText).then(() => {
        // Show brief visual feedback
        task.style.opacity = '0.7';
        setTimeout(() => {
            task.style.opacity = '1';
        }, 200);
        
        // Close the context menu
        closeContextMenu();
    }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        alert('Failed to copy task to clipboard');
        closeContextMenu();
    });
}

function moveTaskToToDo() {
    const task = window.currentContextTask;
    if (!task) return;
    
    const todoColumn = document.getElementById('todo-column');
    if (todoColumn) {
        todoColumn.appendChild(task);
        // Update color class based on date
        const dateText = task.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0];
        task.className = `task ${getTaskColorClass(dateText)} ${task.classList.contains('prioritary') ? 'prioritary' : ''}`;
        autoSave();
        closeContextMenu();
    }
}

function moveTaskToInProgress() {
    const task = window.currentContextTask;
    if (!task) return;
    
    const inProgressColumn = document.getElementById('in-progress-column');
    if (inProgressColumn) {
        inProgressColumn.appendChild(task);
        // Update color class based on date
        const dateText = task.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0];
        task.className = `task ${getTaskColorClass(dateText)} ${task.classList.contains('prioritary') ? 'prioritary' : ''}`;
        autoSave();
        closeContextMenu();
    }
}

function moveTaskToDone() {
    const task = window.currentContextTask;
    if (!task) return;
    
    const doneColumn = document.getElementById('done-column');
    if (doneColumn) {
        doneColumn.appendChild(task);
        // Apply green color for done tasks and remove prioritary status
        task.classList.remove('prioritary');
        task.className = 'task green';
        autoSave();
        closeContextMenu();
    }
}

function eliminateTask() {
    const task = window.currentContextTask;
    if (!task) return;
    
    // Remove the task element
    task.remove();
    autoSave();
    closeContextMenu();
}

function createTaskElement(description, date, assignedTo, isPrioritary = false) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.classList.add(getTaskColorClass(date));
    task.setAttribute('draggable', 'true');
    task.setAttribute('id', `task-${taskCounter++}`);
    // Store date and assignedTo as data attributes for translation updates
    task.setAttribute('data-date', date);
    task.setAttribute('data-assigned-to', assignedTo);
    const language = localStorage.getItem('language') || 'en';
    const dayOfWeek = getDayOfWeek(date, language);
    const formattedDescription = description.replace(/\n/g, '<br>'); // Replace newline with <br>
    task.innerHTML = `
        <div class="description">${formattedDescription}</div>
        <hr class="task-separator">
        <div class="details">${translations[language].due}: ${date} (${dayOfWeek}) | ${translations[language].assignedTo}: ${assignedTo}</div>
    `;
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    task.addEventListener('dblclick', () => openPopup(task.parentElement.id, task));
    task.addEventListener('contextmenu', (e) => handleTaskRightClick(e, task));

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
    // Parse the date string (format: YYYY-MM-DD) and create a local date
    const [year, month, day] = date.split('-').map(Number);
    const taskDate = new Date(year, month - 1, day);
    
    // Get today's date (local, no time component)
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = taskDate - todayDate;
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

    // Clear any previous validation errors
    const errorDiv = document.getElementById('validation-error');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    document.getElementById('taskDescription').style.borderColor = '';
    document.getElementById('taskDescription').style.borderWidth = '';
    document.getElementById('taskDate').style.borderColor = '';
    document.getElementById('taskDate').style.borderWidth = '';
    document.getElementById('taskAssignedTo').style.borderColor = '';
    document.getElementById('taskAssignedTo').style.borderWidth = '';

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
    
    // Add Ctrl+S key listener to save task
    const popupElement = popup;
    popupElement.onkeydown = function(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            saveTask();
        }
    };
    
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
    const language = localStorage.getItem('language') || 'en';
    const errorDiv = document.getElementById('validation-error');

    // Clear previous error
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    document.getElementById('taskDescription').style.borderColor = '';
    document.getElementById('taskDescription').style.borderWidth = '';
    document.getElementById('taskDate').style.borderColor = '';
    document.getElementById('taskDate').style.borderWidth = '';
    document.getElementById('taskAssignedTo').style.borderColor = '';
    document.getElementById('taskAssignedTo').style.borderWidth = '';

    if (description && date) {
        if (currentColumnId === 'todo-column' && !assignedTo) {
            assignedTo = 'None';
        } else if (currentColumnId === 'in-progress-column' && !assignedTo) {
            // Show validation error
            errorDiv.textContent = translations[language].fillMissingData;
            errorDiv.style.display = 'block';
            // Highlight the field with thick red border
            const assignedToField = document.getElementById('taskAssignedTo');
            assignedToField.style.borderColor = '#c62828';
            assignedToField.style.borderWidth = '4px';
            return;
        }

        if (currentEditTask) {
            currentEditTask.querySelector('.description').innerHTML = description.replace(/\n/g, '<br>'); // Replace newline with <br>
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
        // Show validation error
        errorDiv.textContent = translations[language].fillMissingData;
        errorDiv.style.display = 'block';
        
        // Highlight missing fields with thick red border
        if (!description) {
            const descriptionField = document.getElementById('taskDescription');
            descriptionField.style.borderColor = '#c62828';
            descriptionField.style.borderWidth = '4px';
        }
        if (!date) {
            const dateField = document.getElementById('taskDate');
            dateField.style.borderColor = '#c62828';
            dateField.style.borderWidth = '4px';
        }
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
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = JSON.parse(e.target.result);
            loadTasks(content);
            closeSettings();
        } catch (error) {
            console.error('Error parsing JSON file:', error);
            alert('Error loading file. Please ensure it is a valid JSON file.');
        }
        // Reset the file input so the same file can be loaded again
        event.target.value = '';
    };
    reader.readAsText(file);
}

// Import tasks from a JSON file
function loadTasks(content) {
    document.querySelectorAll('.task').forEach(task => task.remove());
    content.forEach(taskData => {
        const column = document.getElementById(taskData.columnId);
        // Description already has newlines from export, just use it as-is
        const taskElement = createTaskElement(taskData.description, taskData.date, taskData.assignedTo, taskData.isPrioritary);
        if (column.id === 'done-column') {
            // For done-column tasks, replace color classes with 'green'
            const classArray = Array.from(taskElement.classList);
            classArray.forEach(className => {
                if (className.startsWith('red-') || className === 'grey' || className === 'today' || className === 'past') {
                    taskElement.classList.remove(className);
                }
            });
            taskElement.classList.add('green');
        }
        column.appendChild(taskElement);
    });
    autoSave(); // Save tasks to memory after loading from file
}

// export tasks to a JSON file
function exportTasks() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        // Get the raw description with newlines preserved from innerText
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
            document.getElementById('languageSelect').value = language;
            
            // Update all translations including floating popup labels
            const reorderLabel = document.getElementById('reorderTasksLabel');
            const filterLabel = document.getElementById('filterTasksLabel');
            const settingsLabel = document.getElementById('settingsLabel');
            
            if (reorderLabel) reorderLabel.textContent = translations[language].reorderTasks;
            if (filterLabel) filterLabel.textContent = translations[language].filterTasks;
            if (settingsLabel) settingsLabel.textContent = translations[language].settings;
            
            // Update language dropdown options with translated names
            updateLanguageOptions(language);
            
            applyTranslations(language);
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
                document.getElementById('languageSelect').value = savedLanguage;
                
                // Update language dropdown options with translated names
                updateLanguageOptions(savedLanguage);
                
                applyTranslations(savedLanguage);
                updateFloatingPopupLabels(savedLanguage); // Add this line
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
    // Show the confirmation modal instead of browser confirm
    const language = localStorage.getItem('language') || 'en';
    document.getElementById('confirmation-title').innerText = translations[language].confirmation;
    document.getElementById('confirmation-message').innerText = translations[language].confirmDeleteDoneTasks;
    document.getElementById('confirmation-cancel').innerText = translations[language].close || 'Cancel';
    document.getElementById('confirmation-confirm').innerText = translations[language].delete;
    
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationOverlay = document.getElementById('confirmation-overlay');
    
    confirmationModal.style.display = 'block';
    confirmationOverlay.style.display = 'block';
    confirmationModal.style.zIndex = '1003';
    confirmationOverlay.style.zIndex = '1002';
    
    setTimeout(() => confirmationModal.classList.add('show'), 10);
}

function confirmDeleteDoneTasks_Modal() {
    // Actually delete the tasks
    deleteDoneTasks();
    closeConfirmationModal();
}

function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationOverlay = document.getElementById('confirmation-overlay');
    
    confirmationModal.classList.remove('show');
    setTimeout(() => {
        confirmationModal.style.display = 'none';
        confirmationOverlay.style.display = 'none';
    }, 150);
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

function changeFontStyle(style) {
    // If called from button, style parameter is provided
    // If called from initialization, get from dropdown
    if (!style) {
        style = document.getElementById('fontStyle') ? document.getElementById('fontStyle').value : localStorage.getItem('fontStyle') || 'normal';
    }
    
    // Update button highlighting
    document.getElementById('fontStyleNormal').classList.toggle('selected', style === 'normal');
    document.getElementById('fontStyleBold').classList.toggle('selected', style === 'bold');
    document.getElementById('fontStyleItalic').classList.toggle('selected', style === 'italic');
    
    // Apply font style to tasks
    document.querySelectorAll('.task .description').forEach(description => {
        description.style.fontStyle = style === 'italic' ? 'italic' : 'normal';
        description.style.fontWeight = style === 'bold' ? 'bold' : 'normal';
    });
    localStorage.setItem('fontStyle', style);
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
    allOption.innerText = 'All Tasks';
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
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    setTimeout(() => {
        filterPopup.classList.add('show');
        overlay.classList.add('show');
    }, 10); // Add show class after a short delay
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
    const newFilterValue = value === 'All' || value === 'All Tasks' ? '' : value; // Convert selected value
    // Only close popup if the selected filter is different from the current one
    if (newFilterValue !== filterAssignedTo) {
        filterAssignedTo = newFilterValue; // Update the current filter value
        highlightCurrentFilter();
        updateFilterTile(); // Update the filter tile display
        applyFilter(filterAssignedTo);
        closeFilterPopup(); // Auto-close the popup when a different filter is selected
    } else {
        closeFilterPopup(); // Also close if the same filter is clicked again
    }
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
    updateFilterTile(); // Update the filter tile display
}

function updateFilterTile() {
    const filterValueElement = document.getElementById('tile-filter-value');
    if (filterValueElement) {
        filterValueElement.innerText = filterAssignedTo === '' ? 'All Tasks' : filterAssignedTo;
    }
}

function closeFilterPopup() {
    const filterPopup = document.getElementById('filter-popup');
    const overlay = document.getElementById('overlay');
    filterPopup.classList.remove('show');
    overlay.classList.remove('show');
    filterPopup.classList.add('hiding');
    overlay.classList.add('hiding');
    setTimeout(() => {
        filterPopup.style.display = 'none';
        overlay.style.display = 'none';
        filterPopup.classList.remove('hiding');
        overlay.classList.remove('hiding');
    }, 300); // Wait for the very slow fade-out transition to complete (1.2s)
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
        const isDoneColumn = column.id === 'done-column';
        tasks.sort((a, b) => {
            const isPrioritaryA = a.classList.contains('prioritary');
            const isPrioritaryB = b.classList.contains('prioritary');
            if (isPrioritaryA && !isPrioritaryB) return -1;
            if (!isPrioritaryA && isPrioritaryB) return 1;
            const dateA = new Date(a.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0]);
            const dateB = new Date(b.querySelector('.details').innerText.split('|')[0].split(': ')[1].split(' ')[0]);
            return isDoneColumn ? dateB - dateA : dateA - dateB;
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

function updateFloatingDateLabel() {
    const dayOfWeekEl = document.getElementById('tile-day-of-week');
    const currentDateEl = document.getElementById('tile-current-date');
    
    if (!dayOfWeekEl || !currentDateEl) {
        console.warn('Date tile elements not found');
        return;
    }
    
    try {
        const today = new Date();
        const language = localStorage.getItem('language') || 'en';
        
        // Check if translations are available
        if (!translations || !translations[language] || !translations[language].weekdays) {
            console.warn('Translations not available for language:', language);
            return;
        }
        
        const dayOfWeek = translations[language].weekdays[today.getDay()];
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        dayOfWeekEl.innerText = dayOfWeek;
        currentDateEl.innerText = formattedDate;
    } catch (error) {
        console.error('Error updating date tile:', error);
    }
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
    if (localStorage.getItem('oneColorMode') === 'true') {
        document.body.classList.add('one-color-mode');
        document.getElementById('taskStyleToggle').checked = true;
        // Force style refresh after applying one-color-mode class
        setTimeout(() => refreshTaskStyles(), 0);
    }
    const savedFontStyle = localStorage.getItem('fontStyle');
    if (savedFontStyle) {
        changeFontStyle(savedFontStyle);
    } else {
        changeFontStyle('normal');
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
    updateLanguageOptions(savedLanguage); // Initialize language options in the current language

    // Update all floating popup labels and matrix labels
    updateFloatingPopupLabels(savedLanguage);

    // Update icon tooltips based on the selected language
    document.querySelector('.reorder-icon').setAttribute('title', translations[savedLanguage].reorderTasks);
    document.querySelector('.filter-icon').setAttribute('title', translations[savedLanguage].filterTasks);
    document.querySelector('.settings-icon').setAttribute('title', translations[savedLanguage].settings);

    updateTodayDate();
    // Update floating date label after translations are applied
    updateFloatingDateLabel();

    // Set the initial state of the filter to "All"
    const filterValue = 'All';
    document.getElementById('filterSelect').value = filterValue;
    filterAssignedTo = filterValue === 'All' ? '' : filterValue;
    applyFilter(filterAssignedTo);
    updateFilterTile(); // Update the filter tile display on initialization

    // Update the blinking circle after setting the filter
    updateBlinkingCircle(filterAssignedTo);

    // Highlight the initial filter tile
    highlightCurrentFilter();

    setVersion("0.1"); // Dynamically set the version
});

// Update the blinking circle based on the current filter value
function updateBlinkingCircle(filterValue) {
    const blinkingCircle = document.getElementById('blinking-circle');
    // Always hide the blinking circle since the filter tile now shows the active filter
    blinkingCircle.style.display = 'none';
}

// Add event listeners for the task style toggle and filter select
document.addEventListener('DOMContentLoaded', () => {
    // Initialize floating date label as soon as DOM is ready
    updateFloatingDateLabel();
    
    const entryPassword = document.getElementById('entry-password');
    entryPassword.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleEntry(); // Trigger submit on ENTER key
        }
    });
    
    // Add language select change listener
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', changeLanguage);
    }
});

function toggleTaskStyle() {
    const oneColorMode = document.getElementById('taskStyleToggle').checked;
    if (oneColorMode) {
        document.body.classList.add('one-color-mode');
    } else {
        document.body.classList.remove('one-color-mode');
    }
    localStorage.setItem('oneColorMode', oneColorMode);
    // Force style refresh for all tasks
    refreshTaskStyles();
}

function refreshTaskStyles() {
    // Force browser to recalculate styles by triggering a reflow
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        // Trigger a reflow by accessing offsetHeight
        void task.offsetHeight;
    });
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
function updateFloatingPopupLabels(language = null) {
    const lang = language || localStorage.getItem('language') || 'en';
    
    // Update floating popup menu labels
    const workloadMatrixLabel = document.getElementById('workloadMatrixLabel');
    if (workloadMatrixLabel) workloadMatrixLabel.textContent = translations[lang].workloadMatrix;
    
    const reorderTasksLabel = document.getElementById('reorderTasksLabel');
    if (reorderTasksLabel) reorderTasksLabel.textContent = translations[lang].reorderTasks;
    
    const filterTasksLabel = document.getElementById('filterTasksLabel');
    if (filterTasksLabel) filterTasksLabel.textContent = translations[lang].filterTasks;
    
    const settingsLabel = document.getElementById('settingsLabel');
    if (settingsLabel) settingsLabel.textContent = translations[lang].settings;
    
    // Update workload matrix popup labels
    const selectWeeksLabel = document.getElementById('selectWeeksLabel');
    if (selectWeeksLabel) selectWeeksLabel.innerText = translations[lang].selectWeeksLabel;
    
    const workloadMatrixTitle = document.getElementById('workloadMatrixTitle');
    if (workloadMatrixTitle) workloadMatrixTitle.innerText = translations[lang].workloadMatrix;
    
    // Refresh the matrix if it's open
    const popup = document.getElementById('workload-matrix-popup');
    if (popup && popup.classList.contains('show')) {
        updateWorkloadMatrix();
    }
}

// Call the function to update labels on page load
window.addEventListener('load', () => {
    updateFloatingPopupLabels();
});

// Prevent copying and right-click on date tile
window.addEventListener('load', () => {
    const dateTile = document.getElementById('date-tile');
    if (dateTile) {
        // Prevent right-click on date tile
        dateTile.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Prevent selection of date tile
        dateTile.style.userSelect = 'none';
        dateTile.style.webkitUserSelect = 'none';
        
        // Prevent copying
        dateTile.addEventListener('copy', (e) => {
            e.preventDefault();
        });
    }
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

// Workload Matrix Functions
function openWorkloadMatrix() {
    hideFloatingPopup();
    const workloadOverlay = document.getElementById('workload-overlay');
    const workloadPopup = document.getElementById('workload-matrix-popup');
    
    workloadOverlay.classList.add('show');
    workloadPopup.classList.add('show');
    document.body.classList.add('workload-matrix-open');
    
    // Update title based on language
    const language = localStorage.getItem('language') || 'en';
    document.getElementById('workloadMatrixTitle').textContent = translations[language].workloadMatrix;
    
    // Update labels
    const selectWeeksLabel = document.getElementById('selectWeeksLabel');
    if (language === 'en') selectWeeksLabel.textContent = 'Select Weeks to Display (1-4):';
    else if (language === 'it') selectWeeksLabel.textContent = 'Seleziona Settimane da Visualizzare (1-4):';
    else if (language === 'es') selectWeeksLabel.textContent = 'Seleccionar Semanas a Mostrar (1-4):';
    else if (language === 'pt') selectWeeksLabel.textContent = 'Selecionar Semanas para Exibir (1-4):';
    else if (language === 'ro') selectWeeksLabel.textContent = 'Selectați Săptămânile de Afișat (1-4):';
    else if (language === 'de') selectWeeksLabel.textContent = 'Wochen zum Anzeigen Auswählen (1-4):';
    else if (language === 'zh') selectWeeksLabel.textContent = '选择要显示的周数 (1-4):';
    else if (language === 'fr') selectWeeksLabel.textContent = 'Sélectionnez les Semaines à Afficher (1-4):';
    
    updateWorkloadMatrix();
}

function closeWorkloadMatrix() {
    const workloadOverlay = document.getElementById('workload-overlay');
    const workloadPopup = document.getElementById('workload-matrix-popup');
    
    workloadOverlay.classList.remove('show');
    workloadPopup.classList.remove('show');
    document.body.classList.remove('workload-matrix-open');
}

function updateWorkloadMatrix() {
    const weeks = 4; // Always display 4 weeks
    const container = document.getElementById('workload-matrix-container');
    
    // Get all tasks
    const allTasks = document.querySelectorAll('.task');
    
    // Get available filter options (assigned to values) from current tasks using data attributes
    const filterOptions = [...new Set([...allTasks].map(task => task.getAttribute('data-assigned-to')))].filter(v => v).sort();
    
    // Group tasks by assigned person and by date
    const tasksByPerson = {};
    const taskColorByDate = {}; // Store color class for each date
    
    allTasks.forEach(task => {
        const date = task.getAttribute('data-date');
        const assigned = task.getAttribute('data-assigned-to');
        
        if (date && assigned) {
            if (!tasksByPerson[assigned]) {
                tasksByPerson[assigned] = {};
            }
            if (!tasksByPerson[assigned][date]) {
                tasksByPerson[assigned][date] = 0;
            }
            tasksByPerson[assigned][date]++;
            
            // Store the color class for this date
            if (!taskColorByDate[date]) {
                taskColorByDate[date] = getTaskColorClass(date);
            }
        }
    });
    
    // Get date range based on weeks selected
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - today.getDay()); // Start from Sunday
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (weeks * 7) - 1); // End on Saturday of last week
    
    // Generate all dates in the range and group by week
    const datesByWeek = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!datesByWeek[weekKey]) {
            datesByWeek[weekKey] = [];
        }
        datesByWeek[weekKey].push(dateStr);
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Create matrix with separate sections for each week
    let html = '<div class="matrix-grid">';
    const language = localStorage.getItem('language') || 'en';
    const weekdays = translations[language].weekdays;
    const dateLabel = translations[language].date || 'Date';
    const weekLabel = translations[language].week || 'Week';
    
    Object.keys(datesByWeek).forEach(weekKey => {
        const weekDates = datesByWeek[weekKey];
        const weekStart = new Date(weekKey);
        const weekEnd = new Date(weekDates[weekDates.length - 1]);
        
        const formattedWeekStart = `${String(weekStart.getDate()).padStart(2, '0')}/${String(weekStart.getMonth() + 1).padStart(2, '0')}`;
        const formattedWeekEnd = `${String(weekEnd.getDate()).padStart(2, '0')}/${String(weekEnd.getMonth() + 1).padStart(2, '0')}`;

        html += `<div class="matrix-week-section">
                    <h3 class="matrix-week-header">
                        ${formattedWeekStart} - ${formattedWeekEnd}
                    </h3>
                    <table class="matrix-table-vertical"><tbody>`;
        
        // Add header row with person names
        html += `<tr class="matrix-person-header"><td>${dateLabel}</td>`;
        filterOptions.forEach(person => {
            html += `<td><strong>${person}</strong></td>`;
        });
        html += '</tr>';
        
        // Add rows for each day (vertical layout)
        weekDates.forEach(dateStr => {
            const date = new Date(dateStr);
            const dayName = weekdays[date.getDay()];
            const dayNum = date.getDate();
            
            html += `<tr class="matrix-day-row">
                        <td class="matrix-day-label">
                            <strong>${dayName.substring(0, 3)}<br>${dayNum}</strong>
                        </td>`;
            
            // Add cells for each person
            filterOptions.forEach(person => {
                const count = (tasksByPerson[person] && tasksByPerson[person][dateStr]) || 0;
                
                // Determine intensity class based on task count
                let intensityClass = 'intensity-0'; // no tasks
                if (count === 1) intensityClass = 'intensity-1';
                else if (count === 2) intensityClass = 'intensity-2';
                else if (count === 3) intensityClass = 'intensity-3';
                else if (count === 4) intensityClass = 'intensity-4';
                else if (count >= 5) intensityClass = 'intensity-5+';
                
                if (count === 0) {
                    html += `<td class="matrix-cell ${intensityClass}">&nbsp;</td>`;
                } else {
                    html += `<td class="matrix-cell ${intensityClass} has-tasks" data-person="${person}" data-date="${dateStr}" style="cursor: pointer;"><strong>${count}</strong></td>`;
                }
            });
            
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Attach click handlers to cells with tasks
    document.querySelectorAll('.matrix-cell.has-tasks').forEach(cell => {
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            const person = cell.getAttribute('data-person');
            const dateStr = cell.getAttribute('data-date');
            showTasksPopup(person, dateStr, e);
        });
    });
}

function showTasksPopup(person, dateStr, event) {
    console.log('showTasksPopup called with:', person, dateStr);
    const date = new Date(dateStr);
    const language = localStorage.getItem('language') || 'en';
    
    // Find all tasks for this person on this date
    const tasks = document.querySelectorAll('.task');
    const matchingTasks = [];
    
    tasks.forEach(task => {
        const taskDate = task.getAttribute('data-date');
        const taskAssigned = task.getAttribute('data-assigned-to');
        if (taskDate === dateStr && taskAssigned === person) {
            const description = task.querySelector('.description').innerText;
            matchingTasks.push(description);
        }
    });
    
    console.log('Found matching tasks:', matchingTasks);
    
    if (matchingTasks.length === 0) {
        console.log('No matching tasks found');
        return;
    }
    
    // Remove existing popup if any
    const existingPopup = document.querySelector('.tasks-details-popup');
    if (existingPopup) existingPopup.remove();
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'tasks-details-popup';
    popup.style.position = 'fixed';
    popup.style.zIndex = '10003';
    popup.style.pointerEvents = 'auto';
    popup.style.display = 'none'; // Start hidden
    
    const dateFormatted = date.toLocaleDateString();
    let content = `<div style="padding: 15px;"><strong>${person} - ${dateFormatted}</strong><br><hr>`;
    matchingTasks.forEach(task => {
        content += `<div style="margin-bottom: 8px;">• ${task}</div>`;
    });
    content += '</div>';
    
    popup.innerHTML = content;
    popup.onclick = (e) => e.stopPropagation();
    
    // Append to DOM but keep hidden to measure
    document.body.appendChild(popup);
    
    // Get popup dimensions using offsetWidth/offsetHeight which work for hidden elements in DOM
    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;
    
    // Get mouse position with offset
    let x, y;
    const offset = 10;
    const padding = 10;
    
    // Check if the click is on the left or right half of the screen
    const screenWidth = window.innerWidth;
    const clickX = event.clientX;
    
    if (clickX < screenWidth / 2) {
        // Click on the left half, open popup to the right
        x = clickX + offset;
    } else {
        // Click on the right half, open popup to the left
        x = clickX - popupWidth - offset;
    }
    
    // Clamp x to stay within padding
    x = Math.max(padding, x);
    x = Math.min(x, screenWidth - popupWidth - padding);
    
    // Handle vertical positioning - show below by default, above if not enough space
    if (window.innerHeight - event.clientY >= popupHeight) {
        y = event.clientY + offset;
    } else {
        y = event.clientY - popupHeight - offset;
    }
    
    // Clamp y to stay within padding
    y = Math.max(padding, y);
    
    // Set position styles before showing
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.display = 'block';
    
    console.log('Popup positioned at:', x, y);
    
    // Close popup on outside click or after 5 seconds
    const closePopup = () => {
        console.log('Closing popup');
        if (popup.parentElement) popup.remove();
    };
    
    setTimeout(() => {
        document.addEventListener('click', closePopup, { once: true });
    }, 100);
    
    setTimeout(closePopup, 5000);
}

