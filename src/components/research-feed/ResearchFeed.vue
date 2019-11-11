<template>
  <base-page-layout>
    <div slot="content" class="full-width">
      <v-layout column justify-center class="feed-header px-5">
        <div class="display-2 uppercase half-bold">Projects</div>
        <div class="py-4"><v-btn :to="{ name: 'CreateResearch' }" color="primary" class="ma-0">Start a project</v-btn></div>
      </v-layout>
      <v-layout row wrap>
        <v-card class="px-5 py-4 elevation-0 full-width">
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <div class="subheading half-bold">Top projects | <span class="primary--text">All {{researchFeed.length}}</span></div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-data-iterator
                :items="researchFeed"
                :rows-per-page-items="rowsPerPageItems"
                :pagination.sync="pagination"
                content-tag="v-layout"
                row
                wrap
              >
                <template v-slot:item="props">
                  <v-flex xs12 sm6 md4 lg4 xl3 px-2 py-4 :key="'feed-item-' + props.item.research_id">
                    <research-project-tile
                      :research="{ id: props.item.research_id, title: props.item.title, permlink: props.item.permlink, group_permlink: props.item.group_permlink }"
                      :members="props.item.authors" 
                      :tokenSale="props.item.tokenSale"
                      :tokenSaleContributions="props.item.tokenSaleContributions">
                    </research-project-tile>
                  </v-flex> 
                </template>
              </v-data-iterator>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>
      <v-layout row wrap px-5 pt-4 pb-5>
        <v-flex xs12 sm12 md12 lg12 xl12 class="pb-4">
          <div class="subheading half-bold">Browse by discipline</div>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 xl12 class="feed-discipline-filter">
          <v-layout row wrap justify-space-between>
            <v-flex xs6 sm6 md3 lg3 xl3 v-for="(discipline, i) in disciplines" :key="'discipline-filter-' + i">
              <v-btn 
                @click="selectDisciplineFilter(discipline)" 
                flat block small color="primary" 
                class="text-capitalize filter-btn" 
                :class="{'selected': discipline === selectedDisciplineFilter}">
                {{discipline.label}}
              </v-btn>
            </v-flex>
            <v-spacer></v-spacer>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-card class="px-5 py-4 elevation-0 full-width">
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12 class="py-2">
              <div class="subheading half-bold">Browse by organizations | <span class="primary--text">All 24</span></div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12 class="py-4">
              <v-layout row wrap justify-space-between>
                <v-flex xs6 sm6 md3 lg3 xl3 
                  v-for="(organization, i) in organizations"
                  :key="'organization-filter-' + i"
                  @click="selectOrganizationFilter(organization)" 
                  class="organization-item px-2" 
                  :class="{'selected': selectedOrganizationFilter === organization}">

                  <div class="organization-item-btn pa-2">
                    <img style="width: 100%; height: 100%" :src="`./../../../static/organizations/${organization.id}.svg`" />
                    <div class="overlay"></div>
                  </div>
                </v-flex>
                <v-spacer></v-spacer>
              </v-layout>
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
      rowsPerPageItems: [9, 30],
      pagination: {
        rowsPerPage: 9
      },
      disciplines: [{"id": 0, "label": "All" }, ...disciplinesService.getTopLevelNodes()],
      organizations: [{
        id: "microsoft"
      },{
        id: "general_mills"
      },{
        id: "alphabet"
      },{
        id: "apple"
      }],

      selectedDisciplineFilter: null,
      selectedOrganizationFilter: null
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      researchFeed: 'feed/researchFeed',
      filter: 'feed/filter'
    })
  },

  methods: {
    selectOrganizationFilter(org) {
      if (this.selectedOrganizationFilter === org) {
        this.selectedOrganizationFilter = null;
      } else {
        this.selectedOrganizationFilter = org;
      }
    },

    selectDisciplineFilter(discipline) {
      if (this.selectedDisciplineFilter === discipline) {
        this.selectedDisciplineFilter = null;
        this.$store.dispatch('feed/updateFilter', { key: 'disciplines', value: []});
      } else {
        this.selectedDisciplineFilter = discipline;
        let disciplines = discipline.id != 0 ? [discipline, ...Object.values(discipline.children)] : [];
        this.$store.dispatch('feed/updateFilter', { key: 'disciplines', value: disciplines });
      }
    },

    selectOrganizationFilter(org) {
      if (this.selectedOrganizationFilter === org) {
        this.selectedOrganizationFilter = null;
      } else {
        this.selectedOrganizationFilter = org;
      }
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

.organization-item {
  width: 240px;
  height: 80px;
  cursor: pointer;

  .organization-item-btn {
    width: 100%;
    height: 100%;
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
      background: rgba(226, 233, 251, .3);
    }
  }

  &.selected .overlay {
    display: block;
    background: rgba(226, 233, 251, .3);
  }
}

</style>
