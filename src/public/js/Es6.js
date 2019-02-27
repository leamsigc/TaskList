class Task {
	constructor(task, done, time) {
		this.task = task;
		this.done = done;
		this.time = time;
	}
}

class UI {
	displayMessage(message, cssClass) {
		const p = document.createElement('p');
		p.className = cssClass;
		p.appendChild(document.createTextNode(message));

		const brotherElement = document.querySelector('[data-js=newTaskForm]');
		const parent = brotherElement.parentElement;
		parent.insertBefore(p, brotherElement);

		setTimeout(() => {
			document.querySelector(`.${cssClass}`).remove();
		}, 3000);
	}
	addTaskTodo(newTask) {
		const li = document.createElement('li');
		const displayTask = document.querySelector('[data-js=display-task]');
		li.id = newTask.time;
		li.innerHTML = `
			${newTask.task}
			<br>
			<input type='checkbox' ${newTask.done ? 'checked' : ''} class='delete'>
		`;
		displayTask.appendChild(li);
	}
	resetForm() {
		document.querySelector('[data-js=newTaskForm]').reset();
	}
	deleteTask(target) {
		if (target.classList.contains('delete')) {
			target.parentElement.remove();
			this.displayMessage('God job you have complete another task today', 'success');
		}
	}
}

class Store {
	static addTaskToLocalStorage(task) {
		const allTodos = Store.getAllTasks();
		allTodos.push(task);
		localStorage.setItem('tasks', JSON.stringify(allTodos));
	}
	static getAllTasks() {
		let AllTasks;
		if (!localStorage.getItem('tasks')) {
			AllTasks = [];
		} else {
			AllTasks = JSON.parse(localStorage.getItem('tasks'));
		}
		return AllTasks;
	}
	static displayTasks() {
		const ui = new UI();
		const allTasks = Store.getAllTasks();

		allTasks.map(task => ui.addTaskTodo(task));
	}
	static removeTaskFromLocalStorage(time) {
		const allTasks = Store.getAllTasks();
		console.log(Number(time));

		const newTaskList = allTasks.filter(task => {
			return task.time === Number(time);
		});
		localStorage.setItem('tasks', JSON.stringify(newTaskList));
	}
}

//add Task
function addTask(e) {
	e.preventDefault();
	//get form value
	const formElements = this.elements;
	const taskValue = formElements['newTask'].value;

	const ui = new UI();
	if (!taskValue) {
		ui.displayMessage('Please enter a task', 'error');
		return false;
	}

	const newTask = new Task(taskValue, false, Date.now());
	ui.addTaskTodo(newTask);
	Store.addTaskToLocalStorage(newTask);
	ui.displayMessage('Good job you jus added another task', 'success');
	ui.resetForm();
}
function removeTask(e) {
	e.preventDefault();
	// console.log(e.target);
	if (!e.target.classList.contains('delete')) return;
	const ui = new UI();
	//delete todo
	ui.deleteTask(e.target);
	//remove task From local storage
	Store.removeTaskFromLocalStorage(e.target.parentElement.id);
	//display success message
	// ui.displayMessage('You have remove the task Successfully...', 'success');
}

const taskForm = document.querySelector('[data-js=newTaskForm]');
taskForm.addEventListener('submit', addTask);
const taskDisplayList = document.querySelector('[data-js=display-task]');
taskDisplayList.addEventListener('click', removeTask);
window.addEventListener('DOMContentLoaded', function() {
	Store.displayTasks();
});
