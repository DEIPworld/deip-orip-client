import deipRpc from '@deip/deip-rpc-client';
import _ from 'lodash';

export const ACTIVE = 1;
export const FINISHED = 2;
export const EXPIRED = 3;
export const INACTIVE = 4;

const types = {
    ACTIVE,
    FINISHED,
    EXPIRED,
    INACTIVE
};

const getCurrentTokenSaleByResearchId = researchId =>
    deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
        .then(tokenSales =>
            // only one active or inactive token sale is able to exist in research
            _.find(tokenSales, tokenSale => tokenSale.status === ACTIVE || tokenSale.status === INACTIVE)
        );

export default {
    types,
    getCurrentTokenSaleByResearchId
};