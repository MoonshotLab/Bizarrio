var TrapDoor = function(opts){
  if(bizarrio.project || bizarrio.debug)
    opts.imagePath = 'trap-door';

  this.type      = 'trap-door';
  this.originalY = opts.el.y - opts.game.map.tileHeight;
  this.init(opts);

  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable    = true;

  return this;
};


TrapDoor.prototype = Object.create(Obstacle.prototype);


TrapDoor.prototype.toggle = function(){
  var state = 'hi';

  if(this.sprite.alive){
    if(!bizarrio.debug) this.sprite.y = -100;
    this.sprite.alive = false;
    this.sprite.alpha = 0.25;
    state = 'lo';
  } else {
    if(!bizarrio.debug) this.sprite.y = this.originalY;
    this.sprite.alive = true;
    this.sprite.alpha = 1;
  }

  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : state,
    arduinoIndex  : this.arduinoIndex
  });

  return this;
};
