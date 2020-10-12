import { UsersService } from '@deip/users-service';
import { ExpressLicensingService } from '@deip/express-licensing-service';

const expressLicensingService = ExpressLicensingService.getInstance();
const usersService = UsersService.getInstance();

const statuses = {
  approved: 'approved',
  pending: 'pending'
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
    return expressLicensingService.getExpressLicensingRequestsByStatus(statuses.approved)
      .then((approvedRequests) => {
        commit('setApprovedRequests', approvedRequests);
      }, (err) => { console.error(err); });
  },
  loadPendingRequests({ commit }) {
    return expressLicensingService.getExpressLicensingRequestsByStatus(statuses.pending)
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
