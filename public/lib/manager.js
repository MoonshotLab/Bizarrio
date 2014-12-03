var Manager = function(){};


Manager.prototype.init = function(){
  this.items = [];
};


Manager.prototype.findByName = function(name){
  var foundItem;

  this.items.forEach(function(item){
    if(item.sprite.name == name)
      foundItem = item;
    });

  return foundItem;
};


Manager.prototype.add = function(item){
  this.items.push(item);
};


Manager.prototype.getSprites = function(){
  var sprites = [];

  this.items.forEach(function(item){
    sprites.push(item.sprite);
  });

  return sprites;
};


Manager.prototype.destroy = function(item){
  this.items = _.without(this.items, item);
  item.sprite.destroy();
  delete(item);
};
