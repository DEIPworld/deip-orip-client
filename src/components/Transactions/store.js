import { UsersService } from '@deip/users-service';
import { UserService } from '@deip/user-service';
import { ExpressLicensingService } from '@deip/express-licensing-service';

const expressLicensingService = ExpressLicensingService.getInstance();
const usersService = UsersService.getInstance();
const userService = UserService.getInstance();

const TX_STATUS = {
  approved: 'approved',
  pending: 'pending',
  resolved: 'resolved'
}

const STATE = {
  approvedRequests: [],
  pendingRequests: []
};

const GETTERS = {
  approvedRequests: (state) => state.approvedRequests,
  pendingRequests: (state) => state.pendingRequests
};

const ACTIONS = {
  loadApprovedRequests({ commit }) {
    return userService.getUserTransactions(TX_STATUS.resolved)
      .then((approvedRequests) => {
        commit('setApprovedRequests', approvedRequests);
      }, (err) => { console.error(err); });
  },
  loadPendingRequests({ commit }) {
    return userService.getUserTransactions(TX_STATUS.pending)
      .then((pendingRequests) => {
        commit('setPendingRequests', pendingRequests);
      }, (err) => { console.error(err); });
  }
};

const MUTATIONS = {
  setApprovedRequests(state, approvedRequests) {
    state.approvedRequests = approvedRequests;
  },
  setPendingRequests(state, pendingRequests) {
    state.pendingRequests = pendingRequests;
  }
};

export const transactionsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
