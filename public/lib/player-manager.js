var PlayerManager = function(){
  this.init();
};


PlayerManager.prototype = Object.create(Manager.prototype);


PlayerManager.prototype.score = function(name){
  var scoringPlayer = this.findByName(name);

  if(scoringPlayer){
    scoringPlayer.score++;
    this.trigger('score', scoringPlayer);
  }
};


MicroEvent.mixin(PlayerManager);
