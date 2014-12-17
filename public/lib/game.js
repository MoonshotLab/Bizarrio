var Game = function(){
  this.waterfall        = null;
  this.fan              = null;

  this.spawnPoints      = new SpawnPoints();
  this.playerManager    = new PlayerManager();
  this.coinManager      = new CoinManager();
  this.portalManager    = new PortalManager();
  this.toggleManager    = new ToggleManager();
  this.conveyorManager  = new ConveyorManager();
  this.snowballManager  = new SnowballManager();
  this.trapDoorManager  = new TrapDoorManager();

  this.interface        = null;
  this.map              = null;
  this.sounds           = {};

  this.layers           = {};
  this.objects          = {};

  return this;
};


Game.prototype.init = function(opts){
  var self = this;

  this.interface = new Phaser.Game(
    2320, 1760, Phaser.CANVAS, 'bizarrio',
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
  self.interface.load.spritesheet('player-1', 'assets/player-1.png', 150, 150);
  self.interface.load.spritesheet('player-2', 'assets/player-2.png', 150, 150);
  self.interface.load.spritesheet('player-3', 'assets/player-3.png', 150, 150);
  self.interface.load.spritesheet('player-4', 'assets/player-4.png', 150, 150);
  self.interface.load.spritesheet('snowball', 'assets/snowball.png', 20, 20);
  self.interface.load.image('spawn-point', 'assets/spawn-point.png');

  self.interface.load.audio('dead', 'assets/sounds/dead.mp3');
  self.interface.load.audio('frozen', 'assets/sounds/frozen.mp3');
  self.interface.load.audio('hit', 'assets/sounds/hit.mp3');
  self.interface.load.audio('jump', 'assets/sounds/jump.mp3');
  self.interface.load.audio('throw', 'assets/sounds/throw.mp3');

  if(bizarrio.project || bizarrio.debug){
    self.interface.load.image('platform', 'assets/platform.png');
    self.interface.load.image('trap-door', 'assets/trap-door.png');
    self.interface.load.image('portal', 'assets/portal.png');
    self.interface.load.image('toggle', 'assets/toggle.png');
    self.interface.load.image('coin', 'assets/coin.png');
    self.interface.load.image('ice', 'assets/ice.png');
    self.interface.load.image('waterfall', 'assets/waterfall.png');
    self.interface.load.image('conveyor', 'assets/conveyor.png');
    self.interface.load.image('fan', 'assets/fan.png');
  } else {
    self.interface.load.image('platform', 'assets/platform-black.png');
    self.interface.load.image('trap-door', 'assets/trap-door-black.png');
    self.interface.load.image('portal', 'assets/portal-black.png');
    self.interface.load.image('toggle', 'assets/toggle-black.png');
    self.interface.load.image('coin', 'assets/coin-black.png');
    self.interface.load.image('ice', 'assets/ice-black.png');
    self.interface.load.image('waterfall', 'assets/waterfall-black.png');
    self.interface.load.image('conveyor', 'assets/conveyor-black.png');
    self.interface.load.image('fan', 'assets/fan-black.png');
  }
};


Game.prototype.create = function(self, opts){
  // scale map to fit
  self.interface.scale.height = 853;
  self.interface.scale.width = 1125;
  self.interface.scale.refresh();

  // add sounds
  self.sounds.dead    = self.interface.add.audio('dead');
  self.sounds.frozen  = self.interface.add.audio('frozen');
  self.sounds.hit     = self.interface.add.audio('hit');
  self.sounds.jump    = self.interface.add.audio('jump');
  self.sounds.throw   = self.interface.add.audio('throw');

  // start physics, gravity, collision mapping, and create
  // the static platform mappings
  self.interface.physics.startSystem(Phaser.Physics.ARCADE);
  self.interface.physics.arcade.gravity.y = bizarrio.settings.gravity;
  self.map = self.interface.add.tilemap('platforms');
  self.layers.platforms = self.map.createLayer('platforms');
  self.map.setCollisionByExclusion([]);

  // color the platforms if in debug mode
  if(bizarrio.project || bizarrio.debug)
    self.map.addTilesetImage('platform');

  self._createObjects();
};


Game.prototype.update = function(self, opts){
  self.characters = self.playerManager.getAliveSprites();

  // Platforms
  self.interface.physics.arcade.collide(self.characters, self.layers.platforms);

  // Trap Doors
  self.interface.physics.arcade.collide(
    self.characters, self.objects.trapDoors,
    function(character, trapDoor){
      var door = self.trapDoorManager.findByName(trapDoor.name);
      door.playerCollide();
    }
  );
  // Only collect snow if not in debug mode
  if(!bizarrio.debug && bizarrio.gameStarted)
    self.trapDoorManager.addWeight();

  // Toggles
  self.interface.physics.arcade.overlap(
    self.characters, self.objects.toggles,
    function(character, toggle){
      self.toggleManager.activate(character, toggle);
    }
  );

  // Portals
  self.interface.physics.arcade.collide(
    self.characters, self.objects.portals,
    function(character, portal){
      self.portalManager.transport(character, portal);
    }
  );

  // Coins
  self.interface.physics.arcade.overlap(
    self.characters, self.objects.coins, function(player, coin){
      if(self.coinManager.collect(coin.name))
        self.playerManager.score(player.name);
    }
  );

  // Ice
  self.interface.physics.arcade.collide(self.characters, self.objects.ice,
    function(character, ice){ character.onIce = true; }
  );

  // Waterfall
  self.interface.physics.arcade.overlap(self.characters, self.objects.waterfalls,
    function(character, waterfall){
      if(waterfall.alive) character.isFrozen = true;
    }
  );

  // Conveyor Belts
  self.interface.physics.arcade.collide(self.characters, self.objects.conveyors,
    function(character, conveyor){
      character.conveyor = {
        dir   : conveyor.direction,
        accel : conveyor.speed
      };
    }
  );

  // Snowballs
  self.interface.physics.arcade.overlap(
    self.characters, self.objects.snowballs, function(playerSprite, snowballSprite){
      var player   = self.playerManager.findByName(playerSprite.name);
      var snowball = self.snowballManager.findByName(snowballSprite.name);
      snowball.smash();
      player.hitByPitch();
    });

  // Player Updating
  self.playerManager.items.forEach(function(player){
    self.interface.physics.arcade.collide(self.characters, player.sprite);
    player.update();
  });
};


// { players : [{}, {}] }
Game.prototype.createPlayers = function(players){
  var self = this;

  players.forEach(function(player, i){
    self.playerManager.add(
      new Player({
        indice  : i,
        game    : self.interface
      })
    );
  });

  self.characters = self.playerManager.getSprites();
};


Game.prototype.start = function(){
  this.coinManager.showRandomCoin();
  this.waterfall.scheduleRandomToggle();
  this.fan.scheduleRandomToggle();
  this._createScoreboard();

  this.conveyorManager.items.forEach(function(conveyor){
    conveyor.toggle();
  });
};


Game.prototype._createScoreboard = function(){
  var scoreboard = new Scoreboard(this.playerManager.items);
  this.playerManager.bind('score', scoreboard.update);
};


Game.prototype._createObjects = function(){
  var self = this;

  this.objects.trapDoors = this.interface.add.group();
  this.objects.portals = this.interface.add.group();
  this.objects.fans = this.interface.add.group();
  this.objects.ice = this.interface.add.group();
  this.objects.toggles = this.interface.add.group();
  this.objects.waterfalls = this.interface.add.group();
  this.objects.conveyors = this.interface.add.group();
  this.objects.coins = this.interface.add.group();
  this.objects.snowballs = this.interface.add.group();

  // add spawn points
  this.map.objects.spawnPoints.forEach(function(el, i){
    self.spawnPoints.add({ x : el.x, y : el.y - 150 });
  });

  // make the trap doors
  this.map.objects.trapDoors.forEach(function(el, i){
    var trapDoor = new TrapDoor({
      game    : self,
      group   : self.objects.trapDoors,
      el      : el,
      indice  : i
    });

    self.trapDoorManager.add(trapDoor);
  });
  self.trapDoorManager.columnify();

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
    self.waterfall = new Waterfall({
      game    : self,
      group   : self.objects.waterfalls,
      el      : el,
      indice  : i
    });
  });

  // make the conveyors
  this.map.objects.conveyors.forEach(function(el, i){
    var conveyor = new Conveyor({
      game    : self,
      group   : self.objects.conveyors,
      el      : el,
      indice  : i
    });

    self.conveyorManager.add(conveyor);
  });

  // make the fans
  this.map.objects.fans.forEach(function(el, i){
    self.fan = new Fan({
      game    : self,
      group   : self.objects.fans,
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
  });
};
