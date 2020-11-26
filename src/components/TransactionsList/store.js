import { ProposalsService } from '@deip/proposals-service';
import { PROPOSAL_STATUS } from '@/variables';

const proposalsService = ProposalsService.getInstance();

const STATE = {
  transactions: []
};

const GETTERS = {
  pendingProposals: (state) => state.transactions.filter(
    ({ proposal: { status } }) => status === PROPOSAL_STATUS.PENDING
  ),
  completedProposals: (state) => state.transactions.filter(
    ({ proposal: { status } }) => status !== PROPOSAL_STATUS.PENDING
  )
};

const ACTIONS = {
  loadTransactions({ commit }, account) {
    return proposalsService.getAccountProposals(account)
      .then((proposals) => {
        commit('setTransactions', proposals.filter(proposal => !!proposal.type));
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
