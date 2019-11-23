<template>
  <base-page-layout>
    <div slot="content" class="full-width">
      <v-layout column justify-center class="feed-header px-5">
        <div class="display-2 uppercase half-bold">Projects</div>
        <div class="py-4"><v-btn :to="{ name: 'CreateResearch' }" color="primary" class="ma-0">Start a project</v-btn></div>
      </v-layout>
      <v-layout row wrap>
        
        <v-flex xs12 sm12 md12 lg12 xl12 class="feed-filter">
          <v-expansion-panel expand v-model="filtersTabExpansionModel">
            <v-expansion-panel-content>
              <template slot="actions"><v-icon color="primary">$vuetify.icons.expand</v-icon></template>
              <template slot="header">
                <v-layout row justify-space-between>
                  <div class="px-4">
                    <div class="discipline-criteria">
                      <v-chip
                        v-for="discipline in selectedTopDisciplines"
                        :key="'filter-by-discipline-' + discipline.id"
                        @input="toggleDiscipline(discipline)" 
                        small
                        close 
                        outline>
                        {{ discipline.label }}
                      </v-chip>
                    </div>
                    <div class="organization-criteria">
                      <v-chip
                        v-for="organization in selectedOrganizations"
                        :key="'filter-by-organization-' + organization.id"
                        @input="toggleOrganization(organization)"
                        small
                        close
                        outline>
                        <v-avatar>
                          <img :src="`./../../../static/organizations/${organization.thumbnail}`">
                        </v-avatar>
                        {{ organization.name }}
                      </v-chip>
                    </div>
                    <div v-if="filterByTopOnly">
                      <v-chip
                        @input="filterByTopOnly = false"
                        small
                        close
                        outline>
                        <v-avatar>
                          <img :src="`./../../../static/top-100.png`">
                        </v-avatar>
                        Top 100
                      </v-chip>
                    </div>
                  </div>
                  <div class="align-self-center">
                    <v-btn small flat color="primary" class="py-0 my-0 elevation-0">
                      {{isFiltersTabExpanded ? 'Hide Filters' : 'Show Filters'}}
                    </v-btn>
                  </div>
                </v-layout>
              </template>
              
              <v-layout row wrap px-5 pt-4 pb-5 class="filters-background"> 
                <v-flex xs12 sm12 md12 lg12 xl12 class="feed-disciplines-filter">
                  <div class="pb-4">
                    <v-layout row justify-space-between align-baseline>
                      <span class="subheading half-bold">Browse by discipline</span>
                      <v-btn 
                        @click="selectAllDisciplines()"
                        class="text-capitalize"
                        flat small color="primary" 
                        outline
                        :disabled="isAllDisciplinesSelected">
                        Reset
                      </v-btn>
                    </v-layout>
                  </div>
                  <v-layout row wrap justify-space-between>
                    <v-flex xs6 sm6 md3 lg3 xl3 px-2 v-for="(discipline, i) in disciplines" :key="'discipline-filter-' + i">
                      <v-btn 
                        @click="toggleDiscipline(discipline)" 
                        flat block small color="primary" 
                        class="text-capitalize filter-btn" 
                        :class="{'selected': isDisciplineSelected(discipline)}">
                        {{discipline.label}}
                      </v-btn>
                    </v-flex>
                    <v-spacer></v-spacer>
                  </v-layout>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12 py-4><v-divider></v-divider></v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12 class="feed-organizations-filter">
                  <div class="pb-4">
                    <v-layout row justify-space-between align-baseline>
                      <span class="subheading half-bold">Browse by organizations</span>
                      <v-btn 
                        @click="selectAllOrganizations()"
                        class="text-capitalize"
                        flat small color="primary" 
                        outline
                        :disabled="isAllOrganizationsSelected">
                        Reset
                      </v-btn>
                    </v-layout>
                  </div>
                  <v-layout row wrap justify-space-between>
                    <v-flex xs3 sm3 md2 lg2 xl2 
                      v-for="(organization, i) in organizations"
                      :key="'organization-filter-' + i"
                      @click="toggleOrganization(organization)" 
                      class="organization-item px-2 my-2" 
                      :class="{'selected': isOrganizationSelected(organization)}">

                      <div class="organization-item-btn pa-1">
                        <img style="width: 100%; height: 100%" :src="`./../../../static/organizations/${organization.logo}`" />
                        <div class="overlay"></div>
                      </div>
                    </v-flex>
                    <v-spacer></v-spacer>
                  </v-layout>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12 py-4><v-divider></v-divider></v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <div class="pb-4">
                    <v-layout  row align-baseline>
                      <v-flex shrink>
                        <span class="subheading half-bold">Browse top projects only</span>
                      </v-flex>
                      <v-flex grow align-self-center pl-4>
                        <v-checkbox
                          v-model="filterByTopOnly"
                          class="ma-0 pa-0"
                          hide-details>
                        </v-checkbox>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-card class="px-5 pb-4 elevation-0 full-width" :class="{'pt-4': isFiltersTabExpanded}">
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <div class="subheading half-bold px-2">Projects | <span class="primary--text">{{researchFeed.length}}</span></div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-data-iterator
                :items="researchFeed"
                :rows-per-page-items="rowsPerPageItems"
                :pagination.sync="pagination"
                content-tag="v-layout"
                no-data-text="No Projects found for specified criteria"
                row
                wrap
              >
                <template v-slot:item="props">
                  <v-flex xs12 sm6 md4 lg4 xl3 px-2 py-4 my-1 :key="'feed-item-' + props.item.research_id">
                    <research-project-tile
                      :research="{ 
                        id: props.item.research_id, 
                        title: props.item.title, 
                        permlink: props.item.permlink, 
                        group_permlink: props.item.group_permlink, 
                        last_update_time: props.item.last_update_time,
                        number_of_negative_reviews: props.item.number_of_negative_reviews,
                        number_of_positive_reviews: props.item.number_of_positive_reviews,
                        isTop: props.item.isTop,
                      }"
                      :members="props.item.authors" 
                      :tokenSale="props.item.tokenSale"
                      :tokenSaleContributions="props.item.tokenSaleContributions"
                      :organization="props.item.organization">
                    </research-project-tile>
                  </v-flex> 
                </template>
              </v-data-iterator>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>

    </div>
  </base-page-layout>
</template>

<script>
import deipRpc from '@deip/deip-oa-rpc-client';
import { mapGetters } from 'vuex';
import moment from 'moment';
import * as disciplinesService from './../../components/common/disciplines/DisciplineTreeService';
import organizationsService from './../../services/OrganizationsService';

export default {
  name: "ResearchFeed",

  data() {
    return {
      rowsPerPageItems: [9, 30, 100],
      pagination: {
        rowsPerPage: 100
      },
      disciplines: [...disciplinesService.getTopLevelNodes()],
      organizations: [...organizationsService.getAllOrganizations()],
      filterByTopOnly: false,
      filtersTabExpansionModel: [false]
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      researchFeed: 'feed/researchFeed',
      filter: 'feed/filter'
    }),
    isFiltersTabExpanded() {
      return this.filtersTabExpansionModel[0];
    },
    selectedTopDisciplines() {
      return this.filter.disciplines.filter(d => d.id != 0 && d.children !== undefined);
    },
    selectedOrganizations() {
      return this.filter.organizations;
    },
    isAllDisciplinesSelected() {
      return this.filter.disciplines.length === 0;
    },
    isAllOrganizationsSelected() {
      return this.filter.organizations.length === 0;
    },
  },

  methods: {

    selectAllDisciplines() {
      this.$store.dispatch('feed/updateFilter', { key: 'disciplines', value: [] });
    },

    toggleDiscipline(discipline) {
      let disciplinesGraph = [discipline, ...Object.values(discipline.children)];
      if (!this.isDisciplineSelected(discipline)) {
        let value = [...disciplinesGraph, ...this.filter.disciplines];
        this.$store.dispatch('feed/updateFilter', { key: 'disciplines', value });
      } else {
        let value = this.filter.disciplines.filter(d => !disciplinesGraph.some(item => item === d));
        this.$store.dispatch('feed/updateFilter', { key: 'disciplines', value });
      }
    },

    isDisciplineSelected(discipline) {
      return this.filter.disciplines.some(d => d === discipline);
    },

    selectAllOrganizations() {
      this.$store.dispatch('feed/updateFilter', { key: 'organizations', value: [] });
    },

    toggleOrganization(organization) {
      if (!this.isOrganizationSelected(organization)) {
        let value = [organization, ...this.filter.organizations];
        this.$store.dispatch('feed/updateFilter', { key: 'organizations', value });
      } else {
        let value = this.filter.organizations.filter(o => o.id != organization.id);
        this.$store.dispatch('feed/updateFilter', { key: 'organizations', value });
      }
    },

    isOrganizationSelected(organization) {
      return this.filter.organizations.some(o => o.id === organization.id);
    }
  },

  watch: {
    filterByTopOnly(newVal) {
      this.$store.dispatch('feed/updateFilter', { key: 'topOnly', value: newVal });
    }
  }
};
</script>

<style lang="less" scoped>

.feed-header {
  background: url('/static/feed-background.svg') 100% 100% no-repeat;
  background-size: cover;
  height: 300px;
  font-style: normal;
  color: white;
}

.filters-background {
  background-color: #fafafa;
}

.organization-item {
  height: 40px;
  cursor: pointer;

  .organization-item-btn {
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid #e5e5e5;
    position: relative;

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      color: #e5e5e5;
    }

    &:hover .overlay {
      display: block;
      background: rgba(219, 228, 251, .6);
    }
  }

  &.selected .overlay {
    display: block;
    background: rgba(219, 228, 251, .6);
  }
}

</style>
