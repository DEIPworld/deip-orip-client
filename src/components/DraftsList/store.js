import { ProjectContentService } from '@deip/project-content-service';

const projectContentService = ProjectContentService.getInstance();

const STATE = {
  list: []
};

const GETTERS = {
  list: (state) => state.list
};

const ACTIONS = {
  getDrafts({ commit }, projectId) {
    return projectContentService.getDraftsByProject(projectId)
      .then(({ data: { items: drafts } }) => {
        commit('storeDrafts', drafts);
      })
      .catch((err) => { console.error(err); });
  },

  deleteDraft({ state, commit }, draftId) {
    return projectContentService.deleteProjectContentDraft(draftId)
      .then(() => {
        commit('storeDrafts', state.list.filter(draft => draft._id != draftId));
      })
      .catch((err) => { console.error(err); });
  },
};

const MUTATIONS = {
  storeDrafts(state, list) {
    state.list = list;
  },
};

export const draftsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
