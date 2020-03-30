import Vue from 'vue';
import deipRpc from '@deip/rpc-client';
import { mapAreaToProgram } from '../../common/disciplines/DisciplineTreeService';
import { GrantsService } from '@deip/grants-service/lib/GrantsService';

const grantsService = GrantsService.getInstance();

const state = {
  organization: undefined,
  selectedArea: undefined,

  corePrograms: [],
  additionalPrograms: [],

  isLoadingOrganizationProgramsPage: undefined,

  isLoadingOrganizationPrograms: undefined
}

// getters
const getters = {
  organization: (state, getters) => state.organization,
  selectedArea: (state, getters) => state.selectedArea,

  corePrograms: (state, getters) => state.corePrograms,
  additionalPrograms: (state, getters) => state.additionalPrograms,

  isLoadingOrganizationProgramsPage: (state, getters) => state.isLoadingOrganizationProgramsPage !== false,
}

// actions
const actions = {

  // pages
  loadOrganizationProgramsPage({state, dispatch, commit}, {organization, areaCode, subAreaCode}) {
    commit('SET_ORGANIZATION_PROGRAMS_LISTING_PAGE_LOADING_STATE', true);
    return deipRpc.api.getResearchGroupByPermlinkAsync(organization)
      .then((organizationProfile) => {
        const researchAreas = [ 
          {
              "title" : "Biological Sciences (BIO)",
              abbreviation: organization,
              subAreaAbbreviation: organization,
              "disciplines" : [ 
                  3, 
                  9
              ],
              "subAreas" : [ 
                  {
                      "title" : "Molecular and Cellular Biosciences (MCB)",
                      abbreviation: organization,
                      subAreaAbbreviation: organization,
                      "disciplines" : [ 
                          3, 
                          9,
                      ]
                  }, 
                  {
                      "title" : "Integrative Organismal Systems (IOS)",
                      abbreviation: organization,
                      subAreaAbbreviation: organization,
                      "disciplines" : [ 
                          3, 
                          9
                      ]
                  }, 
                  {
                      "title" : "Emerging Frontiers (EF)",
                      abbreviation: organization,
                      subAreaAbbreviation: organization,
                      "disciplines" : [ 
                          3, 
                          9
                      ]
                  }, 
                  {
                      "title" : "Environmental Biology (DEB)",
                      abbreviation: organization,
                      subAreaAbbreviation: organization,
                      "disciplines" : [ 
                          3, 
                          9
                      ]
                  }, 
                  {
                      "title" : "Biological Infrastructure (DBI)",
                      abbreviation: organization,
                      subAreaAbbreviation: organization,
                      "disciplines" : [ 
                          3, 
                          9
                      ]
                  }
              ]
          }
        ]
        commit('SET_ORGANIZATION_PROFILE', {...organizationProfile, researchAreas});
        const organizationProgramsLoad = new Promise((resolve, reject) => {
          dispatch('loadOrganizationPrograms', {organization: state.organization, notify: resolve});
        });
        return Promise.all([organizationProgramsLoad])
      })
      .then(() => {
        if (areaCode && subAreaCode) {
          let area = state.organization.researchAreas.find(a => a.abbreviation == areaCode);
          let subArea = area.subAreas.find(a => a.abbreviation == subAreaCode);
          commit('SET_RESEARCH_AREA', {area, subArea});
        } else {
          let area = state.organization.researchAreas[0];
          let subArea = area.subAreas[0];
          commit('SET_RESEARCH_AREA', {area, subArea});
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAMS_LISTING_PAGE_LOADING_STATE', false)
      });
  },


  loadOrganizationPrograms({state, dispatch, commit}, {organization,notify}) {
    commit('SET_ORGANIZATION_PROGRAMS_LOADING_STATE', true);
    grantsService.getFundingOpportunityAnnouncementsByOrganization(organization.id)
      .then(programs => {
        const corePrograms = programs.map(item => {return {
          ...item, 
          organization_name:organization.permlink, 
          abbreviation: organization.permlink,
          subAreaAbbreviation: organization.permlink
        }});

      commit('SET_ORGANIZATION_PROGRAMS', {corePrograms, additionalPrograms: []});
    })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        commit('SET_ORGANIZATION_PROGRAMS_LOADING_STATE', false);
        if (notify) notify();
      });
  },

  setResearchArea({state, dispatch, commit}, {area, subArea}) {
    commit('SET_RESEARCH_AREA', {area, subArea});
  }
}

// mutations
const mutations = {

  ['SET_ORGANIZATION_PROFILE'](state, organization) {
    Vue.set(state, 'organization', organization)
  },

  ['SET_RESEARCH_AREA'](state, {area, subArea}) {
    Vue.set(state, 'selectedArea', {
      title: area.title,
      abbreviation: area.abbreviation,
      subAreaTitle: subArea.title,
      subAreaAbbreviation: subArea.abbreviation,
      disciplines: subArea.disciplines
    });
  },

  ['SET_ORGANIZATION_PROGRAMS'](state, {corePrograms, additionalPrograms}) {
    corePrograms.forEach(p => {
      mapAreaToProgram(p, state.organization.researchAreas)
    });
    additionalPrograms.forEach(p => {
      mapAreaToProgram(p, state.organization.researchAreas)
    });

    Vue.set(state, 'corePrograms', corePrograms);
    Vue.set(state, 'additionalPrograms', additionalPrograms)
  },

  ['SET_ORGANIZATION_PROGRAMS_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingOrganizationPrograms', isLoading)
  },

  ['SET_ORGANIZATION_PROGRAMS_LISTING_PAGE_LOADING_STATE'](state, isLoading) {
    Vue.set(state, 'isLoadingOrganizationProgramsPage', isLoading)
  }
}

const namespaced = true;

export const organizationProgramsStore = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
