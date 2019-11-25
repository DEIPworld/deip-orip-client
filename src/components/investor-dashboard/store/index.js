
import Vue from 'vue'
import deipRpc from '@deip/deip-oa-rpc-client'
import * as usersService from './../../../utils/user'
import investmentPortfolioService from './../../../services/InvestmentPortfolio'
import overdueNotifications from './overdueNotifications.json';

const defaultListId = "all";

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
}

// getters
const getters = {

  investmentPortfolio: (state, getters) => state.investmentPortfolio,

  investments: (state, getters) => {
    return state.researches
      .filter(r => this.selectedListId == defaultListId || getters.selectedList.listResearchesIds.some(id => id == r.id))
      .map(research => {

        let group = state.researchGroups.find(group => group.id == research.research_group_id);
        let researchShares = state.researchTokens.filter(rt => rt.research_id == research.id);
        let researchGroupsTokens = state.researchGroupsTokens.filter(rgt => rgt.research_group_id == research.research_group_id);

        let researchSharesHolders = state.researchTokensHolders.filter(user => researchShares.some(rt => rt.account_name == user.account.name));
        let researchGroupMembers = state.researchGroupsMembers.filter(user => researchGroupsTokens.some(rgt => rgt.owner == user.account.name));
        let researchMembers = researchGroupMembers.filter(user => research.members.some(member => member == user.account.name));
        
        let maxRgtVal = Math.max(...researchGroupsTokens.map(rgt => rgt.amount));
        let maxRgt = researchGroupsTokens.find(rgt => rgt.amount == maxRgtVal);

        let team = researchMembers.map((member) => {
          let rgt = researchGroupsTokens.find(rgt => rgt.owner == member.account.name);
          let isOwner = rgt.owner == maxRgt.owner;
          return { ...member, isOwner, weight: rgt };
        });
        let owner = researchGroupMembers.find(user => user.account.name == maxRgt.owner);
        let shareHolders = researchSharesHolders.map((shareHolder) => {
          let share = researchShares.find(rt => rt.account_name == shareHolder.account.name);
          return { ...shareHolder, share };
        });

        let portfolioRef = state.investmentPortfolio.researches.find(r => r.id == research.id);
        let tags = portfolioRef.tags.map(tag => {
          let list = state.investmentPortfolio.lists.find(l => l.id == tag.list);
          let color = list ? list.color : "";
          return { ...tag, color };
        });

        let comments = portfolioRef.comments.map(comment => {
          let author = state.commentAuthors.find(a => a.account.name == comment.username);
          return { ...comment, author };
        });

        return {
          research: { ...research, comments, owner }, 
          group, 
          team, 
          shareHolders, 
          portfolioRef: { ...portfolioRef, tags }
        };
      });
  },

  selectedInvestment: (state, getters) => {
    return getters.investments.find(inv => inv.research.id == state.selectedInvestmentId);   
  },

  lists: (state, getters) => {
    return state.investmentPortfolio.lists.map(list => {
      let listResearchesIds = state.investmentPortfolio.researches.reduce((acc, research) => {
        return research.tags.some(tag => tag.list == list.id) || list.id == defaultListId ? [research.id, ...acc] : acc;
      }, []);
      return { ...list, listResearchesIds };
    })
  },

  selectedList: (state, getters) => {
    return getters.lists.find(list => list.id == state.selectedListId);
  },

  overdueNotifications: (state, getters) => {
    return [];
    /* if (state.selectedListId == defaultListId) return overdueNotifications;
    return []; */
  },

  noResult: (state, getters) => {
    return getters.investments.length + getters.overdueNotifications.length == 0;
  }
}

// actions
const actions = {

  loadInvestmentPortfolioPage({ state, commit, dispatch }, { username }) {
    commit('SET_INVESTMENT_PORTFOLIO_PAGE_LOADING_STATE', true);

    return investmentPortfolioService.getInvestmentPortfolio(username)
      .then((investmentPortfolio) => {

        commit('SET_INVESTMENT_PORTFOLIO', investmentPortfolio);
        const researchesLoad = new Promise((resolve, reject) => {
          dispatch('loadInvestmentPortfolioResearches', { researchIds: state.investmentPortfolio.researches.map(r => r.id), notify: resolve })
        });
        const commentsLoad = new Promise((resolve, reject) => {
          dispatch('loadInvestmentPortfolioComments', { notify: resolve })
        });

        return Promise.all([researchesLoad, commentsLoad])
          .then(() => {
            commit('SET_SELECTED_LIST_ID', defaultListId);
            let selected = state.researches[0];
            if (selected) commit('SET_SELECTED_INVESTMENT_ID', selected.id);
          });

      }, (err => { console.log(err) }))
      .finally(() => {
        commit('SET_INVESTMENT_PORTFOLIO_PAGE_LOADING_STATE', false)
      })
  },

  loadInvestmentPortfolioResearches({ state, dispatch, commit }, { researchIds, notify }) {
    return Promise.all(researchIds.map(rId => deipRpc.api.getResearchByIdAsync(rId)))
      .then((researches) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCHES', researches);
        return Promise.all(researches
          .reduce((unique, research) => {
            if (unique.some(rgId => rgId == research.research_group_id)) return unique;
            return [research.research_group_id, ...unique];
          }, [])
          .map(rgId => deipRpc.api.getResearchGroupByIdAsync(rgId)));
      })
      .then((groups) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS', groups);
        return Promise.all(groups.map(group => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)));
      })
      .then((researchGroupsTokens) => {
        const tokens = [].concat.apply([], researchGroupsTokens);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_TOKENS', tokens);
        return usersService.getEnrichedProfiles(tokens.reduce((unique, rt) => {
          if (unique.some(name => name == rt.owner)) return unique;
          return [rt.owner, ...unique];
        }, []));
      })
      .then((members) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_MEMBERS', members);
        return Promise.all(researchIds.map(rId => deipRpc.api.getResearchTokensByResearchIdAsync(rId)));
      })      
      .then((researchTokens) => {
        const tokens = [].concat.apply([], researchTokens);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS', tokens);
        return usersService.getEnrichedProfiles(tokens.reduce((unique, share) => {
          if (unique.some(name => name == share.account_name)) return unique;
          return [share.account_name, ...unique];
        }, []));
      })
      .then((researchTokensHolders) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS_HOLDERS', researchTokensHolders);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  },

  loadInvestmentPortfolioComments({ state, dispatch, commit }, { notify }) {
    const allComments = [].concat.apply([], state.investmentPortfolio.researches.map(r => r.comments));
    const distinct = allComments
      .reduce((unique, comment) => {
        if (unique.some(username => comment.username == username)) return unique;
        return [comment.username, ...unique];
      }, []);

    return usersService.getEnrichedProfiles(distinct)
      .then((authors) => {
        commit('SET_INVESTMENT_PORTFOLIO_COMMENT_AUTHORS', authors);
      })
      .catch(err => { console.log(err) })
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
      let investmentId = getters.investments[0].research.id;
      if (state.selectedInvestmentId != investmentId)
        commit('SET_SELECTED_INVESTMENT_ID', investmentId);
    }
  },

  updateInvestmentMemo({ state, commit }, { investmentId, memo }) {
    let update = {};
    let researches = state.investmentPortfolio.researches.map(research => {
      return research.id == investmentId ? { ...research, memo } : research;
    });
    Object.assign(update, state.investmentPortfolio, { researches: researches });
    return investmentPortfolioService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('UPDATE_INVESTMENT_MEMO', { investmentId, memo });
      })
  },

  updateInvestmentListTags({ state, commit }, { investmentId, listId, listTags }) {
    let update = {};
    let researches = state.investmentPortfolio.researches.map(research => {
      if (research.id != investmentId) return research;
      let otherListsTags = research.tags.filter((tag => tag.list != listId));
      return { ...research, tags: [...otherListsTags, ...listTags.map((tagName => { return { name: tagName, list: listId } }))] }
    });
    Object.assign(update, state.investmentPortfolio, { researches: researches });
    return investmentPortfolioService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('UPDATE_INVESTMENT_LIST_TAGS', { investmentId, listId, listTags });
      })
  },

  addNewInvestmentList({ state, commit }, { listId, listName, color }) {
    let update = {};
    let lists = [...state.investmentPortfolio.lists, { id: listId, name: listName, color, researches: [] }];
    Object.assign(update, state.investmentPortfolio, { lists: lists });
    return investmentPortfolioService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('ADD_NEW_INVESTMENT_LIST', { listId, listName, color });
      })
  },

  editInvestmentList({ state, commit }, { listId, listName, color }) {
    let update = {};
    let lists = state.investmentPortfolio.lists.map(list => {
      if (list.id == listId) {
        return { id: listId, name: listName, color, researches: list.researches }
      } else {
        return list;
      }
    });
    Object.assign(update, state.investmentPortfolio, { lists: lists });
    return investmentPortfolioService.updateInvestmentPortfolio(state.investmentPortfolio._id, update)
      .then((updated) => {
        commit('EDIT_NEW_INVESTMENT_LIST', { listId, listName, color });
      })
  }
}

// mutations
const mutations = {

  ['SET_INVESTMENT_PORTFOLIO_PAGE_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingInvestmentPortfolioPage', isLoading)
  },

  ['SET_INVESTMENT_PORTFOLIO'](state, investmentPortfolio) {
    Vue.set(state, 'investmentPortfolio', investmentPortfolio)
  },

  ['SET_INVESTMENT_PORTFOLIO_RESEARCHES'](state, list) {
    Vue.set(state, 'researches', list)
  },

  ['SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS'](state, list) {
    Vue.set(state, 'researchGroups', list)
  },

  ['SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS'](state, list) {
    Vue.set(state, 'researchTokens', list)
  },

  ['SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS_HOLDERS'](state, list) {
    Vue.set(state, 'researchTokensHolders', list)
  },

  ['SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_TOKENS'](state, list) {
    Vue.set(state, 'researchGroupsTokens', list)
  },

  ['SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_MEMBERS'](state, list) {
    Vue.set(state, 'researchGroupsMembers', list)
  },

  ['SET_INVESTMENT_PORTFOLIO_COMMENT_AUTHORS'](state, list) {
    Vue.set(state, 'commentAuthors', list)
  },

  ['SET_SELECTED_INVESTMENT_ID'](state, id) {
    Vue.set(state, 'selectedInvestmentId', id)
  },

  ['SET_SELECTED_LIST_ID'](state, id) {
    Vue.set(state, 'selectedListId', id);
  },

  ['UPDATE_INVESTMENT_MEMO'](state, { investmentId, memo }) {
    let investment = state.investmentPortfolio.researches.find(r => r.id == investmentId);
    Vue.set(investment, 'memo', memo);
  },

  ['UPDATE_INVESTMENT_LIST_TAGS'](state, { investmentId, listId, listTags }) {
    let investment = state.investmentPortfolio.researches.find(r => r.id == investmentId);
    let otherListsTags = investment.tags.filter((tag => tag.list != listId));
    Vue.set(investment, 'tags', [...otherListsTags, ...listTags.map((tagName => { return { name: tagName, list: listId } }))]);
  },

  ['ADD_NEW_INVESTMENT_LIST'](state, { listId, listName, color }) {
    state.investmentPortfolio.lists.push({ id: listId, name: listName, color, researches: [] });
  },

  ['EDIT_NEW_INVESTMENT_LIST'](state, { listId, listName, color }) {
    let editedList = state.investmentPortfolio.lists.find(list => list.id == listId);
    Vue.set(editedList, 'name', listName);
    Vue.set(editedList, 'color', color);
  }
}

const namespaced = true;

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}