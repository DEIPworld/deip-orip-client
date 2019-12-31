<template>
  <base-page-layout>
    <div slot="content" class="full-width">
      <v-layout column justify-center class="feed-header full-width px-5" :style="{ background: 'url(' + $options.filters.tenantBackgroundSrc(tenant) + '), 100%, 100%, no-repeat'}">
        <div class="display-2 uppercase half-bold">Projects</div>
        <div class="py-4"><v-btn :to="{ name: 'CreateResearch' }" color="primary" class="ma-0">Start a project</v-btn></div>
      </v-layout>
      <v-layout row wrap>

        <v-flex xs12 sm12 md12 lg12 xl12 class="feed-filter">
          <v-expansion-panel expand v-model="filtersTabExpansionModel" class="elevation-0">
            <v-expansion-panel-content class="elevation-0">
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
                          <img :src="$options.filters.researchGroupLogoSrc(organization.id, 50, 50, true)">
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
                          <img src="/assets/img/top-100.svg">
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
                        <div class="full-width text-xs-center">{{discipline.label}}</div>
                        <!-- {{discipline.label}} -->
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
                  <v-layout row wrap>
                    <div
                      v-for="organization of organizations"
                      :key="`organization-filter-${organization.id}`"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div
                            v-on="on"
                            @click="toggleOrganization(organization)"
                            :class="{
                              'organization-item ma-2 pa-1': true,
                              'organization-item--selected': isOrganizationSelected(organization)
                            }"
                          >
                            <img
                              
                              class="organization-item__img"
                              :src="$options.filters.researchGroupLogoSrc(organization.id, 200, 200)"
                            />
                            <div class="organization-item__overlay"></div>
                          </div>
                        </template>
                        <span>{{organization.name}}</span>
                      </v-tooltip>
                    </div>
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
                      :group="props.item.group">
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

export default {
  name: "ResearchFeed",

  data() {
    return {
      rowsPerPageItems: [9, 30, 100],
      pagination: {
        rowsPerPage: 100
      },
      disciplines: [...disciplinesService.getTopLevelNodes()],
      filterByTopOnly: false,
      filtersTabExpansionModel: [false]
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      tenant: 'auth/tenant',
      researchFeed: 'feed/researchFeed',
      organizations: 'feed/organizations',
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
  background-size: cover !important;
  background-repeat: no-repeat !important;
  height: 300px;
  width: 100%;
  font-style: normal;
  color: white;
}

.filters-background {
  background-color: #fafafa;
}

.organization-item {
  height: 60px;
  width: 180px;
  cursor: pointer;
  background: white;
  border: 1px solid #e5e5e5;
  position: relative;
  display: flex;
  justify-content: center;

  &__img {
    max-height: 100%;
    max-width: 100%;
    align-self: center;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    color: #e5e5e5;
  }

  &:hover &__overlay, &--selected &__overlay {
    display: block;
    background: rgba(219, 228, 251, .6);
  }
}

</style>
