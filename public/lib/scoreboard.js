var Scoreboard = function(players){
  var self = this;
  this.timeLeft = bizarrio.settings.gameTime;

  var $players = $('#scoreboard').find('.players');
  var template = _.template([
    '<li class="<%= cssSelector %>">',
      '<span class="name">',
        '<%= name %>:',
      '</span>',
      '<span class="score">0</span>',
    '</li>'
  ].join(''));

  players.forEach(function(player){
    $players.append(template(player));
  });

  setInterval(function(){
    self.updateTime();
  }, 1000);
};


Scoreboard.prototype.update = function(player){
  var $player = $('#scoreboard').find('.' + player.cssSelector);
  var $selector = $player.find('.score');
  $selector.text(player.score);
};


Scoreboard.prototype.updateTime = function(){
  if(this.timeLeft > 0){
    this.timeLeft -= 1000;
    $('#scoreboard').find('#time-remaining').find('.time')
      .text(utils.formatTime(this.timeLeft));
  } else {
    $('#finished').show();
    bizarrio.game.interface.paused = true;

    var winningPlayer = {};
    bizarrio.game.playerManager.items.forEach(function(player, i){
      if(i === 0) winningPlayer = player;
      if(player.score > winningPlayer.score)
        winningPlayer = player;
    });

    bizarrio.gameStarted = false;

    var liftDoor = function(door, i){
      setTimeout(function(){ door.lift(); }, i*200);
    };

    bizarrio.game.trapDoorManager.items.forEach(function(trapDoor, i){
      liftDoor(trapDoor, i);
    });

    setTimeout(function(){
      $('#finished').find('.' + winningPlayer.cssSelector).addClass('show');
    }, 500);

    setTimeout(function(){
      location.reload();
    }, 4000);
  }
};
