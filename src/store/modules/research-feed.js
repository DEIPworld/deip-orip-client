import _ from 'lodash';
import deipRpc from '@deip/deip-rpc';
import Vue from 'vue'

const state = {
    fullResearchList: [],
    filter: {
        discipline: undefined,
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
                _.startsWith(research.title.toLowerCase(), state.filter.q.toLowerCase())
            );
        }

        if (state.filter.discipline) {
            handler = handler.filter(research =>
                _.find(research.disciplines, { id: state.filter.discipline.id }) !== undefined
            );
        }

        return handler.orderBy(state.filter.orderBy.iteratee, state.filter.orderBy.order).value();
    },

    allCollapsed: (state, getters) => {
        return state.fullResearchList.reduce((acc, item) => acc && item.isCollapsed, true);
    }
}

// actions
const actions = {

    loadAllResearches({ state, commit }) {
        const disciplineId = _.get(state.filter, 'discipline.id') || 0;
        deipRpc.api.getAllResearchesListingAsync(0, disciplineId)
            .then(data => {
                const list = _.each(data, (item, i) => { item.isCollapsed = true; })
                commit('SET_FULL_RESEARCH_LIST', list)
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

export default {
    state,
    getters,
    actions,
    mutations
}