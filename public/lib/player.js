var Player = function(game, indice){
  this.game       = game;
  this.character  = null;
  this.indice     = indice;
  this.controls   = {};
  this.facing     = 'left';

  // jumping
  this.isJumping = false;
  this.jumpPower = 0;
  this.jumpPressed = 0;

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
  var speed = settings.players.speed;
  this.character.body.velocity.x = 0;

  if(this.controls.speed.isDown)
    speed = speed*1.5;

  // Move character left and right
  if(this.controls.left.isDown){
    this.character.body.velocity.x = -1*speed;

    if(this.facing != 'left'){
      this.character.animations.play('left');
      this.facing = 'left';
    }
  } else if(this.controls.right.isDown){
    this.character.body.velocity.x = speed;

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
  if(this.jumpPressed && !this.controls.jump.isDown &&
    this.character.body.onFloor()){
      // when releasing jump buton
      this.isJumping = true;
      this.jumpPressed = false;

      if(this.jumpPower >= settings.players.maxJumpPower)
          this.jumpPower = settings.players.maxJumpPower;

      this.character.body.velocity.y = -1*(this.jumpPower);
      this.isJumping = false;
      this.jumpPower = 0;
  } else if(this.controls.jump.isDown &&
    this.character.body.onFloor()){
      // building power
      this.jumpPressed = true;
      this.jumpPower+=15;
  } else{
    // reset
    this.jumpPower = 0;
  }

  return this.character;
};
