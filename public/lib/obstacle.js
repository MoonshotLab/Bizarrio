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

  // create the sprite
  var y = opts.y || opts.el.y - opts.game.map.tileHeight;
  this.sprite = opts.group.create(opts.el.x, y, opts.imagePath);

  // set the sprite name
  this.name = this.type + '-' + opts.indice;
  this.sprite.name = this.name;

  // set the state to disabled
  this.sprite.alive = false;
  this.sprite.alpha = 0.25;

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

  if(bizarrio.debug){
    var self = this;
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(function(){
      self.toggle();
    }, this);
  }

  return this;
};


Obstacle.prototype.toggle = function(){
  this.sprite.alive = this.sprite.alive ? false : true;

  var state = 'lo';
  if(this.sprite.alive){
    this.sprite.alpha = 1;
    state = 'hi';
  } else this.sprite.alpha = 0.25;

  bizarrio.socket.emit('update-hardware', {
    pin : this.pin, type : this.type, state : state
  });
};
