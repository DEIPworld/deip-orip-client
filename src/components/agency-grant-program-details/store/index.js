import Vue from 'vue';
import { UsersService } from '@deip/users-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { GrantsService } from '@deip/grants-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { ResearchService } from '@deip/research-service';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService';

const usersService = UsersService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const grantsService = GrantsService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();
const researchService = ResearchService.getInstance();

const state = {
  organization: undefined,
  program: undefined,
  applications: [],

  corePrograms: [],
  additionalPrograms: [],
  appliedForGrantResearches: [],
  appliedForGrantResearchesEciStats: [],

  isLoadingOrganizationProgramDetailsPage: undefined,
  isLoadingOrganizationProgramDetails: undefined,
  isLoadingOrganizationProgramApplications: undefined
};

// getters
const getters = {
  organization: (state, getters) => state.organization,
  program: (state, getters) => state.program,
  applications: (state, getters) => state.applications,

  corePrograms: (state, getters) => state.corePrograms,
  additionalPrograms: (state, getters) => state.additionalPrograms,

  isLoadingOrganizationProgramDetailsPage: (state, getters) => state.isLoadingOrganizationProgramDetailsPage !== false,

  researchesAppliedForGrant: (state, getters) => {
     const list = state.appliedForGrantResearches.map((research, i) => {
      const eciStats = state.appliedForGrantResearchesEciStats.find((stats) => stats.research_external_id == research.external_id);
      return { ...research, eciStats: eciStats ? eciStats : { eci: 0, research_external_id: research.external_id } };
    })

    list.sort((a, b) => b.eciStats.eci - a.eciStats.eci);
    return list;
  }
};

// actions
const actions = {
  loadGrantProgramDetailsPage({ state, dispatch, commit }, { foaId }) {
    commit('SET_ORGANIZATION_PROGRAM_DETAILS_PAGE_LOADING_STATE', true);
    return researchGroupService.getResearchGroup(Vue.$env.TENANT)
      .then((organization) => {
        commit('SET_ORGANIZATION_PROFILE', organization);
        const organizationProgramDetailsLoad = dispatch('loadOrganizationProgramDetails', { foaId });
        return Promise.all([organizationProgramDetailsLoad]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAM_DETAILS_PAGE_LOADING_STATE', false);
      });
  },

  loadOrganizationProgramDetails({ state, dispatch, commit }, { foaId, notify }) {
    commit('SET_ORGANIZATION_PROGRAM_LOADING_STATE', true);

    let program;
    return grantsService.getFundingOpportunityAnnouncementByNumber(foaId)
      .then((programInfo) => {
        program = programInfo;
        return usersService.getUsers(program.officers);
      })
      .then((profiles) => {
        program.officers = profiles;
        mapAreaToProgram(program, state.organization.researchGroupRef.researchAreas);
        commit('SET_ORGANIZATION_PROGRAM', program);
        
        const attrId = Vue.$env.GRANT_DISTRIBUTION_TRANSPARENCY_DEMO_GRANT_ATTR_ID;
        let grantNumber = program.additional_info[attrId];
        return grantNumber ? dispatch('loadAppliedForGrantResearches', { 
          grantAttributeId: attrId,
          grantAttributeValue: grantNumber
         }) : Promise.resolve([]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAM_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadAppliedForGrantResearches({ state, dispatch, commit }, { grantAttributeId, grantAttributeValue }) {
    const filter = {
      // researchAttributes: [{
      //   attributeId: grantAttributeId,
      //   values: [grantAttributeValue]
      // }]
    }

    return researchService.getPublicResearchListing(filter)
      .then((result) => {
        commit('SET_RESEARCHES_APPLIED_FOR_GRANT', result);
        return Promise.all(result.map(r => expertiseContributionsService.getResearchExpertiseStats(r.external_id, {})))
      })
      .then((result) => {
        commit('SET_RESEARCHES_APPLIED_FOR_GRANT_ECI_STATS', result.filter(stats => !!stats.research_external_id));
      })
  }
};

// mutations
const mutations = {

  SET_ORGANIZATION_PROFILE(state, organization) {
    state.organization = organization;
  },

  SET_ORGANIZATION_PROGRAM(state, program) {
    state.program = program;
  },

  SET_ORGANIZATION_PROGRAM_APPLICATIONS(state, applications) {
    state.applications = applications;
  },

  SET_ORGANIZATION_PROGRAM_LOADING_STATE(state, isLoading) {
    state.isLoadingOrganizationProgramDetails = isLoading;
  },

  SET_ORGANIZATION_PROGRAM_APPLICATIONS_LOADING_STATE(state, isLoading) {
    state.isLoadingOrganizationProgramApplications = isLoading;
  },

  SET_ORGANIZATION_PROGRAM_DETAILS_PAGE_LOADING_STATE(state, isLoading) {
    state.isLoadingOrganizationProgramDetailsPage = isLoading;
  },

  SET_RESEARCHES_APPLIED_FOR_GRANT(state, researches) {
    state.appliedForGrantResearches = researches;
  },

  SET_RESEARCHES_APPLIED_FOR_GRANT_ECI_STATS(state, eciStats) {
    state.appliedForGrantResearchesEciStats = eciStats;
  }
};

const namespaced = true;

export const agencyGrantProgramDetailsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
