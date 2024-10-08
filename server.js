const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
	cors: { origin: '*', }
});
let history_broadcast = [];
const CHAT_PORT = process.env.CHAT_PORT || 9000;
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/', function(req, res) {
	console.log('get '+__dirname+' - send '+__dirname + '/index.html');
	res.sendFile(__dirname + '/public/index.html');
});
function broadcast(message,type,app) {
	if(message) {
		if(!type || type.trim().length == 0) type = "bc";
		let msg = {type: type, username: "admin", message: message, app: app};
		console.log("broadcast:",msg);
		io.emit("broadcast-message",msg);
		if(msg.type == "bc") {
			history_broadcast.push(msg);
			if(history_broadcast.length > 5) history_broadcast.shift();
		}
	}
}
//broadcast by admin
app.get("/bc/:message/:type?",function(req,res) {
	broadcast(req.params.message,req.params.type);
	res.send("OK");
});
app.post("/bc",function(req,res) {
	broadcast(req.params.message || req.query.message || req.body.message,req.params.type || req.query.type || req.body.type);
	res.send("OK");
});
app.get("/bcclear",function(req,res) {
	console.log("bc: clear ",history_broadcast.length);
	history_broadcast = [];
	res.send("OK");
});
app.post("/app",function(req,res) {
	broadcast(req.params.message || req.query.message || req.body.message,"app",req.params.app || req.body.app);
	res.send("OK");
});
//direct message
app.get("/direct/:id/:message",function(req,res) {
	let id = req.params.id;
	let message = req.params.message;
	io.to(id).emit("chat-message",{type: "chat", username: "admin", message: message});
	res.send("OK");
});
io.on('connection', function(socket){
	console.log('chat:: a user connected :',socket.id);
	for(let msg of history_broadcast) {
		socket.emit("broadcast-message",msg);
	}
	socket.on('disconnect', function() {
		console.log('chat:: user disconnected :',socket.id);
	});
	socket.on('chat-message', function(msg){
		io.emit('chat-message', {...msg, type: "chat"});
	});	
});
http.listen(CHAT_PORT, function(){
  console.log('listening on *:'+CHAT_PORT);
});
