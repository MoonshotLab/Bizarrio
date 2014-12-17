var JingleBell = function(opts){
  opts.imagePath = 'fan';

  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*5);

  this.type = 'jingleBell';
  this.init(opts);

  return this;
};


JingleBell.prototype = Object.create(Obstacle.prototype);
