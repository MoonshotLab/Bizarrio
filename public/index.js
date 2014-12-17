var bizarrio = {
  gameStarted     : false,
  playersSelected : false,

  socket      : io(),
  game        : null,
  debug       : false,
  project     : false,

  settings    : {
    gameTime        : 180000,
    iceSlickness    : 5000,
    conveyorSpeed   : 12000,
    gravity         : 1100,
    freezeLength    : 3000,
    playerWeight    : 10,
    playerSpeed     : 140,
    playerSpeedBoost: 2,
    playerBounce    : 0,
    playerJumpPow   : 600,

    controls        : [
      {
        'left'  : 'A',
        'right' : 'D',
        'jump'  : 'W',
        'speed' : 'Z'
      },
      {
        'left'  : 'E',
        'right' : 'R',
        'jump'  : 'T',
        'speed' : 'Y'
      },
      {
        'left'  : 'I',
        'right' : 'O',
        'jump'  : 'P',
        'speed' : 'F'
      },
      {
        'left'  : 'H',
        'right' : 'J',
        'jump'  : 'K',
        'speed' : 'L'
      }
    ]
  }
};


$(function(){
  // debug or project mode?
  var urlVars = utils.getUrlVars();
  if(urlVars.indexOf('debug') != -1)
    bizarrio.debug = true;
  if(urlVars.indexOf('project') != -1)
    bizarrio.project = true;

  // player selection screen
  var $playerSelect = $('#player-select');
  $('body').keydown(function(e){
    e.preventDefault();

    // handle number of players toggling
    if(e.keyCode == 32 && !bizarrio.gameStarted && !bizarrio.playersSelected){
      var $selected = $playerSelect.find('.selected');
      $selected.removeClass('selected');

      if($selected.next().length)
        $selected.next().addClass('selected');
      else
        $playerSelect.find('.player-selection:first-child').addClass('selected');
    }

    // handle number of player selection
    if(e.keyCode == 13 && !bizarrio.gameStarted && !bizarrio.playersSelected){
      bizarrio.playersSelected = true;
      $playerSelect.find('.player-selection').not('.selected').addClass('fade');
      setTimeout(function(){
        var $selected = $playerSelect.find('.selected');
        $selected.addClass('fade');
        startGame({ numPlayers : $selected.data('players') });
      }, 1000);
    }
  });
});

var startGame = function(opts){
  // generate players
  var players = [];
  for(var i=0; i<opts.numPlayers; i++){
    players.push({});
  }

  // create game
  bizarrio.game = new Game();
  bizarrio.game.init({ players : players });

  if(bizarrio.debug){
    $('#music')[0].pause();
    $('#scoreboard').hide();
  }
};
