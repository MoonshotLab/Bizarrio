var Scoreboard = function(players){
  var $players = $('#scoreboard').find('.players');
  var template = _.template([
    '<li class="player-<%= indice %>">',
      '<span class="name">',
        '<%= name %>:',
      '</span>',
      '<span class="score"></span>',
    '</li>'
  ].join(''));

  players.forEach(function(player){
    $players.append(template(player));
  });
};


Scoreboard.prototype.update = function(player){
  console.log(player);
  var $player = $('#scoreboard').find('.player-' + player.indice);
  console.log($player);
  var $selector = $player.find('.score');
  $selector.text(player.score);

};
