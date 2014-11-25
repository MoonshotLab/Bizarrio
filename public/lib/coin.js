var Coin = function(opts){
  if(bizarrio.debug) opts.imagePath = 'coin';
  this.type = 'coin';

  this.init(opts);

  // set the state to disabled
  this.sprite.alive = false;
  this.sprite.alpha = 0;

  return this;
};


Coin.prototype = Object.create(Obstacle.prototype);


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
