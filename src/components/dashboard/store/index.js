import Vue from 'vue';
import usersService from './../../../services/http/users';
import deipRpc from '@deip/deip-rpc-client';

const state = {
	isLoadingDashboardPage: false
}

// getters
const getters = {
	isLoadingDashboardPage: state => state.isLoadingDashboardPage
}

// actions
const actions = {
	loadDashboardPage({ commit, dispatch, state }, user) {
		commit('SET_DASHBOARD_PAGE_LOADING_STATE', true);
		
		return Promise.all([])
			.then((res) => {

			})
			.finally(() => {
				commit('SET_DASHBOARD_PAGE_LOADING_STATE', false);
			})
    }
}

// mutations
const mutations = {
	['SET_DASHBOARD_PAGE_LOADING_STATE'](state, value) {
		state.isLoadingDashboardPage = value;
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