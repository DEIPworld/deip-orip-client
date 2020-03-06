import _ from 'lodash';
import deipRpc from '@deip/deip-oa-rpc-client';
import Vue from 'vue';

const state = {
  witnesses: []
};

// getters
const getters = {
  witnesses: state => state.witnesses
};

// actions
const actions = {
  loadProducers({commit}) {
    return deipRpc.api.lookupWitnessAccountsAsync('', 100)
      .then(witnessesNames => {
        return Promise.all(
          witnessesNames.map(accountName => deipRpc.api.getWitnessByAccountAsync(accountName))
        );
      })
      .then(witnesses => {
        return _.chain(witnesses).clone()
          .orderBy(['votes'], ['desc'])
          .each((item, i) => {
            item.votingIndex = i;
          })
          .value();
      })
      .then(witnesses => {
        commit('SET_WITNESSES', witnesses);
      })
      .catch(err => console.log(err));
  }
};

// mutations
const mutations = {
  ['SET_WITNESSES'](state, witnesses) {
    Vue.set(state, 'witnesses', witnesses);
  }
};

const namespaced = true;

export const votingForBlockProducersStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
