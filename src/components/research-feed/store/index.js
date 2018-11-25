import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import { getEnrichedProfiles } from './../../../utils/user'
import Vue from 'vue'

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
        const disciplineId = _.get(state.filter, 'discipline.id') || 0;
        let researchResult = [];

        return deipRpc.api.getAllResearchesListingAsync(0, disciplineId)
            .then(list => {
                const researchPromises = [];

                researchResult = _.each(list, (item, i) => {
                    researchPromises.push(deipRpc.api.getTotalVotesByResearchAsync(item.research_id))
                    item.isCollapsed = true;
                });

                let reviewsPromises = researchResult.map(research =>
                    deipRpc.api.getReviewsByResearchAsync(research.research_id)
                );

                let groupPromises = researchResult.map(research =>
                    deipRpc.api.getResearchGroupByIdAsync(research.group_id)
                );

                let authorsPromises = researchResult.map(research => getEnrichedProfiles(research.authors));

                let tokenSalesPromises = researchResult.map(research =>
                    deipRpc.api.checkResearchTokenSaleExistenceByResearchIdAsync(research.research_id)
                        .then(exists => 
                            exists ? deipRpc.api.getResearchTokenSaleByResearchIdAsync(research.research_id) : undefined
                        )
                );

                return Promise.all([
                    Promise.all(researchPromises),
                    Promise.all(reviewsPromises),
                    Promise.all(groupPromises),
                    Promise.all(authorsPromises),
                    Promise.all(tokenSalesPromises)
                ]);
            })
            .then(([totalVotes, reviews, groups, authors, tokenSales]) => {
                let tvoMap = _.chain(totalVotes)
                    .flatten()
                    .groupBy('research_id')
                    .value();

                researchResult.forEach((research, index) => {
                    research.totalVotes = tvoMap[research.research_id] ? tvoMap[research.research_id] : [];
                    research.reviews = reviews[index];
                    research.group = groups[index];
                    research.enrichedAuthors = authors[index];
                    research.tokenSale = tokenSales[index];
                });

                return researchResult;
            })
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