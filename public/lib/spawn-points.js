var SpawnPoints = function(){
  this.points = [];
};


SpawnPoints.prototype.add = function(point){
  this.points.push(point);
};


SpawnPoints.prototype.getRandom = function(){
  var rando = Math.floor(Math.random() * this.points.length);
  return this.points[rando];
};
