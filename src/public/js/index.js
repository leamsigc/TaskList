(function() {
	const form = document.querySelector('[data-js=newTaskForm]');
	const displayTask = document.querySelector('[data-js=display--not--done]');
	const doneTask = document.querySelector('[data-js=display--done]');
	const toggleModal = document.querySelector('[data-js=toggle-modal]');
	const closeModal = document.querySelector('.modal-close');

	closeModal.addEventListener('click', toggleModalStatus);
	toggleModal.addEventListener('click', toggleModalStatus);
	form.addEventListener('submit', addTask);
	displayTask.addEventListener('click', moveTask);
	doneTask.addEventListener('click', moveTask);

	function moveTask(e) {
		const markTaskCompleted = e.target.className.includes('is-danger');
		const repostTask = e.target.className.includes('is-info');
		if (markTaskCompleted || repostTask) {
			const id = e.target.parentElement.id;
			if (markTaskCompleted) {
				changeTaskStatus(id);
				e.target.classList.toggle('is-danger');
				e.target.classList.toggle('is-info');
				e.target.textContent = 're-post';
				displayNewTask(e.target.parentNode, true);
			} else {
				changeTaskStatus(id);
				e.target.classList.toggle('is-info');
				e.target.classList.toggle('is-danger');
				e.target.textContent = 'delete';
				displayTask.appendChild(e.target.parentNode);
			}
		} else {
			return;
		}
	}
	//change the status of the task
	function changeTaskStatus(taskId) {
		fetch('/taskUpdate', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: taskId })
		})
			.then(res => res.json())
			.then(data => {
				displayMessage('Damn your on fire', 'success');
			});
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
		toggleModalStatus();
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
			const parentElement = document.querySelector('[data-js=display--done]');
			parentElement.appendChild(newTask);
		} else {
			const parentElement = document.querySelector('[data-js=display--not--done]');
			const li = document.createElement('li');
			li.className = 'task--item';
			li.id = newTask.timeStamp;
			li.setAttribute('data-js', newTask.done);
			li.innerHTML = `
				<span class='task--text'>${newTask.name}</span>
				<span class="tag is-danger is-small">delete</span>
				<span class='tag is-danger is-small>delete</span>
			`;
			parentElement.appendChild(li);
		}
	}
	function displayMessage(error, cssClass) {
		let p = document.createElement('p');
		p.className = cssClass;
		const text = document.createTextNode(error);
		p.appendChild(text);
		const taskContainer = document.querySelector('.task--container');
		let parent = taskContainer.parentNode;
		parent.insertBefore(p, taskContainer);

		setTimeout(() => {
			document.querySelector(`.${cssClass}`).remove();
		}, 3000);
	}
	function toggleModalStatus() {
		const modalContainer = document.querySelector('.modal');
		modalContainer.classList.toggle('is-active');
	}
})();
