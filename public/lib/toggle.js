var Toggle = function(opts){

  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*4);
  opts.imagePath = 'toggle';

  this.type = 'toggle';
  this.init(opts);

  // overwrite
  this.sprite.alive = true;

  // creates a timer to prevent constant hit detection
  this.timer = null;
  this.position = 'a';

  return this;
};


Toggle.prototype = Object.create(Obstacle.prototype);


Toggle.prototype.toggle = function(){
  var self = this;

  clearTimeout(this.timer);
  this.timer = setTimeout(function(){
    self.sprite.alive = true;
  }, 2000);

  if(this.sprite.alive){
    this.sprite.alive = false;

    var state = 'hi';
    if(this.position == 'a'){
      this.position = 'b';
      this.sprite.alpha = 1;
    } else {
      state = 'lo';
      this.position = 'a';
      this.sprite.alpha = 0.25;
    }

    bizarrio.socket.emit('update-hardware', {
      pin           : this.pin,
      type          : this.type,
      state         : state,
      arduinoIndex  : this.arduinoIndex
    });
  }
};
