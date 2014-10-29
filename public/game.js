var socket = io();
var platformLayer, outieLayer, outieIsHidden = true;
var player, facing = 'left', jumpTimer = 0;


var preload = function(){
  game.load.tilemap('platforms', 'assets/layer-map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/tiles.png');
  game.load.spritesheet('player', 'assets/player.png', 32, 48);
};


var create = function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#000000';
  game.physics.arcade.gravity.y = settings.gravity;

  player = new Player(game, 0);
  player.initCharacter();
  game.physics.enable(player.character, Phaser.Physics.ARCADE);
  player.create();

  var platformMap = game.add.tilemap('platforms');
  platformMap.addTilesetImage('tiles');
  platformMap.setCollisionByExclusion([]);
  platformLayer = platformMap.createLayer('Platforms');

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};


var update = function() {
  game.physics.arcade.collide(player.character, platformLayer);
  player.update();
};


var game = new Phaser.Game(
  1024, 832, Phaser.CANVAS, 'bizarrio',
  { preload : preload, create : create, update : update }
);
