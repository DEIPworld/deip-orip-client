import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user'
import paymentRequestsHttp from './../../../services/http/paymentRequests'
import { WITHDRAWAL_PENDING, WITHDRAWAL_CERTIFIED, WITHDRAWAL_APPROVED, WITHDRAWAL_REJECTED } from './../../../services/FundingService'
import { toAssetUnits, fromAssetsToFloat } from './../../../utils/blockchain'
import md5 from 'md5'

const state = {
	organization: null,
	contracts: null,
	isLoadingOrganizationDashboardPage: undefined,
	organizations: []
}

// getters
const getters = {
	isLoadingOrganizationDashboardPage: state => state.isLoadingOrganizationDashboardPage,

	currentOrganizationAwards: state => {
		let awards = state.contracts.map(c => {
			let rels = state.organization.permlink == "nsf" ? c.relations : c.relations.filter(r => r.organisation_id == state.organization.id);
			if (!rels.length) return [];

			return rels.map((rel, index) => {
				let totalAmount = fromAssetsToFloat(rel.total_amount);
				let pendingAmount = 0;
				let withdrawnAmount = 0;
				for (let i = 0; i < rel.withdrawals.length; i++) {
					let withdrawal = rel.withdrawals[i];
					if (withdrawal.status == WITHDRAWAL_PENDING || withdrawal.status == WITHDRAWAL_CERTIFIED) pendingAmount += fromAssetsToFloat(withdrawal.amount);
					if (withdrawal.status == WITHDRAWAL_APPROVED) withdrawnAmount += fromAssetsToFloat(withdrawal.amount);
				}
				let availableAmount = totalAmount - pendingAmount - withdrawnAmount;

				let org = state.organizations.find(o => o.id == rel.organisation_id);
				let pi = rel.researcherUser;
				let award = {
					id: rel.id,
					awardId: rel.id,
					awardNumber: `${(rel.id + 1)}${parseInt(`${md5(`${rel.id}-award`)}`, 16)}`.replace(/\./g, "").slice(0, 7),
					totalAmount,
					availableAmount,
					pendingAmount,
					withdrawnAmount,
					from: c.foa.open_date,
					to: c.foa.close_date,
					contract: c,
					relation: rel,
					org,
					pi
				}
				return award;
			});
		});

		return [].concat.apply([], awards);
	},

	currentOrganizationTransactions: state => {
		let transactions = state.contracts.map(c => {
			let rels = state.organization.permlink == "nsf" ? c.relations : c.relations.filter(r => r.organisation_id == state.organization.id);
			if (!rels.length) return [];

			let items = [];

			for (let j = 0; j < rels.length; j++) {
				let rel = rels[j];
				let org = state.organizations.find(o => o.id == rel.organisation_id);
				let pi = rel.researcherUser;
				for (let i = 0; i < rel.withdrawals.length; i++) {
					let withdrawal = rel.withdrawals[i];
					let item = {
						id: withdrawal.id,
						paymentId: withdrawal.id,
						paymentNumber: `${(withdrawal.id + 1)}${parseInt(`${md5(`${withdrawal.id}-payment`)}`, 16)}`.replace(/\./g, "").slice(0, 7),
						awardId: rel.id,
						awardNumber: `${(rel.id + 1)}${parseInt(`${md5(`${rel.id}-award`)}`, 16)}`.replace(/\./g, "").slice(0, 7),
						amount: fromAssetsToFloat(withdrawal.amount),
						status: withdrawal.status,
						statusTitle: getStatusName(withdrawal.status),
						award: rel,
						attachment: withdrawal.attachment,
						org, 
						pi
					}
					items.push(item);
				}
			}
			return items;
		});

		return [].concat.apply([], transactions);
	},

	organization: state => state.organization
}

// actions
const actions = {

	loadOrganizationDashboardPage({ commit, dispatch, state }, { permlink }) {
		commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', true);
		return deipRpc.api.getOrganisationByPermlinkAsync(permlink).then(org => {
			commit('SET_ORGANIZATION', org);
			const fundingContractsLoad = new Promise((resolve, reject) => {
				dispatch('loadFundingContracts', { notify: resolve });
			});
			const organizationsLoad = new Promise((resolve, reject) => {
				dispatch('loadOrganizations', { notify: resolve });
			});
			return Promise.all([fundingContractsLoad, organizationsLoad]);
		})
			.finally(() => {
				commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', false);
			});
	},

	loadFundingContracts({ state, dispatch, commit }, { notify }) {
		const contracts = [];
		return deipRpc.api.getFundingsAsync()
			.then((items) => {
				contracts.push(...items)
				return Promise.all(items.map(c => dispatch('loadFundingContractDetails', { contract: c, notify: null })));
			})
			.then(() => {
				return Promise.all(contracts.map(c => deipRpc.api.getFundingOpportunityAsync(c.funding_opportunity_id)))
			})
			.then((fundingOpportunities) => {
				for (let i = 0; i < fundingOpportunities.length; i++) {
					let foa = fundingOpportunities[i];
					let contract = contracts[i];
					contract.foa = foa;
				}
				let names = contracts.map(r => r.granter);
				return getEnrichedProfiles(names);
			})
			.then((creators) => {
				for (let i = 0; i < creators.length; i++) {
					let creator = creators[i];
					let contract = contracts[i];
					contract.creatorUser = creator;
				}
				commit('SET_FUNDING_CONTRACTS_DETAILS', contracts);
			})
			.catch(err => { console.log(err) })
			.finally(() => {
				if (notify) notify();
			});
	},

	loadFundingContractDetails({ state, dispatch, commit }, { contract, notify }) {
		const flattenWithdrawals = []
		return deipRpc.api.getFundingResearchRelationsByFundingAsync(contract.id)
			.then((relations) => {
				contract.relations = relations;
				return Promise.all(contract.relations.map(r => deipRpc.api.getFundingMilestonesByResearchAsync(r.id)));
			})
			.then((milestones) => {
				for (let i = 0; i < milestones.length; i++) {
					contract.relations[i].milestones = milestones[i];
				}
				let names = contract.relations.map(r => r.researcher);
				return getEnrichedProfiles(names);
			})
			.then((researchers) => {
				for (let i = 0; i < researchers.length; i++) {
					contract.relations[i].researcherUser = researchers[i];
				}
				for (let i = 0; i < contract.relations.length; i++) {
					contract.relations[i].researchExpenses = contract.relations[i]
						.research_expenses.map((exp) => {
							let title = exp[0] == 1 ? 'Salary' : exp[0] == 2 ? 'Equipment' : 'Business Travel';
							let amount = exp[1];
							let type = exp[0];

							return { title, amount, type };
						})
				}
				return Promise.all(contract.relations.map(r => deipRpc.api.getFundingWithdrawalRequestsByResearchAsync(r.research_id)));
			})
			.then((withdrawals) => {
				for (let i = 0; i < contract.relations.length; i++) {
					contract.relations[i].withdrawals = withdrawals[i].filter(w => w.funding_research_relation_id == contract.relations[i].id);
				}
				flattenWithdrawals.push(...[].concat.apply([], withdrawals));
				return Promise.all(flattenWithdrawals
					.map(payment => payment.attachment 
						? paymentRequestsHttp.getPaymentRequestRefByHash(payment.research_id, payment.funding_research_relation_id, payment.attachment) 
						: Promise.resolve(null)));
			})
			.then((attachments) => {
				debugger;
				for (let i = 0; i < flattenWithdrawals.length; i++) {
					flattenWithdrawals[i].attachment = attachments[i] || null;
				}
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

	['SET_FUNDING_CONTRACTS_DETAILS'](state, contracts) {
		Vue.set(state, 'contracts', contracts);
	}
}
function getStatusName(status) {
	return status == WITHDRAWAL_PENDING ? 'Awaiting Certification' :
		status == WITHDRAWAL_CERTIFIED ? 'Certified' :
		status == WITHDRAWAL_APPROVED ? 'Approved' : 
		status == WITHDRAWAL_REJECTED ? 'Rejected' : null;
}

const namespaced = true;

export default {
	namespaced,
	state,
	getters,
	actions,
	mutations
}