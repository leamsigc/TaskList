class Task {
	constructor(task, done, time) {
		this.task = task;
		this.done = done;
		this.time = time;
	}
}

class UI {
	displayMessage() {}
	addTaskTodo() {}
	resetForm() {}
	deleteTask() {}
}

class Store {
	static addTaskToLocalStorage(task) {}
	static getAllTasks() {}
	static displayTasks() {}
	static removeTaskFromLocalStorage() {}
}

//add Task
function addTask(e) {
	e.preventDefault();
	//get form value
	const formElements = this.elements;
	const taskValue = formElements['newTask'].value;

	const ui = new UI();
	if (!task) {
		ui.displayMessage('Please enter a task', 'error');
		return false;
	}

	const newTask = new Task(taskValue, false, Date.now());
	ui.addTaskTodo(newTask);
	Storage.addTaskToLocalStorage(newTask);
	ui.displayMessage('Good job you jus added another task', 'success');
	this.reset();
}
function removeTask(e) {
	e.preventDefault();

	const ui = new UI();
	//delete todo
	ui.deleteTask(e.target);
	//remove task From local storage
	Storage.removeTaskFromLocalStorage(e.target.parentElement());
	//display success message
	ui.displayMessage('You have remove the task Successfully...', 'success');
}

const taskForm = document.querySelector();
taskForm.addEventListener('submit', addTask);
const taskDisplayList = document.querySelector('[data-js=display-task]');
taskDisplayList.addEventListener('click', removeTask);
window.addEventListener('DOMContentLoaded', function() {
	Store.displayTasks();
});
