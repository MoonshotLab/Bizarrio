var ToggleManager = function(){
  this.init();
};


ToggleManager.prototype = Object.create(Manager.prototype);


ToggleManager.prototype.activate = function(character, toggle){
  var selectedToggle = this.findByName(toggle.name);
  if(selectedToggle.actionable){
    selectedToggle.activate();
    this.trigger('activated', { state : selectedToggle.state });
  }
};


MicroEvent.mixin(ToggleManager);
