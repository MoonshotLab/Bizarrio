var PortalManager = function(){
  this.init();
};


PortalManager.prototype = Object.create(Manager.prototype);


PortalManager.prototype.open = function(){
  this.items.forEach(function(portal){
    portal.close();
  });

  var endPointA = this.items[Math.floor(Math.random()*this.items.length)];
  var leftOvers = _.without(this.items, endPointA);
  var endPointB = leftOvers[Math.floor(Math.random()*leftOvers.length)];

  endPointA.open();
  endPointB.open();
};


PortalManager.prototype.transport = function(character, portalSprite){
  var endPointA = this.findByName(portalSprite.name);

  if(endPointA.sprite.alive){
    var leftOvers = _.without(this.items, endPointA);
    var endPointB = null;

    leftOvers.forEach(function(endPoint){
      if(endPoint.sprite.alive) endPointB = endPoint;
    });

    endPointA.close();
    endPointB.close();

    character.x = endPointB.sprite.x + endPointB.sprite.width/2;
    character.y = endPointB.sprite.y - character.height;
  }
};
