<template>
  <v-card height="100%">
    <v-layout v-if="selectedInvestment" row wrap style="flex: 0 0 auto;" class="py-4 full-width">

      <v-layout column class="px-4 full-width">
        <router-link class="subheading half-bold investment-title"
          :to="{ name: 'ResearchDetails', params: {
            research_group_permlink: encodeURIComponent(selectedInvestment.group.permlink),
            research_permlink: encodeURIComponent(selectedInvestment.research.permlink)
          }}">
          {{ selectedInvestment.research.title }}
        </router-link>
      </v-layout>

      <v-layout column class="py-2 full-width">
        <v-divider></v-divider>
        <v-layout row justify-space-between align-middle class="pa-2">
          <span>
            <v-icon small>event</v-icon>
            <span class="caption grey--text px-1">Created {{moment(selectedInvestment.research.created_at).format("DD MMM YYYY")}} by {{selectedInvestment.research.owner | fullname}}</span>
          </span>
          <span>
            <span class="icon-btn"><v-icon>attachment</v-icon></span>
            <span class="icon-btn"><v-icon>compare</v-icon></span>
            <span class="icon-btn"><v-icon>delete</v-icon></span>
          </span>
        </v-layout>
        <v-divider></v-divider>
      </v-layout>


      <v-layout v-if="currentPhase" column class="px-4 py-2 full-width">
        <div class="subheading half-bold">Current Phase</div>
        <div class="body-2 py-1">{{currentPhase.goal}}</div>
        <div class="py-2">
          <v-chip v-if="currentPhaseDeadlineLabel.isOverdue" class="ma-0 body-1" color="amber" text-color="white">{{currentPhaseDeadlineLabel.text}}</v-chip>
          <v-chip v-else class="ma-0 body-1" color="#8BC34A" text-color="white">{{currentPhaseDeadlineLabel.text}}</v-chip>
        </div>
        <div class="body-1 py-2">
          <toggle-text :text="currentPhase.details"></toggle-text>
        </div>
      </v-layout>

      <v-layout column class="full-width">
        <v-divider class="mb-2"></v-divider>
        <div>
          <div class="subheading half-bold px-4">Team: {{selectedInvestment.group.name}}</div>
          <v-layout row justify-start class="px-4 py-2">
            <platform-avatar :size="40" v-for="(member, i) in selectedInvestment.team" :key="'member-' + i" :user="member" class="pr-1" ></platform-avatar>
          </v-layout>
        </div>
        <v-divider class="mt-2"></v-divider>
      </v-layout>

      <v-layout column class="px-4 py-2 full-width">
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

      <v-layout column class="py-2 full-width">
        <v-divider class="mb-2"></v-divider>
        <v-layout row justify-space-between class="px-4">
          <div class="subheading half-bold">My memo</div>
          <!-- <div class="text-xs-right"><span class="icon-btn" @click="editMemo()"><v-icon small>edit</v-icon></span></div> -->
          <v-btn v-if="!isEditingMemo" class="ma-0 pa-0 text-xs-right" flat icon @click="editMemo()">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn v-else class="ma-0 pa-0 text-xs-right" flat icon @click="updateMemo()">
            <v-icon small>reply</v-icon>
          </v-btn>
        </v-layout>
        <div class="body-1 px-4 py-2">
          <toggle-text v-if="!isEditingMemo" :text="selectedInvestment.portfolioRef.memo"></toggle-text>
          <v-textarea 
            v-else
            v-model="memo"
            auto-grow
            :rows="4"
          ></v-textarea>
        </div>
        <v-divider class="mt-2"></v-divider>
      </v-layout>

      <v-layout column class="full-width">
        <v-layout row justify-space-between class="px-4">
          <div>
            <div v-for="(tag, i) in investment.tags" :key="'investment-tag-'+ i">
              <v-chip small class="mx-0 investment-tag caption" :color="tag.color" text-color="black">{{tag.name}}</v-chip>
            </div>
          </div>
          <div>
            <span class="icon-btn"><v-icon>playlist_add</v-icon></span>
            <span class="icon-btn"><v-icon>delete</v-icon></span>
          </div>
        </v-layout>
        <v-divider class="mt-2"></v-divider>
      </v-layout>

      <v-layout column class="px-4 full-width">
        <div class="subheading half-bold py-2">Comments</div>
        <div v-for="(comment, i) in investment.comments" :key="'investment-comment-'+ i">
          <v-layout row wrap align-baseline>
            <platform-avatar :size="40" :user="comment.author" class="pr-1" ></platform-avatar>
            <span class="body-2 px-2">{{comment.author | fullname}}</span>
            <span class="caption grey--text">{{moment(comment.timestamp).format("DD MMM YYYY")}}</span>
          </v-layout>
          <div class="body-1 py-2">
            <toggle-text :text="comment.text"></toggle-text>
          </div>
        </div>
      </v-layout>
    </v-layout>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    name: 'InvestorDashboardInboxRightSidebar',
    computed: {
      ...mapGetters({
        user: "auth/user",
        selectedInvestment: "investorDashboard/selectedInvestment"
      }),

      currentPhase() {
        if (this.selectedInvestment) {
          let milestones = this.$options.filters.researchMilestones(this.selectedInvestment.research.abstract);
          let activeMilestone = milestones.find(m => m.is_active);
          return activeMilestone || milestones[0] || null;
        }
        return null;
      },

      currentPhaseDeadlineLabel() {
        if (this.currentPhase) {
          let daysDiff = moment(this.currentPhase.eta).diff(moment(), 'days');
          let isOverdue = daysDiff < 0;

          let text = isOverdue 
            ? `Deadline overdue ${daysDiff < 7 ? daysDiff + ' days' : Math.floor(daysDiff / 7) + ' weeks'}`
            : `Deadline on ${moment(this.currentPhase.eta).local().format("MMM DD, YYYY")}`;

          return { daysDiff, isOverdue, text };
        }
        return null;
      },

      investorsDistributionChart() {
        if (this.selectedInvestment) {
          return {
            data: [
              ['Distribution', ''],
              ...this.selectedInvestment.shareHolders.map((shareHolder) => [
                this.$options.filters.fullname(shareHolder),
                this.convertToPercent(shareHolder.share.amount)
              ]),
              [this.selectedInvestment.group.name, this.convertToPercent(this.selectedInvestment.research.owned_tokens)]
              // ['Microsoft', 15]
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
              // sliceVisibilityThreshold: .01,

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
        }
      },
    },

    data() {
      return {
        isEditingMemo: false,
        memo: "",
        
        investment: {
          title: "IT Asset Disposal & Recycling",
          created_at: moment().toDate(),
          currenStep: {
            title: "Building Facilities",
            deadline: "Deadline overdue - 3 weeks",
            description: "Intrinsicly seize resource-leveling infrastructures via prospective human capital. Efficiently aggregate quality users and revolutionary paradigms. Rapidiously aggregate reliable services through functional outsourcing. Completely reinvent B2B convergence before market-driven web-readiness. Uniquely seize principle-centered portals before visionary human capital."
          },

          team: [
            { account: {name: "alice"} },
            { account: {name: "bob"} },
            { account: {name: "james"} }
          ],

          memo: "Intrinsicly seize resource-leveling infrastructures via prospective human capital. Efficiently aggregate quality users and revolutionary paradigms. Rapidiously aggregate reliable services through functional outsourcing. Completely reinvent B2B convergence before market-driven web-readiness. Uniquely seize principle-centered portals before visionary human capital.",
          tags: [{ name: "Sponsored", color: "#CCE0CC"}, { name: "Reviewed", color: "#fdd4ca"}],

          comments: [{ 
            author: { account: {name: "alice"} }, 
            text: "I think we can watch the development of the research for a little while",
            timestamp: moment().toDate()
          }]
        }
      }
    },

    methods: {
      editMemo() {
        this.isEditingMemo = true;
      },
      updateMemo() {
        let investmentId = this.selectedInvestment.research.id;
        let memo = this.memo;
        this.$store.dispatch('investorDashboard/updateInvestmentMemo', { investmentId, memo })
          .finally(() => {
            this.isEditingMemo = false;
          })
      }
    },
    watch: {
      selectedInvestment(newVal, oldVal) {
        debugger
        this.memo = newVal.portfolioRef.memo;
      }
    },
    mounted() {
      this.memo = this.selectedInvestment.portfolioRef.memo;
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
