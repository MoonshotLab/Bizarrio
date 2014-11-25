var Ice = function(opts){

  this.type = 'ice';
  if(bizarrio.debug) opts.imagePath = 'ice';

  this.init(opts);

  return this;
};


Ice.prototype = Object.create(Obstacle.prototype);


Ice.prototype.slide = function(character, ice){
  var accel = bizarrio.settings.iceSlickness;
  if(character.body.facing == 1)
    accel = -1*accel;

  character.body.acceleration.x = accel;
};
