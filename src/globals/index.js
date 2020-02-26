// global funcs and constants

import Vue from 'vue'
import moment from 'moment'

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

Vue.prototype.moment = moment;

const mockTokenPrice = (rtId, amount) => {
    let pricePerToken = Math.pow(rtId || 2, 2);
    return amount * pricePerToken;
}
const mockPreviousTokenPrice = ({ research }, offset) => {
    let currentPricePerToken = mockTokenPrice(research.id, 1);
    if (offset <= 0) return currentPricePerToken;

    let factor1 = (offset) % 2 == 0;
    let factor2 = (research.id || 1) % 2 == 0;
    let previousPricePerToken = currentPricePerToken - (factor1 ? currentPricePerToken * (factor2 ? 0.2 : 0.1) : currentPricePerToken * (factor2 ? 0.1 : 0.2)) - offset * 0.9;
    return previousPricePerToken > 0 ? previousPricePerToken : 1;
};
const mockSharePriceWithAvg = ({ research, share }, offset) => {
    let pricePerToken = mockTokenPrice(research.id, 1);
    let currentSharePrice = pricePerToken * share.amount;
    if (offset <= 0) return [currentSharePrice, currentSharePrice / 2];
    let previousSharePrice = mockPreviousTokenPrice({ research }, offset) * share.amount;
    return [previousSharePrice, (currentSharePrice - (currentSharePrice - previousSharePrice)) / 2];
};

Vue.prototype.mockTokenPrice = mockTokenPrice;
Vue.prototype.mockPreviousTokenPrice = mockPreviousTokenPrice;
Vue.prototype.mockSharePriceWithAvg = mockSharePriceWithAvg;

Vue.prototype.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // boundaries included
}

const VIMEO_MATCH_RE = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)/;

const getVimeoEmbedUrlFromVideoUrl = (url) => {
  const _url = new URL(url);
  const match = VIMEO_MATCH_RE.exec(_url.pathname);

  if (_url.hostname === 'vimeo.com' && match) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }

  return null;
};

const getYoutubeEmbedUrlFromVideoUrl = (url) => {
  const getUrlFromVideoId = (id) => `https://www.youtube.com/embed/${id}`;

  const _url = new URL(url);
  if (_url.hostname.indexOf('youtube.com') > -1) {
    return getUrlFromVideoId(_url.searchParams.get('v'));
  }

  if (_url.hostname === 'youtu.be') {
    return getUrlFromVideoId(_url.pathname.split('/')[1]);
  }

  return null
};

Vue.prototype.getEmbedVideoUrl = (url) => {
  return getVimeoEmbedUrlFromVideoUrl(url)
    || getYoutubeEmbedUrlFromVideoUrl(url)
    || url;
};

Vue.prototype.MASTER_PASSWORD_MIN_LENGTH = 10;
Vue.prototype.MASTER_PASSWORD_MAX_LENGTH = 100;

Vue.prototype.TRL = [
  {
    "id": "basic_principles_of_concept_are_observed_and_reported",
    "description": "Basic principles of concept are observed and reported"
  },
  {
    "id": "technology_concept_and_or_application_formulated",
    "description": "Technology concept and/or application formulated"
  },
  {
    "id": "analytical_and_experimental_critical_function_and_or_proof_of_concept",
    "description": "Analytical and experimental critical function and/or proof of concept"
  },
  {
    "id": "component_and_or_validation_in_a_laboratory_environment",
    "description": "Component and/or validation in a laboratory environment"
  },
  {
    "id": "component_and_or_validation_in_a_simulated_environment",
    "description": "Component and/or validation in a simulated environment"
  },
  {
    "id": "system_subsystem_model_or_prototype_demonstration_in_a_simulated_environment",
    "description": "System/subsystem model or prototype demonstration in a simulated environment"
  },
  {
    "id": "prototype_ready_for_demonstration_in_an_appropriate_operational_environment",
    "description": "Prototype ready for demonstration in an appropriate operational environment"
  },
  {
    "id": "actual_technology_completed_and_qualified_through_tests_and_demonstrations",
    "description": "Actual technology completed and qualified through tests and demonstrations"
  },
  {
    "id": "actual_technology_proven_through_successful_deployment_in_an_operational_setting",
    "description": "Actual technology proven through successful deployment in an operational setting"
  }
];
