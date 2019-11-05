

import Vue from 'vue';
// import tokenSaleService from './../../../services/TokenSaleService';
import deipRpc from '@deip/deip-oa-rpc-client';

const state = {
	isLoadingDashboardPage: false,
	investedResearchSharesList: [],
	investedResearchesList: [],
	ongoingContributionsList: [],
	ongoingTokenSalesList: [],
	ongoingFundraisingResearchesList: [],
}

// getters
const getters = {
	isLoadingDashboardPage: state => state.isLoadingDashboardPage
}

// actions
const actions = {
	loadDashboardPage({ commit, dispatch, state }, { username }) {
		commit('SET_DASHBOARD_PAGE_LOADING_STATE', true);

		const researchSharesLoad = new Promise((resolve, reject) => {
			dispatch('loadInvestedResearchShares', { username: username, notify: resolve });
		});
		const contributionsLoad = new Promise((resolve, reject) => {
			dispatch('loadOngoingFundraisingContributions', { username: username, notify: resolve });
		});

		return Promise.all([researchSharesLoad, contributionsLoad])
			.then((res) => {

			})
			.finally(() => {
				commit('SET_DASHBOARD_PAGE_LOADING_STATE', false);
			})
	},

	loadInvestedResearchShares({ commit }, { username, notify } = {}) {
		return deipRpc.api.getResearchTokensByAccountNameAsync(username)
			.then(shares => {
				commit('SET_INVESTED_RESEARCH_SHARES', shares);
				return Promise.all(shares.map(s => deipRpc.api.getResearchByIdAsync(s.research_id)));
			})
			.then(researches => {
				commit('SET_INVESTED_RESEARCHES', researches);
			})
			.finally(() => {
				if (notify) notify();
			});
	},

	loadOngoingFundraisingContributions({ commit }, { username, notify } = {}) {
		return deipRpc.api.getResearchTokenSaleContributionsByContributorAsync(username)
			.then(contributions => {
				commit('SET_ONGOING_CONTRIBUTIONS', contributions);
				return Promise.all(contributions.map(c => deipRpc.api.getResearchTokenSaleByIdAsync(c.research_token_sale_id)));
			})
			.then((sales) => {
				commit('SET_ONGOING_TOKEN_SALES', sales);
				return Promise.all(sales.map(s => deipRpc.api.getResearchByIdAsync(s.research_id)));
			})
			.then((researches) => {
				commit('SET_ONGOING_FUNDRAISING_RESEARCHES', researches);
			})
			.finally(() => {
				if (notify) notify();
			});
	}

}

// mutations
const mutations = {
	['SET_DASHBOARD_PAGE_LOADING_STATE'](state, value) {
		state.isLoadingDashboardPage = value;
	},

	['SET_INVESTED_RESEARCH_SHARES'](state, list) {
		Vue.set(state, 'investedResearchSharesList', list);
	},

	['SET_INVESTED_RESEARCHES'](state, list) {
		Vue.set(state, 'investedResearchesList', list);
	},

	['SET_ONGOING_CONTRIBUTIONS'](state, list) {
		Vue.set(state, 'ongoingContributionsList', list);
	},

	['SET_ONGOING_TOKEN_SALES'](state, list) {
		Vue.set(state, 'ongoingTokenSalesList', list);
	},

	['SET_ONGOING_FUNDRAISING_RESEARCHES'](state, list) {
		Vue.set(state, 'ongoingFundraisingResearchesList', list);
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
