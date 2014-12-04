var Fan = function(opts){
  if(bizarrio.project || bizarrio.debug)
    opts.imagePath = 'fan';

  this.type  = 'fan';
  this.init(opts);

  return this;
};


Fan.prototype = Object.create(Obstacle.prototype);


Fan.prototype.toggle = function(){
  var xGravity  = 0;
  var state     = 'lo';

  if(this.isOn) this.isOn = false;
  else{
    state     = 'hi';
    xGravity  = -5000;
    this.isOn = true;
  }

  bizarrio.game.interface.physics.arcade.gravity.x = xGravity;
  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : state,
    arduinoIndex  : this.arduinoIndex
  });
};


Fan.prototype.scheduleRandomToggle = function(){
  var timeout = Math.floor(Math.random() * 30000) + 10000;
  var self = this;

  setTimeout(function(){
    self.scheduleRandomToggle();
    self.toggle();
  }, timeout);
};
