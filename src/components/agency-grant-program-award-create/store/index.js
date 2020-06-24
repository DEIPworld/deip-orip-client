import Vue from 'vue';
import deipRpc from '@deip/rpc-client';
import { GrantsService } from '@deip/grants-service';
import { UsersService } from '@deip/users-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService';

const grantsService = GrantsService.getInstance();
const usersService = UsersService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();

const state = {
  organization: undefined,
  university: undefined,
  program: undefined,
  allUsers: [],

  isLoadingContractProposalPage: undefined
};

// getters
const getters = {
  organization: (state, getters) => state.organization,
  university: (state, getters) => state.university,

  program: (state, getters) => state.program,
  allUsers: (state) => state.allUsers,

  isLoadingContractProposalPage: (state, getters) => state.isLoadingContractProposalPage !== false
};

// actions
const actions = {
  loadProgramAwardProposalPage({ state, dispatch, commit }, { organization, foaId }) {
    commit('SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE', true);
    return deipRpc.api.getResearchGroupByPermlinkAsync(organization)
      .then((organizationProfile) => {
        commit('SET_ORGANIZATION_PROFILE', organizationProfile);
        const organizationProgramDetailsLoad = dispatch('loadProgramDetails', { foaId });
        const usersLoad = dispatch('loadUsers');
        const universityLoad = dispatch('loadUniversity', { universityExternalId: "c8a87b12c23f53866acd397f43b591fd4e631419" });
        return Promise.all([organizationProgramDetailsLoad, usersLoad, universityLoad]);
      })
      .catch((err) => { console.log(err); })
      .finally(() => {
        commit('SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE', false);
      });
  },

  loadProgramDetails({ state, dispatch, commit }, { foaId, notify }) {
    let program;
    return grantsService.getFundingOpportunityAnnouncementByNumber(foaId)
      .then((programInfo) => {
        program = programInfo;
        return usersService.getEnrichedProfiles(program.officers);
      })
      .then((profiles) => {
        program.officers = profiles;
        commit('SET_ORGANIZATION_PROGRAM', program);
      })
      .catch((err) => { console.log(err); })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadUsers({ state, dispatch, commit }) {
    const blackList = ['regacc', 'hermes', 'initdelegate'];
    // TODO: request server for tenant users
    return deipRpc.api.lookupAccountsAsync("0", 10000)
      .then((accounts) => usersService.getEnrichedProfiles(accounts.filter(a => !a.is_research_group && !blackList.some(username => username == a.name)).map((a) => a.name)))
      .then((users) => {
        commit('SET_ALL_USERS', users);
      })
      .catch((err) => { console.log(err); })
  },

  loadUniversity({ state, dispatch, commit }, { universityExternalId }) {
    return researchGroupService.getResearchGroup(universityExternalId)
      .then((university) => {
        commit('SET_UNIVERSITY', university);
      }, (err) => { console.log(err); });
  }
};

// mutations
const mutations = {
  SET_ORGANIZATION_PROFILE(state, organization) {
    Vue.set(state, 'organization', organization);
  },

  SET_UNIVERSITY(state, university) {
    Vue.set(state, 'university', university);
  },

  SET_ALL_USERS(state, users) {
    Vue.set(state, 'allUsers', users);
  },

  SET_ORGANIZATION_PROGRAM(state, program) {
    Vue.set(state, 'program', program);
  },

  SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE(state, isLoading) {
    Vue.set(state, 'isLoadingContractProposalPage', isLoading);
  }
};

const namespaced = true;

export const agencyGrantProgramAwardCreateStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
