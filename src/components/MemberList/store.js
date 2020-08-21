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
    let members = [];
    let serviceMethod;

    if (payload.groupId !== undefined) {
      serviceMethod = deipRpc.api.getResearchGroupTokensByResearchGroupAsync(payload.groupId)
        .then((rgtList) => {
          rgtList.forEach((rgt) => {
            members.push({ rgt });
          });
          return usersService.getEnrichedProfiles(members.map((member) => member.rgt.owner));
        });
    } else {
      return commit('SET_MEMBERS', members);
    }

    return serviceMethod
      .then((users) => {
        const promises = [];
        members = members.map((member) => {
          const user = users.find((u) => u.account.name === member.rgt.owner);
          promises.push(deipRpc.api.getExpertTokensByAccountNameAsync(user.account.name));
          return {
            ...member,
            account: user.account,
            profile: user.profile
          };
        });

        return Promise.all(promises);
      })
      .then((expList) => {
        members = members.map((member, idx) => (
          {
            ...member,
            expertise: expList[idx]
          }
        ));
        return Promise.all(members.map(({ account: { name } }) => expertiseContributionsService.getAccountExpertiseStats(name, {})));
      })
      .then((expertiseStats) => {
        commit('SET_MEMBERS', members.map((item, i) => ({ ...item, expertiseStats: expertiseStats[i] })));
      })
      .catch((err) => console.error(err));
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
