var bizarrio = {
  socket  : io(),
  game    : new Game(),
  debug   : true
};

bizarrio.game.init({
  players : [{}]
});
