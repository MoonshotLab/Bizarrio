var Portal = function(game, group, el, indice){

  var imagePath;
  if(bizarrio.debug)
    imagePath = 'portal';
  this.sprite = group.create(el.x, el.y - game.map.tileHeight, imagePath);

  // set the sprite name
  this.name = 'portal-' + indice;
  this.sprite.name = this.name;

  // set the portal to closed
  this.isOpen = false;
  this.sprite.alpha = 0.5;

  // no gravity, sits still
  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  // save so we can send to server later
  this.pin = el.properties.pin;
  this.type = 'portal';

  // report to the server so it can prepare the arduino
  bizarrio.socket.emit('register-hardware', {
    'type'  : this.type,
    'pin'   : this.pin
  });

  return this;
};


Portal.prototype.close = function(){
  this.isOpen = false;
  this.sprite.alpha = 0.5;
};


Portal.prototype.open = function(){
  this.sprite.alpha = 1;
  this.isOpen = true;
};
