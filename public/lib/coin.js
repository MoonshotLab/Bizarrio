var Coin = function(opts){
  opts.imagePath = 'coin';

  this.type = 'coin';
  this.init(opts);

  return this;
};


Coin.prototype = Object.create(Obstacle.prototype);
