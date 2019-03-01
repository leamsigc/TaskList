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
		if (document.getElementById(`${newTask.time}`)) {
			document.getElementById(`${newTask.time}`).remove();
		}
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
			console.log(target.parentElement.id);
			document.getElementById(`${target.parentElement.id}`).remove();
			// this.displayMessage('God job you have complete another task today', 'success');
		}
	}
	removeDoneTask() {
		const displayTask = document.querySelector(`[data-js=display--done]`);
		displayTask.innerHTML = '';
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
	static removeAllCompletedTasks() {
		const allTasks = Store.getAllTasks();
		const removeAllTaskDone = allTasks.filter(task => !task.done);

		localStorage.setItem('tasks', JSON.stringify(removeAllTaskDone));
		// this.displayTasks();
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

	if (!info && !danger) return;
	const ui = new UI();

	//delete todo
	ui.deleteTask(e.target);

	//remove task From local storage
	Store.removeTaskFromLocalStorage(e.target.parentElement.id);
	s;
}
function toggleModal() {
	const modal = document.querySelector('.modal');
	modal.classList.toggle('is-active');
}
function removeAllCompleteTasks() {
	const ui = new UI();

	Store.removeAllCompletedTasks();
	ui.removeDoneTask();
	ui.displayMessage('You have remove all the completed tasks', 'success');
}
const taskForm = document.querySelector('[data-js=newTaskForm]');
const taskDisplayList = document.querySelector('[data-js=display--not--done]');
const taskDisplayListDone = document.querySelector('[data-js=display--done]');
const ButtonToggleModal = document.querySelector('[data-js=toggle-modal]');
const ButtonRemoveAllTask = document.querySelector('[data-js=task--remove-all]');

taskForm.addEventListener('submit', addTask);
ButtonToggleModal.addEventListener('click', toggleModal);
ButtonRemoveAllTask.addEventListener('click', removeAllCompleteTasks);
taskDisplayList.addEventListener('click', removeTask);
taskDisplayListDone.addEventListener('click', removeTask);
window.addEventListener('DOMContentLoaded', function() {
	Store.displayTasks();
});
