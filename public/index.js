var bizarrio = {
  socket      : io(),
  game        : new Game(),
  debug       : false,
  project     : true,

  settings    : {
    iceSlickness    : 5000,
    conveyorSpeed   : 7000,
    gravity         : 500,
    freezeLength    : 3000,
    playerSpeed     : 90,
    playerSpeedBoost: 1.5,
    playerBounce    : 0,
    playerJumpPow   : 360,

    controls        : [
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
