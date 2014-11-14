var Player = function(game, indice){
  this.score      = 0;
  this.game       = game;
  this.sprite     = null;
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
  this.sprite = this.game.add.sprite(32, 32, 'player');
  this.sprite.name = 'player-' + this.indice;

  return this.sprite;
};


Player.prototype.create = function(){
  this.sprite.body.bounce.y = settings.players.bounce;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.setSize(20, 32, 5, 16);

  this.sprite.x = 0;

  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
  this.sprite.animations.add('turn', [4], 20, true);
  this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

  return this.sprite;
};


Player.prototype.update = function(){
  var speed = settings.players.speed;
  this.sprite.body.velocity.x = 0;

  if(this.controls.speed.isDown)
    speed = speed*3;

  // Move character left and right
  if(this.controls.left.isDown){
    this.sprite.body.velocity.x = -1*speed;

    if(this.facing != 'left'){
      this.sprite.animations.play('left');
      this.facing = 'left';
    }
  } else if(this.controls.right.isDown){
    this.sprite.body.velocity.x = speed;

    if(this.facing != 'right'){
      this.sprite.animations.play('right');
      this.facing = 'right';
    }
  } else{
    if(this.facing != 'idle') {
      this.sprite.animations.stop();

      if(this.facing == 'left') this.sprite.frame = 0;
      else this.sprite.frame = 5;

      this.facing = 'idle';
    }
  }

  // JUMP!
  if(this.jumpPressed && !this.controls.jump.isDown &&
    this.sprite.body.onFloor()){
      // when releasing jump buton
      this.isJumping = true;
      this.jumpPressed = false;

      if(this.jumpPower >= settings.players.maxJumpPower)
          this.jumpPower = settings.players.maxJumpPower;

      this.sprite.body.velocity.y = -1*(this.jumpPower);
      this.isJumping = false;
      this.jumpPower = 40;
  } else if(this.controls.jump.isDown &&
    this.sprite.body.onFloor()){
      // building power
      this.jumpPressed = true;
      this.jumpPower += 30;
  } else{
    // reset
    this.jumpPower = 0;
  }

  return this.sprite;
};
