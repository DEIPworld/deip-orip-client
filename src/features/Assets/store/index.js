import { AssetsService } from '@deip/assets-service';
import { camelizeObjectKeys, mergeCollection } from '@/utils/helpers';

import where from 'filter-where';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: [],
  currentUserBalances: []
};

const GETTERS = {
  list: (state) => (query = {}) => state.data.filter(
    where(query)
  ),

  listKeys: (state, getters) => (query = {}) => getters.list(query)
    .map((ass) => ass.stringSymbol),

  one: (state) => (assetId, query = {}) => {
    const conditions = {
      ...(assetId ? { stringSymbol: assetId } : {}),
      ...query
    };
    return state.data.find(where(conditions));
  },

  currentUserBalances: (state) => state.currentUserBalances
};

const ACTIONS = {
  fetch({ commit }) {
    return assetsService.lookupAssets('', 10000)
      .then((data) => {
        const assets = data.map((asset) => ({
          ...asset,
          balances: []
        }));
        const balancesPromises = assets
          .filter((asset) => asset.tokenized_research)
          .map((asset) => assetsService.getAccountsAssetBalancesByAsset(asset.string_symbol))

        return Promise.all(balancesPromises)
          .then((balances) => {
            for (const balance of balances.flat(1)) {
              const idx = assets
                .findIndex((asset) => asset.string_symbol === balance.asset_symbol);
              assets[idx].balances.push(balance);
            }

            commit('storeList', assets);
          });
      });
  },

  // /////////////////////////

  get({ dispatch }, payload) {
    // for future use
    return dispatch('getBySymbol', payload.symbol);
  },

  getBySymbol({ commit }, assetSymbol) {
    return assetsService.getAssetBySymbol(assetSymbol)
      .then((asset) => {
        if (asset.tokenized_research) {
          return assetsService
            .getAccountsAssetBalancesByAsset(asset.string_symbol)
            .then((balances) => {
              commit('storeAsset', {
                ...asset,
                balances
              });
            });
        }

        return Promise.resolve(true)
          .then(() => {
            commit('storeAsset', {
              ...asset,
              balances: []
            });
          });
      });
  },

  // /////////////////////////

  create(context, payload) {
    return assetsService.createSecurityTokenAsset(...payload)
      .then((res) => res);
  },

  // /////////////////////////

  getTeamBalance(context, payload) {
    return assetsService
      .getAccountAssetBalance(...payload)
      .then((res) => res);
  },

  getCurrentUserBalances({ commit }, username) {
    return assetsService.getAccountAssetsBalancesByOwner(username)
      .then((balances) => {
        commit(
          'storeCurrentUserBalance',
          balances.filter((balance) => !balance.tokenized_research)
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  storeList(state, payload) {
    if (!payload) return;

    state.data = mergeCollection(
      state.data,
      payload.map((asset) => camelizeObjectKeys(asset)),
      { id: 'stringSymbol' }
    );
  },

  storeAsset(state, payload) {
    if (!payload) return;

    state.data = mergeCollection(
      state.data,
      camelizeObjectKeys(payload),
      { id: 'stringSymbol' }
    );
  },

  storeCurrentUserBalance(state, payload) {
    state.currentUserBalances = payload.map((balance) => camelizeObjectKeys(balance));
  }
};

export const assetsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
