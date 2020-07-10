import Vue from 'vue';
import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';
import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
import { GrantsService } from '@deip/grants-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService';

const usersService = UsersService.getInstance();
const expertiseContributionsService = ExpertiseContributionsService.getInstance();
const grantsService = GrantsService.getInstance();
const researchGroupService = ResearchGroupService.getInstance();

const state = {
  organization: undefined,
  program: undefined,
  applications: [],

  corePrograms: [],
  additionalPrograms: [],

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

  isLoadingOrganizationProgramDetailsPage: (state, getters) => state.isLoadingOrganizationProgramDetailsPage !== false
};

// actions
const actions = {
  loadGrantProgramDetailsPage({ state, dispatch, commit }, { organization, foaId }) {
    commit('SET_ORGANIZATION_PROGRAM_DETAILS_PAGE_LOADING_STATE', true);
    return researchGroupService.getResearchGroupByPermlink(organization)
      .then((org) => researchGroupService.getResearchGroup(org.external_id))
      .then((organizationProfile) => {
        commit('SET_ORGANIZATION_PROFILE', organizationProfile);
        const organizationProgramDetailsLoad = new Promise((resolve, reject) => {
          dispatch('loadOrganizationProgramDetails', { foaId })
            .then(() => {
              dispatch('loadOrganizationProgramApplications', { notify: resolve });
            });
        });
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
        return usersService.getEnrichedProfiles(program.officers);
      })
      .then((profiles) => {
        program.officers = profiles;
        mapAreaToProgram(program, state.organization.researchGroupRef.researchAreas);

        commit('SET_ORGANIZATION_PROGRAM', program);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAM_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  loadOrganizationProgramApplications({ state, dispatch, commit }, { notify }) {
    commit('SET_ORGANIZATION_PROGRAM_APPLICATIONS_LOADING_STATE', true);

    let applications = [];

    deipRpc.api.getGrantApplicationsByGrantAsync(state.program.id)
      .then((list) => {
        applications = list;

        const researchesPromises = applications.map((application) => deipRpc.api.getResearchByIdAsync(application.research_id));

        const reviewsPromises = applications.map((application) => deipRpc.api.getGrantApplicationReviewsByGrantApplicationAsync(application.id));

        const otherResearchApplicationsPromises = applications.map((application) => deipRpc.api.getGrantApplicationsByResearchIdAsync(application.research_id)
          .then((otherResearchApplications) => {
            const grants = otherResearchApplications.map((a) => deipRpc.api.getFundingOpportunityAsync(a.grant_id));
            return Promise.all([otherResearchApplications, Promise.all(grants)]);
          })
          .then(([applications, grants]) => {
            applications.forEach((application, index) => {
              application.program = grants[index];
            });
            return applications;
          }));

        return Promise.all([
          Promise.all(researchesPromises),
          Promise.all(reviewsPromises),
          Promise.all(otherResearchApplicationsPromises)
        ]);
      })
      .then(([researches, reviews, otherResearchApplications]) => {

        applications.forEach((application, index) => {
          application.research = researches[index];
          application.reviews = reviews[index];
          application.similarResearchApplications = otherResearchApplications[index]
            .filter((a) => application.id != a.id && a.program.organization_name != state.program.organization_name
              && a.application_hash.split(':')[0] == application.application_hash.split(':')[0]);
        });
        const groupPromises = researches.map((research) => deipRpc.api.getResearchGroupByPermlinkAsync(research.research_group.permlink));

        return Promise.all([
          Promise.all(groupPromises)
        ]);
      })
      .then(([groups]) => {
        applications.forEach((application, index) => {
          application.group = groups[index];
        });

        const authorsPromises = groups.map((group) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(group.id)
          .then((researchGroupTokens) => usersService.getEnrichedProfiles(researchGroupTokens.map((t) => t.owner))));

        return Promise.all([
          Promise.all(authorsPromises)
        ]);
      })
      .then(([authors]) => {
        applications.forEach((application, index) => {
          application.authors = authors[index];
        });
        return applications;
      })
      .then((applications) => {
        commit('SET_ORGANIZATION_PROGRAM_APPLICATIONS', applications);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAM_APPLICATIONS_LOADING_STATE', false);
        if (notify) notify();
      });
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
