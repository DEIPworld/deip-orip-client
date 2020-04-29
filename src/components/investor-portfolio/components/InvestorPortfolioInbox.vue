<template>
  <div>
    <div class="title bold">
      My Inbox
    </div>

    <div v-if="recentNotifications.length">
      <v-row no-gutters align="end" class="py-4 fill-height">
        <v-col
          xl="1"
          lg="1"
          md="1"
          sm="4"
          cols="4"
        >
          <v-checkbox
            v-model="allRecentSelected"
            class="ma-0 pa-0"
            hide-details
          />
        </v-col>
        <v-col
          xl="8"
          lg="8"
          md="8"
          sm="8"
          cols="8"
        >
          <div class="subtitle-1 half-bold">
            Recent updates: {{ recentNotifications.length }}
          </div>
        </v-col>
        <v-col
          xl="3"
          lg="3"
          md="3"
          sm="12"
          cols="12"
        >
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
        </v-col>
      </v-row>
      <div>
        <v-card
          flat
          v-for="(investment, i) in recentNotifications"
          :key="'investment-' + i"
          class="py-2 investment-item"
          :class="{'selected': investment === selectedInvestment}"
          @click="selectInvestment(investment)"
        >
          <v-row no-gutters align="center">
            <v-col cols="1" align-self="center">
              <v-checkbox
                class="ma-0 pa-0"
                hide-details
              />
            </v-col>
            <v-col cols="6" class="text-truncate">
              <router-link
                class="a"
                :to="{
                  name: 'ResearchDetails',
                  params: {
                    research_group_permlink: encodeURIComponent(investment.group.permlink),
                    research_permlink: encodeURIComponent(investment.research.permlink)
                  }}"
              >
                {{ investment.research.title }}
              </router-link>
            </v-col>
            <v-col class="text--right">
              <v-chip
                v-for="(tag, j) in investment.portfolioRef.tags"
                :key="'investment-'+ i + '-tag-'+ j"
                small
                class="ma-0 ml-1 investment-tag caption"
                :color="tag.color"
                text-color="black"
              >
                {{ tag.name }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>

    <div v-if="overdueNotifications.length" class="pt-12">
      <div class="py-4 fill-height">
        <div class="subtitle-1 half-bold">
          Overdue notifications: {{ overdueNotifications.length }}
        </div>
      </div>
      <v-card flat v-for="(investment, i) in overdueNotifications" :key="'overdue-investment-' + i" class="pa-2 investment-item">
        <v-row no-gutters align="center">
          <v-col cols="1" align-self="center">
            <v-checkbox
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="6" class="text-truncate">
            <router-link
              class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(investment.group.permlink),
                  research_permlink: encodeURIComponent(investment.research.permlink)
                }}"
            >
              {{ investment.research.title }}
            </router-link>
          </v-col>
          <v-col class="text--right">
            <v-chip
              v-for="(tag, j) in investment.portfolioRef.tags"
              :key="'overdue-investment-'+ i + '-tag-'+ j"
              small
              class="ma-0 ml-1 investment-tag caption"
              :color="tag.color"
              text-color="black"
            >
              {{ tag.name }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <div v-if="noResult" class="pt-12 subtitle-1">
      There are no investments in selected list
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'InvestorPortfolioInbox',
    computed: {
      ...mapGetters({
        user: 'auth/user',
        investmentPortfolio: 'investorPortfolio/investmentPortfolio',
        recentNotifications: 'investorPortfolio/investments',
        selectedInvestment: 'investorPortfolio/selectedInvestment',
        selectedList: 'investorPortfolio/selectedList',
        overdueNotifications: 'investorPortfolio/overdueNotifications',
        noResult: 'investorPortfolio/noResult'
      })
    },

    data() {
      return {
        allRecentSelected: false,
        sortingOptions: [{ title: 'All', id: 1 }],
        sort: 1
      };
    },

    methods: {
      selectInvestment(investment) {
        this.$store.dispatch('investorPortfolio/selectInvestment', investment.research.id);
      }
    }
  };
</script>

<style lang="less" scoped>

  @import "./../../../styles/colors.less";

 .investment-item {
   border-left: 4px solid var(--v-primary-darken1) !important;
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
