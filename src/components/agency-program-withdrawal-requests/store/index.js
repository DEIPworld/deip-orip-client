import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import applicationHttp from './../../../services/http/application';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'
import { getEnrichedProfiles } from './../../../utils/user';
import { organizations } from './../../../utils/organizations';

const state = {
    agency: undefined,

    isAgencyProgramWithdrawalRequests: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,

    isAgencyProgramWithdrawalRequests: (state, getters) => state.isAgencyProgramWithdrawalRequests !== false
}


// actions
const actions = {

    loadAgencyProgramWithdrawalRequestsPage({ state, dispatch, commit }, { agency }) {
        commit('SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE', true);
        return agencyHttp.getAgencyProfile(agency)
          .then((agencyProfile) => {
            commit('SET_AGENCY_PROFILE', agencyProfile);
            // const fundingWithdrawalRequestsLoad = dispatch('loadFundingWithdrawalRequests', { organizationId: 1, notify: false});
            // return Promise.all([fundingWithdrawalRequestsLoad])
          })
          .then((items) => {

          })
          .catch(err => { console.log(err) })
          .finally(() => {
              commit('SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE', false);
          });
    },

    loadFundingWithdrawalRequests({ state, dispatch, commit }, { organizationId, notify }) {
      var program;
      return deipRpc.api.getFundingWithdrawalRequestsByOrganisation(organizationId)
        .then((programs) => {
            program = programs.find(p => p.agency_name == state.agency._id);
            return getEnrichedProfiles(program.officers);
        })
        .then((profiles) => {
            program.officers = profiles
            commit('SET_AGENCY_PROGRAM', program);
        })
        .catch(err => { console.log(err) })
        .finally(() => {
            if (notify) notify();
        });
    }

}

// mutations
const mutations = {
  ['SET_AGENCY_PROFILE'](state, agency) {
      Vue.set(state, 'agency', agency)
  },

  ['SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isAgencyProgramWithdrawalRequests', isLoading)
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