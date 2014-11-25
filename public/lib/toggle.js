var Toggle = function(opts){

  if(bizarrio.debug) opts.imagePath = 'toggle';
  // this needs to change, i don't know why it's required
  opts.y = (opts.el.y - opts.game.map.tileHeight*4);
  this.type = 'toggle';

  this.init(opts);

  // set the portal to closed
  this.state = 'on';
  this.sprite.alpha = 1;

  // creates a timer to prevent constant hit detection
  this.timer = null;
  this.actionable = true;

  return this;
};


Toggle.prototype = Object.create(Obstacle.prototype);


Toggle.prototype.activate = function(){
  var self = this;

  clearTimeout(this.timer);
  this.timer = setTimeout(function(){
    self.actionable = true;
  }, 2000);

  if(this.actionable){
    this.actionable = false;

    var position = 'max';
    if(this.state == 'off'){
      this.state = 'on';
      this.sprite.alpha = 1;
      position = 'max';
    } else{
      this.state = 'off';
      this.sprite.alpha = 0.5;
      position = 'min';
    }

    bizarrio.socket.emit('update-hardware', {
      pin : this.pin, type : this.type, state : position
    });
  }
};
