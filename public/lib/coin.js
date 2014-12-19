var Coin = function(opts){
  opts.imagePath = 'coin';

  this.type = 'coin';
  this.init(opts);

  return this;
};


Coin.prototype = Object.create(Obstacle.prototype);


Coin.prototype.turnOn = function(){
  this.sprite.alive = true;
  this.sprite.alpha = 0.75;
  
  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : 'hi',
    arduinoIndex  : this.arduinoIndex
  });
};
