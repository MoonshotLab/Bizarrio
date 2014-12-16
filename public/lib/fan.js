var Fan = function(opts){
  opts.imagePath = 'fan';

  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*5);

  this.type = 'fan';
  this.init(opts);

  return this;
};


Fan.prototype = Object.create(Obstacle.prototype);


Fan.prototype.toggle = function(){
  this.sprite.alive = this.sprite.alive ? false : true;

  var xGravity  = 0;
  var state     = 'lo';
  this.sprite.alpha = 0.25;

  if(this.sprite.alive){
    state     = 'hi';
    xGravity  = -5000;
    this.isOn = true;
    this.sprite.alpha = 0.75;
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
