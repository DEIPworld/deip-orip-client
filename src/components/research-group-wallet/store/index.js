import _ from 'lodash';
import deipRpc from '@deip/rpc-client';
import Vue from 'vue';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { BlockchainService } from '@deip/blockchain-service';

const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const blockchainService = BlockchainService.getInstance();

const state = {
  group: null,
  researches: []
};

// getters
const getters = {
  group: (state) => {
    const researchGroup = state.group;
    const balances = researchGroup.account.balances.reduce((acc, b) => {
      acc[b.split(' ')[1]] = blockchainService.fromAssetsToFloat(b);
      return acc;
    }, {});

    return {
      ...researchGroup,
      balances
    };
  },
  researches: (state) => state.researches
};

// actions
const actions = {
  loadGroupWallet({ dispatch }, { permlink }) {
    return dispatch('loadGroup', permlink)
      .then((group) => dispatch('loadResearches', group.external_id));
  },

  loadGroup({ commit }, permlink) {
    return deipRpc.api.getResearchGroupByPermlinkAsync(permlink)
      .then((data) => {
        commit('SET_GROUP', data);
        return data;
      });
  },

  loadResearches({ commit }, externalId) {
    deipRpc.api.getResearchesByResearchGroupAsync(externalId)
      .then((data) => {
        commit('SET_RESEARCHES', data);
      });
  }
};

// mutations
const mutations = {
  SET_GROUP(state, group) {
    state.group = group;
  },
  SET_RESEARCHES(state, researches) {
    state.researches = researches;
  }
};

const namespaced = true;

export const rgWalletStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
