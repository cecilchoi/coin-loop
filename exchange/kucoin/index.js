const _ = require('lodash');
const request = require('request-promise');
const Exchange = require('../../lib/exchange');

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
        };
      })
      .compact()
      .value();
    });
  }

  getBuyOrder(coin, market) {
  }
}

module.exports = Kucoin;
