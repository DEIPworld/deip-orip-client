<template>
  <v-layout column>
    <div><img style="width: 100%; height: 150px" :src="researchLogoSrc" /></div>
    <div class="subheading half-bold py-2">{{research.title}}</div>
    
    <v-layout row wrap>
      <div class="pt-2 pr-2">
        <platform-avatar :user="user" link-to-profile link-to-profile-class="pl-3 grey--text lighten-2"></platform-avatar>
      </div>
    </v-layout>

    <v-layout row class="pt-1" v-if="tokenSale">
      <v-layout column>
        <v-progress-linear :value="fundingProgressPercent"></v-progress-linear>
        <v-layout row>
          <span class="pr-3">
            <span class="black--text half-bold pr-1">{{fundingProgressPercent}}%</span>
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
      <v-layout row class="pt-4" v-else>
        <v-divider></v-divider>
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
      tokenSale: { required: false, default: undefined },
      tokenSaleContributions: { required: false, default: undefined }
    },
    data() {
      return {
        researchLogoSrc: `./../../../static/research-logo/${this.research.id < 3 ? this.research.id : 'default'}.png`
      };
    },
    computed: {
      ...mapGetters({
        user: "auth/user",
      }),

      fundingProgressPercent() {
        let goal = this.fromAssetsToFloat(this.tokenSale.soft_cap);
        let collected = this.tokenSaleContributions.reduce((acc, item) => {
          return acc + this.fromAssetsToFloat(item.amount);
        }, 0);
        return (collected / goal) * 100;
      },

      fundingGoalAmount() {
        return this.fromAssetsToFloat(this.tokenSale.soft_cap);
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

</style>
