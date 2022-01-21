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
    .map((ass) => ass.symbol),

  one: (state) => (assetId, query = {}) => collectionOne(state.data, {
    ...(assetId ? { symbol: assetId } : {}),
    ...query
  }),

  currentUserBalances: (state) => state.currentUserBalances
};

const ACTIONS = {
  fetch({ commit }) {
    return assetsService.lookupAssets('', 10000)
      .then(({ data: { items: data } }) => {
        const assets = data.map((asset) => ({
          ...asset,
          balances: []
        }));
        const balancesPromises = assets
          .filter((asset) => asset.tokenizedProject)
          .map((asset) => assetsService.getAccountsAssetBalancesByAsset(asset.symbol))

        return Promise.all(balancesPromises)
          .then((res) => {
            const balances = res.map(({ data: { items } }) => items);
            for (const balance of balances.flat(1)) {
              const idx = assets
                .findIndex((asset) => asset.symbol === balance.symbol);
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
      .then(({ data: asset }) => {
        if (asset.tokenizedProject) {
          return assetsService
            .getAccountsAssetBalancesByAsset(asset.symbol)
            .then(({ data: { items: balances } }) => {
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
    return assetsService.createFungibleToken(...payload)
      .then(({ data: res }) => res);
  },

  // /////////////////////////

  getTeamBalances(context, payload) {
    return assetsService
      .getAccountAssetBalance(...payload)
      .then(({ data: res }) => res);
  },

  getCurrentUserBalances({ commit }, username) {
    return assetsService.getAccountAssetsBalancesByOwner(username)
      .then(({ data: { items: balances } }) => {
        commit(
          'setCurrentUserBalance',
          balances.filter((balance) => !balance.tokenizedProject)
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
      // payload.map((asset) => camelizeObjectKeys(asset)),
      payload,
      { key: 'symbol' }
    );
  },

  setOne(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      // camelizeObjectKeys(payload),
      payload,
      { key: 'symbol' }
    );
  },

  setCurrentUserBalance(state, payload) {
    // state.currentUserBalances = payload.map((balance) => camelizeObjectKeys(balance));
    state.currentUserBalances = payload;
  }
};

export const assetsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
