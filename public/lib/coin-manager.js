var CoinManager = function(){
  this.init();
};


CoinManager.prototype = Object.create(Manager.prototype);


CoinManager.prototype.showRandomCoin = function(lastCoin){
  var coins = _.without(this.items, lastCoin);
  var rando = Math.floor(Math.random() * coins.length);

  coins[rando].toggle();
};


CoinManager.prototype.collect = function(spriteName){
  var coin = this.findByName(spriteName);

  if(coin && coin.sprite.alive){
    coin.toggle();
    this.showRandomCoin(coin);
    return coin;
  }
};
