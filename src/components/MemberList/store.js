import deipRpc from '@deip/rpc-client';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { UsersService } from '@deip/users-service';

const usersService = UsersService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const STATE = {
  members: []
};

const GETTERS = {
  members: (state) => state.members
};

const ACTIONS = {
  loadMembers({ commit }, payload) {
    const members = [];
    if (payload.researchGroupExternalId !== undefined) {
      return usersService.getUsersByResearchGroup(payload.researchGroupExternalId)
        .then((users) => {
          members.push(...users);
          return Promise.all(members.map((member) => expertiseContributionsService.getAccountExpertiseTokens(member.account.name)));
        })
        .then((expList) => {
          for (let i = 0; i < members.length; i++) {
            const member = members[i];
            member.expertise = expList[i];
          }
          return Promise.all(members.map(({ account: { name } }) => expertiseContributionsService.getAccountExpertiseStats(name, {})));
        })
        .then((expertiseStats) => {
          for (let i = 0; i < members.length; i++) {
            const member = members[i];
            member.expertiseStats = expertiseStats[i];
          }
          commit('SET_MEMBERS', members);
        })
        .catch((err) => console.error(err));
    } else {
      commit('SET_MEMBERS', members);
    }
  }

};

const MUTATIONS = {
  SET_MEMBERS(state, members) {
    state.members = members;
  }
};

export const memberListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
