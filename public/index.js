var socket = io();

var map;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var platformLayer;
var outieLayer;
var cursors;
var jumpButton;
var outieIsHidden = true;

var preload = function(){
  game.load.tilemap('platforms', 'assets/platforms.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.tilemap('outie', 'assets/outie.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles-1', 'assets/tiles-1.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
};


var hidePlatform = function(){
  socket.emit('hide-platform');
  outieLayer.visible = false;
};

var showPlatform = function(){
  socket.emit('show-platform');
  outieLayer.visible = true;
};


var create = function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#000000';

  game.physics.arcade.gravity.y = 250;

  player = game.add.sprite(32, 32, 'dude');
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.body.setSize(20, 32, 5, 16);

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('turn', [4], 20, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  var platformMap = game.add.tilemap('platforms');
  var outieMap = game.add.tilemap('outie');
  platformMap.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
  outieMap.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
  platformMap.addTilesetImage('tiles-1');
  outieMap.addTilesetImage('tiles-1');

  platformLayer = platformMap.createLayer('Tile Layer 1');
  outieLayer = outieMap.createLayer('Tile Layer 1');
  platformLayer.debug=true;
  outieLayer.debug=true;
  outieLayer.visible = false;

  game.camera.follow(player);

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


  setInterval(function(){
    outieIsHidden = !outieIsHidden;

    if(outieIsHidden)
      hidePlatform();
    else
      showPlatform();

  }, 5000);
};


var update = function() {
  if(outieIsHidden)
    game.physics.arcade.collide(player, platformLayer);
  else
    game.physics.arcade.collide(player, outieLayer);

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
  800, 600, Phaser.CANVAS, 'bizarrio',
  { preload: preload, create: create, update: update }
);
