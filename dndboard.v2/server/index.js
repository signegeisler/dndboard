let express = require('express');
let app = express();
let hostname = '127.0.0.1';
let port = 3000;
let router = express.Router();
let path = require('path');

router.get('/', function(req,res){
    res.send("Hello World");
});

router.get('/dndboard', function(req,res){
    res.send(res.sendFile(path.join(__dirname +'index.html')));
})

app.listen(port,hostname, function(){
    console.log('Server running and now listening on port' + port);
    
})