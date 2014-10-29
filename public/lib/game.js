// Options
  // players : [{ name : 'Joe' }]
var Game = function(opts){
  this.interface = null;
  this.staticMap = null;
  this.players = [];

  return this;
};


Game.prototype.init = function(opts){
  var self = this;

  this.interface = new Phaser.Game(
    1920, 1560, Phaser.CANVAS, 'bizarrio',
    { preload : function(){
      self.preload(self, opts);
    }, create : function(){
      self.create(self, opts);
    }, update : function(){
      self.update(self, opts);
    }
  });
};


Game.prototype.preload = function(self, opts){
  self.interface.load.tilemap('platforms', 'assets/layer-map.json', null, Phaser.Tilemap.TILED_JSON);
  self.interface.load.spritesheet('player', 'assets/player.png', 32, 48);
  self.interface.load.image('red', 'assets/red.png');
};


Game.prototype.create = function(self, opts){
  // start physics and gravity
  self.interface.physics.startSystem(Phaser.Physics.ARCADE);
  self.interface.stage.backgroundColor = '#000000';
  self.interface.physics.arcade.gravity.y = settings.gravity;

  // create all the players
  for(var i=0; i<opts.players.length; i++){
    var player = new Player(self.interface, i);
    player.initCharacter();
    self.interface.physics.enable(player.character, Phaser.Physics.ARCADE);
    player.create();
    self.players.push(player);
  }

  // Create the map and the layer to hold collisions
  var platformMap = self.interface.add.tilemap('platforms');
  platformMap.addTilesetImage('red');
  platformMap.setCollisionByExclusion([]);

  self.staticMap = platformMap.createLayer('platforms');
};


Game.prototype.update = function(self, opts){
  var characters = [];
  self.players.forEach(function(player){
    characters.push(player.character);
  });

  self.interface.physics.arcade.collide(characters, self.staticMap);

  self.players.forEach(function(player){
    self.interface.physics.arcade.collide(characters, player.character);
    player.update();
  });
};
