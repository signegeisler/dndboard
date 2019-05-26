let express = require('express');
let app = express();
let hostname = '127.0.0.1';
let port = 3000;
let path = require('path');
let io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req,res){
   
});

app.get('/dndboard', function(req,res){
    
})

io.on('connection', function(socket){
    console.log("User logged on");
    socket.emit("wrice");
  });

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

app.listen(port,hostname, function(){
    console.log('Server running and now listening on port' + port);
    
})