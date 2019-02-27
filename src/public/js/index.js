(function() {
	const form = document.querySelector('[data-js=newTaskForm]');
	const taskTodo = document.querySelector('[data-js=display-task]');
	const doneTask = document.querySelector('[data-js=done-task]');

	form.addEventListener('submit', addTask);
	taskTodo.addEventListener('click', moveTask);
	doneTask.addEventListener('click', moveTask);

	function moveTask(e) {
		let clickElement = e.target.className.includes('status');
		if (clickElement) {
			if (e.target.checked) {
				displayNewTask(e.target.parentNode, true);
			} else {
				taskTodo.appendChild(e.target.parentNode);
			}
		} else {
			return;
		}
	}
	function addTask(e) {
		e.preventDefault();
		const formElements = this.elements;
		const newTask = formElements['newTask'].value;
		if (newTask === '') {
			displayError('Enter a new node please', 'danger');
			return false;
		}
		const data = {
			name: newTask,
			done: false,
			timeStamp: Date.now()
		};
		sendTask(data);
		this.reset();
	}

	function sendTask(value) {
		console.log(value);
		fetch('/addTask', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(value)
		})
			.then(res => res.json())
			.then(data => {
				// console.log(data);
				displayNewTask(value, false);
			});
	}
	function displayNewTask(newTask, done) {
		if (done) {
			const parentElement = document.querySelector('[data-js=done-task]');
			parentElement.appendChild(newTask);
		} else {
			const parentElement = document.querySelector('[data-js=display-task]');
			const li = document.createElement('li');
			li.className = 'task--items';
			li.id = newTask.timeStamp;
			const taskText = document.createTextNode(newTask.name);
			li.appendChild(taskText);
			let checkBox = document.createElement('input');
			checkBox.setAttribute('type', 'checkbox');
			checkBox.className = 'status';
			li.appendChild(checkBox);
			parentElement.appendChild(li);
		}
	}
	function displayError(error, cssClass) {
		let p = document.createElement('p');
		p.className = cssClass;
		const text = document.createTextNode(error);
		p.appendChild(text);
		let parent = form.parentNode;
		parent.insertBefore(p, form);

		setTimeout(() => {
			document.querySelector('.danger').remove();
		}, 3000);
	}
})();
