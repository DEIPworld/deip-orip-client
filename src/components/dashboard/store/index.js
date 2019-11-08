

import Vue from 'vue';
import deipRpc from '@deip/deip-oa-rpc-client';

const state = {
	isLoadingDashboardPage: false,
	investedResearchSharesList: [],
	investedResearchesList: [],
	ongoingContributionsList: [],
	ongoingTokenSalesList: [],
	investingResearchesList: [],
	membershipResearches: []
}

// getters
const getters = {
	isLoadingDashboardPage: state => state.isLoadingDashboardPage,
	
	researches: (state) => {

		let unique = [
			...state.investedResearchesList,
			...state.investingResearchesList,
			...state.membershipResearches
		]
			.reduce((arr, research) => {
				if (arr.some(r => r.id == research.id)) return arr;
				let tokenSale = state.ongoingTokenSalesList.find(s => s.research_id == research.id);
				if (tokenSale) {
					let tokenSaleContributions = state.ongoingContributionsList.filter(c => c.research_token_sale_id == tokenSale.id);
					return [...arr, { research, tokenSale, tokenSaleContributions }];
				} else {
					return [...arr, { research }];
				}
			}, []);

		unique.sort((a, b) => (a.research.title > b.research.title) ? 1 : ((b.research.title > a.research.title ) ? -1 : 0));
		return unique;
	},

	deals: (state) => {
		return state.investedResearchesList;
	},

	currentShares: (state) => {
		return state.investedResearchSharesList.map(share => {
			let research = state.investedResearchesList.find(r => r.id == share.research_id);
			return { share, research };
		})
	}
}

// actions
const actions = {
	loadDashboardPage({ commit, dispatch, state }, { username }) {
		commit('SET_DASHBOARD_PAGE_LOADING_STATE', true);

		const investedResearchesLoad = new Promise((resolve, reject) => {
			dispatch('loadInvestedResearches', { username: username, notify: resolve });
		});
		const investingResearchesLoad = new Promise((resolve, reject) => {
			dispatch('loadInvestingResearches', { username: username, notify: resolve });
		});
		const membershipResearchesLoad = new Promise((resolve, reject) => {
			dispatch('loadMembershipResearches', { username: username, notify: resolve });
		});


		return Promise.all([
			investedResearchesLoad, 
			investingResearchesLoad, 
			membershipResearchesLoad
		])
			.then((res) => {

			})
			.finally(() => {
				commit('SET_DASHBOARD_PAGE_LOADING_STATE', false);
			})
	},

	loadInvestedResearches({ commit }, { username, notify } = {}) {
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

	loadInvestingResearches({ commit }, { username, notify } = {}) {
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
	},

	loadMembershipResearches({ commit }, { username, notify } = {}) {
		return deipRpc.api.getResearchGroupTokensByAccountAsync(username)
			.then(list => {
				return Promise.all(list.map(rgt => deipRpc.api.getResearchesByResearchGroupIdAsync(rgt.research_group_id)));
			})
			.then((researches) => {
				const flatten = [].concat.apply([], researches);
				commit('SET_MEMBERSHIP_RESEARCHES', flatten);
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
		Vue.set(state, 'investingResearchesList', list);
	},

	['SET_MEMBERSHIP_RESEARCHES'](state, list) {
		Vue.set(state, 'membershipResearches', list);
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
