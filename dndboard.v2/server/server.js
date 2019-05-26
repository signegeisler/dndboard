let express = require('express');
let app = express();
let hostname = '127.0.0.1';
let port = 3000;
let path = require('path');

app.use(express.static('public'));

app.get('/', function(req,res){
    res.send("Hello World");
});

app.get('/dndboard', function(req,res){
    console.log(path.join(__dirname,'index.html'));
    res.sendFile(__dirname +'/index.html');
})

app.listen(port,hostname, function(){
    console.log('Server running and now listening on port' + port);
    
})