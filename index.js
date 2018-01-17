const _ = require('lodash');
const Promise = require('bluebird');
const Kucoin = require('./exchange/kucoin');
const Binance = require('./exchange/binance');

//var binance = new Binance();
var kucoin = new Kucoin();
Promise.all([
  kucoin.calcArc('ETH', 'BTC'),
  kucoin.calcArc('BTC', 'ETH'),
  //binance.calcArc('ETH', 'BTC'),
  //binance.calcArc('BTC', 'ETH'),
])
.then(arcs => {
  console.log(_(arcs).flatten().sortBy('rate').takeRight(10).value());
});
