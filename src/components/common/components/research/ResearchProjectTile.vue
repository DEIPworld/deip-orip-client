<template>
  <v-card
    outlined
    :to="{
      name: $isUser ? 'ResearchDetails' : 'ResearchDetailsPublic',
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

      <!-- <div v-if="hasActiveTokenSale">
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
      </div> -->

      <div v-for="(item, i) in research.researchRef.tenantCriterias" :key="`${i}-tenantCriteria`" class="display-inline-block mr-4">
        <div v-if="steppersInfo[i].isVisible && item.value && item.value.index !== null" class="mb-2">
          <v-tooltip v-if="steppersInfo[i].component.readinessLevels[item.value.index].description" bottom>
            <template v-slot:activator="{ on }">
              <div class="display-flex" v-on="on">
                <v-avatar size="24px" class="align-self-center">
                  <v-icon size="24px" color="#0386b0">
                    mdi-numeric-{{ item.value.index + 1 }}-circle
                  </v-icon>
                </v-avatar>
                <span class="subtitle-1 align-self-center font-weight-medium black--text">{{ steppersInfo[i].component.readinessLevelShortTitle }}</span>
              </div>
            </template>
            <span>{{ steppersInfo[i].component.readinessLevels[item.value.index].description }}</span>
          </v-tooltip>
          <div v-else class="display-flex">
            <v-avatar size="20" color="#0386b0" class="align-self-center mr-1">
              <span class="white--text caption font-weight-medium">{{ item.value.index + 1 }}</span>
            </v-avatar>
            <span class="subtitle-1 align-self-center font-weight-medium black--text">{{ steppersInfo[i].component.readinessLevelShortTitle }}</span>
          </div>
        </div>
      </div>

      <v-row no-gutters justify="space-between" class="mt-3 mb-n3">
        <v-col cols="7" class="caption grey--text align-self-center">
          <v-icon small>
            event
          </v-icon>
          <span class="pl-1">Updated on</span>
          <span class="pl-1 half-bold">{{ moment(research.last_update_time).format('D MMM YYYY') }}</span>
        </v-col>
        <!-- <v-col class="align-self-center">
          <v-icon small color="grey lighten-1">
            chat_bubble
          </v-icon>
          <span class="pl-1 caption half-bold grey--text lighten-1">{{ reviewsCount }}</span>
        </v-col> -->
        <v-col cols="5" class="text-right align-self-center">
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
      ...mapGetters({
        tenant: 'auth/tenant'
      }),
      steppersInfo() {
        return this.research.researchRef.tenantCriterias.map(({ component }) => this.tenant.profile.settings.researchComponents.find(({ _id }) => _id === component))
      },
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
      },

      activeMilestone(){
        return this.research.researchRef.milestones.find(({isActive}) => isActive)
      }

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
