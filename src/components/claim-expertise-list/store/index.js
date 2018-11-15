import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import Vue from 'vue';
import expertiseClaimsService from '../../../services/http/expertiseClaims.js';
import { getNodeById } from "./../../common/disciplines/DisciplineTreeService"; 
import { getEnrichedProfiles } from './../../../utils/user';
import SortFieldsSvc from './../services/SortFieldsSvc';

const state = {
    selectedDisciplines: [],
    claims: [],

    sorting: { 
        sortBy: SortFieldsSvc.types.USERNAME_SORT_BY, 
        descending: false
    }
}

// getters
const getters = {
    selectedDisciplines: (state, getters) => state.selectedDisciplines,
    sorting: (state, getters) => state.sorting,

    claims: (state, getters) => {
        let handler = _.chain(state.claims);

        if (!_.isEmpty(state.selectedDisciplines)) {
            handler = handler.filter(claim => 
                _.some(state.selectedDisciplines, discipline =>
                    discipline.id === claim.disciplineId
                )
            );
        }

        handler = handler.orderBy(
            SortFieldsSvc.sortingMap[state.sorting.sortBy],
            [ state.sorting.descending ? 'desc' : 'asc' ]
        );

        return handler.value();
    }
}

// actions
const actions = {
    loadAllClaims({ state, dispatch, commit }) {
        let claimList = [];

        return expertiseClaimsService.getExpertiseClaims()
            .then(claims => {
                claimList = claims;

                return getEnrichedProfiles(
                    _(claimList).map('username').uniq().value()
                );
            })
            .then(users => {
                claimList.forEach(claim => {
                    claim.discipline = getNodeById(claim.disciplineId);
                    claim.user = _.find(users, user => user.account.name === claim.username);
                });

                commit('SET_CLAIMS', claimList);
            })
            .catch(e => {
                console.log(e);
            });
    },

    setSelectedDisciplines({ state, commit }, disciplines) {
        commit('SET_SELECTED_DISCIPLINES', disciplines);
    },
    setSorting({ state, commit }, sorting) {
        commit('SET_SORTING', sorting);
    }
}

// mutations
const mutations = {
    ['SET_SELECTED_DISCIPLINES'](state, disciplines) {
        Vue.set(state, 'selectedDisciplines', disciplines);
    },
    ['SET_SORTING'](state, sorting) {
        Vue.set(state, 'sorting', Object.assign(state.sorting, sorting));
    },
    ['SET_CLAIMS'](state, claims) {
        Vue.set(state, 'claims', claims);
    },
}

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
}