const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
	res.send('<h1>Hello world</h1>');
});

const users = {};

io.on('connection', function (socket) {
	console.log('a user connected');

	socket.on('new-user', function (name) {
		console.log('new user: ' + name);
		users[socket.id] = name;
		socket.broadcast.emit('user-connected', name);
	});

	socket.on('send-chat-message', function (msg) {
		console.log('message: ' + msg);
		socket.broadcast.emit('chat-message', {
			name: users[socket.id],
			message: msg
		});
	});

	socket.on('disconnect', function () {
		socket.broadcast.emit('user-disconnected', users[socket.id]);
		delete users[socket.id];
		console.log('user disconnected');
	});
});

http.listen(3000, function () {
	console.log('listening on *:3000');
});