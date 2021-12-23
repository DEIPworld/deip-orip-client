import moment from 'moment';
import { camelizeObjectKeys } from '@/utils/helpers';

import { AssetsService } from '@deip/assets-service';
import { ProjectService } from '@deip/project-service';
import { InvestmentsService } from '@deip/investments-service';
import { TeamService } from '@deip/team-service';
import { GrantsService } from '@deip/grants-service';

const teamService = TeamService.getInstance();
const investmentsService = InvestmentsService.getInstance();
const projectService = ProjectService.getInstance();
const assetsService = AssetsService.getInstance();
const grantsService = GrantsService.getInstance();

const state = {
  projects: [],
  projectTokens: [],
  projectTokensHolders: [],
  teams: [],
  assetsInfo: [],
  groupData: {},
  balances: [],
  investmentsRevenueHistory: [],
  allGroups: []
};

// getters
const getters = {
  allGroups: (state) => state.allGroups,

  assetsInfo: (state) => state.assetsInfo,
  balances: (state) => state.balances.map((item) => {
    const revenueHistoryChartData = [...item.revenueHistory];
    return {
      ...item,
      revenueHistoryChartData: revenueHistoryChartData.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateA - dateB;
      }).map((i) => [moment(i.timestamp).format('DD MMM YY'), Number(i.revenue.amount)])
    };
  }),
  groupData: (state) => state.groupData
};

// actions
const actions = {
  loadBalances({ state, commit }, account) {
    let balances = [];
    return assetsService.getAccountAssetsBalancesByOwner(account)
      .then((assetsBalances) => {
        // const securityTokens = assetsBalances
        //   .map((b) => camelizeObjectKeys(b))
        //   .filter((b) => !!b.tokenizedProject);
        const securityTokens = assetsBalances
          .filter((b) => !!b.tokenizedProject);
        balances.push(...securityTokens);
        return Promise.all(balances.map(
          (b) => projectService.getProject(b.tokenizedProject)
        ));
      })
      .then((projects) => {
        balances = balances.map((b) => ({
          ...b,
          project: projects.find((r) => r._id === b.tokenizedProject)
        }));

        return Promise.all(
          balances.map((b) => investmentsService.getAccountRevenueHistoryByAsset(
            b.owner,
            b.symbol,
            1
          ))
        );
      })
      .then((history) => {
        balances = balances.map((b) => ({
          ...b,
          revenueHistory: history.find(
            (r) => r[0] && r[0].security_token.string_symbol === b.symbol
          ) || []
        }));

        return Promise.all(
          balances.map((b) => investmentsService.getAssetRevenueHistory(
            b.symbol
          ))
        );
      })
      .then((securityTokenHistory) => {
        balances = balances.map((b) => ({
          ...b,
          securityTokenHistory: securityTokenHistory.find(
            (s) => s[0] && s[0].security_token.string_symbol === b.symbol
          ) || []
        }));

        commit('setBalances', balances);
      })
      .catch((err) => console.error(err));
  },

  loadAssetsInfo({ commit }, account) {
    return Promise.all(account.balances.map(
      ({ symbol }) => assetsService.getAssetBySymbol(symbol)
    ))
      .then((data) => {
        // const assetsInfo = data.map((a) => camelizeObjectKeys(a)).reduce(
        //   (result, item) => ({
        //     ...result,
        //     [item.stringSymbol]: item
        //   }), {}
        // );
        const assetsInfo = data.reduce(
          (result, item) => ({
            ...result,
            [item.symbol]: item
          }), {}
        );
        commit('SET_ASSETS_INFO', assetsInfo);
      })
      .catch((err) => console.error(err));
  },

  loadBalanceData({ commit, dispatch }, account) {
    let groupData = {};
    return teamService.getTeam(account)
      .then((group) => {
        groupData = group;
        return assetsService.getAccountAssetsBalancesByOwner(groupData._id);
      })
      .then((assetsBalances) => {
        // const currencies = assetsBalances
        //   .map((b) => camelizeObjectKeys(b))
        //   .filter((b) => !b.tokenizedProject);
        const currencies = assetsBalances
          .filter((b) => !b.tokenizedProject);
        groupData.balances = currencies;
        commit('setGroupData', groupData);
        return dispatch('loadAssetsInfo', groupData);
      })
      .catch((err) => console.error(err));
  },

  loadAllGroups({ commit }, user) {
    const groupList = [];
    return teamService.getTeamsByUser(user)
      .then((result) => {
        const groups = result.filter((item) => !item.is_personal);
        groupList.push(...groups);
        return Promise.all(groups.map((item) => projectService.getTeamProjectListing(item._id)));
      })
      .then((projects) => {
        groupList.forEach((g) => {
          const projectList = projects.filter(
            (r) => r[0] && r[0].teamId === g._id
          )[0];
          g.projectList = projectList;
        });
        return Promise.all(
          groupList.map(
            (item) => investmentsService.getAccountRevenueHistory(item._id)
          )
        );
      })
      .then((revenueHistory) => {
        groupList.forEach((g) => {
          const revenueHistoryList = revenueHistory.find(
            (r) => r[0] && r[0].account === g._id
          );
          g.revenueHistory = revenueHistoryList;
        });
        return Promise.all(groupList.reduce(
          (finalArr, item) => {
            if (item.projectList) {
              item.projectList.reduce((arr, r) => {
                r.securityTokens.forEach((rst) => arr.push(rst.symbol));
                return arr;
              }, []).forEach((symbol) => {
                finalArr.push(assetsService.getAccountAssetBalance(item._id, symbol));
              });
            }
            return finalArr;
          }, []
        ));
      })
      .then((result) => {
        groupList.forEach((g) => {
          const accountSecurityTokenBalances = result.filter(
            (r) => g._id === r.owner
          );
          g.accountSecurityTokenBalances = accountSecurityTokenBalances;
        });
        commit('SET_ALL_TEAMS', groupList);
      })
      .catch((err) => console.error(err));
  }
};

// mutations
const mutations = {
  SET_PROJECTS(state, list) {
    state.projects = list;
  },

  SET_PROJECT_TOKENS(state, list) {
    state.projectTokens = list;
  },

  SET_PROJECT_TOKENS_HOLDERS(state, list) {
    state.projectTokensHolders = list;
  },

  SET_TEAMS(state, list) {
    state.teams = list;
  },

  SET_ALL_TEAMS(state, allGroups) {
    state.allGroups = allGroups;
  },

  SET_ASSETS_INFO(state, list) {
    state.assetsInfo = list;
  },

  setInvestmentsRevenueHistory(state, history) {
    state.investmentsRevenueHistory = history;
  },

  setBalances(state, balances) {
    state.balances = balances;
  },

  setGroupData(state, groupData) {
    state.groupData = groupData;
  }
};

const namespaced = true;

export const walletStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
