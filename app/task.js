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
