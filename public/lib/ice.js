var Ice = function(opts){

  this.type = 'ice';
  if(bizarrio.debug) opts.imagePath = 'ice';

  this.init(opts);

  return this;
};


Ice.prototype = Object.create(Obstacle.prototype);
