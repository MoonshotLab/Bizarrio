var bizarrio = {
  socket    : io(),
  game      : new Game(),
  debug     : true,
  settings  : {
    slickness : 5000,
    gravity : 500,
    players : {
      speed : 90,
      bounce : 0.2,
      maxJumpPower : 360
    },
    controls : [
      {
        'left'  : 'A',
        'right' : 'D',
        'jump'  : 'W',
        'speed' : 'Q'
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

bizarrio.game.init({
  players : [{}]
});
