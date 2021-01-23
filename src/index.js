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

let displayController = (function() {
  
let updateProjects = function() {
        let listEl = document.createElement('p');
        listEl.innerText = Projects[Projects.length - 1].name;
        document.getElementById('projects-list').appendChild(listEl);
    }; 


    return {updateProjects};
})();

let projName = document.querySelector('#new-project-name');
let addProj = document.querySelector('#add-project-btn');

addProj.addEventListener('click', (e) => {
    e.preventDefault();
    let newProj = new Project(projName.value);
    Projects.push(newProj);
    displayController.updateProjects();
    document.querySelector('#new-project-form').reset();
})

