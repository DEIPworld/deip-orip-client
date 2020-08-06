<template>
  <d-block title="Expertise Contribution Index" widget>

    <template v-if="enableStats">
      <v-row
        v-for="(item, index) of stats"
        :key="`ls-${index}`"
        :class="{'mb-2': index + 1 < stats.length}"
        no-gutters
      >
        <v-col class="text-caption" cols="auto">
          {{ item.label }}
        </v-col>
        <v-divider class="dotted align-self-end mx-1" style="margin-bottom: 2px;" />
<!--        <v-spacer style="border-bottom: 1px dotted currentColor;margin-bottom: 2px;" class="grey&#45;&#45;text text&#45;&#45;lighten-1 mx-1"></v-spacer>-->
        <v-col
          class="text-caption font-weight-medium"
          :class="item.classList"
          cols="auto"
        >
          {{ item.value }}
        </v-col>
      </v-row>
    </template>

    <template v-if="Object.keys(expertiseData).length">
      <v-card outlined class="mt-4">
        <v-list class="py-0" dense>
          <template v-for="(item, i) in expertiseData">
            <v-list-item :key="`edi-${i}`">
              <v-list-item-content class="text-caption font-weight-medium py-3">
                <v-row no-gutters class="mb-1">
                  <v-col>
                    {{ item.discipline_name }}
                  </v-col>
                  <v-col cols="auto">
                    ECI {{ (item.eci || item.value ) | checkVal | commaNumber }}
                  </v-col>
                </v-row>
                <v-row no-gutters>

                  <v-col>
                    <d-simple-tooltip v-if="item.percentile_rank" tooltip="Percentile rank">
                      {{ item.percentile_rank }}
                    </d-simple-tooltip>
                  </v-col>

                  <v-col cols="auto" :class="item.growth_rate | numDirClass">
                    <d-simple-tooltip v-if="item.growth_rate" tooltip="Growth rate">
                      {{ item.growth_rate | numDir | checkVal }}
                    </d-simple-tooltip>
                  </v-col>

                </v-row>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i + 1 < expertiseData.length" :key="`edd-${i}`" />
          </template>
        </v-list>
      </v-card>
    </template>

    <!-- TODO: temp solution-->
    <v-btn
      v-if="expertiseDetailsRoute"
      block
      color="primary"
      class="mt-3"
      :to="expertiseDetailsRoute"
    >
      More details
    </v-btn>

  </d-block>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { EciMetricsMixin } from '@/components/EciMetrics/EciMetricsMixin';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'EciMetricsWidget',

    components: { DSimpleTooltip, DBlock },

    mixins: [
      EciMetricsMixin
    ],

    props: {
      expertiseData: {
        type: Array,
        default: () => ({})
      }
    },

    computed: {
      stats() {
        return [
          {
            label: 'Total ECI',
            value: this.$options.filters.commaNumber(this.expertiseStats.eci)
          },
          {
            label: 'Percentile rank',
            value: this.expertiseStats.percentile_rank
          },
          {
            label: 'Growth rate',
            value: this.$options.filters.numDir(this.expertiseStats.growth_rate),
            classList: this.$options.filters.numDirClass(this.expertiseStats.growth_rate)
          }
        ];
      },

      expertiseDetailsRoute() {
        if (this.$route.path.includes('/account')) {
          return {
            name: 'account.expertiseDetails'
          };
        }

        if (this.$route.name === 'UserDetails') {
          return {
            name: 'UserExpertiseDetails',
            params: {
              account_name: this.accountName
            }
          };
        }

        if (this.$route.name === 'ResearchDetails') {
          return {
            name: 'ResearchExpertise',
            params: {
              group_permlink: decodeURIComponent(this.$route.params.research_group_permlink),
              research_permlink: decodeURIComponent(this.$route.params.research_permlink)
            }
          };
        }

        if (this.$route.name === 'ResearchContentDetails') {
          return {
            name: 'ResearchContentExpertise',
            params: {
              group_permlink: decodeURIComponent(this.$route.params.research_group_permlink),
              research_permlink: decodeURIComponent(this.$route.params.research_permlink),
              content_permlink: decodeURIComponent(this.$route.params.content_permlink),
              ref: this.$route.query.ref
            }
          };
        }

        return false;
      }
    }
  };
</script>
