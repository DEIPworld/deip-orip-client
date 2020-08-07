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
        <v-col
          class="text-caption font-weight-medium"
          :class="item.classList"
          cols="auto"
        >
          {{ item.value }}
        </v-col>
      </v-row>
    </template>

    <template v-if="Object.keys(expertiseStatsByDisciplines).length">
      <v-list
        class="pa-0 mt-4"
        dense
        outlined
        rounded
      >
        <template v-for="(item, i) in expertiseStatsByDisciplines">
          <v-list-item :key="`edi-${i}`" style="min-height: 0">
            <v-list-item-content class="text-caption font-weight-medium py-3">
              <v-row no-gutters class="mb-1">
                <v-col>
                  {{ item.discipline.name }}
                </v-col>
                <v-col cols="auto">
                  <d-simple-tooltip tooltip="Expertise Contribution Index">
                    ECI {{ (item.eci || item.value ) | checkVal | commaNumber }}
                  </d-simple-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters class="text-overline">

                <v-col>
                  <d-simple-tooltip tooltip="Percentile rank">
                    {{ item.percentile_rank | checkVal }}
                  </d-simple-tooltip>
                </v-col>

                <v-col cols="auto" :class="item.growth_rate | numDirClass">
                  <d-simple-tooltip tooltip="Growth rate">
                    {{ item.growth_rate | numDir | checkVal }}
                  </d-simple-tooltip>
                </v-col>

              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="i + 1 < expertiseStatsByDisciplines.length" :key="`edd-${i}`" />
        </template>
      </v-list>
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

    components: {
      DSimpleTooltip,
      DBlock
    },

    mixins: [
      EciMetricsMixin
    ],

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
