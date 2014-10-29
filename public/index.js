var bizarrio = {
  socket  : io(),
  game    : new Game()
};

bizarrio.game.init({
  players : [
    { name : 'Joe' },
    { name : 'Ricky' }
  ]
});
