const express = require('express');
const cors = require('cors');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const CHAT_PORT = process.env.CHAT_PORT || 9000;
app.use(cors());
app.use(express.static('public'));
app.get('/', function(req, res) {
	console.log('get '+__dirname+' - send '+__dirname + '/index.html');
	res.sendFile(__dirname + '/public/index.html');
});
//broadcast by admin
app.get("/bc/:message",function(req,res) {
	let message = req.params.message;
	io.emit("broadcast-message",{username: "admin", message: message});
	res.send("OK");
});
//direct message
app.get("/direct/:id/:message",function(req,res) {
	let id = req.params.id;
	let message = req.params.message;
	io.to(id).emit("chat-message",{username: "admin", message: message});
	res.send("OK");
});
let history_broadcast = [];
io.on('connection', function(socket){
	console.log('chat:: a user connected :',socket.id);
	for(let msg of history_broadcast) {
		socket.emit("broadcast-message",msg);
	}
	socket.on('disconnect', function() {
		console.log('chat:: user disconnected :',socket.id);
	});
	socket.on('chat-message', function(msg){
		io.emit('chat-message', msg);
	});	
	socket.on('broadcast-message', function(msg){
		io.emit('broadcast-message', msg);
		history_broadcast.push({...msg, id: socket.id});
		if(history_broadcast.length > 5) history_broadcast.shift();
	});	
});
http.listen(CHAT_PORT, function(){
  console.log('listening on *:'+CHAT_PORT);
});
