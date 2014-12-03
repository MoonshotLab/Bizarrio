var TrapDoorManager = function(){
  this.init();
  this.columns = [];
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
