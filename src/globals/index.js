// global funcs and constants

import Vue from 'vue';
import moment from 'moment';
import { DEIP_MODULE } from '@/variables';
import { GrantsService } from '@deip/grants-service';

const grantsService = GrantsService.getInstance();

// regarding with DEIP PERCENTS
Vue.prototype.PERCENT_QUANTITY_REGEX = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,2})?$/;
Vue.prototype.DEIP_100_PERCENT = 10000;
Vue.prototype.DEIP_1_PERCENT = 10000 / 100;
Vue.prototype.convertToPercent = (amount) => parseInt(amount) * 100 / 10000;
Vue.prototype.toDeipPercent = (amount) => parseFloat(amount) * 100;

// regarding with ASSETS
Vue.prototype.ASSET_QUANTITY_REGEX = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,3})?$/;
Vue.prototype.toAssetUnits = (amount, precision = 3, asset = window.env.ASSET_UNIT) => grantsService.toAssetUnits(amount, precision, asset);
Vue.prototype.fromAssetsToFloat = (assets) => grantsService.fromAssetsToFloat(assets);

Vue.prototype.deipTokenValidator = (value) => {
  if (!value || value.match(Vue.prototype.ASSET_QUANTITY_REGEX) === null) {
    return 'Incorrect format';
  }

  const number = parseFloat(value);

  if (number === 0) {
    return 'Amount should be greater than zero';
  }
  return true;
};

// regarding with DEIP Common
Vue.prototype.COMMON_TOKEN_QUANTITY_REGEX = /^(?:0|(?:[1-9]\d*))(?:\.\d{1,3})?$/;
Vue.prototype.toCommonTokens = (amount) => parseFloat(amount / 1000);
Vue.prototype.fromCommonTokensToAmount = (common) => common * 1000;

Vue.prototype.round2DigitsAfterComma = (x) => {
  if (!x) {
    return 0;
  }
  return Math.round(x * 100) / 100;
};

Vue.prototype.moment = moment;

const mockTokenPrice = (rtId, amount) => {
  const pricePerToken = Math.pow(rtId || 2, 2);
  return amount * pricePerToken;
};
const mockPreviousTokenPrice = ({ project }, offset) => {
  const currentPricePerToken = mockTokenPrice(project.id, 1);
  if (offset <= 0) return currentPricePerToken;

  const factor1 = (offset) % 2 == 0;
  const factor2 = (project.id || 1) % 2 == 0;
  const previousPricePerToken = currentPricePerToken - (factor1 ? currentPricePerToken * (factor2 ? 0.2 : 0.1) : currentPricePerToken * (factor2 ? 0.1 : 0.2)) - offset * 0.9;
  return previousPricePerToken > 0 ? previousPricePerToken : 1;
};
const mockSharePriceWithAvg = ({ project, share }, offset) => {
  const pricePerToken = mockTokenPrice(project.id, 1);
  const currentSharePrice = pricePerToken * share.amount;
  if (offset <= 0) return [currentSharePrice, currentSharePrice / 2];
  const previousSharePrice = mockPreviousTokenPrice({ project }, offset) * share.amount;
  return [previousSharePrice, (currentSharePrice - (currentSharePrice - previousSharePrice)) / 2];
};

Vue.prototype.mockTokenPrice = mockTokenPrice;
Vue.prototype.mockPreviousTokenPrice = mockPreviousTokenPrice;
Vue.prototype.mockSharePriceWithAvg = mockSharePriceWithAvg;

Vue.prototype.getRandomInt = (min, max) => { // not used
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // boundaries included
};

const VIMEO_MATCH_RE = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)/;

const getVimeoEmbedUrlFromVideoUrl = (url) => {
  const _url = new URL(url);
  const match = VIMEO_MATCH_RE.exec(_url.pathname);

  if (_url.hostname === 'vimeo.com' && match) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }

  return null;
};

Vue.prototype.MASTER_PASSWORD_MIN_LENGTH = 10;
Vue.prototype.MASTER_PASSWORD_MAX_LENGTH = 100;
Vue.prototype.SYSTEM_USERS = ['regacc', 'initdelegate'];
Vue.prototype.DEIP_MODULE = DEIP_MODULE;