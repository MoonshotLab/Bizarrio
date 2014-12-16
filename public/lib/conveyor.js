var Conveyor = function(opts){
  opts.imagePath = 'conveyor';

  this.type  = 'conveyor';
  this.speed = bizarrio.settings.conveyorSpeed;
  this.init(opts);

  this.sprite.alpha = 0.1;

  // set default direction and turn motor on
  this.direction = opts.el.properties.direction || 'left';

  // store some properties in the sprite for easy access
  // and setting within the game class
  this.sprite.speed = this.speed;
  this.sprite.direction = this.direction;

  return this;
};


Conveyor.prototype = Object.create(Obstacle.prototype);
