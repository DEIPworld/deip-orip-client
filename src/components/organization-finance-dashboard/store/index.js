import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user'
import {
	FUNDING_TRANSACTION_TRANSFER,
	FUNDING_TRANSACTION_WITHDRAW,
	FUNDING_TRANSACTION_FEE 
} from './../../../services/FundingService'

const state = {
	organization: null,
	organizations: [],
	isLoadingOrganizationFinanceDashboardPage: undefined,
	transactions: []
}

// getters
const getters = {
	isLoadingOrganizationFinanceDashboardPage: state => state.isLoadingOrganizationFinanceDashboardPage,
	organization: state => state.organization,
	organizations: state => state.organizations,
	transactions: state => state.transactions
}

// actions
const actions = {

	loadOrganizationFinanceDashboardPage({ commit, dispatch, state }, { permlink }) {
		commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', true);
		return deipRpc.api.getOrganisationByPermlinkAsync(permlink).then(org => {
			commit('SET_ORGANIZATION', org);

			const organizationsLoad = new Promise((resolve, reject) => {
				dispatch('loadOrganizations', { notify: resolve });
			});

			return Promise.all([organizationsLoad]);
		})
			.then(() => {
				return dispatch('loadTransactions');
			})
			.finally(() => {
				commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', false);
			});
	},

	loadTransactions({ state, dispatch, commit, getters }) {
		const transactions = [];
		const fees = [];
		const withdrawals = [];
		const transfer = [];

		return Promise.all(state.organizations.map(o => deipRpc.api.getFundingTransactionsByReceiverOrganisationAsync(o.id)))
			.then((items) => {
				console.log(items);
				const flatten = [].concat.apply([], items);
				transactions.push(...flatten);
				fees.push(...transactions.filter(t => t.type == FUNDING_TRANSACTION_FEE));
				withdrawals.push(...transactions.filter(t => t.type == FUNDING_TRANSACTION_WITHDRAW));
				transfer.push(...transactions.filter(t => t.type == FUNDING_TRANSACTION_TRANSFER));
				let researchers = [...withdrawals, ...transfer].map(t => t.to_account);
				return getEnrichedProfiles(researchers);
			})
			.then((profiles) => {
				let piTxList = [...withdrawals, ...transfer];
				for (let i = 0; i < piTxList.length; i++) {
					let tx = piTxList[i];
					tx.receiverProfile = profiles[i];
					tx.senderProfile = state.organizations.find(o => o.id == tx.sender_organisation_id);
				}

				let orgTxList = [...fees];
				for (let i = 0; i < orgTxList.length; i++) {
					let tx = orgTxList[i];
					tx.receiverProfile = state.organizations.find(o => o.id == tx.receiver_organisation_id);
					tx.senderProfile = profiles.find(r => r.account.organisation_id == tx.sender_organisation_id);
				}

				transactions.sort(function (a, b) {
					return new Date(b.time) - new Date(a.time);
				});

				commit('SET_TRANSACTIONS_HISTORY_LIST', transactions);
				console.log(transactions);
			})
			.catch(err => { console.log(err) })
			.finally(() => { });
	},

	loadOrganizations({ state, dispatch, commit }, { notify }) {
		return deipRpc.api.getOrganisationsAsync()
			.then((items) => {
				commit('SET_ORGANIZATIONS_LIST', items);
			})
			.catch(err => { console.log(err) })
			.finally(() => {
				if (notify) notify();
			});
	}

}

// mutations
const mutations = {

	['SET_ORGANIZATION_DASHBOARD_LOADING_STATE'](state, isLoading) {
		Vue.set(state, 'isLoadingOrganizationFinanceDashboardPage', isLoading);
	},

	['SET_ORGANIZATION'](state, org) {
		Vue.set(state, 'organization', org);
	},
	
	['SET_ORGANIZATIONS_LIST'](state, list) {
		Vue.set(state, 'organizations', list);
	},

	['SET_TRANSACTIONS_HISTORY_LIST'](state, transactions) {
		Vue.set(state, 'transactions', transactions)
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