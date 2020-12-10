import { AssetsService } from '@deip/assets-service';
import { camelizeObjectKeys } from '@/utils/helpers';
import where from 'filter-where';
import renameKeys from 'object-rename-keys';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => state.data,

  one: (state) => (query) => {
    const q = renameKeys(query, {
      projectId: 'tokenizedResearch'
    });
    return state.data.find(where(q));
  }
};

const ACTIONS = {
  fetchAssets({ commit }) {
    return assetsService.lookupAssets('', 10000)
      .then((data) => {
        commit('storeList', data);
      });
  },

  getAsset({ commit }, payload) {
    return Promise.all([
      assetsService.getAssetBySymbol(payload.symbol),
      assetsService.getAccountsAssetBalancesByAsset(payload.symbol)
    ])
      .then(([asset, balances]) => {
        commit('storeAsset', {
          ...asset,
          balances
        });
      });
  },

  createAsset({ commit }, payload) {
    return assetsService.createSecurityTokenAsset(...payload)
      .then((res) => res);
  },

  getTeamBalance(context, payload) {
    return assetsService
      .getAccountAssetBalance(...payload)
      .then((res) => res);
  }

  // getAssetData({ commit }, payload) {
  //   return assetsService.getAssetBySymbol(payload.symbol)
  //     .then((res) => {
  //       commit('storeAsset', res);
  //       return !!res;
  //     });
  // },
  //
  // getAssetBalances({ commit }, payload) {
  //   return assetsService.getAccountsAssetBalancesByAsset(payload.symbol)
  //     .then((data) => {
  //       commit('storeBalances', [payload.symbol, data]);
  //     });
  // }
};

const MUTATIONS = {
  storeList(state, payload) {
    state.data = payload.map((asset) => camelizeObjectKeys(asset));
  },

  storeAsset(state, payload) {
    if (!payload) return;

    const res = camelizeObjectKeys(payload);
    const index = state.data.findIndex((el) => el.stringSymbol === res.stringSymbol);
    if (index !== -1) {
      state.data[index] = { ...state.data[index], ...res };
    } else {
      state.data.push(res);
    }
  }

  // storeBalances(state, balances) {
  //   if (!(balances || balances.length)) return;
  //
  //   for (const balance of balances) {
  //     const targetAsset = state.data.findIndex((el) => el.stringSymbol === balance.asset_symbol);
  //     // Vue.set(state.users[index], 'avatar', avatar)
  //     state.data[targetAsset].balances.push(camelizeObjectKeys(balance));
  //   }
  // }
};

export const assetsStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};


