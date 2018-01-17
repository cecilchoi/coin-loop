const _ = require('lodash');
const request = require('request-promise');
const Exchange = require('.');

class Kucoin extends Exchange {
  getTicker() {
    return request({
      uri: 'https://api.kucoin.com/v1/open/tick',
      json: true
    })
    .then(data => {
      return _(data.data).map(rate => {
        if (rate.vol == 0) return;
        return {
          coinA: rate.coinType,
          coinB: rate.coinTypePair,
          buy:   rate.buy,
          sell:  rate.sell,
          rate:  ((rate.buy+rate.sell)/2),
        };
      })
      .compact()
      .value();
    });
  }

}

module.exports = Kucoin;
