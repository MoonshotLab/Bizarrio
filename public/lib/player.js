// { game : game, indice : 5 }
var Player = function(opts){
  this.score        = 0;
  this.sprite       = null;

  this.indice       = opts.indice;
  this.game         = opts.game;

  this.name         = 'Player ' + opts.indice;
  this.facing       = 'right';

  this.controls     = {};

  this.isJumping    = false;
  this.jumpPower    = 0;
  this.jumpPressed  = 0;

  var controlMapping = bizarrio.settings.controls[opts.indice];
  for(var prop in controlMapping){
    var key = controlMapping[prop];
    this.controls[prop] = opts.game.input.keyboard.addKey(Phaser.Keyboard[key]);
  }

  this.sprite = this.game.add.sprite(32, 32, 'player');
  this.sprite.name = 'player-' + opts.indice;

  return this;
};


Player.prototype.create = function(){
  this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.gravity.x = 5;

  this.sprite.body.bounce.y = bizarrio.settings.players.bounce;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.setSize(20, 32, 5, 16);

  this.sprite.x = 400;

  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
  this.sprite.animations.add('turn', [4], 20, true);
  this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

  return this;
};


Player.prototype.update = function(){
  var speed = bizarrio.settings.players.speed;
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
  if(this.jumpPressed && !this.controls.jump.isDown){
      // when releasing jump buton
      this.isJumping = true;
      this.jumpPressed = false;

      if(this.jumpPower >= bizarrio.settings.players.maxJumpPower)
          this.jumpPower = bizarrio.settings.players.maxJumpPower;

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

  this.sprite.body.acceleration.x = 0;

  return this;
};
