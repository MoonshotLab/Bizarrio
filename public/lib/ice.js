var Ice = function(opts){
  if(bizarrio.project || bizarrio.debug)
    opts.imagePath = 'ice';

  this.type = 'ice';
  this.init(opts);

  // override
  this.sprite.alpha = 1;
  this.sprite.alive = true;

  return this;
};


Ice.prototype = Object.create(Obstacle.prototype);
