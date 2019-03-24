import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import applicationHttp from './../../../services/http/application';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'
import { getEnrichedProfiles } from './../../../utils/user';

const state = {
    agency: undefined,
    program: undefined,
    contract: undefined,

    isLoadingContractDetailsPage: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    program: (state, getters) => state.program,
    contract: (state, getters) => state.contract,

    relationsByOrganizations: (state, getters) => {
      let organizations = [];
      state.contract.relations.forEach(r => {
        const orgId = r.researcherUser.account.organisation_id;
        var organization = organizations.find(o => o.orgId == orgId);
        if (!organization) {
          organization = {
            orgId: orgId,
            relations: [],
            totalAmount: 0
          }
          organizations.push(organization);
        }
        organization.relations.push(r);
        organization.totalAmount += r.research_expenses.reduce((acc, exp) => acc + parseInt(exp[1], 10), 0);
      });
      return organizations;
    },

    isLoadingContractDetailsPage: (state, getters) => state.isLoadingContractDetailsPage !== false
}



// actions
const actions = {
    loadProgramContractDetailsPage({ state, dispatch, commit }, { agency, foaId, contractId }) {
        commit('SET_FUNDING_CONTACT_DETAILS_PAGE_LOADING_STATE', true);
        return agencyHttp.getAgencyProfile(agency)
          .then((agencyProfile) => {
            commit('SET_AGENCY_PROFILE', agencyProfile);
            const agencyProgramDetailsLoad = dispatch('loadProgramDetails', { foaId });
            const fundingContractLoad = dispatch('loadFundingContractDetails', { contractId });
            return Promise.all([agencyProgramDetailsLoad, fundingContractLoad])
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              commit('SET_FUNDING_CONTACT_DETAILS_PAGE_LOADING_STATE', false);
          });
    },

    loadProgramDetails({ state, dispatch, commit }, { foaId, notify }) {
        var program;
        return deipRpc.api.getFundingOpportunitiesByOpportunityNumberAsync(foaId)
          .then((programs) => {
              program = programs.find(p => p.agency_name == state.agency._id);
              return getEnrichedProfiles(program.officers);
          })
          .then((profiles) => {
              program.officers = profiles
              commit('SET_AGENCY_PROGRAM', program);
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              if (notify) notify();
          });
    },

    loadFundingContractDetails({ state, dispatch, commit }, { contractId, notify }) {
        var contract;
        return deipRpc.api.getFundingAsync(contractId)
          .then((item) => {
            contract = item;
            return deipRpc.api.getFundingResearchRelationsByFundingAsync(contract.id);
          })
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
            for (let i = 0; i <  contract.relations.length; i++) {
              contract.relations[i].researchExpenses = contract.relations[i]
                .research_expenses.map((exp) => {
                  let title = exp[0] == 1 ? 'Salary' : exp[0] == 2 ? 'Equipment' : 'Business Travel';
                  let amount = exp[1];
                  let type = exp[0];
                  
                  return { title, amount, type };
                })
            }

            commit('SET_FUNDING_CONTRACT_DETAILS', contract);
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              if (notify) notify();
          });
    },


}

// mutations
const mutations = {
  ['SET_AGENCY_PROFILE'](state, agency) {
      Vue.set(state, 'agency', agency)
  },

  ['SET_AGENCY_PROGRAM'](state, program) {
      mapAreaToProgram(program, state.agency.researchAreas);
      Vue.set(state, 'program', program)
  },

  ['SET_FUNDING_CONTRACT_DETAILS'](state, contract) {
    Vue.set(state, 'contract', contract)
  },

  ['SET_FUNDING_CONTACT_DETAILS_PAGE_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingContractDetailsPage', isLoading)
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