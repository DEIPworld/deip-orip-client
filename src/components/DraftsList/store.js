import { ResearchContentService } from '@deip/research-content-service';

const researchContentService = ResearchContentService.getInstance();

const STATE = {
  list: []
};

const GETTERS = {
  list: (state) => state.list
};

const ACTIONS = {
  getDrafts({ commit }, projectId) {
    return researchContentService.getResearchContentAndDraftsByResearch(projectId)
      .then((list) => {
        const drafts = list
          .filter((researchContent) => researchContent.isDraft)
          .map((researchContent) => ({ ...researchContent.researchContentRef })); 
        
        commit('storeDrafts', drafts);
      })
      .catch((err) => { console.error(err); });
  },

  deleteDraft({ state, commit }, draftId) {
    return researchContentService.deleteResearchContentDraft(draftId)
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
