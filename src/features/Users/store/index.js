import { UsersService } from '@deip/users-service';
import { TeamService } from '@deip/team-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne
} from '@/utils/helpers';

const usersService = UsersService.getInstance();
const teamService = TeamService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  one: (state) => (username, query = {}) => collectionOne(state.data, {
    ...(username ? { username } : {}),
    ...query
  })
};

const ACTIONS = {
  get({ commit }, username) {
    return Promise.all([
      usersService.getUser(username),
      teamService.getTeamsByUser(username),
      expertiseContributionsService.getAccountExpertiseTokens(username)
    ])
      .then(([{ account, profile }, teams, expertise]) => {
        commit('setOne', {
          username,
          account,
          profile,
          teams: teams.map((t) => camelizeObjectKeys(t)),
          expertise: expertise.map((e) => camelizeObjectKeys(e))
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setOne(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      camelizeObjectKeys(payload),
      { key: 'username' }
    );
  }
};

export const usersStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};

export * from './usersListStore';
