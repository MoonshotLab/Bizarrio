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
  // { pin : 5, type : 'trap-door', state : 'min', arduinoId : '95333353836351511280' }
  socket.on('update-hardware', function(params){
    findArduino(socket.arduinoId).updatePin(params);
  });

  // { pin : 5, type : 'trap-door', arduinoId : '95333353836351511280' }
  socket.on('register-hardware', function(params){
    findArduino(socket.arduinoId).registerPin(params);
  });
});


// find and create the arduinos
var Arduino = require('./lib/arduino');
var SerialPort = require('serialport');

SerialPort.list(function(err, ports){
  ports.forEach(function(port){
    if(port.manufacturer.indexOf('Arduino') != -1)
      arduinos.push(new Arduino(port));
  });
});


// store the arduinos
var arduinos = [];
var findArduino = function(id){
  var foundArduino;
  arduinos.forEach(function(arduino){
    if(arduino.id == id) foundArduino = arduino;
  });

  return foundArduino;
};
