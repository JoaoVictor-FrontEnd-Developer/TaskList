const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

// .trim() = evita que os espaços adicionados no input sejam lidos como valores
const validateInput = () => {
    return inputElement.value.trim().length > 0;
}

const handleAddTask = () => {
    const inputIsValid = validateInput();

    if (!inputIsValid) {
        // Pq caso o valor seja invalido n tem pq prosseguir a função, por isso o return para finalizar
        return inputElement.classList.add("error")
    }

    //Criando Div dinamicamente
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    //Criando paragrafo dinamicamente
    const taskContent = document.createElement("p");
    taskContent.innerText = inputElement.value;

    taskContent.addEventListener('click', () => handleClick(taskContent))

    //Criando icon dinamicamente
    const deleteItem = document.createElement("i");
    deleteItem.classList.add("far");
    deleteItem.classList.add("fa-trash-alt");

    deleteItem.addEventListener('click', () => handleDeleteClick(taskItemContainer, taskContent))

    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);

    inputElement.value = '';
    inputElement.focus();

    updateLocalStorage();
}

//taskContent = item que está sendo clicado
const handleClick = (taskContent) => {
    /* Obs: para o loop funcionar, a div n deve conter nada de comentários ou espaços 
    tasks = todas as div dentro de tasksContainer
    */
    const tasks = tasksContainer.childNodes;
    for (const task of tasks) {
        //Veriaficando se o "p" de cada div do loop é semelhante ao "p" passado como parâmetro
        if (task.firstChild.isSameNode(taskContent)) {
            task.firstChild.classList.toggle('completed')
        }
    }

    updateLocalStorage();
}

const handleDeleteClick = (taskItemContainer, taskContent) => {
    const tasks = tasksContainer.childNodes;

    for (const task of tasks) {
        if (task.firstChild.isSameNode(taskContent)) {
            taskItemContainer.remove();
        }
    }

    updateLocalStorage();
}

const handleInputChange = () => {
    const inputIsValid = validateInput();

    if (inputIsValid) {
        return inputElement.classList.remove("error")
    }
}

const updateLocalStorage = () => {
    const tasks = tasksContainer.childNodes;
    
    const localStorageTasks = [...tasks].map(task => {
        const content = task.firstChild;
        const isCompleted = content.classList.contains('completed');

        return {description: content.innerText, isCompleted}
    })

    localStorage.setItem('tasks', JSON.stringify(localStorageTasks))
}

const refreshTasksUsingLocalStorage = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
    
    if (tasksFromLocalStorage.length > 0) {
        for (const task of tasksFromLocalStorage) {
            //Criando Div dinamicamente
            const taskItemContainer = document.createElement("div");
            taskItemContainer.classList.add("task-item");

            //Criando paragrafo dinamicamente
            const taskContent = document.createElement("p");
            taskContent.innerText = task.description;
            if (task.isCompleted) {
                taskContent.classList.add("completed")
            }
    

            taskContent.addEventListener('click', () => handleClick(taskContent))

            //Criando icon dinamicamente
            const deleteItem = document.createElement("i");
            deleteItem.classList.add("far");
            deleteItem.classList.add("fa-trash-alt");

            deleteItem.addEventListener('click', () => handleDeleteClick(taskItemContainer, taskContent))

            taskItemContainer.appendChild(taskContent);
            taskItemContainer.appendChild(deleteItem);

            tasksContainer.appendChild(taskItemContainer);
        }
    }
}

refreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask()) 
inputElement.addEventListener("change", () => handleInputChange())
