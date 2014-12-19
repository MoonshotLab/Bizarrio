var Waterfall = function(opts){
  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*24);

  opts.imagePath = 'waterfall';
  this.type = 'waterfall';
  this.init(opts);
  this.sprite.alpha = 1;

  this.sprite.animations.add('on', [0, 1, 2], 7, true);
  this.sprite.animations.add('off', [3], 7, true);
  this.sprite.animations.play('off');

  return this;
};

Waterfall.prototype = Object.create(Obstacle.prototype);


Waterfall.prototype.scheduleRandomToggle = function(){
  var timeout = Math.floor(Math.random() * 10000) + 3000;
  var self = this;

  setTimeout(function(){
    self.scheduleRandomToggle();
    self.toggle();
  }, timeout);
};


Waterfall.prototype.toggle = function(){
  this.sprite.alive = this.sprite.alive ? false : true;

  var state = 'lo';
  if(this.sprite.alive)
    state = 'hi';

  if(state == 'hi'){
    bizarrio.game.sounds.waterfall.play();
    this.sprite.animations.play('on');
  }
  else{
    bizarrio.game.sounds.waterfall.stop();
    this.sprite.animations.play('off');
  }

  bizarrio.socket.emit('update-hardware', {
    pin           : this.pin,
    type          : this.type,
    state         : state,
    arduinoIndex  : this.arduinoIndex
  });
};
