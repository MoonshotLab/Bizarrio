var port = process.env.PORT || 3000;
var connect = require('connect');
var serveStatic = require('serve-static');
var arduino = require('./lib/arduino');

var server = connect().use(serveStatic(__dirname)).listen(port);
var io = require('socket.io')(server);
arduino.connect();
console.log('server started and listening on port', port);

io.on('connection', function(socket){
  // { pin : 5, type : 'trap-door', state : 'min' }
  socket.on('update-hardware', arduino.updatePin);

  // { pin : 5, type : 'trap-door',  }
  socket.on('register-hardware', arduino.registerPin);
});
