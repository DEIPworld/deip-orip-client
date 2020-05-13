<template>
  <v-card
    outlined
    :to="{
      name: isLoggedIn() ? 'ResearchDetails' : 'ResearchDetailsPublic',
      params: {
        research_group_permlink: encodeURIComponent(research.research_group.permlink),
        research_permlink: encodeURIComponent(research.permlink)
      }
    }"
  >
    <v-img
      height="150"
      :src="$options.filters.researchBackgroundSrc(research.external_id, 430, 150)"
    />

    <!-- TODO: check    -->
    <div v-if="research.isTop" class="top-research-label">
      <top-research-label class="pa-2" />
    </div>

    <v-sheet tile class="pa-6">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div class="subtitle-1 text-truncate" v-on="on">
            {{ research.title }}
          </div>
        </template>
        <span>{{ research.title }}</span>
      </v-tooltip>

      <div v-if="hasActiveTokenSale">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-progress-linear
              class="progress-current my-0"
              :value="fundingProgressPercent"
              v-on="on"
            />
          </template>
          <span>Fundraising Progress</span>
        </v-tooltip>
      </div>

      <div v-if="hasInactiveTokenSale">
        <v-chip class="my-0 mx-0 px-0 caption" style="height: 1.4em" color="primary lighten-3">
          Fundraising starts in
          {{ tokenSaleStartLeft }}
        </v-chip>
      </div>

      <technology-readiness-level
        v-if="research.researchRef && research.researchRef.trl"
        :current-trl-step="research.researchRef.trl"
        is-read-only
        is-chip
      />

      <v-row no-gutters justify="space-between" class="mt-3 mb-n3">
        <v-col cols="6" class="caption grey--text">
          <v-icon small>
            event
          </v-icon>
          <span class="pl-1">Updated on</span>
          <span class="pl-1 half-bold">{{ moment(research.last_update_time).format('D MMM YYYY') }}</span>
        </v-col>
        <v-col>
          <v-icon small color="grey lighten-1">
            chat_bubble
          </v-icon>
          <span class="pl-1 caption half-bold grey--text lighten-1">{{ reviewsCount }}</span>
        </v-col>
        <v-col cols="5" class="text-right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip small v-on="on">
                <v-avatar left>
                  <img :src="$options.filters.researchGroupLogoSrc(group.external_id, 50, 50, true)">
                </v-avatar>
                <span class="text-truncate">{{ group.name }}</span>
              </v-chip>
            </template>
            <span>{{ group.name }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-sheet>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchProjectTile',
    props: {
      research: { required: true, default: undefined },
      members: { required: true, default: () => [] },
      tokenSale: { required: false, default: undefined },
      tokenSaleContributions: { required: false, default: undefined },
      group: { required: false, default: undefined }
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({}),
      membersToDisplay() {
        return this.members.slice(0, 3);
      },

      fundingProgressPercent() {
        const goal = this.fromAssetsToFloat(this.tokenSale.hard_cap);
        const collected = this.tokenSaleContributions.reduce((acc, item) => acc + this.fromAssetsToFloat(item.amount), 0);
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

        const now = moment.utc().local();
        const end = moment.utc(this.tokenSale.end_time).local();

        const months = Math.floor(moment.duration(end.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        const days = Math.floor(moment.duration(end.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        const hours = Math.floor(moment.duration(end.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        const minutes = Math.floor(moment.duration(end.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        const seconds = Math.floor(moment.duration(end.diff(now)).asSeconds());
        return `${seconds} secs`;
      },

      tokenSaleStartLeft() {
        if (!this.tokenSale) return null;

        const now = moment.utc().local();
        const start = moment.utc(this.tokenSale.start_time).local();

        const months = Math.floor(moment.duration(start.diff(now)).asMonths());
        if (months > 1) return `${months} months`;

        const days = Math.floor(moment.duration(start.diff(now)).asDays());
        if (days > 1) return `${days} days`;

        const hours = Math.floor(moment.duration(start.diff(now)).asHours());
        if (hours > 1) return `${hours} hours`;

        const minutes = Math.floor(moment.duration(start.diff(now)).asMinutes());
        if (minutes > 1) return `${minutes} mins`;

        const seconds = Math.floor(moment.duration(start.diff(now)).asSeconds());
        return `${seconds} secs`;
      },

      reviewsCount() {
        // todo: there is an odd bug in chain api which doubles this numbers
        return this.research.number_of_negative_reviews + this.research.number_of_positive_reviews;
      }

    },
    methods: {
      isLoggedIn() { return accessService.isLoggedIn(); }
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
