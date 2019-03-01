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

		const brotherElement = document.querySelector('.task--container');
		const parent = brotherElement.parentElement;
		parent.insertBefore(p, brotherElement);

		setTimeout(() => {
			document.querySelector(`.${cssClass}`).remove();
		}, 3000);
	}
	addTaskTodo(newTask, selector = 'not--done') {
		const li = document.createElement('li');
		const displayTask = document.querySelector(`[data-js=display--${selector}]`);
		li.id = newTask.time;
		li.className = 'task--item';
		li.innerHTML = `
			${newTask.task}
			<br>
			<span class=' tag is-small ${newTask.done ? 'is-info' : 'is-danger'}'>${newTask.done ? 're-post' : 'delete'}</span>
		`;
		displayTask.appendChild(li);
	}
	resetForm() {
		document.querySelector('[data-js=newTaskForm]').reset();
	}
	deleteTask(target) {
		if (target.classList.contains('is-danger') || target.classList.contains('is-info')) {
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

		allTasks.map(task => {
			if (task.done) {
				ui.addTaskTodo(task, 'done');
			} else {
				ui.addTaskTodo(task);
			}
		});
	}
	static removeTaskFromLocalStorage(time) {
		const allTasks = Store.getAllTasks();

		// const newTaskList = allTasks.filter(task => {
		// 	return task.time === Number(time);
		// });
		const newTaskList = allTasks.map(item => {
			if (item.time === Number(time)) {
				item.done = !item.done;
				return item;
			}
			return item;
		});
		localStorage.setItem('tasks', JSON.stringify(newTaskList));
		this.displayTasks();
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
	toggleModal();
}
function removeTask(e) {
	e.preventDefault();

	let info = e.target.classList.contains('is-info');
	let danger = e.target.classList.contains('is-danger');
	// console.log(info, danger);
	if (!info && !danger) return;
	const ui = new UI();
	//delete todo
	ui.deleteTask(e.target);
	//remove task From local storage
	Store.removeTaskFromLocalStorage(e.target.parentElement.id);
	//display success message
	// ui.displayMessage('You have remove the task Successfully...', 'success');
}
function toggleModal() {
	const modal = document.querySelector('.modal');

	modal.classList.toggle('is-active');
}
const taskForm = document.querySelector('[data-js=newTaskForm]');
taskForm.addEventListener('submit', addTask);
const taskDisplayList = document.querySelector('[data-js=display--not--done]');
const taskDisplayListDone = document.querySelector('[data-js=display--done]');
const ButtonToggleModal = document.querySelector('[data-js=toggle-modal]');
ButtonToggleModal.addEventListener('click', toggleModal);
taskDisplayList.addEventListener('click', removeTask);
taskDisplayListDone.addEventListener('click', removeTask);
window.addEventListener('DOMContentLoaded', function() {
	Store.displayTasks();
});
