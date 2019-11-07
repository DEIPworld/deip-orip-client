<template>
  <v-card height="100%">
    <v-layout row wrap style="flex: 0 0 auto;" class="full-width">

      <v-layout column class="pa-4">
        <router-link class="subheading half-bold investment-title"
          :to="{ name: 'ResearchDetails', params: {
            research_group_permlink: encodeURIComponent(investment.group_permlink),
            research_permlink: encodeURIComponent(investment.permlink)
          }}">
          {{ investment.title }}
        </router-link>
      </v-layout>

      <v-layout column>
        <v-divider></v-divider>
        <v-layout row justify-space-between align-baseline class="pa-2">
          <span>
            <v-icon small>event</v-icon>
            <span class="caption grey--text px-1">Created {{moment(investment.created_at).format("DD MMM YYYY")}} by Alex Shkor</span>
          </span>
          <span>
            <span class="icon-btn"><v-icon small>attachment</v-icon></span>
            <span class="icon-btn"><v-icon small>compare</v-icon></span>
            <span class="icon-btn"><v-icon small>delete</v-icon></span>
          </span>
        </v-layout>
        <v-divider></v-divider>
      </v-layout>


      <v-layout column class="pa-4">
        <div class="subheading half-bold">Current Phase</div>
        <div class="body-2 py-2">{{investment.currenStep.title}}</div>
        <div class="py-2">
          <v-chip class="ma-0 body-1" color="amber" text-color="white">{{investment.currenStep.deadline}}</v-chip>
        </div>
        <div class="body-1 py-2">
          <toggle-text :text="investment.currenStep.description"></toggle-text>
        </div>
      </v-layout>

      <v-layout column class="full-width py-2">
        <v-divider></v-divider>
      </v-layout>
      <v-layout column>
        <div>
          <div class="subheading half-bold px-4">Team: IADR Team</div>
          <v-layout row justify-start class="px-4 py-2">
            <platform-avatar :size="40" v-for="(member, i) in investment.team" :key="'member-' + i" :user="member" class="pr-1" ></platform-avatar>
          </v-layout>
        </div>
      </v-layout>
      <v-layout column class="full-width py-2">
        <v-divider></v-divider>
      </v-layout>
      

      <v-layout column class="pa-4 full-width">
        <div class="subheading half-bold">Top investors</div>
        <div class="py-2">
          <GChart
            type="PieChart"
            :settings="{ packages: ['corechart'] }"
            :data="investorsDistributionChart.data"
            :options="investorsDistributionChart.options"
          />
        </div>
      </v-layout>

      <v-layout column class="full-width py-2">
        <v-divider></v-divider>
      </v-layout>
      <v-layout column class="px-4 pa-2">
        <div class="subheading half-bold pb-1">My memo</div>
        <div class="body-1">
          <toggle-text :text="investment.memo"></toggle-text>
        </div>
      </v-layout>

      <v-layout column class="full-width py-2">
        <v-divider></v-divider>
      </v-layout>

      <v-layout column class="px-4 pa-2">
        <div v-for="(tag, j) in investment.tags" :key="'investment-tag-'+ j" >
          <v-chip small class="mx-0 my-1 investment-tag caption" :color="tag.color" text-color="black">{{tag.name}}</v-chip>
        </div>
      </v-layout>

      <v-layout column class="full-width py-2">
        <v-divider></v-divider>
      </v-layout>

    </v-layout>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    name: 'InvestorDashboardInboxRightSidebar',
    data() {
      return {
        investment: {
          title: "IT Asset Disposal & Recycling",
          created_at: moment().toDate(),
          currenStep: {
            title: "Building Facilities",
            deadline: "Deadline overdue - 3 weeks",
            description: "Intrinsicly seize resource-leveling infrastructures via prospective human capital. Efficiently aggregate quality users and revolutionary paradigms. Rapidiously aggregate reliable services through functional outsourcing. Completely reinvent B2B convergence before market-driven web-readiness. Uniquely seize principle-centered portals before visionary human capital."
          },

          team: [
            {account: {name: "alice"}},
            {account: {name: "bob"}},
            {account: {name: "james"}}
          ],

          memo: "Intrinsicly seize resource-leveling infrastructures via prospective human capital. Efficiently aggregate quality users and revolutionary paradigms. Rapidiously aggregate reliable services through functional outsourcing. Completely reinvent B2B convergence before market-driven web-readiness. Uniquely seize principle-centered portals before visionary human capital.",
          tags: [{ name: "Sponsored", color: "#CCE0CC"}, { name: "Reviewed", color: "#fdd4ca"}]
        }
      }
    },

    computed: {
      ...mapGetters({
        user: "auth/user"
      }),

      investorsDistributionChart() {
        // let totalShares = this.currentShares.reduce((acc, { share }) => acc + this.convertToPercent(share.amount), 0);
        return {
          data: [
            ['Distribution', ''],
            // ...this.currentShares.map(({ research, share }) => [research.title,  this.convertToPercent(share.amount) / totalShares * 100])
            ['Microsoft', 15],
            ['Intel', 40],
            ['Alphabet', 16],
            ['International Business Machines', 23],
            ['Others', 6],
          ],

          options: {
            title: "",
            legend: { position: 'left' },
            colors: ['#c6bbff', '#f9c3d7', '#a6dcff', '#B9F6CA', '#2d99ff', '#f3f5f8'],
            chartArea: { 
              right: 0,
              width: "100%",
              height: "100%"
            },

            width: "100%",
            height: "100%",
            pieSliceTextStyle: {
              // color: "#ffffff", 
              color: "#000000",
              fontSize: 10
            },
            pieHole: 0.6
          }
        }
      },
    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>
@import "./../../../styles/colors.less";

.investment-title {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.investment-tag {
  text-transform: uppercase;
}

.icon-btn {
  i:hover {
    cursor: pointer;
    color: @grey-darken-4;
  }
}


</style>
