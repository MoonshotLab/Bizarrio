var CoinManager = function(coins){
  this.coins = [];
};


CoinManager.prototype.findByName = function(name){
  var foundCoin;

  this.coins.forEach(function(coin){
    if(coin.sprite.name == name)
      foundCoin = coin;
  });

  return foundCoin;
};


CoinManager.prototype.add = function(coin){
  this.coins.push(coin);
};


CoinManager.prototype.showRandomCoin = function(lastCoin){
  var coins = _.without(this.coins, lastCoin);
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
