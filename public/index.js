var bizarrio = {
  socket  : io(),
  game    : new Game(),
  debug   : false
};

bizarrio.game.init({
  players : [
    { name : 'Joe' },
    { name : 'Ricky' }
  ]
});
