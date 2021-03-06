import Vue from 'vue';
import { UserService } from '@deip/user-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { GrantsService } from '@deip/grants-service';
import { ProjectService } from '@deip/project-service';
import { TeamService } from '@deip/team-service';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService';

const teamService = TeamService.getInstance();
const userService = UserService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const grantsService = GrantsService.getInstance();
const projectService = ProjectService.getInstance();

const state = {
  organization: undefined,
  program: undefined,
  applications: [],

  corePrograms: [],
  additionalPrograms: [],
  appliedForGrantProjects: [],
  appliedForGrantProjectsEciStats: [],

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

  projectsAppliedForGrant: (state, getters) => {
     const list = state.appliedForGrantProjects.map((project, i) => {
      const eciStats = state.appliedForGrantProjectsEciStats.find((stats) => stats.projectId == project._id);
      return { ...project, eciStats: eciStats ? eciStats : { eci: 0, projectId: project._id } };
    })

    list.sort((a, b) => b.eciStats.eci - a.eciStats.eci);
    return list;
  }
};

// actions
const actions = {
  loadGrantProgramDetailsPage({ state, dispatch, commit }, { foaId }) {
    commit('SET_ORGANIZATION_PROGRAM_DETAILS_PAGE_LOADING_STATE', true);
    return teamService.getTeam(Vue.$env.TENANT)
      .then(({ data: organization }) => {
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
      .then(({ data: programInfo }) => {
        program = programInfo;
        return userService.getUsers(program.officers);
      })
      .then(({ data: { items: profiles } }) => {
        program.officers = profiles;
        mapAreaToProgram(program, state.organization.areas);
        commit('SET_ORGANIZATION_PROGRAM', program);
        
        const attrId = Vue.$env.GRANT_DISTRIBUTION_TRANSPARENCY_DEMO_GRANT_ATTR_ID;
        let grantNumber = program.additional_info[attrId];
        return grantNumber ? dispatch('loadAppliedForGrantProjects', { 
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

  loadAppliedForGrantProjects({ state, dispatch, commit }, { grantAttributeId, grantAttributeValue }) {
    const filter = {
      // projectAttributes: [{
      //   attributeId: grantAttributeId,
      //   values: [grantAttributeValue]
      // }]
    }

    return projectService.getPublicProjectListing(filter)
      .then(({ data: { items: result } }) => {
        commit('SET_PROJECTS_APPLIED_FOR_GRANT', result);
        return Promise.all(result.map(r => expertiseContributionsService.getProjectExpertiseStats(r._id, {})))
      })
      .then((res) => {
        const result = res.map(({ data: { items } }) => items)
        commit('SET_PROJECTS_APPLIED_FOR_GRANT_ECI_STATS', result.filter(stats => !!stats.projectId));
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

  SET_PROJECTS_APPLIED_FOR_GRANT(state, projects) {
    state.appliedForGrantProjects = projects;
  },

  SET_PROJECTS_APPLIED_FOR_GRANT_ECI_STATS(state, eciStats) {
    state.appliedForGrantProjectsEciStats = eciStats;
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
