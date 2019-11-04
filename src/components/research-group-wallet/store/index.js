import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';

const state = {
    group: null,
    researches: []
};

// getters
const getters = {
    group: state => state.group,
    researches: state => state.researches
};

// actions
const actions = {
    loadGroupWallet({ dispatch }, { permlink }) {
        return dispatch('loadGroup', permlink)
            .then(group => 
                dispatch('loadResearches', group.id)
            );
    },

    loadGroup({ commit }, permlink) {
        return deipRpc.api.getResearchGroupByPermlinkAsync(permlink)
            .then(data => {
                commit('SET_GROUP', data);

                return data;
            });
    },

    loadResearches({ commit }, groupId) {
        const researchResult = [];

        deipRpc.api.getResearchesByResearchGroupIdAsync(groupId)
            .then(list => {
                researchResult.push(...list);
                return Promise.all(
                    list.map(item => deipRpc.api.getTotalVotesByResearchAsync(item.id))
                );
            })
            .then(list => {
                const tvoMap = _.chain(list)
                    .flatten()
                    .groupBy('research_id')
                    .value();

                researchResult.forEach(research => {
                    research.totalVotes = tvoMap[research.id] ? tvoMap[research.id] : [];
                });

                return researchResult;
            })
            .then(data => {
                commit('SET_RESEARCHES', data);
            })
    }
};

// mutations
const mutations = {
    ['SET_GROUP'](state, group) {
        Vue.set(state, 'group', group);
    },
    ['SET_RESEARCHES'](state, researches) {
        Vue.set(state, 'researches', researches);
    }
};

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
