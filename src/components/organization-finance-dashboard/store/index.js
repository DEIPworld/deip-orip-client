import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import { getEnrichedProfiles } from './../../../utils/user'
import paymentRequestsHttp from './../../../services/http/paymentRequests'
import { WITHDRAWAL_PENDING, WITHDRAWAL_CERTIFIED, WITHDRAWAL_APPROVED, WITHDRAWAL_REJECTED } from './../../../services/FundingService'
import { toAssetUnits, fromAssetsToFloat } from './../../../utils/blockchain'
import md5 from 'md5'

const state = {
	organization: null,
	isLoadingOrganizationFinanceDashboardPage: undefined
}

// getters
const getters = {
	isLoadingOrganizationFinanceDashboardPage: state => state.isLoadingOrganizationFinanceDashboardPage,
	organization: state => state.organization
}

// actions
const actions = {

	loadOrganizationFinanceDashboardPage({ commit, dispatch, state }, { permlink }) {
		commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', true);
		return deipRpc.api.getOrganisationByPermlinkAsync(permlink).then(org => {
			commit('SET_ORGANIZATION', org);
		})
			.finally(() => {
				commit('SET_ORGANIZATION_DASHBOARD_LOADING_STATE', false);
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