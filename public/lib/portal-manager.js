var PortalManager = function(){
  this.portals = [];
};


PortalManager.prototype.findByName = function(name){
  var foundPortal;

  this.portals.forEach(function(portal){
    if(portal.sprite.name == name)
      foundPortal = portal;
  });

  return foundPortal;
};


PortalManager.prototype.add = function(portal){
  this.portals.push(portal);
};


PortalManager.prototype.open = function(){
  this.portals.forEach(function(portal){
    portal.close();
  });

  var endPointA = this.portals[Math.floor(Math.random()*this.portals.length)];
  var leftOvers = _.without(this.portals, endPointA);
  var endPointB = leftOvers[Math.floor(Math.random()*leftOvers.length)];

  endPointA.open();
  endPointB.open();
};


PortalManager.prototype.transport = function(character, portalSprite){
  var endPointA = this.findByName(portalSprite.name);

  if(endPointA.isOpen){
    var leftOvers = _.without(this.portals, endPointA);
    var endPointB = leftOvers[Math.floor(Math.random()*leftOvers.length)];

    endPointA.close();
    endPointB.close();

    character.x = endPointB.sprite.x + endPointB.sprite.width/2;
    character.y = endPointB.sprite.y - character.height;
  }
};
