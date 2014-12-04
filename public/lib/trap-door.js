var TrapDoor = function(opts){
  if(bizarrio.project || bizarrio.debug)
    opts.imagePath = 'trap-door';

  this.type      = 'trap-door';
  this.originalY = opts.el.y - opts.game.map.tileHeight;
  this.init(opts);

  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable    = true;
  this.sprite.alive = true;

  // related to snow collection and player weight
  this.playerTouching = false;
  this.columnIndex    = 0;
  this.verticalIndex  = 0;
  this.weight         = 0;
  this.maxWeight      = Math.floor(Math.random() * 50) + 10;

  return this;
};


TrapDoor.prototype = Object.create(Obstacle.prototype);


TrapDoor.prototype.playerCollide = function(){
  this.playerTouching = true;

  if(this.weight + bizarrio.settings.playerWeight >= this.maxWeight){
    this.weight = 0;
    this.fall();
  }
};


TrapDoor.prototype.addWeight = function(weight){
  if(!weight) weight = 1;
  this.weight += weight;

  if(this.weight >= this.maxWeight)
    this.fall();
};


TrapDoor.prototype.fall = function(){
  var self = this;

  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : 'lo',
    arduinoIndex  : this.arduinoIndex
  });

  this.sprite.alive = false;
  this.sprite.y = -100;

  // Delay event to simulate snow falling
  setTimeout(function(){
    self.trigger('fall', {
      columnIndex : self.columnIndex,
      weight      : self.weight
    });
  }, 700);

  setTimeout(function(){
    self.lift();
  }, 5000);
};


TrapDoor.prototype.lift = function(){
  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : 'hi',
    arduinoIndex  : this.arduinoIndex
  });

  this.sprite.alive = true;
  this.sprite.y = this.originalY;
  this.weight = 0;
};


TrapDoor.prototype.toggle = function(){
  if(this.sprite.alive) this.fall();
  else this.lift();
};


MicroEvent.mixin(TrapDoor);
