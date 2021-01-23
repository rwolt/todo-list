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


