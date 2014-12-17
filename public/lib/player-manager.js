var PlayerManager = function(){
  this.init();
};


PlayerManager.prototype = Object.create(Manager.prototype);


PlayerManager.prototype.score = function(name){
  var scoringPlayer = this.findByName(name);

  if(scoringPlayer){
    scoringPlayer.score++;
    bizarrio.game.jingleBell.toggle();
    this.trigger('score', scoringPlayer);
  }
};


PlayerManager.prototype.add = function(item){
  var self = this;

  this.items.push(item);
  item.bind('score', function(player){
    self.trigger('score', player);
  });
};


MicroEvent.mixin(PlayerManager);
