<template>
  <v-skeleton-loader
    :loading="loading"
    type="eci-widget"
    :types="{
      'eci-widget': 'heading@3',
    }"
  >
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

    <template v-if="Object.keys(data.expertiseStatsByDisciplines).length">
      <v-list
        class="pa-0 mt-4"
        dense
        outlined
        rounded
      >
        <template v-for="(item, i) in data.expertiseStatsByDisciplines">
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
          <v-divider v-if="i + 1 < data.expertiseStatsByDisciplines.length" :key="`edd-${i}`" />
        </template>
      </v-list>
    </template>

    <v-btn
      v-if="expertiseDetailsRoute"
      block
      small
      text
      color="primary"
      class="mt-3"
      :to="expertiseDetailsRoute"
    >
      {{ $t('defaultNaming.moreDetails') }}
    </v-btn>
  </v-skeleton-loader>
  <!-- TODO: temp solution-->

</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import { dataLoadableFactory } from '@/mixins/dataLoadable';

  export default {
    name: 'EciStatsWidget',
    components: {
      DSimpleTooltip
    },

    mixins: [dataLoadableFactory({})],

    computed: {
      stats() {
        return [
          {
            label: 'Total ECI',
            value: this.$options.filters.checkVal(this.$options.filters.commaNumber(this.data.expertiseStats.eci))
          },
          {
            label: 'Percentile rank',
            value: this.$options.filters.checkVal(this.data.expertiseStats.percentile_rank)
          },
          {
            label: 'Growth rate',
            value: this.$options.filters.checkVal(this.$options.filters.numDir(this.data.expertiseStats.growth_rate)),
            classList: this.$options.filters.numDirClass(this.data.expertiseStats.growth_rate)
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
              account_name: this.$route.params.account_name
            }
          };
        }

        if (this.$route.name === 'project.details') {
          return {
            name: 'project.expertise',
            params: this.$route.params
          };
        }

        if (this.$route.name === 'project.content.details') {
          return {
            name: 'project.content.expertise',
            params: this.$route.params
          };
        }

        return false;
      }
    }
  };
</script>

<style lang="scss">
  .v-skeleton-loader {
    $host: &;

    &__eci-widget {
      display: grid;
      grid-gap: 1rem;

      #{$host}__heading {
        width: 100%;
      }
    }
  }
</style>
