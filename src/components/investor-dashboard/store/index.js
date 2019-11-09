
import Vue from 'vue'
import deipRpc from '@deip/deip-oa-rpc-client'
import * as usersService from './../../../utils/user'
import investmentPortfolioService from './../../../services/InvestmentPortfolio'

const state = {
  investmentPortfolio: null,
  selectedInvestmentId: undefined,
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
    return state.researches.map(research => {

      let group = state.researchGroups.find(group => group.id == research.research_group_id);
      let researchShares = state.researchTokens.filter(rt => rt.research_id == research.id);
      let researchGroupsTokens = state.researchGroupsTokens.filter(rgt => rgt.research_group_id == research.research_group_id);

      let researchSharesHolders = state.researchTokensHolders.filter(user => researchShares.some(rt => rt.account_name == user.account.name));
      let researchMembers = state.researchGroupsMembers.filter(user => researchGroupsTokens.some(rgt => rgt.owner == user.account.name));
      
      let maxRgt = Math.max(...researchGroupsTokens.map(rgt => rgt.amount));
      let team = researchMembers.map((member) => {
        let weight = researchGroupsTokens.find(rgt => rgt.owner == member.account.name);
        let isOwner = weight.amount == maxRgt;
        return { ...member, isOwner, weight };
      });
      
      let shareHolders = researchSharesHolders.map((shareHolder) => {
        let share = researchShares.find(rt => rt.account_name == shareHolder.account.name);
        return { ...shareHolder, share };
      });

      let portfolioRef = state.investmentPortfolio.researches.find(r => r.id == research.id);
      let tags = portfolioRef.tags.map(tag => {
        let list = state.investmentPortfolio.lists.find(l => l.id == tag.list);
        let color = list ? list.color : "";
        return { ...tag, color };
      })

      return {
        research: { ...research, owner: team.find(m => m.isOwner) }, 
        group, 
        team, 
        shareHolders, 
        portfolioRef: { ...portfolioRef, tags }
      };
    })
  },

  selectedInvestment: (state, getters) => {
    return getters.investments.find(inv => inv.research.id == state.selectedInvestmentId);   
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

        return Promise.all([researchesLoad])
          .then(() => {
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
        return Promise.all(researches.map(research => deipRpc.api.getResearchGroupByIdAsync(research.research_group_id)));
      })
      .then((groups) => {
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS', groups);
        return Promise.all(groups.map(group => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)));
      })
      .then((researchGroupsTokens) => {
        const tokens = [].concat.apply([], researchGroupsTokens);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_TOKENS', tokens);
        return usersService.getEnrichedProfiles(tokens.map(m => m.owner));
      })
      .then((members) => {
        const distinct = members.reduce((unique, member) => {
          if (unique.some(user => member.account.name == user.account.name)) return unique;
          return [member, ...unique];
        }, []);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_GROUPS_MEMBERS', distinct);
        return Promise.all(researchIds.map(rId => deipRpc.api.getResearchTokensByResearchIdAsync(rId)));
      })      
      .then((researchTokens) => {
        const tokens = [].concat.apply([], researchTokens);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS', tokens);
        return usersService.getEnrichedProfiles(tokens.map(m => m.account_name));
      })
      .then((researchTokensHolders) => {
        const distinct = researchTokensHolders.reduce((unique, shareHolder) => {
          if (unique.some(user => shareHolder.account.name == user.account.name)) return unique;
          return [shareHolder, ...unique];
        }, []);
        commit('SET_INVESTMENT_PORTFOLIO_RESEARCH_TOKENS_HOLDERS', distinct);
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (notify) notify();
      });
  },

  selectInvestment({ state, commit }, investmentId) {
    commit('SET_SELECTED_INVESTMENT_ID', investmentId);
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

  ['SET_SELECTED_INVESTMENT_ID'](state, isLoading) {
    Vue.set(state, 'selectedInvestmentId', isLoading)
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