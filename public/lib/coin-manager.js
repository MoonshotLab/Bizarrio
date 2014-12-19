var CoinManager = function(){
  this.init();
};


CoinManager.prototype = Object.create(Manager.prototype);


CoinManager.prototype.showRandomCoin = function(lastCoin){
  var otherCoins = _.without(this.items, lastCoin);
  var offCoins = [];
  otherCoins.forEach(function(coin){
    if(!coin.sprite.alive) offCoins.push(coin);
  });
  var rando = Math.floor(Math.random() * offCoins.length);

  offCoins[rando].toggle();
};


CoinManager.prototype.collect = function(spriteName){
  var coin = this.findByName(spriteName);

  if(coin && coin.sprite.alive){
    coin.toggle();
    this.showRandomCoin(coin);
    return coin;
  }
};
