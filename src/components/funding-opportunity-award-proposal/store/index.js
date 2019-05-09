import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import applicationHttp from './../../../services/http/application';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'
import { getEnrichedProfiles } from './../../../utils/user';

const state = {
    agency: undefined,
    program: undefined,
    allUsers: [],

    isLoadingContractProposalPage: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    program: (state, getters) => state.program,
    allUsers: (state) => state.allUsers,
    
    isLoadingContractProposalPage: (state, getters) => state.isLoadingContractProposalPage !== false
}

// actions
const actions = {
    loadProgramAwardProposalPage({ state, dispatch, commit }, { agency, foaId }) {
        commit('SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE', true);
        return agencyHttp.getAgencyProfile(agency)
          .then((agencyProfile) => {
            commit('SET_AGENCY_PROFILE', agencyProfile);
            const agencyProgramDetailsLoad = dispatch('loadProgramDetails', { foaId });
            const usersLoad = dispatch('loadUsers');
            return Promise.all([agencyProgramDetailsLoad, usersLoad])
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              commit('SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE', false);
          });
    },

    loadProgramDetails({ state, dispatch, commit }, { foaId, notify }) {
        var program;
        return deipRpc.api.getFundingOpportunitiesByOpportunityNumberAsync(foaId)
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
    },

    loadUsers({ state, dispatch, commit }) {
      return deipRpc.api.getAllAccountsAsync()
        .then((accounts) => {
          return getEnrichedProfiles(accounts.map(a => a.name))
        }, (err) => {console.log(err)}) 
        .then((users) => {
          commit('SET_ALL_USERS', users);
        }, (err) => {console.log(err)})
    }
}

// mutations
const mutations = {
  ['SET_AGENCY_PROFILE'](state, agency) {
      Vue.set(state, 'agency', agency)
  },

  ['SET_ALL_USERS'](state, users) {
    Vue.set(state, 'allUsers', users)
  },

  ['SET_AGENCY_PROGRAM'](state, program) {
      mapAreaToProgram(program, state.agency.researchAreas);
      Vue.set(state, 'program', program)
  },

  ['SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE'](state, isLoading) {
      Vue.set(state, 'isLoadingContractProposalPage', isLoading)
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