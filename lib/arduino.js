var firmata = require('firmata');
var hardware = require('../config/hardware')();
var board = null;


// { port : 1421 }
exports.connect = function(opts){
  if(!opts) opts = { port : 1411 };

  board = new firmata.Board('/dev/tty.usbmodem' + opts.port, function(err){
    if(!err) console.log('arduino ready');
    else console.log(err);
  });
};


// { pin : 5, type : 'trap-door' }
exports.registerPin = function(params){
  var mode = hardware[params.type].mode;
  board.pinMode(params.pin, board.MODES[mode]);
};


// { pin : 5, type : 'trap-door', state : 'min' }
exports.updatePin = function(params){
  var action = hardware[params.type].action;
  var stateVal = hardware[params.type][params.state];
  board[action](params.pin, stateVal);
};