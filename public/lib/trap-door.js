var TrapDoor = function(game, group, el){
  this.originalY = el.y - game.map.tileHeight;
  this.sprite = group.create(el.x, this.originalY, 'trap-door');

  // make it behave like a platform
  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  // save so we can send to server later
  this.pin = el.properties.pin;
  this.type = 'trap-door';

  // report to the server so it can prepare the arduino
  bizarrio.socket.emit('register-hardware', {
    'type'  : this.type,
    'pin'   : this.pin
  });

  return this;
};


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
};
