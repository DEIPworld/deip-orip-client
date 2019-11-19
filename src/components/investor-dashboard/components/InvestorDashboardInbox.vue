<template>
  <v-layout row wrap class="py-5 px-4" style="flex: 0 0 auto;">
    <v-layout column>
      <div class="title bold">My Inbox</div>

      <v-layout column v-if="recentNotifications.length">
        <v-layout row align-end fill-height class="py-3"> 
          <v-flex xl1 lg1 md1 sm4 xs4>
            <v-checkbox
              class="ma-0 pa-0"
              v-model="allRecentSelected"
              hide-details>
            </v-checkbox>
          </v-flex>
          <v-flex xl8 lg8 md8 sm8 xs8>
            <div class="subheading half-bold">Recent updates: {{recentNotifications.length}}</div>
          </v-flex>
          <v-flex xl3 lg3 md3 sm12 xs12>
            <!-- <v-select
              v-model="sort" 
              :items="sortingOptions" 
              solo
              dense
              hide-details
              class="ma-0 pa-0"
              item-text="title"
              item-value="id">
            </v-select> -->
          </v-flex>
        </v-layout>
        <v-layout column>
          <v-card @click="selectInvestment(investment)" v-for="(investment, i) in recentNotifications" :key="'investment-' + i" class="pa-2 investment-item" :class="{'selected': investment === selectedInvestment}">
            <v-layout row wrap align-baseline>
              <v-flex xs1 align-self-center>
                <v-checkbox
                  class="ma-0 pa-0"
                  hide-details>
                </v-checkbox>
              </v-flex>
              <v-flex xs6 class="ellipsis">
                <router-link class="a" :to="{ 
                  name: 'ResearchDetails', 
                  params: {
                    research_group_permlink: encodeURIComponent(investment.group.permlink),
                    research_permlink: encodeURIComponent(investment.research.permlink)
                  }}">
                  {{investment.research.title}}
                </router-link>
              </v-flex>
              <v-flex class="text-xs-right">
                <v-chip small v-for="(tag, j) in investment.portfolioRef.tags" :key="'investment-'+ i + '-tag-'+ j" class="ma-0 ml-1 investment-tag caption" :color="tag.color" text-color="black">{{tag.name}}</v-chip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-layout>
      </v-layout>

      <v-layout column class="pt-5" v-if="overdueNotifications.length">
        <v-layout row align-end fill-height class="py-3"> 
          <div class="subheading half-bold">Overdue notifications: {{overdueNotifications.length}}</div>
        </v-layout>
        <v-card v-for="(investment, i) in overdueNotifications" :key="'overdue-investment-' + i" class="pa-2 investment-item">
          <v-layout row wrap align-baseline>
            <v-flex xs1 align-self-center>
              <v-checkbox
                class="ma-0 pa-0"
                hide-details>
              </v-checkbox>
            </v-flex>
            <v-flex xs6 class="ellipsis">
              <router-link class="a" :to="{ 
                name: 'ResearchDetails', 
                params: {
                  research_group_permlink: encodeURIComponent(investment.group.permlink),
                  research_permlink: encodeURIComponent(investment.research.permlink)
                }}">
                {{investment.research.title}}
              </router-link>
            </v-flex>
            <v-flex class="text-xs-right">
              <v-chip small v-for="(tag, j) in investment.portfolioRef.tags" :key="'overdue-investment-'+ i + '-tag-'+ j" class="ma-0 ml-1 investment-tag caption" :color="tag.color" text-color="black">{{tag.name}}</v-chip>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>

      <v-layout column class="pt-5 subheading" v-if="noResult">There are no investments in selected list</v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'InvestorDashboardInbox',
    computed: {
      ...mapGetters({
        user: "auth/user",
        investmentPortfolio: "investorDashboard/investmentPortfolio",
        recentNotifications: "investorDashboard/investments",
        selectedInvestment: "investorDashboard/selectedInvestment",
        selectedList: "investorDashboard/selectedList",
        overdueNotifications: "investorDashboard/overdueNotifications",
        noResult: "investorDashboard/noResult"
      })
    },

    data() {
      return {
        allRecentSelected: false,
        sortingOptions: [{title: "All", id: 1}],
        sort: 1
      }
    },

    methods: {
      selectInvestment(investment) {
        this.$store.dispatch('investorDashboard/selectInvestment', investment.research.id);
      }
    }
  }
</script>

<style lang="less" scoped>

  @import "./../../../styles/colors.less";

 .investment-item {
   border-left: 4px solid var(--v-primary-darken1);
   cursor: pointer !important;

  .investment-tag {
    text-transform: uppercase;
  }

  &:hover {
    background-color: var(--v-secondary-lighten2);
  }
  
  &.selected {
    background-color: var(--v-primary-lighten5);
  }
 }
</style>
