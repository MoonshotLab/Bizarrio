// Options
  // players : [{ name : 'Joe' }]
var Game = function(opts){
  this.interface = null;
  this.layers = { platforms : null };
  this.map = null;
  this.players = [];
  this.obstacles = null;

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
  self.interface.load.tilemap('trap-doors', 'assets/layer-map.json', null, Phaser.Tilemap.TILED_JSON);
  self.interface.load.spritesheet('player', 'assets/player.png', 32, 48);
  self.interface.load.image('red', 'assets/red.png');
  self.interface.load.image('trap-door', 'assets/trap-door.png');
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

  // create the map and the layer to hold collisions
  self.map = self.interface.add.tilemap('platforms');
  self.map.addTilesetImage('red');
  self.map.setCollisionByExclusion([]);

  // find the trap doors, make them each an instance
  self.interface.obstacles = self.interface.add.group();

  self.map.objects['trap-doors'].forEach(function(el, i){
    var trapDoor = new TrapDoor(self, self.interface.obstacles, el);
    setTimeout(function(){
      trapDoor.toggle({ timer : 1000 });
    }, i*250);
  });

  self.layers.platforms = self.map.createLayer('platforms');
};


Game.prototype.update = function(self, opts){
  var characters = [];
  self.players.forEach(function(player){
    characters.push(player.character);
  });

  self.interface.physics.arcade.collide(characters, self.layers.platforms);
  self.interface.physics.arcade.collide(characters, self.interface.obstacles);

  self.players.forEach(function(player){
    self.interface.physics.arcade.collide(characters, player.character);
    player.update();
  });
};
