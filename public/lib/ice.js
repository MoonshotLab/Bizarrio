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
  var accel = bizarrio.settings.slickness;
  if(character.body.facing == 1)
    accel = -1*accel;

  character.body.acceleration.x = accel;
};
