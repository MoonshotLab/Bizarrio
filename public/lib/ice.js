var Ice = function(game, group, el, indice){
  var imagePath;
  if(bizarrio.debug)
    imagePath = 'ice';
  this.sprite = group.create(el.x, el.y - game.map.tileHeight, imagePath);

  // set the sprite name
  this.name = 'ice-' + indice;
  this.sprite.name = this.name;

  // no gravity, sits still
  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  // save so we can send to server later
  this.pin = el.properties.pin;
  this.type = 'ice';

  return this;
};


Ice.prototype.slide = function(character, ice){
  // this.sprite.body.acceleration.x = bizarrio.settings.slideAccel;
  // this.sprite.body.acceleration.x = -1*bizarrio.settings.slideAccel;
  // console.log(character.body._dx);
  // var dx = character.body._dx;
  var accel = bizarrio.settings.players.slideAccel;
  // console.log(bizarrio.settings.slideAccel);
  character.body.acceleration.x = accel;

  console.log('a');
};
