// create server, start sockets
var port    = process.env.PORT || 3000;
var pubDir  = require('path').join(__dirname, 'public');
var server  = require('connect')().use(
  require('serve-static')(pubDir)
).listen(port);

var io = require('socket.io')(server);
console.log('server started and listening on port', port);


// listen for socket events
io.on('connection', function(socket){
  // { pin : 5, type : 'trap-door', state : 'min', arduinoIndex : '0' }
  socket.on('update-hardware', function(params){
    if(arduinos[params.arduinoIndex])
      arduinos[params.arduinoIndex].updatePin(params);
  });

  // { pin : 5, type : 'trap-door', arduinoIndex : '0' }
  socket.on('register-hardware', function(params){
    if(arduinos[params.arduinoIndex])
      arduinos[params.arduinoIndex].registerPin(params);
  });
});


// find and create the arduinos
var Arduino = require('./lib/arduino');
var SerialPort = require('serialport');
var arduinos = [];

SerialPort.list(function(err, ports){
  ports.forEach(function(port, i){
    if(port.manufacturer.indexOf('Arduino') != -1)
      arduinos.push(new Arduino(port, i.toString()));
  });
});
