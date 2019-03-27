import Vue from 'vue';
import deipRpc from '@deip/deip-rpc-client';
import agencyHttp from './../../../services/http/agency';
import applicationHttp from './../../../services/http/application';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService'
import { getEnrichedProfiles } from './../../../utils/user';
import { organizations } from './../../../utils/organizations';

const granter = "alice";
const state = {
    agency: undefined,
    withdrawRequests: [],
    relationsWithReports: [],
    isAgencyProgramWithdrawalRequests: undefined
}

// getters
const getters = {
    agency: (state, getters) => state.agency,
    withdrawRequests: (state) => state.withdrawRequests,
    relationsWithReports: (state) => state.relationsWithReports,
    withdrawRequestsByOrganizations: (state) => {
      let organizations = [];
      state.withdrawRequests.forEach(r => {
        const orgId = r.requesterUser.account.organisation_id;
        var organization = organizations.find(o => o.orgId == orgId);
        if (!organization) {
          organization = {
            orgId: orgId,
            withdraws: []
          }
          organizations.push(organization);
        }
        organization.withdraws.push(r);
      });
      return organizations;
    },

    relationsWithReportsByOrganizations(state) {
      let organizations = [];

      for(let i = 0; i < state.relationsWithReports.length; i++) {
        let rel = state.relationsWithReports[i];
        if (!rel.activeMilestone) continue;

        let isLater = (str1, str2) => { return new Date(str1) > new Date(str2)};
        if (isLater(rel.report.created_at, rel.activeMilestone.deadline)) continue;

        const orgId = rel.researcherUser.account.organisation_id;
        var organization = organizations.find(o => o.orgId == orgId);
        if (!organization) {
          organization = {
            orgId: orgId,
            relationsWithReports: []
          }
          organizations.push(organization);
        }
        organization.relationsWithReports.push(rel);
      }
      return organizations;
    },

    isAgencyProgramWithdrawalRequests: (state, getters) => state.isAgencyProgramWithdrawalRequests !== false
}


// actions
const actions = {

    loadAgencyProgramWithdrawalRequestsPage({ state, dispatch, commit }, { agency }) {
        commit('SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE', true);
        agency = "nsf"; // demo
        return agencyHttp.getAgencyProfile(agency)
          .then((agencyProfile) => {
            commit('SET_AGENCY_PROFILE', agencyProfile);
            // const fundingWithdrawalRequestsLoad = dispatch('loadFundingWithdrawalRequests', { notify: false});
            const milestoneReportsLoad = dispatch('loadMilestoneReports', { notify: false});
            return Promise.all([milestoneReportsLoad])
          })
          .catch(err => { console.log(err) })
          .finally(() => {
              commit('SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE', false);
          });
    },

    loadMilestoneReports({ state, dispatch, commit }, { notify }) {
      const reports = [];
      const allFundings = [];
      const relationsWithReports = [];

      return deipRpc.api.getMilestoneReportsByGrantorAsync(granter)
        .then((items) => {

          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (!reports.some(r => r.id == item.id)){
              reports.push(item)
            }
          }
          return Promise.all(reports.map(r => deipRpc.api.getResearchByIdAsync(r.research_id)))
        })
        .then((researches) => {
          for (let i = 0; i < researches.length; i++) {
            reports[i].research = researches[i];
          }
          return deipRpc.api.getFundingsByGranterAsync(granter);
        })
        .then((fundings) => {
          allFundings.push(...fundings);
          return Promise.all(allFundings.map(f => deipRpc.api.getFundingResearchRelationsByFundingAsync(f.id)))
        })
        .then((items) => {
          const relations = [].concat.apply([], items);

          for (let i = 0; i < relations.length; i++) {
            let relation = relations[i];
            for(let j = 0; j < reports.length; j++){
              let report = reports[j];
              report.relations = report.relations || [];
              if (report.research_id == relation.research_id) {
                relation.report = report;
                relation.research = report.research;
                relation.funding = allFundings.find(f => f.id == relation.funding_id);
                
                report.relations.push(relation);
                relationsWithReports.push(relation);
              }
            }
          }
          return Promise.all(relationsWithReports.map(f => deipRpc.api.getFundingOpportunityAsync(f.funding.funding_opportunity_id)));
        })
        .then((programs) => {
          for (let i = 0; i < programs.length; i++) {
            relationsWithReports[i].foa = programs[i];
          }
          let researchers = relationsWithReports.map(r => r.researcher);
          return getEnrichedProfiles(researchers);
        })
        .then((researchers) => {
          for (let i = 0; i < researchers.length; i++) {
            relationsWithReports[i].researcherUser = researchers[i];
          }
          return Promise.all(relationsWithReports.map(r => deipRpc.api.getFundingMilestonesByResearchAsync(r.id)));
        })
        .then((milestones) => {
          for (let i = 0; i < milestones.length; i++) {
            relationsWithReports[i].activeMilestone = milestones[i].find(m => m.status == 1);
          }
          commit('SET_RELATIONS_WITH_REPORTS', relationsWithReports);
        })
        .catch(err => { console.log(err) })
        .finally(() => {
            if (notify) notify();
        });

    }

    // loadFundingWithdrawalRequests({ state, dispatch, commit }, { notify }) {
    //   const requests = [];
    //   return deipRpc.api.getFundingWithdrawalRequestsAsync()
    //     .then((items) => {
    //       items = items.filter(i => i.status == 1); // pending only
    //       requests.push(...items);
    //       let requesters = requests.map(r => r.requester);
    //       return getEnrichedProfiles(requesters);
    //     })
    //     .then((requesters) => {
          // for (let i = 0; i < requesters.length; i++) {
          //   requests[i].requesterUser = requesters[i];
          // }
    //       return Promise.all(requests.map(r => deipRpc.api.getFundingResearchRelationAsync(r.funding_research_relation_id)))
    //     })
    //     .then((relations) => {
    //       for (let i = 0; i < relations.length; i++) {
    //         requests[i].relation = relations[i];
    //       }
    //       return Promise.all(relations.map(r => deipRpc.api.getFundingAsync(r.funding_id)))
    //     })
    //     .then((fundings) => {
    //       for (let i = 0; i < fundings.length; i++) {
    //         requests[i].funding = fundings[i];
    //       }
    //       return Promise.all(fundings.map(r => deipRpc.api.getFundingOpportunityAsync(r.funding_opportunity_id)))
    //     })
    //     .then((programs) => {
    //       for (let i = 0; i < programs.length; i++) {
    //         requests[i].foa = programs[i];
    //       }
    //       return Promise.all(requests.map(r => deipRpc.api.getResearchByIdAsync(r.relation.research_id)))
    //     })
    //     .then((researches) => {
    //       for (let i = 0; i < researches.length; i++) {
    //         requests[i].research = researches[i];
    //       }
          // commit('SET_FUNDING_WITHDRAW_REQUESTS_PROFILE', requests);
    //     })
    //     .catch(err => { console.log(err) })
    //     .finally(() => {
    //         if (notify) notify();
    //     });
    // }

}

// mutations
const mutations = {
  ['SET_AGENCY_PROFILE'](state, agency) {
      Vue.set(state, 'agency', agency)
  },

  ['SET_FUNDING_WITHDRAW_REQUESTS_PROFILE'](state, list) {
    Vue.set(state, 'withdrawRequests', list)
  },

  ['SET_RELATIONS_WITH_REPORTS'](state, list) {
    Vue.set(state, 'relationsWithReports', list)
  },

  ['SET_AGENCY_PROGRAM_WITHDRAWAL_REQUESTS_PAGE_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isAgencyProgramWithdrawalRequests', isLoading)
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