var TrapDoorManager = function(){
  this.init();
  this.columnCount = 0;
  this.iterations = 0;
  this.snowFrequency = 30;
};


TrapDoorManager.prototype = Object.create(Manager.prototype);


TrapDoorManager.prototype.add = function(trapDoor){
  var self = this;

  trapDoor.bind('fall', function(opts){
    var nextDoor = self._findNextDoorInColumn(opts.columnIndex);
    if(nextDoor) nextDoor.addWeight(opts.weight);
  });

  this.items.push(trapDoor);
};


TrapDoorManager.prototype.columnify = function(){
  var self = this;

  // find all the possible values
  var xVals = [];
  this.items.forEach(function(item){
    xVals.push(item.x);
  });

  // assign column names
  var columnXs = _.uniq(xVals).sort(function(a, b){
    return a-b;
  });
  this.columnCount = columnXs.length;
  this.items.forEach(function(item){
    var index = columnXs.indexOf(item.x);
    item.columnIndex = index;
  });

  // assign vertical indices
  columnXs.forEach(function(xVal, i){
    var column = _.where(self.items, { columnIndex : i });
    var items = _.sortBy(column, function(item){
      return item.y;
    });

    items.forEach(function(item, j){
      item.verticalIndex = j;
    });
  });
};


TrapDoorManager.prototype._findNextDoorInColumn = function(index){
  var column = _.where(this.items, { columnIndex : index });
  var sorted = _.sortBy(column, function(item){
    return -1*item.y;
  });

  var nextDoor;
  sorted.some(function(item){
    if(item.sprite.alive){
      nextDoor = item;
      return;
    }
  });

  return nextDoor;
};


TrapDoorManager.prototype.addWeight = function(){
  var self = this;
  // Add snow to the top most door
  this.iterations++;
  if(this.iterations >= this.snowFrequency){
    this.iterations = 0;

    for(var i=0; i<this.columnCount; i++){
      var nextDoor = self._findNextDoorInColumn(i);
      if(nextDoor)
        nextDoor.addWeight();
    }
  }
};
