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
    return `${value} ${process.env.ASSET_UNIT}`;
};
Vue.prototype.fromAssetsToFloat = assets => parseFloat(assets.split(' ')[0]);
Vue.prototype.deipTokenValidator = value => {
    if (value.match(Vue.prototype.ASSET_QUANTITY_REGEX) === null) {
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

// from config
Vue.prototype.fileStorageBaseUrl = process.env.DEIP_SERVER_URL;
