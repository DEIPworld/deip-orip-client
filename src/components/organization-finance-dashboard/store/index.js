import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user'
import {
	FUNDING_TRANSACTION_TRANSFER,
	FUNDING_TRANSACTION_WITHDRAW,
	FUNDING_TRANSACTION_FEE 
} from './../../../services/FundingService'
import moment from 'moment'

const state = {
	organization: null,
	organizations: [],
	isLoadingOrganizationFinanceDashboardPage: undefined,
	transactions: [],
	tokenInfo: null
}

// getters
const getters = {
	isLoadingOrganizationFinanceDashboardPage: state => state.isLoadingOrganizationFinanceDashboardPage,
	organization: state => state.organization,
	organizations: state => state.organizations,
	transactions: state => state.transactions,
	tokenInfo: state => {

		let total_issued = 2153500;

		let withdrawn = state.transactions
			.filter(tx => tx.type == FUNDING_TRANSACTION_WITHDRAW)
			.map(tx => tx.amount.amount)
			.reduce((sum, amount) => sum + amount, 0);

		let distributed = state.transactions
			.filter(tx => tx.type == FUNDING_TRANSACTION_TRANSFER || tx.type == FUNDING_TRANSACTION_FEE)
			.map(tx => tx.amount.amount)
			.reduce((sum, amount) => sum + amount, 0);

		let available_to_issuer = total_issued - withdrawn - distributed;
		let circulating_supply = total_issued - withdrawn;

		return {
			available_to_issuer: state.tokenInfo.available_to_issuer + available_to_issuer,
			circulating_supply: state.tokenInfo.circulating_supply + circulating_supply,
			description: state.tokenInfo.description,
			distributed: state.tokenInfo.distributed + distributed,
			id: state.tokenInfo.id,
			issuer: state.tokenInfo.issuer,
			name: state.tokenInfo.name,
			symbol: state.tokenInfo.symbol,
			total_issued: state.tokenInfo.total_issued + total_issued,
			withdrawn: state.tokenInfo.withdrawn + withdrawn
		}
	}
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
			const tokenStatiscticLoad = new Promise((resolve, reject) => {
				dispatch('loadStatisticToken', { notify: resolve, symbol: "NGT" });
			});

			return Promise.all([organizationsLoad, tokenStatiscticLoad]);
		})
			.then(() => {
				return dispatch('loadTransactions');
			})
			.finally(() => {
				commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', false);
			});
	},

	loadStatisticToken({ commit, dispatch, state }, { symbol, notify }) {
		return deipRpc.api.getAssetStatisticsAsync(symbol).then(stat => {
			commit('SET_TOKEN_INFO', stat);
		})
		.catch(err => { console.log(err) })
		.finally(() => {
			if (notify) notify();
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
					tx.senderProfile = state.organizations.find(o => o.id == tx.sender_organisation_id);
					/* profiles.find(r => r.account.organisation_id == tx.sender_organisation_id); */
				}

				for (let i = 0; i < transactions.length; i++) {
					let tx = transactions[i];
					if (tx.time == '1970-01-01T00:00:00') {
						tx.time = moment()
							.subtract(i + 1, "days")
							.subtract(i + 1, "hours")
							.subtract(i + 1, "minutes")
							.subtract(i + 1, "seconds")
							.toString();
					}
					tx.time = new Date(tx.time.toString());
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
	},

	['SET_TOKEN_INFO'](state, stat) {
		Vue.set(state, 'tokenInfo', stat)
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