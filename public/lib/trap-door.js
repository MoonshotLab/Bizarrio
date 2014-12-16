var TrapDoor = function(opts){
  opts.imagePath = 'trap-door';
  this.type      = 'trap-door';
  this.originalX = opts.el.x;
  this.originalY = opts.el.y - opts.game.map.tileHeight;
  this.init(opts);

  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable    = true;
  this.sprite.alive = true;
  this.sprite.alpha = 0.75;

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

  this.sprite.width = 20;
  this.sprite.height = 120;

  if(this.columnIndex%2 == 1)
    this.sprite.x = this.originalX + 100;

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
  this.sprite.width = 120;
  this.sprite.height = 20;

  this.sprite.x = this.originalX;
  this.weight = 0;
};


MicroEvent.mixin(TrapDoor);
