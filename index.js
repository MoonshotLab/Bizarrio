var port = process.env.PORT || 3000;
var connect = require('connect');
var serveStatic = require('serve-static');
var server = connect().use(serveStatic(__dirname)).listen(port);
console.log('server started and listening on port', port);


// Connect to arduino
var arduinoReady = false;
var firmata = require('firmata');
var board = new firmata.Board('/dev/tty.usbmodem1421', function(err){
  if(!err){
    arduinoReady = true;
    console.log('arduino ready');
    board.pinMode(9,board.MODES.SERVO);
  }
});


// // Handle socket events
var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('hide-platform', function(){
    if(arduinoReady)
      board.servoWrite(9,50);
  });

  socket.on('show-platform', function(){
    if(arduinoReady)
      board.servoWrite(9,25);
  });
});
