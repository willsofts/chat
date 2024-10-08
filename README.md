## Chat Project

This is project introduce to socket.io implement for chat and broadcast message

## Installation

With npm installed (comes with [node](https://nodejs.org/en/)), run the following commands into a terminal in the root directory of this project:

```shell
npm install
npm run start
```

The project will run at http://localhost:9000/

You can change port setting by environment variable CHAT_PORT
ex. \
Window

    set CHAT_PORT=9000

Linux

    export CHAT_PORT=9000

## Broadcast

This project contains broadcast API that it can invoke by [curl](https://curl.se/download.html):

* curl http://localhost:9000/bc/BroadcastMessage 
* curl http://localhost:9000/bc?message=BroadcastMessage
* curl -X POST http://localhost:9000/bc -d message=BroadcastMessage
* curl -X POST -H "Content-Type: application/json" "http://localhost:9000/bc" -d "{\"message\":\"BroadcastMessage\"}"

Specified message type, with this user can defined type of message sending.

* curl http://localhost:9000/bc/BroadcastMessage/bc 
* curl http://localhost:9000/bc?message=BroadcastMessage&type=bc
* curl -X POST http://localhost:9000/bc -d message=BroadcastMessage&type=bc
* curl -X POST -H "Content-Type: application/json" "http://localhost:9000/bc" -d "{\"message\":\"BroadcastMessage\",\"type\":\"bc\"}"

Send message by app:

* curl -X POST -H "Content-Type: application/json" "http://localhost:9000/app" -d "{\"message\":\"Open App\",\"type\":\"app\", \"app\": { \"programid\":\"exme001\", \"url\":\"\", \"progpath\":\"/exme001/exme001.html\", \"parameters\":\"para=xxx\" }}"

