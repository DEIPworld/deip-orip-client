import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import applicationHttp from './../../../services/http/application';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'
import { getEnrichedProfiles } from './../../../utils/user';
import { organizations } from './../../../utils/organizations';

const state = {
    agency: undefined,
    withdrawRequests: [],
    isAgencyProgramWithdrawalRequests: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    withdrawRequests: (state) => state.withdrawRequests,
    withdrawRequestsByOrganizations: (state) => {
      let organizations = [];
      state.withdrawRequests.forEach(r => {
        const orgId = r.requesterUser.account.organisation_id;
        var organization = organizations.find(o => o.orgId == orgId);
        if (!organization) {
          organization = {
            orgId: orgId,
            withdraws: []
          }
          organizations.push(organization);
        }
        organization.withdraws.push(r);
      });
      return organizations;
    },

    isAgencyProgramWithdrawalRequests: (state, getters) => state.isAgencyProgramWithdrawalRequests !== false
}


// actions
const actions = {

    loadAgencyProgramWithdrawalRequestsPage({ state, dispatch, commit }, { agency }) {
        commit('SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE', true);
        agency = "nsf"; // demo
        return agencyHttp.getAgencyProfile(agency)
          .then((agencyProfile) => {
            commit('SET_AGENCY_PROFILE', agencyProfile);
            const fundingWithdrawalRequestsLoad = dispatch('loadFundingWithdrawalRequests', { notify: false});
            return Promise.all([fundingWithdrawalRequestsLoad])
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              commit('SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE', false);
          });
    },

    loadFundingWithdrawalRequests({ state, dispatch, commit }, { notify }) {
      const requests = [];
      return deipRpc.api.getFundingWithdrawalRequestsAsync()
        .then((items) => {
          items = items.filter(i => i.status == 1); // pending only
          requests.push(...items);
          let requesters = requests.map(r => r.requester);
          return getEnrichedProfiles(requesters);
        })
        .then((requesters) => {
          for (let i = 0; i < requesters.length; i++) {
            requests[i].requesterUser = requesters[i];
          }
          return Promise.all(requests.map(r => deipRpc.api.getFundingResearchRelationAsync(r.funding_research_relation_id)))
        })
        .then((relations) => {
          for (let i = 0; i < relations.length; i++) {
            requests[i].relation = relations[i];
          }
          return Promise.all(relations.map(r => deipRpc.api.getFundingAsync(r.funding_id)))
        })
        .then((fundings) => {
          for (let i = 0; i < fundings.length; i++) {
            requests[i].funding = fundings[i];
          }
          return Promise.all(fundings.map(r => deipRpc.api.getFundingOpportunityAsync(r.funding_opportunity_id)))
        })
        .then((programs) => {
          for (let i = 0; i < programs.length; i++) {
            requests[i].foa = programs[i];
          }
          return Promise.all(requests.map(r => deipRpc.api.getResearchByIdAsync(r.relation.research_id)))
        })
        .then((researches) => {
          for (let i = 0; i < researches.length; i++) {
            requests[i].research = researches[i];
          }
          commit('SET_FUNDING_WITHDRAW_REQUESTS_PROFILE', requests);
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

  ['SET_FUNDING_WITHDRAW_REQUESTS_PROFILE'](state, list) {
    Vue.set(state, 'withdrawRequests', list)
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