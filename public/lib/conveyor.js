var Conveyor = function(opts){

  this.type = 'conveyor';
  this.speed = bizarrio.settings.conveyorSpeed;
  if(bizarrio.debug) opts.imagePath = 'conveyor';

  this.init(opts);

  // set default direction and turn motor on
  this.direction = opts.el.properties.direction || 'left';
  bizarrio.socket.emit('update-hardware', {
    pin : self.pin, type : self.type, state : 'on'
  });

  // store some properties in the sprite for easy access
  // and setting within the game class
  this.sprite.speed = this.speed;
  this.sprite.direction = this.direction;

  return this;
};


Conveyor.prototype = Object.create(Obstacle.prototype);
