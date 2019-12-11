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
      <div style="position: relative">
        <img class="ma-0" style="width: 100%; height: 150px" :src="researchLogoSrc" />
        <div v-if="research.isTop" class="top-research-label">
          <top-research-label class="pa-2"></top-research-label>
        </div>
      </div>
      <v-tooltip bottom>
        <div slot="activator" class="subheading ellipsis half-bold py-2">{{ research.title }}</div>
        <span>{{research.title}}</span>
      </v-tooltip>
    </router-link>

    <v-layout row wrap justify-start>
      <platform-avatar v-for="(member, i) in membersToDisplay" :user="member" :size="15" :key="`member-${research.permlink}-`+ i" link-to-profile link-to-profile-class="px-2 grey--text lighten-2 research-tile-researcher"></platform-avatar>
    </v-layout>

    <v-layout row class="token-sale-section">
      <v-layout v-if="hasActiveTokenSale" column>
        <v-layout row align-center>
          <v-flex grow>
            <v-tooltip bottom>
              <v-progress-linear slot="activator" class="progress-current my-0" :value="fundingProgressPercent"></v-progress-linear>
              <span>Fundraising Progress</span>
            </v-tooltip>
          </v-flex>
          <!-- <v-flex shrink class="grey--text caption ml-2">Token Sale</v-flex> -->
        </v-layout>
        <!-- <v-layout row>
          <span class="pr-3">
            <span class="black--text half-bold pr-1">{{fundingProgressPercent.toFixed(2)}}%</span>
            <span class="grey--text lighten-2">funded</span>
          </span>
          <span class="px-3" style="border-left: 1px solid #e0e0e0;">
            <span class="black--text half-bold pr-1">${{fundingGoalAmount}}</span>
            <span class="grey--text lighten-2">goal</span>
          </span>
          <span class="pl-3" style="border-left: 1px solid #e0e0e0;">
            <span class="black--text half-bold pr-1">{{tokenSaleEndLeft}}</span>
            <span class="grey--text lighten-2">left</span>
          </span>
        </v-layout> -->
      </v-layout>
      <v-layout v-else-if="hasInactiveTokenSale" row align-baseline justify-end>
        <v-chip class="my-0 mx-0 px-0 caption" style="height: 1.4em" color="primary lighten-3">Fundraising starts in {{tokenSaleStartLeft}}</v-chip> 
      </v-layout>
    </v-layout>
    <v-layout row justify-space-between align-center>
      <v-flex xs5 class="caption grey--text lighten-1">
        <v-icon small>event</v-icon>
        <span>Updated on</span>
        <span class="half-bold">{{moment(research.last_update_time).format("d MMM YYYY")}}</span>
      </v-flex>
      <v-flex xs2>
        <v-icon small color="grey lighten-1">chat_bubble</v-icon>
        <span class="caption half-bold grey--text lighten-1">{{ reviewsCount }}</span>
      </v-flex>
      <v-flex xs5>
        <v-layout row align-center class="group-logo" v-if="group.logo_src">
          <v-avatar style="margin: 2px">
            <img :src="group.logo_src">
          </v-avatar>
          <v-tooltip bottom class="group-logo__text">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="mx-2 caption text-truncate">{{ group.name }}</span>
            </template>
            <span>{{group.name}}</span>
          </v-tooltip>
        </v-layout>
      </v-flex>
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
      group: { required: false, default: undefined }
    },
    data() {
      return {
        researchLogoSrc: `./../../../../../static/researches/${this.research.id < 30 ? this.research.id : 'default'}_thumbnail.png`
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

      hasActiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 1;
      },

      hasInactiveTokenSale() {
        return this.tokenSale && this.tokenSale.status == 4;
      },

      tokenSaleEndLeft() {
        if (!this.tokenSale) return null;

        let now = moment.utc().local();
        let end = moment.utc(this.tokenSale.end_time).local();

        let months = Math.floor(moment.duration(end.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        let days = Math.floor(moment.duration(end.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        let hours = Math.floor(moment.duration(end.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        let minutes = Math.floor(moment.duration(end.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        let seconds = Math.floor(moment.duration(end.diff(now)).asSeconds());
        return `${seconds} secs`;
      },

      tokenSaleStartLeft() {
        if (!this.tokenSale) return null;

        let now = moment.utc().local();
        let start = moment.utc(this.tokenSale.start_time).local();

        let months = Math.floor(moment.duration(start.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        let days = Math.floor(moment.duration(start.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        let hours = Math.floor(moment.duration(start.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        let minutes = Math.floor(moment.duration(start.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        let seconds = Math.floor(moment.duration(start.diff(now)).asSeconds());
        return `${seconds} secs`;
      },

      reviewsCount() {
        // todo: there is an odd bug in chain api which doubles this numbers
        return this.research.number_of_negative_reviews + this.research.number_of_positive_reviews;
      }

    },
    methods: {

    }
  };
</script>

<style lang="less" scoped>
  @import './../../../../styles/colors.less';

  .research-tile {
    flex: 0 0 auto;

    .token-sale-section {
      width: 100%;
      height: 20px;
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

  .top-research-label {
    position: absolute; 
    top: 0; 
    left: 10; 
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 100%, transparent);
  }

  .group-logo {
    height: 24px;
    background: #e0e0e0;
    border-radius: 28px;
    .v-avatar {
      height: 20px !important;
      width: 20px !important;
    }
    &__text {
      max-width: 100%;
    }
  }
</style>
