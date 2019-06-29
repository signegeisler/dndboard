
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



io.on('connection', function(socket){
  console.log('user connected');

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('map', function(map){
    io.emit('map', map);
  });

  socket.on('color tile', function(pos){
    io.emit('color tile',pos);
  });

  socket.on('color block', function(block){
    console.log(block);
    io.emit('color block', block);
  });

  socket.on('worldgridcoordinate', function(coordinates){
    io.emit('worldgridcoordinate', coordinates);
  });

  socket.on('change color tile', function(color){
    io.emit('change color tile', color);
  });

  socket.on('change color occupant', function(color){
    console.log('change color occupant');
    io.emit('change color occupant', color);
  });

  socket.on('place occupant', function(coordinates){
    console.log('place occupant');
    io.emit('place occupant', coordinates);
  });

  socket.on('pick up occupant', function(coordinates){
    console.log('pick op occupant');
    io.emit('pick up occupant', coordinates);
  });

  socket.on('put down occupant', function(coordinates){
    console.log('put down occupant /n');
    io.emit('put down occupant', coordinates);
  })

  socket.on('hover coordinates', function(coordinates){
    console.log('hovering coordinates');
    io.emit('hover coordinates', coordinates);
  });

  socket.on('delete item from canvas', function(coordinates){
    console.log('emmitting delete from canvas');
    io.emit('delete item from canvas', coordinates);
  });

  socket.on('hover effect coordinates', function(coordinates){
    console.log(coordinates);
    io.emit('hover effect coordinates', coordinates);
  });

  socket.on('new hovering effect', function(effect){
    console.log(effect);
    io.emit('new hovering effect', effect);
  });

  socket.on('put down effect', function(coordinates){
    io.emit('put down effect', coordinates);
  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});