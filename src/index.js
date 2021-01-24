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

let updateProjects = function() {
        let listEl = document.createElement('p');
        listEl.innerText = Projects[Projects.length - 1].name;
        listEl.dataset.index = `${Projects.length - 1}`
        let projectsList = document.getElementById('projects-list')
        projectsList.appendChild(listEl);
        listEl.addEventListener('click', (e) => {
            document.querySelector('#list-panel').appendChild(
                displayController.createList(Projects[e.target.dataset.index])); 
            if(document.querySelector('#selected')) {
                document.querySelector('#selected').removeAttribute('id');
                e.target.id = 'selected';
            } else {
                e.target.id = 'selected';
            }
        });
} 

let createList = function(project) {
        //Create Title Element
        let projTitle = document.createElement('p');
        projTitle.className = 'title';
        projTitle.innerText = project.name;
       //Create Todo List Element
        let todoList = document.createElement('div');
        todoList.className = 'todo-list';
        //Create Form and Form Elements for New Todo
        let newTodoForm = document.createElement('form');
        newTodoForm.id = 'new-todo-form';
        let addTodoBtn = document.createElement('button');
        addTodoBtn.innerText = "+";
        addTodoBtn.id = 'add-todo-btn';
        let newTodoName = document.createElement('input');
        newTodoName.id = 'new-todo-name';
        addTodoBtn.addEventListener('click', addTodoHandler);
        //Append Form Elements to Form
        newTodoForm.appendChild(addTodoBtn);
        newTodoForm.appendChild(newTodoName);
        //Append All Elements to List
        todoList.appendChild(projTitle);
        todoList.appendChild(newTodoForm);
        todoList.appendChild(updateTodos(project));

        return todoList;
}

let updateTodos = function(project) {
    //Populate Todo List Element
    let list = document.createElement('div');
    list.id = 'task-list';
    for (let todo of project.todos) {
        let item = document.createElement('p');
        item.innerText = todo.name;
        list.appendChild(item);
    }
    return list;
}

let clearList = function() {
    let list = document.querySelector('#task-list');
    list.parentElement.removeChild(list);
}

    return { updateProjects, createList, clearList, updateTodos };
})();

let projName = document.querySelector('#new-project-name');
let addProj = document.querySelector('#add-project-btn');
let addTodo = document.querySelector('#add-todo-btn');

addProj.addEventListener('click', (e) => {
    e.preventDefault();
    let newProj = new Project(projName.value);
    Projects.push(newProj);
    displayController.updateProjects();
    document.querySelector('#new-project-form').reset();
});

let addTodoHandler = (e) => {
    e.preventDefault();
    let currentIndex = document.querySelector('#selected').dataset.index;
    let todoName = document.querySelector('#new-todo-name').value;
    let currentProject = Projects[currentIndex];
    currentProject.addTask(todoName);
    displayController.clearList();
    document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProject));
    document.querySelector('#new-todo-form').reset();
   
};
