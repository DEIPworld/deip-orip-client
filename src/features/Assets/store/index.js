import { AssetsService } from '@deip/assets-service';
import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne
} from '@/utils/helpers';

import where from 'filter-where';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: [],
  currentUserBalances: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  listKeys: (state, getters) => (query = {}) => getters.list(query)
    .map((ass) => ass.stringSymbol),

  one: (state) => (assetId, query = {}) => collectionOne(state.data, {
    ...(assetId ? { stringSymbol: assetId } : {}),
    ...query
  }),

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

            commit('setList', assets);
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
              commit('setOne', {
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
    return assetsService.createAsset(...payload)
      .then((res) => res);
  },

  // /////////////////////////

  getTeamBalances(context, payload) {
    return assetsService
      .getAccountAssetBalance(...payload)
      .then((res) => res);
  },

  getCurrentUserBalances({ commit }, username) {
    return assetsService.getAccountAssetsBalancesByOwner(username)
      .then((balances) => {
        commit(
          'setCurrentUserBalance',
          balances.filter((balance) => !balance.tokenized_research)
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      payload.map((asset) => camelizeObjectKeys(asset)),
      { key: 'stringSymbol' }
    );
  },

  setOne(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      camelizeObjectKeys(payload),
      { key: 'stringSymbol' }
    );
  },

  setCurrentUserBalance(state, payload) {
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
