var Coin = function(opts){
  if(bizarrio.project || bizarrio.debug)
    opts.imagePath = 'coin';

  this.type = 'coin';
  this.init(opts);

  return this;
};


Coin.prototype = Object.create(Obstacle.prototype);
