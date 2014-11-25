var TrapDoor = function(opts){
  this.type = 'trap-door';
  this.originalY = opts.el.y - opts.game.map.tileHeight;

  if(bizarrio.debug) opts.imagePath = 'trap-door';

  this.init(opts);

  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  return this;
};


TrapDoor.prototype = Object.create(Obstacle.prototype);


TrapDoor.prototype.toggle = function(opts){
  var self = this;

  setInterval(function(){
    var state = 'min';

    if(self.sprite.y == -100){
      self.sprite.y = self.originalY;
      state = 'max';
    } else self.sprite.y = -100;

    bizarrio.socket.emit('update-hardware', {
      pin : self.pin, type : self.type, state : state
    });

  }, opts.timer);

  return this;
};
