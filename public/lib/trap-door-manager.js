var TrapDoorManager = function(){
  this.init();
  this.columnCount = 0;
  this.iterations = 0;
  this.snowFrequency = 30;
};


TrapDoorManager.prototype = Object.create(Manager.prototype);


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


TrapDoorManager.prototype.addWeight = function(){
  var self = this;

  var findTopDoor = function(i){
    var column = _.where(self.items, { columnIndex : i });
    var sorted = _.sortBy(column, function(item){
      return -1*item.y;
    });

    var topDoor;
    sorted.some(function(item){
      if(item.sprite.alive){
        topDoor = item;
        return;
      }
    });

    return topDoor;
  };

  // Add snow to the top most door
  this.iterations++;
  if(this.iterations >= this.snowFrequency){
    this.iterations = 0;

    for(var i=0; i<this.columnCount; i++){
      var topDoor = findTopDoor(i);
      topDoor.addWeight();
    }
  }
};
