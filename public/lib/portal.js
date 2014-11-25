var Portal = function(opts){

  this.type = 'portal';
  if(bizarrio.debug) opts.imagePath = 'portal';

  this.init(opts);

  // set the portal to closed
  this.isOpen = false;
  this.sprite.alpha = 0.5;

  return this;
};


Portal.prototype = Object.create(Obstacle.prototype);


Portal.prototype.close = function(){
  this.isOpen = false;
  this.sprite.alpha = 0.5;

  bizarrio.socket.emit('update-hardware', {
    pin : this.pin, type : this.type, state : 'off'
  });
};


Portal.prototype.open = function(){
  this.sprite.alpha = 1;
  this.isOpen = true;

  bizarrio.socket.emit('update-hardware', {
    pin : this.pin, type : this.type, state : 'on'
  });
};
