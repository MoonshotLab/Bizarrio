var Toggle = function(game, group, el, indice){

  var imagePath;
  if(bizarrio.debug)
    imagePath = 'toggle';

  var y = (el.y - game.map.tileHeight*4);
  this.sprite = group.create(el.x, y, imagePath);

  // set the sprite name
  this.name = 'toggle-' + indice;
  this.sprite.name = this.name;

  // set the portal to closed
  this.state = 'on';
  this.sprite.alpha = 1;

  // creates a timer to prevent constant hit detection
  this.timer = null;
  this.actionable = true;

  // no gravity, sits still
  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  // save so we can send to server later
  this.pin = el.properties.pin;
  this.type = 'switch';

  // report to the server so it can prepare the arduino
  bizarrio.socket.emit('register-hardware', {
    'type'  : this.type,
    'pin'   : this.pin
  });

  return this;
};


Toggle.prototype.activate = function(){
  var self = this;

  clearTimeout(this.timer);
  this.timer = setTimeout(function(){
    self.actionable = true;
  }, 2000);

  if(this.actionable){
    this.actionable = false;

    if(this.state == 'off'){
      this.state = 'on';
      this.sprite.alpha = 1;
    } else{
      this.state = 'off';
      this.sprite.alpha = 0.5;
    }
  }
};
