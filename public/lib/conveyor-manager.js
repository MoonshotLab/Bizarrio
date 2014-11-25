var ConveyorManager = function(){
  this.init();
};


ConveyorManager.prototype = Object.create(Manager.prototype);


ConveyorManager.prototype.accelerate = function(character, conveyor){
  var selectedConveyor = this.findByName(conveyor.name);
  var accel = bizarrio.settings.conveyorSpeed;
  if(selectedConveyor.direction == 'left') accel = -1*accel;

  character.body.acceleration.x = accel;
};
