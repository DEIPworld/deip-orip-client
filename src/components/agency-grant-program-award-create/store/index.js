import Vue from 'vue';
import deipRpc from '@deip/rpc-client';
import { GrantsService } from '@deip/grants-service';
import { UsersService } from '@deip/users-service';
import { ResearchGroupService } from '@deip/research-group-service';

const grantsService = GrantsService.getInstance();
const usersService = UsersService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();

const state = {
  organization: undefined,
  university: undefined,
  program: undefined,
  allUsers: [],
  awardee: null,

  isLoadingContractProposalPage: undefined
};

// getters
const getters = {
  organization: (state, getters) => state.organization,
  university: (state, getters) => state.university,

  program: (state, getters) => state.program,
  allUsers: (state) => state.allUsers,

  awardee: (state) => state.awardee,

  isLoadingContractProposalPage: (state, getters) => state.isLoadingContractProposalPage !== false
};

// actions
const actions = {
  loadProgramAwardProposalPage({ state, dispatch, commit }, { orgExternalId, foaId, awardee }) {
    commit('SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE', true);
    return researchGroupService.getResearchGroup(orgExternalId)
      .then((organizationProfile) => {
        commit('SET_ORGANIZATION_PROFILE', organizationProfile);
        const organizationProgramDetailsLoad = dispatch('loadProgramDetails', { foaId });
        const usersLoad = dispatch('loadUsers');
        const universityLoad = dispatch('loadUniversity', { universityExternalId: 'c8a87b12c23f53866acd397f43b591fd4e631419' });
        const awardeeLoad = dispatch('loadAwardee', { awardee: awardee });
        
        return Promise.all([organizationProgramDetailsLoad, usersLoad, universityLoad, awardeeLoad]);
      })
      .catch((err) => { console.error(err); })
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
      .catch((err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadUsers({ state, dispatch, commit }) {
    return usersService.getUsersListing()
      .then((users) => {
        commit('SET_ALL_USERS', users);
      })
      .catch((err) => { console.error(err); });
  },

  loadUniversity({ state, dispatch, commit }, { universityExternalId }) {
    return researchGroupService.getResearchGroup(universityExternalId)
      .then((university) => {
        commit('SET_UNIVERSITY', university);
      }, (err) => { console.error(err); });
  },

  loadAwardee({ state, dispatch, commit }, { awardee }) {
    commit('SET_AWARDEE', awardee);
  }
};

// mutations
const mutations = {
  SET_ORGANIZATION_PROFILE(state, organization) {
    state.organization = organization;
  },

  SET_UNIVERSITY(state, university) {
    state.university = university;
  },

  SET_ALL_USERS(state, users) {
    state.allUsers = users;
  },

  SET_ORGANIZATION_PROGRAM(state, program) {
    state.program = program;
  },

  SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE(state, isLoading) {
    state.isLoadingContractProposalPage = isLoading;
  },

  SET_AWARDEE(state, awardee) {
    state.awardee = awardee;
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
