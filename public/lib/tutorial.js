var tutorial = { steps : [] };


tutorial.start = function(next){
  $('#tutorial').show();
  setTimeout(this.steps[0], 0);
  setTimeout(this.steps[1], 4000);
  setTimeout(this.steps[2], 7000);
  setTimeout(this.steps[3], 9500);
  setTimeout(next, 12000);
};


// show obstacles
tutorial.steps.push(function(){
  $('#tutorial').find('.step').eq(0).show();

  var toggle = function(index, iterator){
    var timeout = iterator*200;

    setTimeout(function(){
      bizarrio.game.trapDoorManager.items[index].fall({ skipLift : true });
    }, timeout);
    setTimeout(function(){
      bizarrio.game.trapDoorManager.items[index].lift();
    }, timeout+200);
  };

  for(var i=0; i<bizarrio.game.trapDoorManager.items.length; i++){
    toggle(i, i);
  }
});


// show coins
tutorial.steps.push(function(){
  $('#tutorial').find('.step').hide();
  $('#tutorial').find('.step').eq(1).show();

  var toggle = function(index, iterator){
    setTimeout(function(){
      bizarrio.game.coinManager.items[index].toggle();
    }, iterator*50);
  };

  for(var i=0; i<bizarrio.game.coinManager.items.length; i++){
    toggle(i, i);
  }

  setTimeout(function(){
    for(var i=0; i<bizarrio.game.coinManager.items.length; i++){
      toggle(i, 0);
    }
  }, (bizarrio.game.coinManager.items.length*50)*1.75);
});


// show portals
tutorial.steps.push(function(){
  $('#tutorial').find('.step').hide();
  $('#tutorial').find('.step').eq(2).show();

  var toggle = function(index, iterator){
    setTimeout(function(){
      bizarrio.game.portalManager.items[index].toggle();
    }, iterator*300);
  };

  for(var i=0; i<bizarrio.game.portalManager.items.length; i++){
    toggle(i, i);
  }

  setTimeout(function(){
    for(var i=0; i<bizarrio.game.portalManager.items.length; i++){
      toggle(i, 0);
    }
  }, (bizarrio.game.portalManager.items.length*300)*1.7);
});


// watch out for the waterfall
tutorial.steps.push(function(){
  $('#tutorial').find('.step').hide();
  $('#tutorial').find('.step').eq(3).show();

  setTimeout(function(){
    bizarrio.game.waterfall.toggle();
  }, 1000);

  setTimeout(function(){
    bizarrio.game.waterfall.toggle();
    $('#tutorial').find('.step').hide();
  }, 3000);
});
