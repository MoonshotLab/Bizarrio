var Ice = function(opts){
  opts.imagePath = 'ice';

  this.type = 'ice';
  this.init(opts);

  // override
  this.sprite.alpha = 1;
  this.sprite.alive = true;

  return this;
};


Ice.prototype = Object.create(Obstacle.prototype);
