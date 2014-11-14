// Options
  // players : [{ name : 'Joe' }]
var Game = function(opts){
  this.interface = null;
  this.layers = { platforms : null };

  this.map = null;
  this.playerManager  = new PlayerManager();
  this.coinManager    = new CoinManager();
  this.obstacles      = null;

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

  if(bizarrio.debug){
    self.interface.load.image('red', 'assets/red.png');
    self.interface.load.image('trap-door', 'assets/trap-door.png');
    self.interface.load.image('gold', 'assets/gold.png');
  }
};


Game.prototype.create = function(self, opts){
  // start physics and gravity
  self.interface.physics.startSystem(Phaser.Physics.ARCADE);
  self.interface.stage.backgroundColor = '#000000';
  self.interface.physics.arcade.gravity.y = settings.gravity;

  // create all the players
  for(var i=0; i<opts.players.length; i++){
    var player = new Player(self.interface, i);
    self.interface.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    player.create();
    self.playerManager.add(player);
  }

  // create the static map
  self.map = self.interface.add.tilemap('platforms');
  self.map.setCollisionByExclusion([]);
  if(bizarrio.debug)
    self.map.addTilesetImage('red');

  // find the trap doors, make them each an instance
  self.interface.obstacles = self.interface.add.group();
  self.map.objects['trap-doors'].forEach(function(el, i){
    var trapDoor = new TrapDoor(self, self.interface.obstacles, el);
    setTimeout(function(){
      trapDoor.toggle({ timer : 1000 });
    }, i*250);
  });

  // find the coins, make each an instance, add to coin manager
  self.interface.coins = self.interface.add.group();
  self.map.objects.coins.forEach(function(el, i){
    var coin = new Coin(self, self.interface.coins, el, i);
    self.coinManager.add(coin);

    if(i === 0) coin.toggle();
  });

  self.layers.platforms = self.map.createLayer('platforms');
};


Game.prototype.update = function(self, opts){
  var characters = this.playerManager.getSprites();

  self.interface.physics.arcade.collide(characters, self.layers.platforms);
  self.interface.physics.arcade.collide(characters, self.interface.obstacles);

  self.interface.physics.arcade.overlap(
    characters, self.interface.coins, function(sprite1, sprite2){
      if(self.coinManager.collect(sprite2.name))
        self.playerManager.score(sprite1.name);
    }
  );

  self.playerManager.players.forEach(function(player){
    self.interface.physics.arcade.collide(characters, player.sprite);
    player.update();
  });
};
