
$(document).ready(function(){



$(function () {
    var socket = io.connect('localhost:3000');
    
    function testSocket(){
        socket.emit('chat message', 'Hello World');
    }
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
  });

})