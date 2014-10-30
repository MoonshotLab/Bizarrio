var TrapDoor = function(game, group, el){
  var self = this;

  this.originalY = el.y - game.map.tileHeight;
  this.sprite = group.create(el.x, self.originalY, 'trap-door');

  // make it behave like a platform
  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  return this;
};


TrapDoor.prototype.toggle = function(opts){
  var self = this;

  setInterval(function(){
    if(self.sprite.y == -100)
      self.sprite.y = self.originalY;
    else
      self.sprite.y = -100;
  }, opts.timer);
};
