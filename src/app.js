const express = require('express'),
	path = require('path'),
	pug = require('pug'),
	bodyParser = require('body-parser');

//initialize app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//get port for app
const PORT = process.env.PORT || 3000;

//set engine for the app
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
//task array
let tasks = [
	{
		name: 'do the dishes',
		done: false,
		timeStamp: Date.now() + 1
	},
	{
		name: 'do the cats',
		done: true,
		timeStamp: Date.now() + 2
	},
	{
		name: 'do the dogs',
		done: false,
		timeStamp: Date.now() + 3
	}
];
//GET HOME PAGE
app.get('/', (req, res) => {
	res.render('home.pug', { tasks: tasks });
});
//add task
app.post('/addTask', (req, res) => {
	let newTask = req.body;
	tasks.push(newTask);
	res.send({ status: 200 });
});

app.post('/taskUpdate', (req, res) => {
	const taskId = req.body.id;

	tasks.map(item => {
		if (item.timeStamp == parseInt(taskId)) {
			item.done = !item.done;
		}
	});
	res.json({ status: 200 });
});
app.listen(PORT, () => {
	console.log(`Server started on port:${PORT}`);
});
