(function() {
	const form = document.querySelector('[data-js=newTaskForm]');
	const displayTask = document.querySelector('[data-js=display-task]');
	const doneTask = document.querySelector('[data-js=done-task]');

	form.addEventListener('submit', addTask);
	displayTask.addEventListener('click', moveTask);
	doneTask.addEventListener('click', moveTask);

	function moveTask(e) {
		let clickElement = e.target.className.includes('delete');
		if (clickElement) {
			if (e.target.checked) {
				displayNewTask(e.target.parentNode, true);
			} else {
				displayTask.appendChild(e.target.parentNode);
			}
		} else {
			return;
		}
	}
	function addTask(e) {
		e.preventDefault();
		const formElements = this.elements;
		const newTask = formElements['newTask'].value;
		if (!newTask) {
			displayMessage('Enter a new task please', 'danger');
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
				displayMessage('Task added successfully', 'success');
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
			checkBox.className = 'delete';
			li.appendChild(checkBox);
			parentElement.appendChild(li);
		}
	}
	function displayMessage(error, cssClass) {
		let p = document.createElement('p');
		p.className = cssClass;
		const text = document.createTextNode(error);
		p.appendChild(text);
		let parent = form.parentNode;
		parent.insertBefore(p, form);

		setTimeout(() => {
			document.querySelector(`.${cssClass}`).remove();
		}, 3000);
	}
})();
