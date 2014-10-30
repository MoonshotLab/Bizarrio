var TrapDoor = function(game, group, el){
  this.sprite = group.create(el.x, el.y - game.map.tileHeight, 'trap-door');

  game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  return  this.sprite;
};
