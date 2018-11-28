import _ from 'lodash';
import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import stateApiSvc from './stateApiSvc';

const state = {
    fullResearchList: [],
    
    filter: {
        disciplines: [],
        q: '',
        orderBy: {
            iteratee: ['title'],
            order: ['asc']
        },
        dateFrom: null,
        dateTo: null
    }
}

// getters
const getters = {

    filter: (state, getters) => {
        return state.filter;
    },

    researchFeed: (state, getters) => {
        let handler = _(state.fullResearchList);

        if (state.filter.q !== '') {
            handler = handler.filter(research =>
                _.includes(research.title.toLowerCase(), state.filter.q.toLowerCase())
            );
        }

        if (state.filter.disciplines.length) {
            handler = handler.filter(research => {
                return research.disciplines.some(discipline => {
                    return state.filter.disciplines.some(d => {return d.id == discipline.id});
                });
            });
        }

        return handler.orderBy(state.filter.orderBy.iteratee, state.filter.orderBy.order).value();
    },

    allCollapsed: (state, getters) => {
        return state.fullResearchList.reduce((acc, item) => acc && item.isCollapsed, true);
    },

    hasSelectedChildDiscipline: (state, getters) => {
        return discipline => state.filter.disciplines.find(d => {
            const parts = d.path.split('.')
            return d.id != discipline.id && parts.some(p => p == discipline.path);
        }) !== undefined;
    }
}

// actions
const actions = {

    loadAllResearches({ state, dispatch, commit }) {
        return stateApiSvc.loadAllResearches()
            .then(data => {
                commit('SET_FULL_RESEARCH_LIST', data);
            });
    },

    toggleFeedItem({ commit, state, getters }, id) {
        const item = state.fullResearchList.find(item => { return item.research_id == id });
        commit('SET_FEED_ITEM_COLLAPSE_STATE', { item: item, collapsed: !item.isCollapsed })
    },

    toggleFeed({ commit, state, getters }) {
        const collapsed = !getters.allCollapsed
        commit('SET_FEED_ITEMS_COLLAPSE_STATE', collapsed)
    },

    updateFilter({ commit, state, getters }, payload) {
        commit('UPDATE_FILTER', { key: payload.key, value: payload.value })
    }
}

// mutations
const mutations = {

    ['SET_FULL_RESEARCH_LIST'](state, list) {
        Vue.set(state, 'fullResearchList', list)
    },

    ['SET_FEED_ITEM_COLLAPSE_STATE'](state, { item, collapsed }) {
        item.isCollapsed = collapsed;
    },

    ['SET_FEED_ITEMS_COLLAPSE_STATE'](state, collapsed) {
        state.fullResearchList.forEach(item => { item.isCollapsed = collapsed });
    },

    ['UPDATE_FILTER'](state, { key, value }) {
        Vue.set(state.filter, key, value)
    }
}

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}