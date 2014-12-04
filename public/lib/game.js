var Game = function(){
  this.playerManager    = new PlayerManager();
  this.coinManager      = new CoinManager();
  this.portalManager    = new PortalManager();
  this.toggleManager    = new ToggleManager();
  this.conveyorManager  = new ConveyorManager();
  this.snowballManager  = new SnowballManager();
  this.trapDoorManager  = new TrapDoorManager();

  this.interface        = null;
  this.map              = null;

  this.layers           = {};
  this.objects          = {};

  return this;
};


// { players : [{}, {}] }
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
  self.interface.load.spritesheet('player', 'assets/player.png', 32, 48);
  self.interface.load.spritesheet('snowball', 'assets/snowball.png', 20, 20);

  self.interface.load.image('platform', 'assets/platform.png');
  self.interface.load.image('trap-door', 'assets/trap-door.png');
  self.interface.load.image('portal', 'assets/portal.png');
  self.interface.load.image('toggle', 'assets/toggle.png');
  self.interface.load.image('coin', 'assets/coin.png');
  self.interface.load.image('ice', 'assets/ice.png');
  self.interface.load.image('waterfall', 'assets/waterfall.png');
  self.interface.load.image('conveyor', 'assets/conveyor.png');
};


Game.prototype.create = function(self, opts){
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

  // init all the interface elements
  if(!bizarrio.debug){
    self._createPlayers(opts.players);
    self._createScoreboard();
  }

  self._createObjects();
};


Game.prototype.update = function(self, opts){
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


Game.prototype._createPlayers = function(players){
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
  this.objects.conveyors = this.interface.add.group();
  this.objects.coins = this.interface.add.group();
  this.objects.snowballs = this.interface.add.group();

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
    var waterfall = new Waterfall({
      game    : self,
      group   : self.objects.waterfalls,
      el      : el,
      indice  : i
    });

    if(!bizarrio.debug) waterfall.scheduleRandomToggle();
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

    if(!bizarrio.debug) conveyor.toggle();
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

  if(!bizarrio.debug) this.coinManager.showRandomCoin();
};
