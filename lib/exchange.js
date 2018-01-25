const _ = require('lodash');
const Promise = require('bluebird');

class Exchange {
  constructor() {
    this.rates = {};
    this.arcs = {};
    this._loading = this.loadTicker();
  }

  calcArc(coinA, coinC) {
    return this._loading
      .then(() => {
        return _(this.rates[coinA])
          .map((rateAB, coinB) => {
            if (!this.rates[coinB][coinC]) return;
            return {
              exchange: this.constructor.name,
              rate:  (rateAB * 0.999 * this.rates[coinB][coinC] * 0.999 * this.rates[coinC][coinA] * 0.999),
              coinA: coinA,
              coinB: coinB,
              coinC: coinC,
            };
          })
          .compact()
          .orderBy(['rate'], ['desc'])
          .value();
      });
  }

  calcLoop(coinA) {
    return this._loading
      .then(() => {
        return Promise.all(_(this.rates)
          .map((rates, coinC) => {
            if (!this.rates[coinC][coinA]) return;
            return this.calcArc(coinA, coinC);
          })
          .compact()
          .value())
      })
      .then(loops => {
        return _(loops)
          .flatten()
          .orderBy(['rate'], ['desc'])
          .value();
      });
  }
 
  loadTicker() {
    return this.getTicker()
    .then(ticker => {
      _.each(ticker, rate => {
        this.setRate(rate.coinA, rate.coinB, rate.buy);
        this.setRate(rate.coinB, rate.coinA, 1/rate.sell);
      });
      return this.rates;
    });
  }

  setRate(coinA, coinB, rate) {
    if (!this.rates[coinA]) {
      this.rates[coinA] = {};
    }
    this.rates[coinA][coinB] = rate;
  }

  setArc(coinA, coinB, coinC, rate) {
  }
}

module.exports = Exchange;
