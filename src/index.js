Projects = [];

function Project(name) {
    this.name = name;
    this.todos = [];
}

Project.prototype.changeName = function(name) {
    this.name = name;
};

Project.prototype.addTask = function(item) {
    let newTask = new Task(item);
    this.todos.push(newTask);
};

Project.prototype.removeTask = function(task) {
    this.todos.pop(task);
};

function Task(name) {
    this.name = name;
    this.completed = false;
    this.important = false;
}

Task.prototype.changeName = function(name) {
    this.name = name;
};

Task.prototype.markComplete = function() {
    this.completed = true;
};

Task.prototype.markNotComplete = function() {
    this.completed = false;
};

Task.prototype.markImportant = function() {
    this.important = true;
};

Task.prototype.markNotImportant = function() {
    this.important = false;
};

//Module for controlling DOM elements
let displayController = (function() {

//Add a new project to the Projects list
let updateProjects = function() {
        let listEl = document.createElement('p');
        listEl.innerText = Projects[Projects.length - 1].name;
        listEl.dataset.index = `${Projects.length - 1}`
        let projectsList = document.getElementById('projects-list')
        projectsList.appendChild(listEl);
        listEl.classList.add('project-list-item');
//Event listener to change selected project and update the list panel
        listEl.addEventListener('click', (e) => {
            if(!(document.querySelector('#detail-panel').classList.contains('invisible'))) {
                document.querySelector('#detail-panel').classList.toggle('invisible');
            }
            if(document.querySelector('.selected')) {
                document.querySelector('.selected').classList.remove('selected');
                e.target.classList.add('selected');
            } else {
                e.target.classList.add('selected');
            }
            let taskList = document.querySelector('#list-panel');
            taskList.innerHTML = '';
            let newList = displayController.createList(Projects[e.target.dataset.index]);
            newList.dataset.index = e.target.dataset.index;
            document.querySelector('#list-panel').appendChild(newList); 
        });
} 

let createList = function(project) {
        //Create Title Element
        let projTitle = document.createElement('h2');
        projTitle.className = 'title';
        projTitle.innerText = project.name;
       //Create Todo List Element
        let todoList = document.createElement('div');
        todoList.className = 'todo-list';
        //Create Form and Form Elements for New Todo
        let newTodoForm = document.createElement('form');
        newTodoForm.id = 'new-todo-form';
        let addTodoBtn = document.createElement('button');
        addTodoBtn.classList.add('add-todo-btn');
        let newTodoName = document.createElement('input');
        newTodoName.placeholder = 'Add a Task';
        newTodoName.classList.add('new-todo-name');
        let container = document.createElement('div');
        container.classList.add('list-container');
        let addBtn = document.createElement('button');
        addBtn.classList.add('add-button');
        addBtn.classList.add('invisible');
        addBtn.innerText = 'ADD';
        newTodoName.addEventListener('focus', todoNameHandler );
        newTodoName.addEventListener('keyup', checkValueHandler);
        newTodoName.addEventListener('blur', removeTodoHandler);
        addTodoBtn.addEventListener('mousedown', function (e) {
            e.preventDefault();
            window.prevFocus = document.activeElement;
        });
        addBtn.addEventListener('mousedown', function (e) {
            e.preventDefault();
            window.prevFocus = document.activeElement;
        });
        addTodoBtn.addEventListener('click', addTodoHandler);

        newTodoName.addEventListener('keydown', function(e) {
            if(e.key=='Enter') {
                if (newTodoName.value !== "") {
                    document.querySelector('.add-todo-btn').dispatchEvent(new MouseEvent('mousedown'));
                    document.querySelector('.add-todo-btn').dispatchEvent(new MouseEvent('mouseup'));
                } else {
                    e.preventDefault();
                }     
            }
        });
        addBtn.addEventListener('click', addTodoHandler);
        //Append Form Elements to Form
        newTodoForm.appendChild(addTodoBtn);
        newTodoForm.appendChild(newTodoName);
        newTodoForm.appendChild(addBtn);
        container.appendChild(newTodoForm);
        //Append All Elements to List
        todoList.appendChild(projTitle);
        todoList.appendChild(container);
        todoList.appendChild(displayController.updateTodos(project));

        return todoList;
}



let updateTodos = function(project) {
    //Populate Todo List Element
    if(document.querySelector('#task-list')) {
        document.querySelector('#task-list').parentElement.removeChild(document.querySelector('#task-list'));
    }
    let list = document.createElement('div');
    list.id = 'task-list';
    for (let i = 0; i < project.todos.length; i++) {
        let container = document.createElement('div');
        container.classList.add('list-container');
        let item = document.createElement('p');
        item.classList.add('todo-item');
        item.innerText = project.todos[i].name;
        item.dataset.index = i;
        let checkButton = document.createElement('button');
        checkButton.classList.add('checkmark-button');
        container.appendChild(checkButton);
        container.appendChild(item);
        list.appendChild(container);
        item.addEventListener('click', updateDetails);
}
    return list;
}
let clearList = function() {
    let list = document.querySelector('#task-list');
    list.parentElement.removeChild(list);
}

let updateDetails = function(e) {
    if (document.querySelector('#detail-panel').classList.contains('invisible')){
        document.querySelector('#detail-panel').classList.toggle('invisible');
    }
    if(document.querySelector('.selected-task')) {
        document.querySelector('.selected-task').classList.remove('selected-task');
        e.target.classList.add('selected-task');
    } else {
    e.target.classList.add('selected-task');
    }
    let currentProject = Projects[document.querySelector('.selected').dataset.index];
    let currentTask = currentProject.todos[e.target.dataset.index];
    let detailName = document.querySelector('#detail-name');
    detailName.innerText = currentTask.name;
}

    return { updateProjects, createList, clearList, updateTodos };
})();

let addTodoHandler = (e) => {
    e.preventDefault();
    if(window.prevFocus !== document.querySelector('.new-todo-name')) {
            document.querySelector('.new-todo-name').focus()
        }
    else if (document.querySelector('.new-todo-name').value == "") {
             document.querySelector('.add-todo-btn').focus();
    }
    else {
            let currentIndex = document.querySelector('.selected').dataset.index;
            let todoName = document.querySelector('.new-todo-name').value;
            let currentProject = Projects[currentIndex];
            currentProject.addTask(todoName);
            displayController.clearList();
            document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProject));
            document.querySelector('#new-todo-form').reset();
      }
};

let checkValueHandler = (e) => {
    if(e.target.value != "") {
        document.querySelector('.add-button').classList.remove('invisible');
    } else {
        document.querySelector('.add-button').classList.add('invisible');
    }
};

let todoNameHandler = (e) => {
    e.target.parentElement.parentElement.style.borderBottom = "1px solid #3e69e4";
    document.querySelector('.add-todo-btn').id = 'focused-todo-btn';
};

let removeTodoHandler = (e) => {
    document.querySelector('.add-button').classList.add('invisible');
    e.target.parentElement.parentElement.style.borderBottom = "1px solid #ddd";
    document.querySelector('.add-todo-btn').removeAttribute('id');
    e.target.value = "";
}

let projName = document.querySelector('.new-project-name');
let todoName = document.querySelector('.new-todo-name');
let addProj = document.querySelector('.add-project-btn');
let addTodo = document.querySelector('.add-todo-btn');
let delBtn = document.querySelector('#delete-btn');

addProj.addEventListener('click', (e) => {
    e.preventDefault();
    if(document.querySelector('.new-project-name').value == "") {
        document.querySelector('.new-project-name').focus()
    } else {
    console.log(projName.value);
    let newProj = new Project(projName.value);
    Projects.push(newProj);
    displayController.updateProjects();
    document.querySelector('#new-project-form').reset();
    }
});



document.querySelector('.new-project-name').addEventListener('focus', (e) => {
    document.querySelector('.add-project-btn').id = 'focused-proj-btn'  
});

document.querySelector('.new-project-name').addEventListener('blur', (e) => {
    document.querySelector('.add-project-btn').removeAttribute('id');
});



delBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let currentProj = Projects[document.querySelector('.selected').dataset.index];
    let currentTask = currentProj.todos[document.querySelector('.selected-task').dataset.index];
    currentProj.removeTask(currentTask);
    document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProj));
    document.querySelector('#detail-panel').classList.toggle('invisible');
});

let tasks = new Project('Tasks');
let important = new Project('Important');
let planned = new Project('Planned');
let myDay = new Project('My Day');

Projects.push(myDay);
displayController.updateProjects();
Projects.push(important);
displayController.updateProjects();
Projects.push(planned);
displayController.updateProjects();
Projects.push(tasks);
displayController.updateProjects();

let projList = document.querySelectorAll('.project-list-item');
projList[0].id = 'my-day';
projList[1].id = 'important';
projList[2].id = 'planned';
projList[3].id = 'tasks';



