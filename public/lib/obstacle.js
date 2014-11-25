// Pass in params like this -
// {
//    el      :
//    indice  :
//    group   :
//    game    :
// }

var Obstacle = function(){};

Obstacle.prototype.init = function(opts){
  // check for errors in object initting
  if(!this.type) console.error('Obstacles must define a type');
  if(!opts.el || !opts.group || !opts.game || opts.indice === undefined){
    console.error(
      'Missing a require paramater for obstacle. `el`, `indice`, `group`, and',
      'and `game` are required'
    );
  }

  // creat the sprite
  var y = opts.y || opts.el.y - opts.game.map.tileHeight;
  this.sprite = opts.group.create(opts.el.x, y, opts.imagePath);

  // set the sprite name
  this.name = this.type + '-' + opts.indice;
  this.sprite.name = this.name;

  // default gravity settings
  opts.game.interface.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
  this.sprite.body.immovable = true;

  // save hardware pin so we can send to server later
  // report to the server so it can prepare the arduino
  this.pin = opts.el.properties.pin;
  bizarrio.socket.emit('register-hardware', {
    'type'  : this.type,
    'pin'   : this.pin
  });

  return this;
};
