var PlayerManager = function(){
  this.players = [];
};


PlayerManager.prototype.findByName = function(name){
  var foundPlayer;

  this.players.forEach(function(player){
    if(player.sprite.name == name)
      foundPlayer = player;
  });

  return foundPlayer;
};


PlayerManager.prototype.add = function(player){
  this.players.push(player);
};


PlayerManager.prototype.getSprites = function(){
  var sprites = [];

  this.players.forEach(function(player){
    sprites.push(player.sprite);
  });

  return sprites;
};


PlayerManager.prototype.score = function(name){
  var scoringPlayer = this.findByName(name);

  if(scoringPlayer){
    scoringPlayer.score++;
    this.trigger('score', scoringPlayer);
  }
};


MicroEvent.mixin(PlayerManager);
