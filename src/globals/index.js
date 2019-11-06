// global funcs and constants

import Vue from 'vue'

// regarding with DEIP PERCENTS
Vue.prototype.PERCENT_QUANTITY_REGEX = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,2})?$/;
Vue.prototype.DEIP_100_PERCENT = 10000;
Vue.prototype.DEIP_1_PERCENT = 10000 / 100;
Vue.prototype.convertToPercent = amount => parseInt(amount) * 100 / 10000;
Vue.prototype.toDeipPercent = amount => parseFloat(amount) * 100;

// regarding with ASSETS
Vue.prototype.ASSET_QUANTITY_REGEX = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,3})?$/;
Vue.prototype.toAssetUnits = amount => {
    let value = parseFloat(amount).toFixed(3);
    return `${value} ${window.env.ASSET_UNIT}`;
};
Vue.prototype.fromAssetsToFloat = assets => parseFloat(assets.split(' ')[0]);
Vue.prototype.deipTokenValidator = value => {
    if (!value || value.match(Vue.prototype.ASSET_QUANTITY_REGEX) === null) {
        return "Incorrect format";
    }

    let number = parseFloat(value);

    if (number === 0) {
        return 'Amount should be greater than zero';
    } else {
        return true;
    }
};

// regarding with DEIP Common
Vue.prototype.COMMON_TOKEN_QUANTITY_REGEX = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,3})?$/;
Vue.prototype.toCommonTokens = amount => parseFloat(amount / 1000);
Vue.prototype.fromCommonTokensToAmount = common => common * 1000;

//
Vue.prototype.countEciBarWidth = (eci, eciMax, eciAverage) => {
    if (eci < 0) {
        return 0;
    }

    // shkor's formula :)
    let countX = (eci, eciAverage) => eci / eciAverage * 1.175;
    let fx = (eci, eciAverage) => Math.pow(-1 / (countX(eci, eciAverage) + 0.5) + 2, 2);

    let fxEci = fx(eci, eciAverage);
    let fxEciMax = fx(eciMax, eciAverage);

    return fxEci !== 0 ? (fxEci / fxEciMax * 100) : 0;
}

Vue.prototype.round2DigitsAfterComma = (x) => {
  if (!x) {
    return 0;
  }
  return Math.round(x * 100) / 100;
};
