const _ = require('lodash');
const request = require('request-promise');
const Promise = require('bluebird');
const Exchange = require('.');


class Binance extends Exchange {
  getTicker() {
    return Promise.all([
      request({
        uri: 'https://api.binance.com//api/v1/exchangeInfo',
        json: true
      }),
      request({
        uri: 'https://api.binance.com/api/v3/ticker/price',
        json: true
      })
    ])
      .spread((info, tickers) => {
        var lookup = {};
        _.each(info.symbols, symbol => {
          lookup[symbol.symbol] = symbol;
        });
        return _.map(tickers, ticker => {
          return {
            coinA: lookup[ticker.symbol].baseAsset,
            coinB: lookup[ticker.symbol].quoteAsset,
            rate:  ticker.price,
          };
        });
      });
  }
}

module.exports = Binance;
