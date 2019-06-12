import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user';
import { fromAssetsToFloat } from './../../../utils/blockchain';
import moment from 'moment';
import md5 from 'md5';
import {
	FUNDING_TRANSACTION_TRANSFER,
	FUNDING_TRANSACTION_WITHDRAW,
	FUNDING_TRANSACTION_FEE,

	WITHDRAWAL_PENDING,
	WITHDRAWAL_CERTIFIED,
	WITHDRAWAL_APPROVED,
	WITHDRAWAL_PAID,
	WITHDRAWAL_REJECTED,

	loadFundingContracts
} from './../../../services/FundingService';

const state = {
	organization: null,
	organizations: [],
	isLoadingOrganizationDashboardPage: undefined,
	transactions: [],
	tokenInfo: null,
	contracts: []
}

// getters
const getters = {
	isLoadingOrganizationDashboardPage: state => state.isLoadingOrganizationDashboardPage,
	organization: state => state.organization,
	organizations: state => state.organizations,
	transactions: state => state.transactions,
	tokenInfo: state => {

		// let total_issued = 2153500;
		let total_issued = 0;

		// let withdrawn = state.transactions
		// 	.filter(tx => tx.type == FUNDING_TRANSACTION_WITHDRAW)
		// 	.map(tx => tx.amount.amount)
		// 	.reduce((sum, amount) => sum + amount, 0);
		let withdrawn = 0;

		// let distributed = state.transactions
		// 	.filter(tx => tx.type == FUNDING_TRANSACTION_TRANSFER || tx.type == FUNDING_TRANSACTION_FEE)
		// 	.map(tx => tx.amount.amount)
		// 	.reduce((sum, amount) => sum + amount, 0);
		let distributed = 0;

		// let available_to_issuer = total_issued - withdrawn - distributed;
		let available_to_issuer = 0;
		// let circulating_supply = total_issued - withdrawn;
		let circulating_supply = 0;

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
	},

	awards: state => {
		let awards = state.contracts.map(c => {
			let rels = c.relations;
			if (!rels.length) return [];

			return rels.map((rel, index) => {
				let totalAmount = fromAssetsToFloat(rel.total_amount);
				let universityOverheadAmount = rel.isSubaward ? 0 : totalAmount - (totalAmount - (totalAmount * (rel.university_overhead / 100) / 100));
				let pendingPiAmount = 0;
				let withdrawnPiAmount = 0;
				let requestedPiAmount = 0;

				for (let i = 0; i < rel.withdrawals.length; i++) {
					let withdrawal = rel.withdrawals[i];
					if (withdrawal.status == WITHDRAWAL_PENDING || withdrawal.status == WITHDRAWAL_CERTIFIED || withdrawal.status == WITHDRAWAL_APPROVED) pendingPiAmount += fromAssetsToFloat(withdrawal.amount);
					if (withdrawal.status == WITHDRAWAL_PAID) withdrawnPiAmount += fromAssetsToFloat(withdrawal.amount);
					requestedPiAmount += fromAssetsToFloat(withdrawal.amount);
				}

				let subawardeesAmount = rel.subawards
					.map(s => s.total_amount.amount)
					.reduce((sum, amount) => sum + amount, 0);

				let requestedSubawardeesAmount = rel.subawards
					.map(s => s.withdrawals
							.map(w => w.amount.amount)
							.reduce((sum, amount) => sum + amount, 0)
					)
					.reduce((sum, amount) => sum + amount, 0);

				let withdrawnSubawardeesAmount = rel.subawards
					.map(s => s.withdrawals
							.filter(w => w.status == WITHDRAWAL_PAID)
							.map(w => w.amount.amount)
							.reduce((sum, amount) => sum + amount, 0)
					)
					.reduce((sum, amount) => sum + amount, 0);

				let pendingSubawardeesAmount = rel.subawards
					.map(s => s.withdrawals
						.filter(w => w.status == WITHDRAWAL_PENDING || w.status == WITHDRAWAL_CERTIFIED || w.status == WITHDRAWAL_APPROVED)
						.map(w => w.amount.amount)
						.reduce((sum, amount) => sum + amount, 0)
					)
					.reduce((sum, amount) => sum + amount, 0);

				let remainingSubawardeesAmount = subawardeesAmount - withdrawnSubawardeesAmount;

				let piAmount = totalAmount - subawardeesAmount - universityOverheadAmount;
				let remainingPiAmount = piAmount - withdrawnPiAmount;

				let requestedAmount = requestedPiAmount + requestedSubawardeesAmount;
				let pendingAmount = pendingPiAmount + pendingSubawardeesAmount;
				let withdrawnAmount = withdrawnPiAmount + withdrawnSubawardeesAmount;

				let remainingAmount = totalAmount - withdrawnPiAmount - withdrawnSubawardeesAmount - universityOverheadAmount;

				let org = state.organizations.find(o => o.id == rel.organisation_id);
				let pi = rel.researcherUser;
				let award = {
					id: rel.id,
					awardId: rel.id,

					totalAmount,
					requestedAmount,
					universityOverheadAmount,
					pendingAmount,
					withdrawnAmount,
					remainingAmount,

					piAmount,
					requestedPiAmount,
					pendingPiAmount,
					withdrawnPiAmount,
					remainingPiAmount,

					subawardeesAmount,
					requestedSubawardeesAmount,
					pendingSubawardeesAmount,
					withdrawnSubawardeesAmount,
					remainingSubawardeesAmount,

					isSubaward: rel.isSubaward,
					from: c.foa.open_date,
					to: c.foa.close_date,
					contract: c,
					relation: rel,
					organization: org,
					pi
				}
				return award;
			});
		});

		return [].concat.apply([], awards);
	},

	payments: state => {
		let transactions = state.contracts.map(c => {
			let rels = 
				state.organization.permlink == "nsf" || state.organization.permlink == "treasury" 
				? c.relations 
				: c.relations.filter(r => r.organisation_id == state.organization.id);

			let items = [];

			for (let j = 0; j < rels.length; j++) {
				let rel = rels[j];

				for (let i = 0; i < rel.withdrawals.length; i++) {
					let withdrawal = rel.withdrawals[i];

					let pi = rel.isSubaward ? rel.parentAward.researcherUser : rel.researcherUser;
					let requester = rel.researcherUser;

					let item = {
						id: withdrawal.id,
						paymentId: withdrawal.id,
						awardId: rel.id,
						contract: c,
						amount: fromAssetsToFloat(withdrawal.amount),
						status: withdrawal.status,
						award: rel,
						attachment: withdrawal.attachment,
						timestamp: withdrawal.time,
						organization: rel.organization,
						pi,
						requester
					}
					items.push(item);
				}
			}
			return items;
		});

		return [].concat.apply([], transactions);
	}

}

// actions
const actions = {

	loadOrganizationDashboardPage({ commit, dispatch, state }, { permlink }) {
		commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', true);
		return deipRpc.api.getOrganisationByPermlinkAsync(permlink).then(org => {
			commit('SET_ORGANIZATION', org);

			const organizationsLoad = new Promise((resolve, reject) => {
				dispatch('loadOrganizations', { notify: resolve });
			});
			const tokenStatiscticLoad = new Promise((resolve, reject) => {
				dispatch('loadStatisticToken', { notify: resolve, symbol: "NGT" });
			});
			const awardsLoad = new Promise((resolve, reject) => {
				dispatch('loadAwards', { notify: resolve});
			});

			return Promise.all([organizationsLoad, tokenStatiscticLoad, awardsLoad]);
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

	loadAwards({ commit, dispatch, state }, { notify }) {
		return loadFundingContracts()
			.then(contracts => {
				commit('SET_FUNDING_CONTRACTS_LIST', contracts);
			})
			.catch(err => { console.log(err) })
			.finally(() => {
				if (notify) notify();
			});
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
		Vue.set(state, 'isLoadingOrganizationDashboardPage', isLoading);
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
	},

	['SET_FUNDING_CONTRACTS_LIST'](state, contracts) {
		Vue.set(state, 'contracts', contracts)
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