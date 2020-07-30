<template>
  <v-card v-if="$ready" class="pa-12 full-width">
    <div class="pb-4 display-flex">
      <div>
        <platform-avatar :user="userInfo" :size="80" />
      </div>
      <div class="ml-6">
        <div class="text-h5">
          {{ userInfo | fullname }}
        </div>
        <div v-if="$options.filters.userLocation(userInfo)">
          <v-icon small>
            location_on
          </v-icon>
          {{ userInfo | userLocation }}
        </div>
        <div v-if="$options.filters.employmentOrEducation(userInfo)">
          <v-icon small>
            school
          </v-icon>
          {{ userInfo | employmentOrEducation }}
        </div>
      </div>
    </div>

    <v-divider class="mt-4 mb-8" />

    <div>
      <eci-history
        :data="eciHistoryRecords"
        :overview-data="{eciStatsByDiscipline, overview}"
        :loading="eciHistoryLoading"
        :disciplines="disciplines"
        @updateData="loadDisciplineEciHistory"
      >
        <template #eciHeader>
          <div class="pt-12 pb-4 display-flex justify-space-between">
            <div class="font-weight-bold title">
              Expertise Contribution Index
            </div>
            <router-link
              class="a mx-0 mr-12 pr-4"
              color="primary"
              outlined
              :to="{ name: 'ReviewSetup' }"
            >
              Alternative review model
            </router-link>
          </div>
        </template>
      </eci-history>
    </div>

    <div v-if="!eciHistoryRecords.length" class="text-h5 py-4">
      There are no history records for selected Discipline
    </div>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import EciHistory from '@/components/EciHistory/EciHistory';

  export default {
    name: 'UserExpertiseDetails',
    components: { EciHistory },
    props: {
      username: {
        type: String,
        default: undefined
      }
    },

    data() {
      return {
        disciplines: [],

        eciHistoryRecords: [],
        eciHistoryLoading: false,

        contributionTypeNameMap: {
          [EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN]: 'Graduation',
          [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: 'Research',
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: 'Review',
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: 'Review support'
        }
      };
    },

    computed: {
      ...mapGetters({
        userInfo: 'userDetails/userInfo',
        expertise: 'userDetails/expertise',
        eciStatsByDiscipline: 'userDetails/eciStatsByDiscipline'
      }),
      overview() {
        const contributions = this.eciHistoryRecords.filter((item) => item.contribution_type !== EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN);
        const allocations = contributions.reduce((acc, item) => {
          if (acc[item.contribution_type] === undefined) {
            acc[item.contribution_type] = 0;
          }
          acc[item.contribution_type] += 1;
          return acc;
        }, {});

        return {
          contributions: contributions.length,
          percentile: 10,
          contributionsAllocation: [
            ['Contribution Type', ''],
            ...Object.entries(allocations)
              .map((e) => {
                const contribution = e[0];
                return [this.contributionTypeNameMap[contribution], e[1]];
              })
          ]
        };
      }
    },

    methods: {
      loadDisciplineEciHistory(updatedFilter = {}) {
        this.eciHistoryLoading = true;

        const account = this.userInfo.account.name;

        return Promise.all([
          this.$store.dispatch('userDetails/loadAccountEciHistoryRecords', { ...updatedFilter, account }),
          this.$store.dispatch('userDetails/loadAccountEciStatsRecords', { ...updatedFilter, account })
        ])
          .then(() => {
            const records = this.$store.getters['userDetails/eciHistoryByDiscipline'];
            this.eciHistoryRecords = records;
            this.eciHistoryLoading = false;
          });
      },
      growthRateIsUp(rate) {
        return parseFloat(rate) >= 0;
      }
    },

    created() {
      this.$store.dispatch('userDetails/loadAccountExpertiseDetailsPage', {
        username: this.username
      })
        .then(() => {
          this.disciplines.push(...this.expertise.map((exp) => ({
            label: exp.discipline_name,
            id: exp.discipline_external_id
          })));

          this.loadDisciplineEciHistory()
            .then(() => {
              this.$setReady();
            });
        });
    }

  };
</script>

<style lang="less" scoped>
  .eci-up {
    background: #C8E6C9;
  }

  .eci-down {
    background-color: #ffbdbd;
  }

  // .divider-border-left {
  //   border-left: 1px solid;
  //   border-color: rgba(0, 0, 0, 0.12);
  // }
</style>
