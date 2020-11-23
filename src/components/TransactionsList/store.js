import { ProposalsService } from '@deip/proposals-service';
import { PROPOSAL_STATUS } from '@/variables';

const proposalsService = ProposalsService.getInstance();

const STATE = {
  transactions: []
};

const GETTERS = {
  pendingTrc: (state) => state.transactions.filter(
    ({ proposal: { status } }) => status === PROPOSAL_STATUS.PENDING
  ),
  completedTrc: (state) => state.transactions.filter(
    ({ proposal: { status } }) => status !== PROPOSAL_STATUS.PENDING
  )
};

const ACTIONS = {
  loadTransactions({ commit }, account) {
    return proposalsService.getAccountProposals(account)
      .then((transactions) => {
        commit('setTransactions', transactions);
      }, (err) => { console.error(err); });
  }
};

const MUTATIONS = {
  setTransactions(state, transactions) {
    state.transactions = transactions;
  }
};

export const transactionsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
