var socket = io();
var platformLayer, outieLayer, outieIsHidden = true;
var player, facing = 'left', jumpTimer = 0;
var cursors, jumpButton;


var preload = function(){
  game.load.tilemap('platforms', 'assets/platforms.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.tilemap('outie', 'assets/outie.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tileset', 'assets/tileset.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
};


// Message back to the server, telling it to toggle
// the status of the servo
var toggleOutie = function(){
  outieIsHidden = !outieIsHidden;

  if(outieIsHidden){
    socket.emit('hide-platform');
    outieLayer.visible = false;
  } else{
    socket.emit('show-platform');
    outieLayer.visible = true;
  }
};


var create = function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#000000';
  game.physics.arcade.gravity.y = 500;

  // Player physics and animations
  player = game.add.sprite(32, 32, 'dude');
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.bounce.y = 0.5;
  player.body.collideWorldBounds = true;
  player.body.setSize(20, 32, 5, 16);

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('turn', [4], 20, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  // There's probably a better way to do this,
  var platformMap = game.add.tilemap('platforms');
  var outieMap = game.add.tilemap('outie');

  platformMap.addTilesetImage('tileset');
  outieMap.addTilesetImage('tileset');
  platformMap.setCollisionByExclusion([]);
  outieMap.setCollisionByExclusion([]);

  platformLayer = platformMap.createLayer('Stuff');
  outieLayer = outieMap.createLayer('Stuff');
  outieLayer.visible = false;
  // End, todo better

  // Buttons 'n stuff
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  setInterval(toggleOutie, 1000);
};


var update = function() {
  // Determine which layer to treat as the collision layer
  var collisionLayer = outieIsHidden ? platformLayer : outieLayer;
  game.physics.arcade.collide(player, collisionLayer);

  // Handle player movement
  player.body.velocity.x = 0;

  if (cursors.left.isDown){
    player.body.velocity.x = -150;

    if (facing != 'left'){
      player.animations.play('left');
      facing = 'left';
    }
  } else if (cursors.right.isDown){
    player.body.velocity.x = 150;

    if (facing != 'right'){
      player.animations.play('right');
      facing = 'right';
    }
  } else {
    if (facing != 'idle') {
      player.animations.stop();

      if (facing == 'left')
        player.frame = 0;
      else
        player.frame = 5;

      facing = 'idle';
    }
  }

  if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer){
    player.body.velocity.y = -250;
    jumpTimer = game.time.now + 750;
  }
};


var game = new Phaser.Game(
  160, 160, Phaser.CANVAS, 'bizarrio',
  { preload: preload, create: create, update: update }
);
