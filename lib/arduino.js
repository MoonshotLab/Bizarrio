var firmata = require('firmata');
var hardware = require('../config/hardware')();


// { comName : '/dev/cu/usbmodem1411', serialNumber : '95333353836351511280' }
var Arduino = function(opts, i){
  var self = this;

  this.ready = false;

  if(opts){
    this.serialNumber = opts.serialNumber;
    this.board = new firmata.Board(opts.comName, function(err){
      if(!err){
        console.log('arduino', opts.serialNumber, opts.comName, 'ready');
        self.ready = true;
      } else console.log(err);
    });
  }

  return this;
};


// { pin : 5, type : 'trap-door' }
Arduino.prototype.registerPin = function(params){
  if(this.ready){
    console.log('registering pin', params);

    var mode    = hardware[params.type].mode;
    var action  = hardware[params.type].action;
    var reset   = hardware[params.type].reset;

    this.board.pinMode(params.pin, this.board.MODES[mode]);
    this.board[action](params.pin, reset);
  }
};


// { pin : 5, type : 'trap-door', state : 'min' }
Arduino.prototype.updatePin = function(params){
  if(this.ready){
    console.log('updating pin', params);

    var action    = hardware[params.type].action;
    var stateVal  = hardware[params.type][params.state];

    this.board[action](params.pin, stateVal);
  }
};


module.exports = Arduino;
