import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';

const usersService = UsersService.getInstance();

const STATE = {
  list: []
};

const GETTERS = {
  list: (state) => state.list
};

const ACTIONS = {
  getReviews({ commit }, researchExternalId) {
    const reviews = [];

    deipRpc.api.getReviewsByResearchAsync(researchExternalId)
      .then((items) => {
        reviews.push(...items);

        console.log(items);

        return Promise.all([
          Promise.all(reviews.map((item) => deipRpc.api.getReviewVotesByReviewIdAsync(item.id))),
          usersService.getEnrichedProfiles(reviews.map((r) => r.author))
        ]);
      }, (err) => { console.error(err); })
      .then(([reviewVotes, users]) => {
        reviews.forEach((review, i) => {
          review.author = users.find((u) => u.account.name === review.author);
          review.votes = reviewVotes[i];
          review.supporters = reviewVotes[i].reduce((arr, vote) => (arr.some(({ voter }) => voter === vote.voter) ? arr : [...arr, vote]), []);
        });
        commit('storeReviews', reviews);
      })
      .catch((err) => { console.error(err); });;
  }
};

const MUTATIONS = {
  storeReviews(state, list) {
    state.list = list;
  }
};

export const reviewsListStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
