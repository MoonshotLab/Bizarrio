var Portal = function(opts){
  if(bizarrio.project || bizarrio.debug)
    opts.imagePath = 'portal';

  this.type = 'portal';
  this.init(opts);

  return this;
};


Portal.prototype = Object.create(Obstacle.prototype);


Portal.prototype.close = function(){
  this.sprite.alive = false;
  this.sprite.alpha = 0.25;

  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : 'lo',
    arduinoIndex  : this.arduinoIndex
  });
};


Portal.prototype.open = function(){
  this.sprite.alive = true;
  this.sprite.alpha = 1;

  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : 'hi',
    arduinoIndex  : this.arduinoIndex
  });
};
