var Waterfall = function(opts){
  if(bizarrio.debug) opts.imagePath = 'waterfall';
  this.type = 'waterfall';
  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*24);

  this.init(opts);

  this.isOn = false;
  this.toggle();
  this.scheduleRandomToggle();

  return this;
};

Waterfall.prototype = Object.create(Obstacle.prototype);


Waterfall.prototype.scheduleRandomToggle = function(){
  var timeout = Math.floor(Math.random() * 10000) + 3000;
  var self = this;

  setTimeout(function(){
    self.scheduleRandomToggle();
    self.toggle();
  }, timeout);
};


Waterfall.prototype.toggle = function(){
  var pinState;

  if(!this.isOn){
    pinState = 'on';
    this.sprite.alpha = 0.5;
    this.isOn = true;
  } else {
    pinState = 'off';
    this.sprite.alpha = 0.0;
    this.isOn = false;
  }

  bizarrio.socket.emit('update-hardware', {
    pin : this.pin, type : this.type, state : pinState
  });
};
