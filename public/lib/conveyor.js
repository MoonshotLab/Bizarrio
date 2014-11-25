var Conveyor = function(opts){

  this.type = 'conveyor';
  if(bizarrio.debug) opts.imagePath = 'conveyor';

  this.init(opts);

  // set default direction and turn motor on
  this.direction = opts.el.properties.direction || 'left';
  console.log(this.direction);
  bizarrio.socket.emit('update-hardware', {
    pin : self.pin, type : self.type, state : 'on'
  });

  return this;
};


Conveyor.prototype = Object.create(Obstacle.prototype);


Conveyor.prototype.slide = function(character, ice){
  // console.log('collide');
  var accel = bizarrio.settings.conveyorSpeed;
  if(this.direction == 'left') accel = -1*accel;

  console.log(accel);

  character.body.acceleration.x = accel;
};
