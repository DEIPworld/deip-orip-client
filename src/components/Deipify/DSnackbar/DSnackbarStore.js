const moduleState = {
  message: '',
  type: ''
};

const moduleGetters = {
  message: (state) => state.message,
  type: (state) => state.type
};

const moduleActions = {
  showMessage(context, payload) {
    context.commit('showMessage', payload);
  },

  hideMessage(context) {
    context.commit('hideMessage');
  }
}

const moduleMutations = {
  showMessage(state, payload) {
    state.message = payload.message;
    state.type = payload.type;
  },

  hideMessage(state) {
    state.message = '';
    state.type = '';
  }
};

export const dSnackbarStore = {
  namespaced: true,
  state: moduleState,
  getters: moduleGetters,
  actions: moduleActions,
  mutations: moduleMutations
};
