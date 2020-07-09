import Vue from 'vue';
import deipRpc from '@deip/rpc-client';

import { UsersService } from '@deip/users-service';
import { InvestmentsService } from '@deip/investments-service';
import { ResearchService } from '@deip/research-service';

const usersService = UsersService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const researchService = ResearchService.getInstance();

const defaultListId = 'all';

const state = {
  investmentPortfolio: null,
  commentAuthors: [],
  selectedInvestmentId: undefined,
  selectedListId: undefined,
  isLoadingInvestmentPortfolioPage: undefined,

  researches: [],
  researchTokens: [],
  researchTokensHolders: [],

  researchGroups: [],
  researchGroupsTokens: [],
  researchGroupsMembers: []
};

// getters
const getters = {

  investmentPortfolio: (state, getters) => state.investmentPortfolio,

  investments: (state, getters) => state.researches
    .filter((r) => state.selectedListId == defaultListId || getters.selectedList.listResearchesIds.some((id) => id == r.external_id))
    .map((research) => {
      const group = state.researchGroups.find((group) => group.id == research.research_group_id);
      const researchShares = state.researchTokens.filter((rt) => rt.research_external_id == research.external_id);
      const researchGroupsTokens = state.researchGroupsTokens.filter((rgt) => rgt.research_group_id == research.research_group_id);

      const researchSharesHolders = state.researchTokensHolders.filter((user) => researchShares.some((rt) => rt.account_name == user.account.name));
      const researchGroupMembers = state.researchGroupsMembers.filter((user) => researchGroupsTokens.some((rgt) => rgt.owner == user.account.name));
      const researchMembers = researchGroupMembers.filter((user) => research.members.some((member) => member == user.account.name));

      const maxRgtVal = Math.max(...researchGroupsTokens.map((rgt) => rgt.amount));
      const maxRgt = researchGroupsTokens.find((rgt) => rgt.amount == maxRgtVal);

      const team = researchMembers.map((member) => {
        const rgt = researchGroupsTokens.find((rgt) => rgt.owner == member.account.name);
        const isOwner = rgt.owner == maxRgt.owner;
        return { ...member, isOwner, weight: rgt };
      });
      const owner = researchGroupMembers.find((user) => user.account.name == maxRgt.owner);
      const shareHolders = researchSharesHolders.map((shareHolder) => {
        const share = researchShares.find((rt) => rt.account_name == shareHolder.account.name);
        return { ...shareHolder, share };
      });

      const portfolioRef = state.investmentPortfolio.researches.find((r) => r.id == research.external_id);
      const tags = portfolioRef.tags.map((tag) => {
        const list = state.investmentPortfolio.lists.find((l) => l.id == tag.list);
        const color = list ? list.color : '';
        return { ...tag, color };
      });

      const comments = portfolioRef.comments.map((comment) => {
        const author = state.commentAuthors.find((a) => a.account.name == comment.username);
        return { ...comment, author };
      });

      return {
        research: {
          ...research, comments, owner, ref: research.researchRef
        },
        group,
        team,
        shareHolders,
        portfolioRef: { ...portfolioRef, tags }
      };
    }),

  selectedInvestment: (state, getters) => getters.investments.find((inv) => inv.research.external_id == state.selectedInvestmentId),

  lists: (state, getters) => state.investmentPortfolio.lists.map((list) => {
    const listResearchesIds = state.investmentPortfolio.researches.reduce((acc, research) => (research.tags.some((tag) => tag.list == list.id) || list.id == defaultListId ? [research.id, ...acc] : acc), []);
    return { ...list, listResearchesIds };
  }),

  selectedList: (state, getters) => getters.lists.find((list) => list.id == state.selectedListId),

  overdueNotifications: (state, getters) => [], /* if (state.selectedListId == defaultListId) return overdueNotifications;
    return []; */


  noResult: (state, getters) => getters.investments.length + getters.overdueNotifications.length === 0
};

// actions
const actions = {

  loadInvestmentPortfolioPage({ state, commit, dispatch }, { username }) {
    commit('SET_INVESTMENT_PORTFOLIO_PAGE_LOADING_STATE', true);

    return investmentsService.getInvestmentPortfolio(username)
      .then((investmentPortfolio) => {
        commit('SET_INVESTMENT_PORTFOLIO', investmentPortfolio);
        const researchesLoad = new Promise((resolve, reject) => {
          dispatch('loadInvestmentPortfolioResearches', {
            researchExternalIds: state.investmentPortfolio.researches.map((r) => r.id),
            notify: resolve
          });
        });
        const commentsLoad = new Promise((resolve, reject) => {
          dispatch('loadInvestmentPortfolioComments', { notify: resolve });
        });

        return Promise.all([researchesLoad, commentsLoad])
          .then(() => {
            commit('SET_SELECTED_LIST_ID', defaultListId);
            const selected = state.researches[0];
            if (selected) commit('SET_SELECTED_INVESTMENT_ID', selected.external_id);
          });
      }, ((err) => {
        console.log(err);
      }))
      .finally(() => {
        commit('SET_INVESTMENT_PORTFOLIO_PAGE_LOADING_STATE', false);
      });
  },

  loadInvestmentPortfolioResearches({ state, dispatch, commit }, { researchExternalIds, notify }) {

    return Promise.all(researchExternalIds.map((externalId) => researchService.getResearch(externalId)))
      .then((items) => {
        const researches = items.filter(r => !!r);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCHES', researches);
        return Promise.all(state.researches
          .reduce((unique, research) => {
            if (unique.some((rgId) => rgId == research.research_group_id)) return unique;
            return [research.research_group_id, ...unique];
          }, [])
          .map((rgId) => deipRpc.api.getResearchGroupByIdAsync(rgId)));
      })
      .then((groups) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS', groups);
        return Promise.all(groups.map((group) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)));
      })
      .then((researchGroupsTokens) => {
        const tokens = [].concat.apply([], researchGroupsTokens);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_TOKENS', tokens);
        return usersService.getEnrichedProfiles(tokens.reduce((unique, rt) => {
          if (unique.some((name) => name == rt.owner)) return unique;
          return [rt.owner, ...unique];
        }, []));
      })
      .then((members) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_MEMBERS', members);
        return Promise.all(state.researches.map((research) => deipRpc.api.getResearchTokensByResearchIdAsync(research.id)));
      })
      .then((researchTokens) => {
        const tokens = [].concat.apply([], researchTokens);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS', tokens);
        return usersService.getEnrichedProfiles(tokens.reduce((unique, share) => {
          if (unique.some((name) => name == share.account_name)) return unique;
          return [share.account_name, ...unique];
        }, []));
      })
      .then((researchTokensHolders) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS_HOLDERS', researchTokensHolders);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadInvestmentPortfolioComments({ state, dispatch, commit }, { notify }) {
    const allComments = [].concat.apply([], state.investmentPortfolio.researches.map((r) => r.comments));
    const distinct = allComments
      .reduce((unique, comment) => {
        if (unique.some((username) => comment.username == username)) return unique;
        return [comment.username, ...unique];
      }, []);

    return usersService.getEnrichedProfiles(distinct)
      .then((authors) => {
        commit('SET_INVESTMENT_PORTFOLIO_COMMENT_AUTHORS', authors);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (notify) notify();
      });
  },

  selectInvestment({ state, commit }, investmentId) {
    commit('SET_SELECTED_INVESTMENT_ID', investmentId);
  },

  selectList({ state, getters, commit }, listId) {
    commit('SET_SELECTED_LIST_ID', listId);
    if (getters.investments.length) {
      const investmentId = getters.investments[0].research.external_id;
      if (state.selectedInvestmentId != investmentId) commit('SET_SELECTED_INVESTMENT_ID', investmentId);
    }
  },

  updateInvestmentMemo({ state, commit }, { investmentId, memo }) {
    const update = {};
    const researches = state.investmentPortfolio.researches.map((research) => (research.id == investmentId ? { ...research, memo } : research));
    Object.assign(update, state.investmentPortfolio, { researches });
    return investmentsService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('UPDATE_INVESTMENT_MEMO', { investmentId, memo });
      });
  },

  updateInvestmentListTags({ state, commit }, { investmentId, listId, listTags }) {
    const update = {};
    const researches = state.investmentPortfolio.researches.map((research) => {
      if (research.id != investmentId) return research;
      const otherListsTags = research.tags.filter(((tag) => tag.list != listId));
      return {
        ...research,
        tags: [...otherListsTags, ...listTags.map(((tagName) => ({ name: tagName, list: listId })))]
      };
    });
    Object.assign(update, state.investmentPortfolio, { researches });
    return investmentsService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('UPDATE_INVESTMENT_LIST_TAGS', { investmentId, listId, listTags });
      });
  },

  addNewInvestmentList({ state, commit }, { listId, listName, color }) {
    const update = {};
    const lists = [...state.investmentPortfolio.lists, {
      id: listId, name: listName, color, researches: []
    }];
    Object.assign(update, state.investmentPortfolio, { lists });
    return investmentsService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('ADD_NEW_INVESTMENT_LIST', { listId, listName, color });
      });
  },

  editInvestmentList({ state, commit }, { listId, listName, color }) {
    const update = {};
    const lists = state.investmentPortfolio.lists.map((list) => {
      if (list.id == listId) {
        return {
          id: listId, name: listName, color, researches: list.researches
        };
      }
      return list;
    });
    Object.assign(update, state.investmentPortfolio, { lists });
    return investmentsService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('EDIT_NEW_INVESTMENT_LIST', { listId, listName, color });
      });
  }
};

// mutations
const mutations = {

  SET_INVESTMENT_PORTFOLIO_PAGE_LOADING_STATE(state, isLoading) {
    state.isLoadingInvestmentPortfolioPage = isLoading;
  },

  SET_INVESTMENT_PORTFOLIO(state, investmentPortfolio) {
    state.investmentPortfolio = investmentPortfolio;
  },

  SET_INVESTMENT_PORTFOLIO_RESEARCHES(state, list) {
    state.researches = list;
  },

  SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS(state, list) {
    state.researchGroups = list;
  },

  SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS(state, list) {
    state.researchTokens = list;
  },

  SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS_HOLDERS(state, list) {
    state.researchTokensHolders = list;
  },

  SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_TOKENS(state, list) {
    state.researchGroupsTokens = list;
  },

  SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_MEMBERS(state, list) {
    state.researchGroupsMembers = list;
  },

  SET_INVESTMENT_PORTFOLIO_COMMENT_AUTHORS(state, list) {
    state.commentAuthors = list;
  },

  SET_SELECTED_INVESTMENT_ID(state, externalId) {
    state.selectedInvestmentId = externalId;
  },

  SET_SELECTED_LIST_ID(state, id) {
    state.selectedListId = id;
  },

  UPDATE_INVESTMENT_MEMO(state, { investmentId, memo }) {
    const investment = state.investmentPortfolio.researches.find((r) => r.id == investmentId);
    investment.memo = memo;
  },

  UPDATE_INVESTMENT_LIST_TAGS(state, { investmentId, listId, listTags }) {
    const investment = state.investmentPortfolio.researches.find((r) => r.id == investmentId);
    const otherListsTags = investment.tags.filter(((tag) => tag.list != listId));
    investment.tags = [...otherListsTags, ...listTags.map(((tagName) => ({ name: tagName, list: listId })))];
  },

  ADD_NEW_INVESTMENT_LIST(state, { listId, listName, color }) {
    state.investmentPortfolio.lists.push({
      id: listId, name: listName, color, researches: []
    });
  },

  EDIT_NEW_INVESTMENT_LIST(state, { listId, listName, color }) {
    const editedList = state.investmentPortfolio.lists.find((list) => list.id == listId);
    editedList.name = listName;
    editedList.color = color;
  }
};

const namespaced = true;


export const investorPortfolioStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
