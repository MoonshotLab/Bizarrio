var Coin = function(game, group, el, indice){
  this.sprite = group.create(el.x, el.y - game.map.tileHeight, 'gold');

  // no gravity, sits still
  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;

  // set the state to disabled
  this.name = 'coin-' + indice;
  this.sprite.alive = false;
  this.sprite.alpha = 0;
  this.sprite.name = this.name;

  // save so we can send to server later
  this.pin = el.properties.pin;
  this.type = 'coin';

  // report to the server so it can prepare the arduino
  bizarrio.socket.emit('register-hardware', {
    'type'  : this.type,
    'pin'   : this.pin
  });

  return this;
};


Coin.prototype.toggle = function(){
  this.sprite.alive = this.sprite.alive ? false : true;

  var state = 'off';
  if(this.sprite.alive){
    this.sprite.alpha = 1;
    state = 'on';
  } else this.sprite.alpha = 0;

  bizarrio.socket.emit('update-hardware', {
    pin : this.pin, type : this.type, state : state
  });
};
