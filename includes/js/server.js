var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');
 
var server = http.createServer(function(req, res) {
    res.writeHead(200);
    if (req.url != "/") {
    	res.end(fs.readFileSync(__dirname + req.url));	
    }
    else
    {
    res.end(fs.readFileSync(__dirname + '/interface.html'));	
    }
    
}).listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});
 
socketio.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('Message Received: ', msg);
        socket.broadcast.emit('message', msg);
    });
    socket.on('custom_event', function (data) {
        console.dir(data);
    });    
    socket.on('file_open', function (data) {
        console.dir(data);
    });        
});

