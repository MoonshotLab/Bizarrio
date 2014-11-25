var Waterfall = function(game, group, el, indice){
  var imagePath;
  if(bizarrio.debug)
    imagePath = 'waterfall';

  var y = (el.y - game.map.tileHeight*18);
  this.sprite = group.create(el.x, y, imagePath);

  // set the sprite name
  this.name = 'waterfall-' + indice;
  this.sprite.name = this.name;

  // no gravity, sits still
  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  // save so we can send to server later
  this.pin = el.properties.pin;
  this.type = 'waterfall';

  return this;
};


Waterfall.prototype.freeze = function(character, waterfall){
  var player = bizarrio.game.playerManager.findByName(character.name);
  player.freeze();
};
