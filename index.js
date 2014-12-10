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
    if(arduinos[params.arduinoIndex]){
      var arduino = findArduino(params.arduinoIndex);
      if(arduino) arduino.updatePin(params);
    }
  });

  // { pin : 5, type : 'trap-door', arduinoIndex : '0' }
  socket.on('register-hardware', function(params){
    if(arduinos[params.arduinoIndex]){
      var arduino = findArduino(params.arduinoIndex);
      if(arduino) arduino.registerPin(params);
    }
  });
});


// See the readme for an explanation of the below
// 0 - 95333353836351511280
// 1 - 7543730383035120E070
// find and create the arduinos
var Arduino = require('./lib/arduino');
var SerialPort = require('serialport');
var arduinos = [];

SerialPort.list(function(err, ports){
  ports.forEach(function(port, i){
    if(port.manufacturer.indexOf('Arduino') != -1){
      var arduino = new Arduino(port, i.toString());
      if(port.serialNumber == '95333353836351511280')
        arduino.index = 1;
      else arduino.index = 0;

      arduinos.push(arduino);
    }
  });
});

var findArduino = function(index){
  var foundArduino;
  arduinos.forEach(function(arduino){
    if(arduino.index == index) foundArduino = arduino;
  });

  return foundArduino;
};
