<template>
<v-layout row class="research-tile">
  <v-layout column>
    <router-link tag="div" class="research-title" 
      :to="{
        name: 'ResearchDetails', 
        params: {
          research_group_permlink: encodeURIComponent(research.group_permlink),
          research_permlink: encodeURIComponent(research.permlink)
        }
      }"
    >
      <div><img style="width: 100%; height: 150px" :src="researchLogoSrc" /></div>
      <div class="subheading ellipsis half-bold py-2">{{ research.title }}</div>
    </router-link>
    
    <v-layout row wrap justify-start>
      <platform-avatar v-for="(member, i) in membersToDisplay" :user="member" :size="15" :key="`member-${research.permlink}-`+ i" link-to-profile link-to-profile-class="px-2 grey--text lighten-2 research-tile-researcher"></platform-avatar>
    </v-layout>

    <v-layout v-if="tokenSale" row class="pt-1 token-sale-section">
      <v-layout column>
        <v-layout row align-center>
          <v-flex grow>
            <v-progress-linear class="progress-current" :value="fundingProgressPercent"></v-progress-linear>
          </v-flex>
          <v-flex shrink class="grey--text ml-2">TOKEN SALE</v-flex>
        </v-layout>
        <v-layout row>
          <span class="pr-3">
            <span class="black--text half-bold pr-1">{{fundingProgressPercent.toFixed(2)}}%</span>
            <span class="grey--text lighten-2">funded</span>
          </span>
          <span class="px-3" style="border-left: 1px solid #e0e0e0;">
            <span class="black--text half-bold pr-1">${{fundingGoalAmount}}</span>
            <span class="grey--text lighten-2">goal</span>
          </span>
          <span class="pl-3" style="border-left: 1px solid #e0e0e0;">
            <span class="black--text half-bold pr-1">{{fundingDaysLeft}}</span>
            <span class="grey--text lighten-2">days left</span>
          </span>
        </v-layout>
      </v-layout>
    </v-layout>
    <v-layout v-else row class="pt-4 divider">
      <v-divider></v-divider>
    </v-layout>
  </v-layout>
</v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    name: "ResearchProjectTile",
    props: {
      research: { required: true, default: undefined },
      members: { required: true, default: () => [] },
      tokenSale: { required: false, default: undefined },
      tokenSaleContributions: { required: false, default: undefined },
    },
    data() {
      return {
        researchLogoSrc: `./../../../static/research-logo/${this.research.id < 20 ? this.research.id : 'default'}_thumbnail.png`
      };
    },
    computed: {
      ...mapGetters({
      }),
      membersToDisplay() {
        return this.members.slice(0, 3);
      },

      fundingProgressPercent() {
        let goal = this.fromAssetsToFloat(this.tokenSale.hard_cap);
        let collected = this.tokenSaleContributions.reduce((acc, item) => {
          return acc + this.fromAssetsToFloat(item.amount);
        }, 0);
        return (collected / goal) * 100;
      },

      fundingGoalAmount() {
        return this.fromAssetsToFloat(this.tokenSale.hard_cap);
      },

      fundingDaysLeft() {
        let now = moment.utc().local();
        let end = moment.utc(this.tokenSale.end_time).local();
        return Math.floor(moment.duration(end.diff(now)).asDays());
      }
      
    },
    methods: {

    }
  };
</script>

<style lang="less" scoped>
  @import './../../../styles/colors.less';

  .research-tile {
    flex: 0 0 auto;

    .token-sale-section {
      width: 100%;
      flex: 0 0 auto;
    }
    .divider {
      flex: 0 0 auto;
    }
  }

  .research-title {
    cursor: pointer;
    text-decoration: none;
    color: #000000
  }

  .research-title:hover {
    color: var(--v-primary-base);
  }

</style>
