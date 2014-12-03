// { x : 0, y : 0, dir : 'left' || 'right' }
var Snowball = function(opts){
  this.exploded = false;
  this.name = new Date().getTime();

  console.log(opts.dir);

  var yVel = -20;
  var xVel = 600;
  var xPos = opts.x;
  var yPos = opts.y - 20;

  if(opts.dir === 'left'){
    xVel = -500;
    xPos -= 15;
  } else xPos += 15;

  this.sprite = bizarrio.game.interface.add.sprite(xPos, yPos, 'snowball');
  bizarrio.game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.body.setSize(20, 20, 0, 0);
  this.sprite.body.velocity.setTo(xVel, yVel);
  this.sprite.body.collideWorldBounds = false;
  this.sprite.body.gravity.set(0, 150);

  this.sprite.animations.add('smash', [1, 2, 3], 10, false);

  bizarrio.game.snowballManager.add(this);
};


Snowball.prototype.smash = function(){
  var self = this;

  if(!this.exploded){
    this.exploded = true;

    this.sprite.animations.play('smash');
    this.sprite.body.velocity.setTo(0, 0);

    // remove from manager
    setTimeout(function(){
      bizarrio.game.snowballManager.destroy(self);
    }, 10000);
  }
};
