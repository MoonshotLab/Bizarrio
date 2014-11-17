var ToggleManager = function(){
  this.toggles = [];
};


ToggleManager.prototype.findByName = function(name){
  var foundToggle;

  this.toggles.forEach(function(toggle){
    if(toggle.sprite.name == name)
      foundToggle = toggle;
  });

  return foundToggle;
};


ToggleManager.prototype.add = function(toggle){
  this.toggles.push(toggle);
};


ToggleManager.prototype.activate = function(character, toggle){
  var selectedToggle = this.findByName(toggle.name);
  if(selectedToggle.actionable){
    selectedToggle.activate();
    this.trigger('activated', { state : selectedToggle.state });
  }
};


MicroEvent.mixin(ToggleManager);
