(function() {
	const form = document.querySelector('[data-js=newTaskForm]');
	const taskTodo = document.querySelector('[data-js=display-task]');
	const doneTask = document.querySelector('[data-js=done-task]');

	form.addEventListener('submit', createNewTask);
})();
const Task = function(name, status) {
	this.name = name;
	this.status = status;
};

function createNewTask(e) {
	e.preventDefault();
	const formElements = this.elements;
	const newTask = formElements['newTask'].value;

	if (!newTask) return;

	const newTaskCreate = new Task(newTask, false);

	console.log(newTaskCreate);
}
