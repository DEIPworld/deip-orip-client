import { ResearchGroupService } from '@deip/research-group-service';
import { UserService } from '@deip/user-service';

const userService = UserService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => state.data
};

const ACTIONS = {
  fetch({ commit }, username) {
    const invites = [];
    return userService.getUserInvites(username)
      .then((list) => {
        const promises = [];
        for (let i = 0; i < list.length; i++) {
          const invite = list[i];
          invites.push(invite);
          promises.push(researchGroupService.getResearchGroup(invite.researchGroupExternalId));
        }
        return Promise.all(promises);
      })
      .then((groups) => {
        for (let i = 0; i < invites.length; i++) {
          const invite = invites[i];
          invite.group = groups[i];
        }
        commit('setList', invites);
      })
  }
};

const MUTATIONS = {
  setList(state, payload) {
    state.data = payload;
  }
};

export const invitesStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
