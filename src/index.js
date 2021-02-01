Projects = [];

function Project(name) {
    this.name = name;
    this.todos = [];
    this.count = 0;
}

Project.prototype.changeName = function (name) {
    this.name = name;
};

Project.prototype.addTask = function (item) {
    let newTask = new Task(item);
    newTask.parentProject = this;
    if(newTask.parentProject == Projects[1]) {
        newTask.important = true;
    }
    this.todos.push(newTask);
};

Project.prototype.removeTask = function (index) {
    this.todos.splice(index, 1);
};

function Task(name) {
    this.name = name;
    this.completed = false;
    this.important = false;
}

Task.prototype.changeName = function (name) {
    this.name = name;
};

Task.prototype.markComplete = function () {
    this.completed = true;
};

Task.prototype.markNotComplete = function () {
    this.completed = false;
};

Task.prototype.markImportant = function () {
    this.important = true;
};

Task.prototype.markNotImportant = function () {
    this.important = false;
};

//Module for controlling DOM elements
let displayController = (function () {

    //Add a new project to the Projects list
    let updateProjects = function () {
        let projectContainer = document.createElement('div');
        projectContainer.classList.add('project-container');
        let listEl = document.createElement('p');
        listEl.innerText = Projects[Projects.length - 1].name;
        listEl.classList.add('project-list-item');
        projectContainer.dataset.index = `${Projects.length - 1}`
        let projectsList = document.getElementById('projects-list')
        let projectCounter = document.createElement('p');
        projectCounter.classList.add('task-counter');
        projectCounter.classList.add('invisible');
        projectCounter.innerText = Projects[projectContainer.dataset.index].count;
        projectContainer.appendChild(listEl);
        projectContainer.appendChild(projectCounter);
        projectsList.appendChild(projectContainer);

        //Event listener to change selected project and update the list panel
        projectContainer.addEventListener('click', (e) => {
            if (!(document.querySelector('#detail-panel').classList.contains('invisible'))) {
                document.querySelector('#detail-panel').classList.toggle('invisible');
            }
            if (document.querySelector('.selected')) {
                e.stopPropagation();
                document.querySelector('.selected').classList.remove('selected');
                e.currentTarget.classList.add('selected');
            } else {
                e.stopPropagation();
                e.currentTarget.classList.add('selected');
            }
            let taskList = document.querySelector('#list-panel');
            taskList.innerHTML = '';
            let newList = displayController.createList(Projects[e.currentTarget.dataset.index]);
            newList.dataset.index = e.target.dataset.index;
            document.querySelector('#list-panel').appendChild(newList);
        }, true);
    }

    let createList = function (project) {
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
        newTodoName.addEventListener('focus', todoNameHandler);
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

        newTodoName.addEventListener('keydown', function (e) {
            if (e.key == 'Enter') {
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

    let updateTodos = function (project) {
        //Populate Todo List Element
        if (document.querySelector('#task-list')) {
            document.querySelector('#task-list').parentElement.removeChild(document.querySelector('#task-list'));
        }

        let list = document.createElement('div');
        list.id = 'task-list';
        let tasks = document.createElement('div');
        let completed = document.createElement('div');

        for (let i = 0; i < project.todos.length; i++) {
            let container = document.createElement('div');
            container.classList.add('list-container');
            let item = document.createElement('p');
            item.classList.add('todo-item');
            item.innerText = project.todos[i].name;
            item.dataset.index = i;

            if(project.todos[i].dueDate) {
                dueDateEl = document.createElement('p');
                dueDateEl.classList.add('due-date-subtitle');
                dueDateEl.innerText = `Due ${project.todos[i].dueDate}`;
                item.appendChild(dueDateEl);
            } 

            let checkButton = document.createElement('button');
            checkButton.addEventListener('click', (e) => {
                let currentProject = Projects[document.querySelector('.selected').dataset.index];
                let index = e.target.nextSibling.dataset.index;
                let task = currentProject.todos[index];
                let parentProject = task.parentProject;
                parentIndex = parentProject.todos.indexOf(task);
                currentProject.todos[index].completed = !(currentProject.todos[index].completed);

                if (important.todos.filter(todo => todo.completed == false).length != 0) {
                    document.querySelector('#important').lastElementChild.classList.remove('invisible');
                    document.querySelector('#important').lastElementChild.innerText =
                        important.todos.filter(todo => todo.completed == false).length;
                }else {
                    document.querySelector('#important').lastElementChild.classList.add('invisible');
                }
    
                if (parentProject.todos.filter(todo => todo.completed == false).length != 0) {
                    document.querySelectorAll('.project-container')[Projects.indexOf(parentProject)].lastElementChild.classList.remove('invisible');
                    document.querySelectorAll('.project-container')[Projects.indexOf(parentProject)].lastElementChild.innerText =
                        parentProject.todos.filter(todo => todo.completed == false).length;
                } else {
                    document.querySelectorAll('.project-container')[Projects.indexOf(parentProject)].lastElementChild.classList.add('invisible');
                }
                // if (currentProject.todos[index].completed) {
                //     currentProject.count--;
                //     // parentProject.count --;
                // } else {
                //     currentProject.count++;
                //     // parentProject.count++;
                // };

                e.target.nextSibling.classList.toggle('todo-item-completed');
                checkButton.classList.toggle('checkmark-button');
                checkButton.classList.toggle('checkmark-completed');
                displayController.clearList();
                document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProject));
            });

            let starBtn = document.createElement('button');
            starBtn.classList.add('list-star');
            if(project.todos[i].important) {
                starBtn.classList.add('list-star-important');
            }

            starBtn.addEventListener('click', (e) => {
               let listIndex = e.target.previousElementSibling.dataset.index;
               let currentProj = Projects[document.querySelector('.selected').dataset.index];
               let currentTask = currentProj.todos[listIndex];
               currentTask.important = !currentTask.important;
               e.target.classList.toggle('list-star-important');
               let important = Projects[1];
               
               if (!(important.todos.indexOf(currentTask) + 1)) {
                    important.todos.push(currentTask);
                    myDayBtn.classList.toggle('list-star-important');
        
               } else if (currentProj == Projects[1]) {
                    important.removeTask(important.todos.indexOf(currentTask));
                    document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProj));
                } else {
                    important.removeTask(important.todos.indexOf(currentTask));
                }
        
                if (important.todos.filter(todo => todo.completed == false).length !== 0) {
                    document.querySelector('#important').lastElementChild.innerText = important.todos.filter(todo => todo.completed == false).length;
                    document.querySelector('#important').lastElementChild.classList.remove('invisible');
                } else {
                    document.querySelector('#important').lastElementChild.innerText = important.todos.filter(todo => todo.completed == false).length;
                    document.querySelector('#important').lastElementChild.classList.add('invisible');
                }
            });


            container.appendChild(checkButton);
            container.appendChild(item);
            container.appendChild(starBtn);

            if (project.todos[i].completed) {
                if (!completed.querySelector('#completed-list')) {
                    let completedList = document.createElement('p');
                    completedList.id = 'completed-list';
                    completedList.innerText = 'Completed';
                    completed.appendChild(completedList);
                    checkButton.classList.add('checkmark-completed'),
                        item.classList.add('todo-item-completed');
                    completed.appendChild(container);
                } else {
                    checkButton.classList.add('checkmark-completed'),
                        item.classList.add('todo-item-completed');
                    completed.appendChild(container);
                }
            } else {
                checkButton.classList.add('checkmark-button');
                tasks.appendChild(container);
            };

            item.addEventListener('click', updateDetails);
        }
            
            if(tasks.querySelectorAll('.list-container').length == 0) {
                document.querySelector('.selected p:last-child').classList.add('invisible');
            } else {  
                document.querySelector('.selected p:last-child').classList.remove('invisible');
            };

            if(myDay.todos.filter(todo => todo.completed == false).length != 0) {
                document.querySelector('#my-day').lastElementChild.innerText = myDay.todos.filter(todo => todo.completed == false).length;
                document.querySelector('#my-day').lastElementChild.classList.remove('invisible');
            } else {
                document.querySelector('#my-day').lastElementChild.classList.add('invisible');
            }
            document.querySelector('.selected p:last-child').innerText = tasks.querySelectorAll('.list-container').length;
            
           


        list.appendChild(tasks);
        list.appendChild(completed);
        return list;
    }
    let clearList = function () {
        let list = document.querySelector('#task-list');
        list.parentElement.removeChild(list);
    }

    let updateDetails = function (e) {
        let currentProject = Projects[document.querySelector('.selected').dataset.index];
        let currentTask = currentProject.todos[e.target.dataset.index];

        if (document.querySelector('#detail-panel').classList.contains('invisible')) {
            document.querySelector('#detail-panel').classList.toggle('invisible');
        }
        if (document.querySelector('.selected-task')) {
            document.querySelector('.selected-task').classList.remove('selected-task');
            e.target.classList.add('selected-task');
        } else {
            e.target.classList.add('selected-task');
        }
        if (currentTask.dueDate) {
            document.querySelector('#date-input').value = currentTask.dueDate;
            document.querySelector('.due-date-picker').classList.remove('unhidden');
            document.querySelector('#due-date-card p').innerText = `Due ${currentTask.dueDate}`;
        } else {
            document.querySelector('#date-form').reset();
            document.querySelector('.due-date-picker').classList.remove('unhidden');
            document.querySelector('#due-date-card p').innerText = 'Add Due Date';
        }
   
        let detailName = document.querySelector('#detail-name');
        detailName.innerText = currentTask.name;
        detailName.dataset.index = e.target.dataset.index;
        if (myDay.todos.indexOf(currentTask) + 1) {
            document.querySelector('#my-day-card').classList.add('my-day-added');
            document.querySelector('#my-day-card').firstElementChild.innerText = 'Added to My Day';
        } else {
            document.querySelector('#my-day-card').classList.remove('my-day-added');
            document.querySelector('#my-day-card').firstElementChild.innerText = 'Add to My Day';
        }
    }

    return { updateProjects, createList, clearList, updateTodos };
})();

let addTodoHandler = (e) => {
    e.preventDefault();
    if (window.prevFocus !== document.querySelector('.new-todo-name')) {
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
        document.querySelector('.add-button').classList.toggle('invisible');
    }
};

let checkValueHandler = (e) => {
    if (e.target.value != "") {
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
let collapseBtn = document.querySelector('#collapse-btn');
let myDayBtn = document.querySelector('#my-day-card');
let dueDateCard = document.querySelector('#due-date-card');
let saveDateBtn = document.querySelector('#save-date-btn');

dueDateCard.addEventListener('click', (e) => {
    document.querySelector('.due-date-picker').classList.toggle('unhidden');
    let currentProj = Projects[document.querySelector('.selected').dataset.index];
    let currentTask = currentProj.todos[document.querySelector('#detail-name').dataset.index]
    if(currentTask.dueDate){
        document.querySelector('#date-input').value = currentTask.dueDate;
    } else {
        document.querySelector('#date-form').reset();
    }
});

saveDateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let currentProj = Projects[document.querySelector('.selected').dataset.index];
    let currentTask = currentProj.todos[document.querySelector('.selected-task').dataset.index]
    currentTask.dueDate = document.querySelector('#date-input').value;
    document.querySelector('#due-date-card').classList.add('has-due-date');
    document.querySelector('#due-date-card p').innerText = `Due ${currentTask.dueDate}`;
    if(!(Projects[2].todos.indexOf(currentTask) + 1)) {
        Projects[2].todos.push(currentTask);
    }
    document.querySelector('.due-date-picker').classList.toggle('unhidden');
    document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProj));
    console.log(document.querySelectorAll('#task-list .list-container')[document.querySelector('#detail-name').dataset.index].querySelector('.todo-item').classList.add('selected-task'));

    if(Projects[2].todos.filter(todo => todo.completed == false).length != 0) {
        document.querySelector('#planned').lastElementChild.classList.remove('invisible');
        document.querySelector('#planned').lastElementChild.innerText = Projects[2].todos.filter(todo => todo.completed == false).length;
    } else {
        document.querySelector('#planned').lastElementChild.classList.add('invisible');
    }
});


addProj.addEventListener('click', (e) => {
    e.preventDefault();
    if (document.querySelector('.new-project-name').value == "") {
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

myDayBtn.addEventListener('click', (e) => {
   let currentProj = Projects[document.querySelector('.selected').dataset.index];
   let listIndex = e.currentTarget.previousElementSibling.lastElementChild.dataset.index;
   let currentTask = currentProj.todos[listIndex];
   if (!(myDay.todos.indexOf(currentTask) + 1)) {
        myDay.todos.push(currentTask);
        myDayBtn.firstElementChild.innerText = 'Added to My Day';
        myDayBtn.classList.toggle('my-day-added');

    } else if (currentProj == Projects[0]) {
        myDay.removeTask(myDay.todos.indexOf(currentTask));
        document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProj));
        document.querySelector('#detail-panel').classList.toggle('invisible');
    } else {
            myDay.removeTask(myDay.todos.indexOf(currentTask));
            myDayBtn.firstElementChild.innerText = 'Add to My Day';
            myDayBtn.classList.toggle('my-day-added');
    }

    if (myDay.todos.filter(todo => todo.completed == false).length !== 0) {
            document.querySelector('#my-day').lastElementChild.innerText = myDay.todos.filter(todo => todo.completed == false).length;
            document.querySelector('#my-day').lastElementChild.classList.remove('invisible');
        } else {
            document.querySelector('#my-day').lastElementChild.innerText = myDay.todos.filter(todo => todo.completed == false).length;
            document.querySelector('#my-day').lastElementChild.classList.add('invisible');
        }
}, true);


delBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let currentProj = Projects[document.querySelector('.selected').dataset.index];
    let index = document.querySelector('.selected-task').dataset.index;
    let parentProj = currentProj.todos[index].parentProject
    parentProjIndex = Projects.indexOf(parentProj);
    parentProj.removeTask(parentProj.todos.indexOf(currentProj.todos[index]));
    parentProjEl = document.querySelectorAll('.project-container')[parentProjIndex];

    if((myDay.todos.indexOf(currentProj[index])) || (important.todos.indexOf(currentProj[index])) || (planned.todos.indexOf(currentProj[index]))) {
        myDay.removeTask(myDay.todos.indexOf(currentProj[index]));
        important.removeTask(important.todos.indexOf(currentProj[index]));
        planned.removeTask(myDay.todos.indexOf(currentProj[index]));
    }

    if (parentProj.todos.filter(todo => todo.completed == false).length !== 0){
    parentProjEl.lastElementChild.innerText = parentProj.todos.filter(todo => todo.completed == false).length;
    } else {
        parentProjEl.lastElementChild.classList.add('invisible');
    }
    if (myDay.todos.filter(todo => todo.completed == false).length !== 0) {
        document.querySelector('#my-day').lastElementChild.innerText = myDay.todos.filter(todo => todo.completed == false).length;
        document.querySelector('#my-day').lastElementChild.classList.remove('invisible');
    } else {
        document.querySelector('#my-day').lastElementChild.innerText = myDay.todos.filter(todo => todo.completed == false).length;
        document.querySelector('#my-day').lastElementChild.classList.add('invisible');
    } 
    
    if (important.todos.filter(todo => todo.completed == false).length !== 0) {
        document.querySelector('#important').lastElementChild.innerText = important.todos.filter(todo => todo.completed == false).length;
        document.querySelector('#important').lastElementChild.classList.remove('invisible');
    } else {
        document.querySelector('#important').lastElementChild.innerText = important.todos.filter(todo => todo.completed == false).length;
        document.querySelector('#important').lastElementChild.classList.add('invisible');
    }

    if (planned.todos.filter(todo => todo.completed == false).length !== 0) {
        document.querySelector('#planned').lastElementChild.innerText = planned.todos.filter(todo => todo.completed == false).length;
        document.querySelector('#planned').lastElementChild.classList.remove('invisible');
    } else {
        document.querySelector('#planned').lastElementChild.innerText = planned.todos.filter(todo => todo.completed == false).length;
        document.querySelector('#planned').lastElementChild.classList.add('invisible');
    }


    
    document.querySelector('.todo-list').appendChild(displayController.updateTodos(currentProj));
    document.querySelector('#detail-panel').classList.toggle('invisible');
});

collapseBtn.addEventListener('click', (e) => {
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


let projList = document.querySelectorAll('.project-container');
projList[0].id = 'my-day';
projList[1].id = 'important';
projList[2].id = 'planned';
projList[3].id = 'tasks';

document.querySelector('#tasks').classList.add('selected');
document.querySelector('#tasks').dispatchEvent(new MouseEvent('click'));

