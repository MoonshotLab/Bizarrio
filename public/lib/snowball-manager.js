var SnowballManager = function(){
  this.init();
};


SnowballManager.prototype = Object.create(Manager.prototype);


SnowballManager.prototype.add = function(snowball){
  this.items.push(snowball);
  bizarrio.game.objects.snowballs.add(snowball.sprite);
};
