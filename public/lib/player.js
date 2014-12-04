// { game : game, indice : 5 }
var Player = function(opts){
  this.score        = 0;
  this.name         = 'Player ' + opts.indice;
  this.cssSelector  = 'player-' + opts.indice;
  this.facing       = 'right';

  // keep track of jumping
  this.jumpPower    = 0;
  this.jumpPressed  = 0;

  // set up controls
  this.controls = {};
  var controlMapping = bizarrio.settings.controls[opts.indice];
  for(var prop in controlMapping){
    var key = controlMapping[prop];
    this.controls[prop] = opts.game.input.keyboard.addKey(Phaser.Keyboard[key]);
  }

  // create the sprite and enable gravity
  this.sprite = opts.game.add.sprite(825, 570, 'player');
  opts.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  // set a bunch of sprite attributes
  this.sprite.name = 'player-' + opts.indice;
  this.sprite.body.bounce.y = bizarrio.settings.playerBounce;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.setSize(20, 32, 5, 16);
  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
  this.sprite.animations.add('turn', [4], 20, true);
  this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
  this.sprite.animations.add('frozen', [9], 10, false);
  this.sprite.animations.add('smacked', [10, 11], 5, false);

  // keep track of external set states
  // yes, isFrozen is listed twice
  this.freezeTimer      = null;
  this.snowballed       = false;
  this.isFrozen         = false;
  this.sprite.isFrozen  = false;
  this.sprite.conveyor  = false;
  this.sprite.onIce     = false;

  this.attachActions();

  return this;
};


Player.prototype.update = function(){
  var speed = bizarrio.settings.playerSpeed;

  // disable controls if frozen or snowballed
  if(!this.isFrozen){

    // if not on ice, play normally
    if(!this.sprite.onIce){
      // stop!!!
      this.sprite.body.velocity.x = 0;

      // speed boost
      if(this.controls.speed.isDown)
        speed = speed*bizarrio.settings.playerSpeedBoost;

      // handle basic movement
      if(this.controls.left.isDown) this.actions.moveLeft(speed);
      else if(this.controls.right.isDown) this.actions.moveRight(speed);
      else this.sprite.animations.stop();
    }

    // handle jumping and resetting
    if(this.jumpPressed && !this.controls.jump.isDown) this.actions.jump();
    else if(this.controls.jump.isDown) this.actions.buildJumpPower();
    else this.jumpPower = 0;
  }

  // reset acceleration
  this.sprite.body.acceleration.x = 0;

  // handle collision modifications
  if(this.sprite.conveyor) this.actions.onConveyor();
  if(this.sprite.onIce) this.actions.onIce();
  if(this.sprite.isFrozen) this.actions.freeze();

  // reset attrs set by collisions
  this.sprite.conveyor = false;
  this.sprite.onIce = false;
  this.sprite.isFrozen = false;

  return this;
};


Player.prototype.hitByPitch = function(){
  var self = this;

  if(!this.snowballed){
    this.sprite.animations.play('smacked');
    this.snowballed = true;

    setTimeout(function(){
      self.sprite.animations.play('turn');
      self.snowballed = false;
    }, 2000);
  }
};


Player.prototype.attachActions = function(){
  var self = this;
  this.actions = {};

  this.actions.jump = function(){
    self.jumpPressed = false;

    if(self.sprite.body.touching.down || self.sprite.body.onFloor()){
      if(self.jumpPower >= bizarrio.settings.playerJumpPow)
        self.jumpPower = bizarrio.settings.playerJumpPow;

      self.sprite.body.velocity.y = -1*(self.jumpPower);
      self.jumpPower = 40;
    }
  };

  this.actions.fireSnowball = function(){
    if(!self.isFrozen){
      var body = self.sprite.body;
      var snowball = new Snowball({
        x   : body.x,
        y   : body.y,
        dir : self.facing
      });
    }
  };

  this.actions.buildJumpPower = function(){
    self.jumpPressed = true;
    self.jumpPower += 60;
  };

  this.actions.moveLeft = function(speed){
    self.sprite.body.velocity.x = -1*speed;
    self.sprite.animations.play('left');
    self.facing = 'left';
  };

  this.actions.slideLeft = function(){
    self.sprite.body.velocity.x-=3;
    self.sprite.animations.play('left');
    self.facing = 'left';
  };

  this.actions.moveRight = function(speed){
    self.sprite.body.velocity.x = speed;
    self.sprite.animations.play('right');
    self.facing = 'right';
  };

  this.actions.slideRight = function(){
    self.sprite.body.velocity.x+=3;
    self.sprite.animations.play('right');
    self.facing = 'right';
  };

  this.actions.onConveyor = function(){
    var accel = self.sprite.conveyor.accel;

    if(self.isFrozen) self.sprite.body.velocity.x = 0;
    if(self.sprite.conveyor.dir == 'left')
      accel = accel*-1;

    self.sprite.body.acceleration.x = accel;
  };

  this.actions.freeze = function(){
    self.isFrozen = true;
    clearTimeout(self.freezeTimer);

    self.sprite.animations.play('frozen');

    // don't immediately stop, otherwise you'll get stuck
    // in the watefall forever
    setTimeout(function(){
      self.sprite.body.acceleration.x = 0;
    }, 150);

    self.freezeTimer = setTimeout(function(){
      self.isFrozen = false;
      self.sprite.animations.play('turn');
    }, bizarrio.settings.freezeLength);
  };

  this.actions.onIce = function(){
    self.sprite.onIce = true;

    if(self.controls.left.isDown) self.actions.slideLeft();
    else if(self.controls.right.isDown) self.actions.slideRight();

  };

  this.controls.speed.onDown.add(this.actions.fireSnowball, this);
};
