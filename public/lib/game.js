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
  self.playerManager.items.forEach(function(player){
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
  var scoreboard = new Scoreboard(this.playerManager.items);
  this.playerManager.bind('score', scoreboard.update);
};


Game.prototype._createObjects = function(){
  var self = this;

  this.objects.trapDoors = this.interface.add.group();
  this.objects.portals = this.interface.add.group();
  this.objects.ice = this.interface.add.group();
  this.objects.toggles = this.interface.add.group();
  this.objects.waterfalls = this.interface.add.group();
  this.objects.coins = this.interface.add.group();

  // make the trap doors
  this.map.objects.trapDoors.forEach(function(el, i){
    var trapDoor = new TrapDoor({
      game    : self,
      group   : self.objects.trapDoors,
      el      : el,
      indice  : i
    });

    setTimeout(function(){
      trapDoor.toggle({ timer : 3000 });
    }, i*1500);
  });

  // make the portals
  this.map.objects.portals.forEach(function(el, i){
    var portal = new Portal({
      game    : self,
      group   : self.objects.portals,
      el      : el,
      indice  : i
    });

    self.portalManager.add(portal);
  });

  // make the ice
  this.map.objects.ice.forEach(function(el, i){
    new Ice({
      game    : self,
      group   : self.objects.ice,
      el      : el,
      indice  : i
    });
  });

  // make the toggles
  this.map.objects.toggles.forEach(function(el, i){
    var toggle = new Toggle({
      game    : self,
      group   : self.objects.toggles,
      el      : el,
      indice  : i
    });
    self.toggleManager.add(toggle);
  });
  this.toggleManager.bind('activated', function(){
    self.portalManager.open();
  });

  // make the waterfalls
  this.map.objects.waterfalls.forEach(function(el, i){
    new Waterfall({
      game    : self,
      group   : self.objects.waterfalls,
      el      : el,
      indice  : i
    });
  });

  // make the coins
  this.map.objects.coins.forEach(function(el, i){
    var coin = new Coin({
      game    : self,
      group   : self.objects.coins,
      el      : el,
      indice  : i
    });

    self.coinManager.add(coin);

    if(i === 0) coin.toggle();
  });
};
