import Vue from 'vue';
import { GrantsService } from '@deip/grants-service';
import { UserService } from '@deip/user-service';
import { TeamService } from '@deip/team-service';

const teamService = TeamService.getInstance();
const grantsService = GrantsService.getInstance();
const userService = UserService.getInstance();

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
  loadProgramAwardProposalPage({ state, dispatch, commit }, { foaId, awardee }) {
    const universityOrg = "c8a87b12c23f53866acd397f43b591fd4e631419";

    commit('SET_FUNDING_CONTACT_PROPOSAL_PAGE_LOADING_STATE', true);
    return teamService.getTeam(Vue.$env.TENANT)
      .then(({ data: organization }) => {
        commit('SET_ORGANIZATION_PROFILE', organization);
        const organizationProgramDetailsLoad = dispatch('loadProgramDetails', { foaId });
        const usersLoad = dispatch('loadUsers');
        const universityLoad = dispatch('loadUniversity', { universityId: universityOrg });
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
      .then(({ data: programInfo }) => {
        program = programInfo;
        return userService.getUsers(program.officers);
      })
      .then(({ data: { items: profiles } }) => {
        program.officers = profiles;
        commit('SET_ORGANIZATION_PROGRAM', program);
      })
      .catch((err) => { console.error(err); })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadUsers({ state, dispatch, commit }) {
    return userService.getUsersListing()
      .then(({ data: { items: users } }) => {
        commit('SET_ALL_USERS', users);
      })
      .catch((err) => { console.error(err); });
  },

  loadUniversity({ state, dispatch, commit }, { universityId }) {
    return teamService.getTeam(universityId)
      .then(({ data: university }) => {
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
