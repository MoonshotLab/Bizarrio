// TODO:
// destroy self after getting hit
// animate sprite when hitting
// animate player when hitting
// knockdown player based on snowball direction

// { x : 0, y : 0, dir : 1 || 2 }
var Snowball = function(opts){
  this.name = new Date().getTime();

  var yVel = -20;
  var xVel = 600;
  var xPos = opts.x;
  var yPos = opts.y - 20;

  if(opts.dir === 1){
    xVel = -500;
    xPos -= 15;
  } else xPos += 15;

  this.sprite = bizarrio.game.interface.add.sprite(xPos, yPos, 'snowball');
  bizarrio.game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.body.velocity.setTo(xVel, yVel);
  this.sprite.body.collideWorldBounds = false;
  this.sprite.body.gravity.set(0, 150);

  bizarrio.game.snowballManager.add(this);
};


Snowball.prototype.smash = function(){
  console.log('smash');
};
