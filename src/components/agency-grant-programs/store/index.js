import Vue from 'vue';
import { GrantsService } from '@deip/grants-service';
import { TeamService } from '@deip/team-service';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService';

const teamService = TeamService.getInstance();
const grantsService = GrantsService.getInstance();

const state = {
  organization: undefined,
  selectedArea: undefined,

  corePrograms: [],
  additionalPrograms: [],

  isLoadingOrganizationProgramsPage: undefined,

  isLoadingOrganizationPrograms: undefined
};

// getters
const getters = {
  organization: (state, getters) => state.organization,
  selectedArea: (state, getters) => state.selectedArea,

  corePrograms: (state, getters) => state.corePrograms,
  additionalPrograms: (state, getters) => state.additionalPrograms,

  isLoadingOrganizationProgramsPage: (state, getters) => state.isLoadingOrganizationProgramsPage !== false
};

// actions
const actions = {

  // pages
  loadGrantProgramsPage({ state, dispatch, commit }, { areaCode, subAreaCode }) {
    commit('SET_ORGANIZATION_PROGRAMS_LISTING_PAGE_LOADING_STATE', true);
    return teamService.getTeam(Vue.$env.TENANT)
      .then(({ data: team }) => {
        commit('SET_ORGANIZATION_PROFILE', team);
        const organizationProgramsLoad = new Promise((resolve, reject) => {
          dispatch('loadOrganizationPrograms', { organization: state.organization, notify: resolve });
        });
        return Promise.all([organizationProgramsLoad]);
      })
      .then(() => {
        if (areaCode && subAreaCode) {
          const area = state.organization.areas.find((a) => a.abbreviation == areaCode);
          const subArea = area.subAreas.find((a) => a.abbreviation == subAreaCode);
          commit('SET_PROJECT_AREA', { area, subArea });
        } else {
          const area = state.organization.areas[0];
          const subArea = area.subAreas[0];
          commit('SET_PROJECT_AREA', { area, subArea });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAMS_LISTING_PAGE_LOADING_STATE', false);
      });
  },

  loadOrganizationPrograms({ state, dispatch, commit }, { organization, notify }) {
    commit('SET_ORGANIZATION_PROGRAMS_LOADING_STATE', true);
    grantsService.getFundingOpportunityAnnouncementsByOrganization(organization.id)
      .then(({ data: { items: programs } }) => {
        const corePrograms = programs.map((item) => ({
          ...item,
          organizationId: organization._id,
          abbreviation: organization._id,
          subAreaAbbreviation: organization._id
        }));

        corePrograms.forEach((p) => {
          mapAreaToProgram(p, state.organization.areas);
        });

        commit('SET_ORGANIZATION_PROGRAMS', { corePrograms, additionalPrograms: [] });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAMS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  setProjectArea({ state, dispatch, commit }, { area, subArea }) {
    commit('SET_PROJECT_AREA', { area, subArea });
  }
};

// mutations
const mutations = {

  SET_ORGANIZATION_PROFILE(state, organization) {
    state.organization = organization;
  },

  SET_PROJECT_AREA(state, { area, subArea }) {
    state.selectedArea = {
      title: area.title,
      abbreviation: area.abbreviation,
      subAreaTitle: subArea.title,
      subAreaAbbreviation: subArea.abbreviation,
      domains: subArea.domains
    };
  },

  SET_ORGANIZATION_PROGRAMS(state, { corePrograms, additionalPrograms }) {
    state.corePrograms = corePrograms;
    state.additionalPrograms = additionalPrograms;
  },

  SET_ORGANIZATION_PROGRAMS_LOADING_STATE(state, isLoading) {
    state.isLoadingOrganizationPrograms = isLoading;
  },

  SET_ORGANIZATION_PROGRAMS_LISTING_PAGE_LOADING_STATE(state, isLoading) {
    state.isLoadingOrganizationProgramsPage = isLoading;
  }
};

const namespaced = true;

export const agencyGrantProgramsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
