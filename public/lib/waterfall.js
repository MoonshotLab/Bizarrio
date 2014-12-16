var Waterfall = function(opts){
  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*24);

  opts.imagePath = 'waterfall';
  this.type = 'waterfall';
  this.init(opts);

  return this;
};

Waterfall.prototype = Object.create(Obstacle.prototype);


Waterfall.prototype.scheduleRandomToggle = function(){
  var timeout = Math.floor(Math.random() * 10000) + 3000;
  var self = this;

  setTimeout(function(){
    self.scheduleRandomToggle();
    self.toggle();
  }, timeout);
};
