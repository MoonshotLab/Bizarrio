var Game = function(){
  this.playerManager  = new PlayerManager();
  this.coinManager    = new CoinManager();
  this.portalManager  = new PortalManager();
  this.toggleManager  = new ToggleManager();

  this.interface      = null;
  this.map            = null;

  this.layers         = {};
  this.objects        = {};

  return this;
};


// { players : [{}, {}] }
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
    self.interface.load.image('portal', 'assets/portal.png');
    self.interface.load.image('toggle', 'assets/toggle.png');
    self.interface.load.image('gold', 'assets/gold.png');
    self.interface.load.image('ice', 'assets/ice.png');
    self.interface.load.image('waterfall', 'assets/waterfall.png');
  }
};


Game.prototype.create = function(self, opts){
  // start physics, gravity, collision mapping, and create
  // the static platform mappings
  self.interface.physics.startSystem(Phaser.Physics.ARCADE);
  self.interface.physics.arcade.gravity.y = bizarrio.settings.gravity;
  self.map = self.interface.add.tilemap('platforms');
  self.layers.platforms = self.map.createLayer('platforms');
  self.map.setCollisionByExclusion([]);

  // color the platforms if in debug mose
  if(bizarrio.debug)
    self.map.addTilesetImage('red');

  // init all the interface elements
  self._createPlayers(opts.players);
  self._createScoreboard();
  self._createObjects();
};


Game.prototype.update = function(self, opts){
  self.interface.physics.arcade.collide(self.characters, self.layers.platforms);
  self.interface.physics.arcade.collide(self.characters, self.objects.trapDoors);
  self.interface.physics.arcade.overlap(self.characters, self.objects.toggles,
    function(character, toggle){
      self.toggleManager.activate(character, toggle);
    }
  );
  self.interface.physics.arcade.overlap(self.characters, self.objects.toggles,
    function(character, toggle){
      self.toggleManager.activate(character, toggle);
    }
  );
  self.interface.physics.arcade.collide(self.characters, self.objects.portals,
    function(character, portal){
      self.portalManager.transport(character, portal);
    }
  );
  self.interface.physics.arcade.overlap(
    self.characters, self.objects.coins, function(sprite1, sprite2){
      if(self.coinManager.collect(sprite2.name))
        self.playerManager.score(sprite1.name);
    }
  );
  self.playerManager.players.forEach(function(player){
    self.interface.physics.arcade.collide(self.characters, player.sprite);
    player.update();
  });

  self.interface.physics.arcade.collide(self.characters, self.objects.ice,
    Ice.prototype.slide);
  self.interface.physics.arcade.overlap(self.characters, self.objects.waterfalls,
    Waterfall.prototype.freeze);
};


Game.prototype._createPlayers = function(players){
  var self = this;

  players.forEach(function(player, i){
    var instance = new Player({
      indice  : i,
      game    : self.interface
    });

    self.playerManager.add(instance.create());
  });

  self.characters = self.playerManager.getSprites();
};


Game.prototype._createScoreboard = function(){
  var scoreboard = new Scoreboard(this.playerManager.players);
  this.playerManager.bind('score', scoreboard.update);
};


Game.prototype._createObjects = function(){
  var self = this;

  // make the trap doors
  this.objects.trapDoors = this.interface.add.group();
  this.map.objects['trap-doors'].forEach(function(el, i){
    if(i === 0 || i === 1 || i === 2 ){
    var trapDoor = new TrapDoor(self, self.objects.trapDoors, el);
    setTimeout(function(){
      trapDoor.toggle({ timer : 3000 });
    }, i*1500);
    }
  });

  // make the portals
  this.objects.portals = this.interface.add.group();
  this.map.objects.portals.forEach(function(el, i){
    var portal = new Portal(self, self.objects.portals, el, i);
    self.portalManager.add(portal);
  });

  // make the ice
  this.objects.ice = this.interface.add.group();
  this.map.objects.ice.forEach(function(el, i){
    new Ice(self, self.objects.ice, el, i);
  });

  // make the toggles
  this.objects.toggles = this.interface.add.group();
  this.map.objects.toggles.forEach(function(el, i){
    var toggle = new Toggle(self, self.objects.toggles, el, i);
    self.toggleManager.add(toggle);
  });
  this.toggleManager.bind('activated', function(){
    self.portalManager.open();
  });

  // make the waterfalls
  this.objects.waterfalls = this.interface.add.group();
  this.map.objects.waterfalls.forEach(function(el, i){
    new Waterfall(self, self.objects.waterfalls, el, i);
  });

  // make the coins
  this.objects.coins = this.interface.add.group();
  this.map.objects.coins.forEach(function(el, i){
    var coin = new Coin(self, self.objects.coins, el, i);
    self.coinManager.add(coin);

    if(i === 0) coin.toggle();
  });
};
