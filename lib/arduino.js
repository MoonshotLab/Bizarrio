var firmata = require('firmata');
var hardware = require('../config/hardware')();
var board = null;
var boardReady = false;


// { port : 1421 }
exports.connect = function(opts){
  if(!opts) opts = { port : 1411 };

  board = new firmata.Board('/dev/tty.usbmodem' + opts.port, function(err){
    if(!err) {
      console.log('arduino ready');
      boardReady = true;
    } else console.log(err);
  });
};


// { pin : 5, type : 'trap-door' }
exports.registerPin = function(params){
  if(boardReady){
    var mode = hardware[params.type].mode;
    var action = hardware[params.type].action;
    var reset = hardware[params.type].reset;

    board.pinMode(params.pin, board.MODES[mode]);
    board[action](params.pin, reset);
  }
};


// { pin : 5, type : 'trap-door', state : 'min' }
exports.updatePin = function(params){
  if(boardReady){
    var action = hardware[params.type].action;
    var stateVal = hardware[params.type][params.state];
    board[action](params.pin, stateVal);
  }
};
