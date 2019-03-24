import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import applicationHttp from './../../../services/http/application';
import { getEnrichedProfiles } from './../../../utils/user';
import { organizations } from './../../../utils/organizations';

const state = {
    contracts: [],
    isLoadingContractsDetailsPage: undefined
}


// getters
const getters = {
  contracts: (state, getters) => state.contracts,
  contractsByAgencies: (state, getters) => {
    let ordered = [];
    for (let i = 0; i < state.contracts.length; i++) {
      let contract = state.contracts[i];
      let orgId = contract.creatorUser.account.organisation_id;
      var agency = ordered.find(c => c.id == orgId);

      if (!agency) {
        agency = {
          id: organizations[orgId].id,
          title: organizations[orgId].title,
          contracts: [],
          totalAgencyAmount: 0
        };
        ordered.push(agency);
      }

      agency.contracts.push(contract);
      agency.totalAgencyAmount += contract.relations.reduce((acc, rel) => {
         return acc + rel.research_expenses.reduce((acc, exp) => acc + parseInt(exp[1], 10), 0);
      }, 0);
    }
    
    return ordered;
  },

  isLoadingContractsDetailsPage: (state, getters) => state.isLoadingContractsDetailsPage !== false
}

// actions
const actions = {
    loadTreasuryDepartmentPage({ state, dispatch, commit }) {
        commit('SET_FUNDING_CONTACTS_DETAILS_PAGE_LOADING_STATE', true);
        const contractsLoad = dispatch('loadFundingContracts', { notify: null });
        Promise.all([contractsLoad])
          .then(() => {
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              commit('SET_FUNDING_CONTACTS_DETAILS_PAGE_LOADING_STATE', false);
          });
    },

    loadFundingContracts({ state, dispatch, commit }, { notify }) {
        const contracts = [];
        return deipRpc.api.getFundingsAsync()
          .then((items) => {
            contracts.push(...items)
            return Promise.all(items.map(c => dispatch('loadFundingContractDetails', { contract: c, notify: null })));
          })
          .then(() => {
            return Promise.all(contracts.map(c => deipRpc.api.getFundingOpportunityAsync(c.funding_opportunity_id)))
          })
          .then((fundingOpportunities) => {
            for (let i = 0; i < fundingOpportunities.length; i++) {
              let foa = fundingOpportunities[i];
              let contract = contracts[i];
              contract.foa = foa;
            }
            let names = contracts.map(r => r.granter);
            return getEnrichedProfiles(names);
          })
          .then((creators) => {
            for (let i = 0; i < creators.length; i++) {
              let creator = creators[i];
              let contract = contracts[i];
              contract.creatorUser = creator;
            }
            commit('SET_FUNDING_CONTRACTS_DETAILS', contracts);
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              if (notify) notify();
          });
    },

    loadFundingContractDetails({ state, dispatch, commit }, { contract, notify }) {
        return deipRpc.api.getFundingResearchRelationsByFundingAsync(contract.id)
          .then((relations) => {
            contract.relations = relations;
            return Promise.all(contract.relations.map(r => deipRpc.api.getFundingMilestonesByResearchAsync(r.id)));
          })
          .then((milestones) => {
            for (let i = 0; i < milestones.length; i++) {
              contract.relations[i].milestones = milestones[i];
            }
            let names = contract.relations.map(r => r.researcher);
            return getEnrichedProfiles(names);
          })
          .then((researchers) => {
            for (let i = 0; i < researchers.length; i++) {
              contract.relations[i].researcherUser = researchers[i];
            }
            for (let i = 0; i < contract.relations.length; i++) {
              contract.relations[i].researchExpenses = contract.relations[i]
                .research_expenses.map((exp) => {
                  let title = exp[0] == 1 ? 'Salary' : exp[0] == 2 ? 'Equipment' : 'Business Travel';
                  let amount = exp[1];
                  let type = exp[0];
                  
                  return { title, amount, type };
                })
            }
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              if (notify) notify();
          });
    }

}

// mutations
const mutations = {
  ['SET_FUNDING_CONTRACTS_DETAILS'](state, contracts) {
    Vue.set(state, 'contracts', contracts)
  },

  ['SET_FUNDING_CONTACTS_DETAILS_PAGE_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingContractsDetailsPage', isLoading)
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