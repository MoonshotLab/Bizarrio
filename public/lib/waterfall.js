var Waterfall = function(opts){
  if(bizarrio.debug) opts.imagePath = 'waterfall';
  this.type = 'waterfall';
  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*24);

  this.init(opts);

  this.sprite.alpha = 0.5;

  return this;
};


Waterfall.prototype = Object.create(Obstacle.prototype);
