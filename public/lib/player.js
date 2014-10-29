var Player = function(game, indice){
  this.game       = game;
  this.character  = null;
  this.jumpTimer  = 0;
  this.indice     = indice;
  this.controls   = {};
  this.facing     = 'left';

  var controlMapping = settings.controls[indice];
  for(var prop in controlMapping){
    var key = controlMapping[prop];
    this.controls[prop] = game.input.keyboard.addKey(Phaser.Keyboard[key]);
  }

  return this;
};


Player.prototype.initCharacter = function(){
  this.character = this.game.add.sprite(32, 32, 'player');

  return this.character;
};


Player.prototype.create = function(){
  this.character.body.bounce.y = settings.players.bounce;
  this.character.body.collideWorldBounds = true;
  this.character.body.setSize(20, 32, 5, 16);

  this.character.animations.add('left', [0, 1, 2, 3], 10, true);
  this.character.animations.add('turn', [4], 20, true);
  this.character.animations.add('right', [5, 6, 7, 8], 10, true);

  return this.character;
};


Player.prototype.update = function(){
  this.character.body.velocity.x = 0;

  // Move character left and right
  if(this.controls.left.isDown){
    this.character.body.velocity.x = -1*settings.players.speed;

    if(this.facing != 'left'){
      this.character.animations.play('left');
      this.facing = 'left';
    }
  } else if(this.controls.right.isDown){
    this.character.body.velocity.x = settings.players.speed;

    if(this.facing != 'right'){
      this.character.animations.play('right');
      this.facing = 'right';
    }
  } else{
    if(this.facing != 'idle') {
      this.character.animations.stop();

      if(this.facing == 'left') player.frame = 0;
      else player.frame = 5;

      this.facing = 'idle';
    }
  }

  // JUMP!
  if(this.controls.jump.isDown &&
    this.character.body.onFloor() &&
    this.game.time.now > this.jumpTimer) {
      this.character.body.velocity.y = -1*(settings.players.jumpPower);
      this.jumpTimer = this.game.time.now + 750;
    }

  return this.character;
};
