const express = require("express");
const socketClient = require("socket.io-client");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var p = 1;

const totalServers = 5;
const selfServerId = 5;

const Emitter = require('events');
const eventEmitter = new Emitter();


const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('eventEmitter',eventEmitter);

var count = 0;

const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
})

const server1 = socketClient("http://localhost:3000");
server1.emit("join",5);
const server2 = socketClient("http://localhost:4000");
server2.emit("join",5);
const server3 = socketClient("http://localhost:5000");
server3.emit("join",5);
const server4 = socketClient("http://localhost:6000");
server4.emit("join",5);

server2.on("init",(serverId)=>{
  console.log("server ",serverId," initiated election");
})

server3.on("init",(serverId)=>{
  console.log("server ",serverId," initiated election");
})

server4.on("init",(serverId)=>{
  console.log("server ",serverId," initiated election");
})

server1.on("init",(serverId)=>{
  console.log("server ",serverId," initiated election");
})

server1.on("election message",(serverId)=>{
    console.log("election message from server",serverId);
    io.to(serverId).emit("okay message",selfServerId);
    eventEmitter.emit("send election message");
})

server2.on("election message",(serverId)=>{
    console.log("election message from server",serverId);
    io.to(serverId).emit("okay message",selfServerId);
    eventEmitter.emit("send election message");
})

server3.on("election message",(serverId)=>{
    console.log("election message from server",serverId);
    io.to(serverId).emit("okay message",selfServerId);
    eventEmitter.emit("send election message");
})

server4.on("election message",(serverId)=>{
    console.log("election message from server",serverId);
    io.to(serverId).emit("okay message",selfServerId);
    eventEmitter.emit("send election message");
})

io.on('connection', socket => {
  socket.on('join', ( serverId ) => {
    socket.join(serverId);
    console.log('new socket connection with server ',serverId);
  })
});

server2.on("broadcast",(serverId)=>{
    console.log("server ",serverId," is coordinator");
  })
  
  server3.on("broadcast",(serverId)=>{
    console.log("server ",serverId," is coordinator");
  })
  
  server4.on("broadcast",(serverId)=>{
    console.log("server ",serverId," is coordinator");
  })
  
  server1.on("broadcast",(serverId)=>{
    console.log("server ",serverId," is coordinator");
  })

eventEmitter.on("send election message",()=>{
    if(p>0)
    {
      for(var i=selfServerId+1;i<=totalServers;i++)
      {
        if(i!=selfServerId)
        {
          io.to(i).emit("election message",selfServerId);
        }
      }
      setTimeout(() => {
    
        if(count==0)
        {
            io.sockets.emit('broadcast',selfServerId);
        }
      }, 5000);
      p=p-1;
    }
})

  
http.listen(7000, function() {
    console.log('Food App Server 5 Listening On Port 7000');

    if(parseInt(process.argv[2])===1)
    {
      setTimeout(()=>{
        io.sockets.emit('init',selfServerId);
        eventEmitter.emit("send election message");
      },10000);
    }
});
